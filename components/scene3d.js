/* ═══════════ CẢNH 3D ═══════════
   Cùng lối với draw2d.js: React chỉ dựng khung DOM rỗng rồi gọi init() một lần sau khi
   mount; toàn bộ việc dựng cảnh nằm ở đây, không dính React.

   Hình khối do lib/massing.js sinh ra từ đúng dữ liệu mà bản vẽ 2D dùng — không chép lại
   con số nào. Vị trí mặt trời do lib/sun.js tính (NOAA). Xem 3d.md.

   Ghi chú lệch với 3d.md mục 7: bản HTML cũ phải ghim three 0.160.1 (UMD) vì mở bằng
   file:// thì ES module gãy. Trong Next thì three đi qua bundler nên dùng bản mới và
   OrbitControls dựng sẵn, không cần tự viết điều khiển camera. */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { LOT, heightsOf } from '../lib/lot.js';
import { applyConfig, readConfig, writeConfig, emptyConfig, isEmpty } from '../lib/config.js';
import { mountSavedConfigs } from './savedConfigs.js';
import { PLANS } from '../lib/versions/index.js';
import { buildMassing } from '../lib/massing.js';
import { roofCovering } from '../lib/envelope.js';
import { WALK, walkSolids, supportAt, stepWalk } from '../lib/walk.js';
import { KEY_DATES, sunPosition, sunriseSunset, toSceneVector, compassName, dayLabel }
  from '../lib/sun.js';

/* Bảng màu giấy can, cùng tông với bản vẽ 2D. Khoá phải trùng `kind` mà massing.js sinh ra. */
const COLORS = {
  houseWall:   0xefece4,
  partitionWall:0xb8c3c5,   // vách nhựa ngăn phòng, không phải tường xây
  fenceWall:   0xd9d3c4,
  railing:     0x4f4c46,     // lan can sắt sơn tối trên tường rào thấp
  floor:       0xe8e3d6,
  ground:      0xcfccc0,
  roof:        0xc9c2b2,
  alleyRoof:   0xbdb6a6,
  overhang:    0xc9c2b2,
  metalRoof:   0xb9bcb8,     // tôn — xám hơi lạnh, tách khỏi bê tông
  gutter:      0x7d8582,     // máng xối — tối hơn tôn cho thấy rõ viền mép mái
  downpipe:    0x6a716e,     // ống xả đứng áp tường bao
  post:        0x55595a,     // cột thép hộp đỡ mái nhẹ
  beam:        0x55595a,     // dầm biên thép hộp, cùng màu cột
  purlin:      0x73787a,     // xà gồ dưới tấm tôn, nhỏ hơn dầm biên
  ceiling:     0xe4e0d4,
  dropCeiling: 0xe9e6dc,     // trần giả thạch cao / nhựa
  step:        0xe2dccd,
  furniture:   0xc4ab86,     // nội thất — gỗ nhạt, tách khỏi tường và sàn
  doorLeaf:    0x8d6e4f,     // cánh cửa đi — gỗ sẫm
  glass:       0xa9cfe0,
};

const CENTER = new THREE.Vector3(LOT.w / 2, 0, LOT.d / 2);

/* Màu nắng và màu trời theo cao độ mặt trời — nội suy giữa hai đầu cho gọn. */
const SUN_LOW   = new THREE.Color(0xff9c4a);
const SUN_HIGH  = new THREE.Color(0xfff4e2);
const SKY_LOW   = new THREE.Color(0xc9b9ad);
const SKY_HIGH  = new THREE.Color(0xa9c8de);
const SKY_NIGHT = new THREE.Color(0x2c3440);

export function init(){
  const host = document.getElementById('canvas3d');
  if (!host) return () => {};

  /* Dọn sạch trước khi dựng: trong dev, React StrictMode gọi effect hai lần, nếu không
     dọn thì canvas và mấy danh sách tự đổ (phương án, nơi xây, mốc ngày) dựng chồng nhau. */
  for (const id of ['canvas3d', 'plan3', 'keyDates', 'heightSliders'])
    document.getElementById(id)?.replaceChildren();

  /* ═══════════ RENDERER · CẢNH ═══════════ */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  /* PCFSoftShadowMap bị bỏ ở three r186 — đúng bản đang dùng — và engine âm thầm hạ xuống
     PCFShadowMap kèm một dòng cảnh báo. Khai thẳng cho khớp thực tế: không đổi hình ảnh, chỉ
     hết cảnh báo. Không dùng VSMShadowMap: nó đổi cả ngữ nghĩa (mọi mặt nhận bóng cũng đổ
     bóng) và hay rò sáng ở tường mỏng, không đáng cho cảnh dài 30 m này. */
  renderer.shadowMap.type = THREE.PCFShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdce6ee);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.maxPolarAngle = Math.PI / 2 - 0.02;    // không chui xuống dưới đất
  orbit.target.copy(CENTER);

  const walk = new PointerLockControls(camera, renderer.domElement);
  scene.add(walk.object);

  /* ═══════════ ÁNH SÁNG ═══════════ */
  const sky = new THREE.HemisphereLight(0xdfeaf2, 0x9a9384, 1.1);
  scene.add(sky);

  const sun = new THREE.DirectionalLight(0xfff2dc, 3);
  sun.castShadow = true;
  sun.target.position.copy(CENTER);
  scene.add(sun, sun.target);

  /* Cảnh dài 30 m: bó khung camera bóng sát đúng lô, nếu để mặc định thì bóng răng cưa
     (3d.md mục 6). Chéo lô ~31.5 m nên nửa khung 18 m là vừa đủ mọi góc mặt trời. */
  const shadowCam = sun.shadow.camera;
  shadowCam.left = -18; shadowCam.right = 18; shadowCam.top = 18; shadowCam.bottom = -18;
  shadowCam.near = 1; shadowCam.far = 140;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;

  /* ═══════════ VẬT LIỆU ═══════════ */
  const solidMats = {};
  for (const [kind, color] of Object.entries(COLORS)) {
    if (kind === 'glass') continue;
    solidMats[kind] = new THREE.MeshLambertMaterial({ color });
  }
  const glassMat = new THREE.MeshLambertMaterial({
    color: COLORS.glass, transparent: true, opacity: 0.34, depthWrite: false });

  const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);   // một hộp dùng chung, co giãn theo scale

  /* ═══════════ MŨI TÊN CHỈ BẮC ═══════════ */
  function northArrow(){
    const g = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6),
      new THREE.MeshBasicMaterial({ color: 0x8a1c1c }));
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = -0.8;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5),
      new THREE.MeshBasicMaterial({ color: 0x8a1c1c }));
    tip.rotation.x = -Math.PI / 2;
    tip.position.z = -1.85;
    g.add(shaft, tip);
    g.position.set(LOT.w + 1.6, 0.05, 2.2);
    return g;
  }
  const compass = northArrow();
  scene.add(compass);

  /* Thân mũi tên dựng theo chiều −z cục bộ, nên xoay để −z trùng với hướng bắc trong cảnh.
     Gọi lại mỗi lần đổi hướng mặt tiền. */
  function aimNorth(){
    const dir = toSceneVector(0, 0);              // phương vị 0 = bắc, đổi sang hệ cảnh
    compass.rotation.y = Math.atan2(-dir.x, -dir.z);
  }

  /* ═══════════ DỰNG KHỐI ═══════════ */
  let group = null, LEVELS = null, roofHidden = false, furnitureHidden = false;
  let solids = [];                               // khối đặc cho đi bộ (lib/walk.js)

  function box(b, material, kind){
    const m = new THREE.Mesh(UNIT_BOX, material);
    m.scale.set(b.w, b.y1 - b.y0, b.d);
    m.position.set(b.x + b.w / 2, (b.y0 + b.y1) / 2, b.z + b.d / 2);
    m.castShadow = m.receiveShadow = true;
    if (kind) m.userData.kind = kind;
    return m;
  }

  /* Lăng trụ mặt nghiêng — mái tôn dốc và đầu hồi tam giác của bếp (lib/massing.js). Hộp co
     giãn không dựng được vì bốn góc khác cao độ. Dựng không chỉ mục (36 đỉnh) để mỗi mặt
     phẳng lì: dùng chung đỉnh thì pháp tuyến bị trung bình hoá, mái dốc trông như bị bẻ. */
  function prismGeometry(p){
    const x0 = p.x, x1 = p.x + p.w, z0 = p.z, z1 = p.z + p.d;
    /* i = 0/1 là đầu nhỏ / đầu lớn của trục nghiêng; hai đầu kia dùng chung cao độ. */
    const lvl = (ix, iz, top) => (top ? p.yt : p.yb)[p.axis === 'x' ? ix : iz];
    const c = (ix, iz, top) => [ix ? x1 : x0, lvl(ix, iz, top), iz ? z1 : z0];
    const A = c(0,0,0), B = c(1,0,0), C = c(1,1,0), D = c(0,1,0);
    const a = c(0,0,1), b = c(1,0,1), d = c(1,1,1), e = c(0,1,1);
    const tri = [
      A,B,C,  A,C,D,           // đáy (pháp tuyến −y)
      a,d,b,  a,e,d,           // mặt trên
      A,a,B,  a,b,B,           // mặt z nhỏ
      D,C,e,  C,d,e,           // mặt z lớn
      A,D,a,  D,e,a,           // mặt x nhỏ
      B,b,C,  b,d,C,           // mặt x lớn
    ];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(tri.flat(), 3));
    g.computeVertexNormals();
    return g;
  }

  function build(plan){
    if (group) {
      scene.remove(group);
      group.traverse(o => { if (o.isMesh && o.geometry !== UNIT_BOX) o.geometry.dispose(); });
    }
    const massing = buildMassing(plan);
    LEVELS = massing.levels;
    solids = walkSolids(massing);
    BOUNDS.max.y = LEVELS.top;
    group = new THREE.Group();
    for (const b of massing.boxes)
      group.add(box(b, solidMats[b.tone || b.kind] || solidMats.houseWall, b.kind));
    for (const p of massing.prisms) {
      const m = new THREE.Mesh(prismGeometry(p), solidMats[p.kind] || solidMats.houseWall);
      m.castShadow = m.receiveShadow = true;
      m.userData.kind = p.kind;
      group.add(m);
    }
    for (const b of massing.glass) {
      const m = box(b, glassMat, 'glass');
      m.castShadow = false;                    // kính không đổ bóng: để vệt nắng lọt xuống
      group.add(m);
    }
    scene.add(group);
    applyRoofHidden();
    applyFurnitureHidden();
  }

  /* "Ẩn mái" phải giấu cả mái tôn, máng xối và trần tôn của bếp, không thì bấm xong vẫn không nhìn
     được vào trong bếp. Đầu hồi là tường, giữ nguyên. */
  const isRoof = k => k === 'roof' || k === 'alleyRoof' || k === 'overhang'
                   || k === 'metalRoof' || k === 'gutter' || k === 'beam' || k === 'purlin' || k === 'ceiling' || k === 'dropCeiling';
  function applyRoofHidden(){
    group.children.forEach(m => { if (isRoof(m.userData.kind)) m.visible = !roofHidden; });
  }

  /* Nội thất và cánh cửa là hai loại khối riêng: chỉ ẩn `furniture` để cửa vẫn là mốc
     đọc lối đi khi xem không gian trống. */
  function applyFurnitureHidden(){
    group.children.forEach(m => { if (m.userData.kind === 'furniture') m.visible = !furnitureHidden; });
  }

  const setHtml = (id, html) => {
    const e = document.getElementById(id);
    if (e) e.innerHTML = html;
  };

  /* ═══════════ MẶT TRỜI ═══════════ */
  const state = { day: 172, hour: 15 };
  const hhmm = x =>
    `${String(Math.floor(x)).padStart(2, '0')}:${String(Math.round(x % 1 * 60)).padStart(2, '0')}`;

  function updateSun(){
    const { lat, lon } = LOT;
    const pos = sunPosition({ lat, lon, day: state.day, hour: state.hour });
    const dir = toSceneVector(pos.azimuth, pos.altitude);

    sun.visible = pos.up;
    sun.position.set(CENTER.x + dir.x * 60, dir.y * 60, CENTER.z + dir.z * 60);

    /* Mặt trời càng thấp thì càng đỏ và càng yếu; đêm thì chỉ còn ánh trời.
       Ánh trời cố ý để yếu hơn nắng khá nhiều — vệt nắng là thứ duy nhất đọc được ở mô hình
       này nên nó phải nổi rõ, đừng bị ánh nền dìm mất. */
    const t = Math.max(0, Math.min(1, pos.altitude / 40));
    sun.intensity = pos.up ? 1.2 + 2.6 * t : 0;
    sun.color.copy(SUN_LOW).lerp(SUN_HIGH, t);
    sky.intensity = pos.up ? 0.45 + 0.45 * t : 0.3;
    scene.background.copy(pos.up ? SKY_LOW : SKY_NIGHT).lerp(SKY_HIGH, pos.up ? t : 0);

    const { sunrise, sunset } = sunriseSunset({ lat, lon, day: state.day });
    setHtml('lblHour', hhmm(state.hour));
    setHtml('lblDay', dayLabel(state.day));
    setHtml('sunInfo', pos.up
      ? `Cao độ <b>${pos.altitude.toFixed(1)}°</b> · phương vị`
        + ` <b>${pos.azimuth.toFixed(0)}°</b> (${compassName(pos.azimuth)})`
        + ` · mọc ${hhmm(sunrise)}, lặn ${hhmm(sunset)}`
      : `Mặt trời đã lặn (mọc ${hhmm(sunrise)}, lặn ${hhmm(sunset)})`
        + ` — chỉ còn ánh trời khuếch tán`);
  }

  /* ═══════════ HƯỚNG NHÀ ═══════════ */
  /* Hướng không đụng hình khối — chỉ đường đi của nắng và mũi tên bắc. Giá trị nằm ở
     localStorage (lib/lot.js) nên bản vẽ 2D đọc cùng một chỗ. */
  function updateAzimuth(){
    const deg = Number.isFinite(CFG?.azimuth) ? CFG.azimuth : LOT.frontAzimuth;
    setHtml('lblAzimuth', `<b>${deg.toFixed(0)}°</b> · ${compassName(deg)}`);
    setHtml('subAzimuth', `Mặt tiền quay ${compassName(deg)}`);
    const slider = document.getElementById('azimuth');
    if (slider && Math.abs(+slider.value - deg) > 0.5) slider.value = deg;
    aimNorth();
    updateSun();
  }

  /* ═══════════ GÓC NHÌN ═══════════ */
  /* Toạ độ ngắm lấy từ tim phòng của phương án đang mở, không ghim số. */
  function roomCenter(plan, match){
    const r = plan.rooms.find(x => match.test(x[1]));
    return r ? new THREE.Vector3(r[2] + r[4] / 2, 0, r[3] + r[5] / 2) : CENTER.clone();
  }

  /* Khung bao cả lô, kể cả mái. Chiều cao lấy đỉnh thật của phương án đang mở (`levels.top`) —
     nóc mái tôn bếp nhô trên mái bê tông nên ghim một con số là hụt mất chỏm. */
  const BOUNDS = new THREE.Box3(new THREE.Vector3(0, 0, 0),
                                new THREE.Vector3(LOT.w, 4.2, LOT.d));

  /* Ngắm theo một hướng, lùi vừa đủ để lô lọt khung ở mọi tỉ lệ cửa sổ — lô dài 30 m mà
     ngang có 9.5 m nên phải xét cả nửa góc mở dọc lẫn ngang, lấy cái chặt hơn.
     `tighten` bù chỗ thừa của phép tính theo hình cầu bao: lô là tấm mỏng, không phải quả cầu. */
  function frameView(dir, tighten = 0){
    exitWalk(true);
    const center = BOUNDS.getCenter(new THREE.Vector3());
    const size   = BOUNDS.getSize(new THREE.Vector3());
    const radius = 0.5 * Math.hypot(size.x, size.y, size.z);

    const halfV = THREE.MathUtils.degToRad(camera.fov) / 2;
    const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
    const dist  = radius / Math.sin(Math.min(halfV, halfH)) * (1 - tighten);

    orbit.target.copy(center);
    camera.position.copy(center).addScaledVector(new THREE.Vector3(...dir).normalize(), dist);
    orbit.update();
  }

  /* Đứng chếch phía mặt tiền (−z), cao vừa đủ thấy được cả sân lẫn mái. */
  const overviewView = () => frameView([0.55, 0.70, -1], 0.30);
  const topView      = () => frameView([0.001, 1, 0.02], 0.02);

  /* ═══════════ ĐI BỘ ═══════════ */
  const keys = new Set();
  let walking = false;
  /* `foot` là mặt đang đứng (lib/walk.js) — sàn nhà, bậc, sân. `eyeY` đuổi theo `foot + WALK.eye`
     chứ không nhảy thẳng, để lên xuống bậc thấy êm như bước chứ không giật. */
  let foot = 0, eyeY = 0;

  const ORBIT_HINT = 'Kéo để xoay · lăn để phóng · giữ chuột phải để dời';

  /* Đi bộ luôn bắt đầu ngay phía trong cổng chính, nhìn vào sân. Không ghim toạ độ: mỗi phương án
     có bề rộng cổng khác nhau; bản cũ có cổng xe + cổng bộ thì ưu tiên cổng bộ cho người đi. */
  function gateEntry(plan){
    const gate = plan.gates.find(g => /CỔNG CHÍNH/i.test(g[4]))
              || plan.gates.find(g => /CỔNG BỘ/i.test(g[4])) || plan.gates[0];
    if (!gate) {
      const p = roomCenter(plan, /HÀNH LANG$/);
      return { ...p, dx:0, dz:1, label:'hành lang' };
    }
    const [ax, pos, a, b, label] = gate, mid = (a + b) / 2, inset = 0.45;
    if (ax === 'h') {
      const dz = pos <= LOT.d / 2 ? 1 : -1;
      return { x:mid, z:pos + dz * inset, dx:0, dz, label };
    }
    const dx = pos <= LOT.w / 2 ? 1 : -1;
    return { x:pos + dx * inset, z:mid, dx, dz:0, label };
  }

  /* Trạng thái đi bộ bám theo sự kiện khoá chuột thật, không tự đoán: requestPointerLock()
     có thể bị trình duyệt từ chối, đoán trước thì kẹt ở chế độ không điều khiển được gì. */
  function enterWalk(plan){
    const p = gateEntry(plan);
    foot = supportAt(solids, p.x, p.z, LEVELS ? LEVELS.floor : 0.45);
    const y = eyeY = foot + WALK.eye;

    /* Đứng ngay trong cổng ở cao độ mắt trước, rồi mới xin khoá chuột. Trình duyệt có thể từ
       chối khoá (thiếu cử chỉ người dùng, iframe không cho) — khi đó vẫn đang đứng đúng chỗ,
       đúng tầm mắt, chỉ là xoay bằng cách kéo chứ không rê được chuột. Đây là lộ trình tự nhiên
       để vào nhà, nên không được để nó phụ thuộc vào pointer lock. */
    camera.position.set(p.x, y, p.z);
    orbit.target.set(p.x + p.dx * 4, y, p.z + p.dz * 4); // nhìn vào trong lô
    orbit.update();

    /* Gọi thẳng requestPointerLock chứ không qua walk.lock(): three bỏ rơi promise, bị từ
       chối là văng lỗi đỏ mà người xem không hiểu chuyện gì. Trả về undefined ở trình duyệt
       cũ nên phải ?.catch. */
    renderer.domElement.requestPointerLock()?.catch(() => {
      setHtml('hint', `Trình duyệt không cho khoá chuột — vẫn đứng ở ${p.label}, `
                    + 'kéo để nhìn quanh (không đi lại được bằng W A S D)');
    });
  }

  /* jumpingToPreset: đang thoát để nhảy sang một góc ngắm đặt sẵn. Mở khoá chuột là bất đồng
     bộ nên nếu không đánh dấu, sự kiện 'unlock' về sau sẽ đạp lên góc ngắm vừa đặt. */
  let jumpingToPreset = false;
  function exitWalk(jumping = false){
    if (!walking) return;
    jumpingToPreset = jumping;
    walk.unlock();
  }

  walk.addEventListener('lock', () => {
    walking = true;
    orbit.enabled = false;
    document.getElementById('vWalk')?.classList.add('on');
    setHtml('hint', 'Bắt đầu từ cổng chính · Chuột để nhìn · <b>W A S D</b> để đi · <b>Esc</b> để thoát');
  });
  walk.addEventListener('unlock', () => {
    walking = false;
    keys.clear();
    orbit.enabled = true;
    if (!jumpingToPreset) {
      /* Thoát tại chỗ: giữ nguyên vị trí đang đứng, lấy điểm đang nhìn làm tâm xoay. */
      orbit.target.copy(camera.position)
        .addScaledVector(walk.getDirection(new THREE.Vector3()), 4);
      orbit.update();
    }
    jumpingToPreset = false;
    document.getElementById('vWalk')?.classList.remove('on');
    setHtml('hint', ORBIT_HINT);
  });

  const onKeyDown = e => {
    if (e.code === 'Escape') return exitWalk();
    keys.add(e.code);
  };
  const onKeyUp = e => keys.delete(e.code);
  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', onKeyUp);

  function moveWalk(dt){
    if (!walking) return;
    const step = WALK.speed * dt;
    const fwd   = (keys.has('KeyW') || keys.has('ArrowUp'))
                - (keys.has('KeyS') || keys.has('ArrowDown'));
    const right = (keys.has('KeyD') || keys.has('ArrowRight'))
                - (keys.has('KeyA') || keys.has('ArrowLeft'));
    const p = walk.object.position;

    /* PointerLockControls chỉ biết hướng nhìn: cho nó đi thử để lấy độ dời trên mặt phẳng ngang, rồi
       trả về chỗ cũ và để lib/walk.js quyết đi được tới đâu. */
    if (fwd || right) {
      const from = p.clone();
      if (fwd)   walk.moveForward(fwd * step);
      if (right) walk.moveRight(right * step);
      const to = stepWalk(solids, { x: from.x, z: from.z, foot }, p.x - from.x, p.z - from.z);
      /* Cổng mở ra ngõ nên va chạm không giữ được người trong lô — chặn ở mép lô như trước. */
      p.x = Math.max(0.3, Math.min(LOT.w - 0.3, to.x));
      p.z = Math.max(0.3, Math.min(LOT.d - 0.3, to.z));
      foot = to.foot;
    }
    eyeY += (foot + WALK.eye - eyeY) * Math.min(1, dt * 12);
    p.y = eyeY;
  }

  /* ═══════════ THANH CÔNG CỤ ═══════════ */
  const planSel = document.getElementById('plan3');
  PLANS.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.label;
    planSel.appendChild(o);
  });

  let plan = PLANS[PLANS.length - 1], CFG = null;
  /* Gán sau khi dựng phần "Cấu hình đã lưu"; để hàm rỗng trước đó cho những chỗ gọi sớm. */
  let refreshSaved = () => {};

  function openPlan(id){
    plan = PLANS.find(p => p.id === id) || plan;
    planSel.value = plan.id;
    setHtml('planTitle', plan.label);
    setHtml('planNote', plan.note || '');

    /* Cấu hình dùng chung với bản vẽ 2D (lib/config.js). Phần `lines` chỉ đúng với mặt bằng
       đã sinh ra nó nên bỏ khi đổi mặt bằng; cao độ thì giữ. */
    const saved = readConfig();
    CFG = emptyConfig(plan.id);
    CFG.heights = saved?.heights || {};
    if (saved && saved.planId === plan.id) CFG.lines = saved.lines || CFG.lines;

    rebuild();
    buildHeightSliders();
    updateAzimuth();
    refreshSaved();
  }

  /* Dựng lại khối từ mặt bằng đã áp cấu hình. Camera và mặt trời giữ nguyên. */
  function rebuild(){
    build(applyConfig(plan, CFG));
    const saved = readConfig();
    setHtml('cfgState3', isEmpty(CFG)
      ? 'Đang xem đúng kích thước gốc.'
      : '<b>Đang xem bản tuỳ chỉnh.</b> Kích thước phòng kéo ở trang bản vẽ 2D.');
    if (saved !== null || !isEmpty(CFG)) writeConfig(CFG);
    refreshSaved();
  }

  /* ═══════════ THANH TRƯỢT CAO ĐỘ ═══════════ */
  const HEIGHT_ROWS = [
    { key:'ceiling', name:'Cao trần',            min:2.4, max:5.0 },
    { key:'floor',   name:'Cốt nền so với sân',  min:0.0, max:1.2 },
    { key:'door',    name:'Cao cửa',             min:1.9, max:3.0 },
    { key:'sill',    name:'Bệ cửa sổ',           min:0.0, max:1.6 },
    { key:'head',    name:'Mép trên cửa sổ',     min:1.4, max:3.2 },
    { key:'slab',    name:'Dày bản mái',         min:0.1, max:0.6 },
    { key:'fence',   name:'Tường rào — đỉnh rào', min:1.2, max:3.0 },
    { key:'fenceSolid', name:'Tường rào — phần xây đặc (trên là lan can)', min:0.3, max:3.0 },
    { key:'alley',   name:'Mái hiên hành lang ngoài', min:2.0, max:4.0 },
  ];

  function slider(host, { name, value, min, max, step, onInput, hint }){
    const row = document.createElement('div');
    row.className = 'cfgrow';
    const lab = document.createElement('label');
    const sl = document.createElement('input');
    sl.type = 'range'; sl.min = min; sl.max = max; sl.step = step; sl.value = value;
    const show = () => { lab.innerHTML = `${name} — <b>${(+sl.value).toFixed(2)} m</b>`; };
    show();
    sl.oninput = () => { show(); onInput(+sl.value); if (hint) hint(); };
    row.append(lab, sl);
    host.appendChild(row);
    return row;
  }

  function buildHeightSliders(){
    const host = document.getElementById('heightSliders');
    if (!host) return;
    host.replaceChildren();
    /* Giá trị đầu của thanh trượt là cao độ mặt bằng thật sự dùng — kể cả số khai trong `heights` của
       chính mặt bằng (bản hiện hành hạ tường rào) — rồi mới tới phần người xem đã kéo. Phần xây đặc
       chưa khai thì bằng đỉnh rào: tường kín, không lan can. */
    const eff = { ...heightsOf(plan), ...CFG.heights };
    eff.fenceSolid ??= eff.fence;
    /* Mặt bằng nào khai mái nhẹ trùm hành lang ngoài thì cao độ mái ấy nằm trong `roofs`, thanh
       trượt HEIGHTS.alley không chạm tới — giấu đi cho khỏi kéo mà không thấy gì đổi. */
    const r3 = plan.rooms.find(r => r[0] === 'R3');
    const rows = HEIGHT_ROWS.filter(r => r.key !== 'alley' || !(r3 && roofCovering(plan, r3)));
    for (const r of rows)
      slider(host, { name: r.name, value: eff[r.key], min: r.min, max: r.max, step: 0.05,
        onInput: v => { CFG.heights[r.key] = v; rebuild(); } });
  }

  const daySlider  = document.getElementById('day');
  const hourSlider = document.getElementById('hour');
  daySlider.value  = state.day;
  hourSlider.value = state.hour;

  const keyDatesBox = document.getElementById('keyDates');
  KEY_DATES.forEach(d => {
    const b = document.createElement('button');
    b.textContent = d.name;
    b.onclick = () => { state.day = d.n; daySlider.value = d.n; updateSun(); };
    keyDatesBox.appendChild(b);
  });

  const listeners = [];
  const on = (id, type, fn) => {
    const e = document.getElementById(id);
    if (!e) return;
    e.addEventListener(type, fn);
    listeners.push([e, type, fn]);
  };

  on('plan3', 'change', e => openPlan(e.target.value));
  on('day',   'input',  e => { state.day   = +e.target.value; updateSun(); });
  on('hour',  'input',  e => { state.hour  = +e.target.value; updateSun(); });

  on('azimuth', 'input', e => { CFG.azimuth = +e.target.value; writeConfig(CFG); updateAzimuth(); refreshSaved(); });
  on('azReset', 'click', () => { CFG.azimuth = null; writeConfig(CFG); updateAzimuth(); refreshSaved(); });

  on('cfg3Reset', 'click', () => {
    CFG.heights = {};
    rebuild();
    buildHeightSliders();
    updateAzimuth();
    refreshSaved();
  });

  /* Cấu hình đặt tên — cùng thành phần với trang 2D (components/savedConfigs.js). */
  refreshSaved = mountSavedConfigs('cfgSaved3', {
    getCfg: () => CFG,
    setCfg: cfg => {
      /* Mở cấu hình lưu cho mặt bằng khác thì bỏ phần `lines` — chỉ số đường không chuyển
         được sang mặt bằng này. Cao độ và hướng thì vẫn dùng được. */
      CFG = { ...cfg, planId: plan.id };
      if (cfg.planId !== plan.id) CFG.lines = { x: {}, y: {} };
      writeConfig(CFG);
      rebuild();
      buildHeightSliders();
      updateAzimuth();
    },
  });

  on('vRoof', 'click', e => {
    roofHidden = !roofHidden;
    e.target.classList.toggle('on', roofHidden);
    e.target.textContent = roofHidden ? 'Hiện mái' : 'Ẩn mái';
    applyRoofHidden();
  });
  on('vFurniture', 'click', e => {
    furnitureHidden = !furnitureHidden;
    e.target.classList.toggle('on', furnitureHidden);
    e.target.textContent = furnitureHidden ? 'Hiện đồ' : 'Ẩn đồ';
    applyFurnitureHidden();
  });
  on('vOverview', 'click', overviewView);
  on('vTop', 'click', topView);
  on('vWalk', 'click', () => walking ? exitWalk() : enterWalk(plan));

  /* ═══════════ VÒNG VẼ ═══════════ */
  function resize(){
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  let stopped = false, lastTime = performance.now();
  function loop(now){
    if (stopped) return;
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    moveWalk(dt);
    if (!walking) orbit.update();
    renderer.render(scene, camera);
  }

  openPlan(plan.id);
  updateAzimuth();                             // gọi luôn updateSun() bên trong
  resize();                                    // phải có aspect thật trước khi ngắm cho vừa
  overviewView();
  setHtml('hint', ORBIT_HINT);
  requestAnimationFrame(loop);

  /* ═══════════ DỌN ═══════════ */
  return () => {
    stopped = true;
    ro.disconnect();
    removeEventListener('keydown', onKeyDown);
    removeEventListener('keyup', onKeyUp);
    for (const [e, type, fn] of listeners) e.removeEventListener(type, fn);
    orbit.dispose();
    walk.dispose();
    UNIT_BOX.dispose();
    Object.values(solidMats).forEach(m => m.dispose());
    glassMat.dispose();
    renderer.dispose();
    host.replaceChildren();
  };
}
