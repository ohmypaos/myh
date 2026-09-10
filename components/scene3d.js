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

import { LOT, frontAzimuth, setFrontAzimuth } from '../lib/lot.js';
import { PLANS } from '../lib/versions/index.js';
import { buildMassing } from '../lib/massing.js';
import { PLACES, KEY_DATES, sunPosition, sunriseSunset, toSceneVector, compassName, dayLabel }
  from '../lib/sun.js';

/* Bảng màu giấy can, cùng tông với bản vẽ 2D. Khoá phải trùng `kind` mà massing.js sinh ra. */
const COLORS = {
  houseWall:   0xefece4,
  alleyWall:   0xe4e0d5,
  fenceWall:   0xd9d3c4,
  floor:       0xe8e3d6,
  ground:      0xcfccc0,
  roof:        0xc9c2b2,
  alleyRoof:   0xbdb6a6,
  carportRoof: 0xb3aa98,
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
  for (const id of ['canvas3d', 'plan3', 'place', 'keyDates'])
    document.getElementById(id)?.replaceChildren();

  /* ═══════════ RENDERER · CẢNH ═══════════ */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
  let group = null, LEVELS = null, roofHidden = false;

  function box(b, material, kind){
    const m = new THREE.Mesh(UNIT_BOX, material);
    m.scale.set(b.w, b.y1 - b.y0, b.d);
    m.position.set(b.x + b.w / 2, (b.y0 + b.y1) / 2, b.z + b.d / 2);
    m.castShadow = m.receiveShadow = true;
    if (kind) m.userData.kind = kind;
    return m;
  }

  function build(plan){
    if (group) {
      scene.remove(group);
      group.traverse(o => { if (o.isMesh && o.geometry !== UNIT_BOX) o.geometry.dispose(); });
    }
    const massing = buildMassing(plan);
    LEVELS = massing.levels;
    group = new THREE.Group();
    for (const b of massing.boxes)
      group.add(box(b, solidMats[b.kind] || solidMats.houseWall, b.kind));
    for (const b of massing.glass) {
      const m = box(b, glassMat, 'glass');
      m.castShadow = false;                    // kính không đổ bóng: để vệt nắng lọt xuống
      group.add(m);
    }
    scene.add(group);
    applyRoofHidden();
  }

  const isRoof = k => k === 'roof' || k === 'alleyRoof' || k === 'carportRoof';
  function applyRoofHidden(){
    group.children.forEach(m => { if (isRoof(m.userData.kind)) m.visible = !roofHidden; });
  }

  const setHtml = (id, html) => {
    const e = document.getElementById(id);
    if (e) e.innerHTML = html;
  };

  /* ═══════════ MẶT TRỜI ═══════════ */
  const state = { place: 'HN', day: 172, hour: 15 };
  const hhmm = x =>
    `${String(Math.floor(x)).padStart(2, '0')}:${String(Math.round(x % 1 * 60)).padStart(2, '0')}`;

  function updateSun(){
    const { lat, lon } = PLACES[state.place];
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
    const deg = frontAzimuth();
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

  /* Khung bao cả lô, kể cả mái. */
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
  const EYE = 1.60;                              // cao mắt so với mặt sàn đang đứng

  const ORBIT_HINT = 'Kéo để xoay · lăn để phóng · giữ chuột phải để dời';

  /* Trạng thái đi bộ bám theo sự kiện khoá chuột thật, không tự đoán: requestPointerLock()
     có thể bị trình duyệt từ chối, đoán trước thì kẹt ở chế độ không điều khiển được gì. */
  function enterWalk(plan){
    const p = roomCenter(plan, /HÀNH LANG$/);
    const y = (LEVELS ? LEVELS.floor : 0.45) + EYE;

    /* Đứng vào hành lang ở cao độ mắt trước, rồi mới xin khoá chuột. Trình duyệt có thể từ
       chối khoá (thiếu cử chỉ người dùng, iframe không cho) — khi đó vẫn đang đứng đúng chỗ,
       đúng tầm mắt, chỉ là xoay bằng cách kéo chứ không rê được chuột. Đây là câu hỏi chính
       của mô hình (3d.md mục 1) nên không được để nó phụ thuộc vào pointer lock. */
    camera.position.set(p.x, y, p.z);
    orbit.target.set(p.x, y, p.z + 4);         // nhìn dọc hành lang
    orbit.update();

    /* Gọi thẳng requestPointerLock chứ không qua walk.lock(): three bỏ rơi promise, bị từ
       chối là văng lỗi đỏ mà người xem không hiểu chuyện gì. Trả về undefined ở trình duyệt
       cũ nên phải ?.catch. */
    renderer.domElement.requestPointerLock()?.catch(() => {
      setHtml('hint', 'Trình duyệt không cho khoá chuột — vẫn đứng trong hành lang, '
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
    setHtml('hint', 'Chuột để nhìn · <b>W A S D</b> để đi · <b>Esc</b> để thoát');
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
    const step = 2.4 * dt;
    const fwd   = (keys.has('KeyW') || keys.has('ArrowUp'))
                - (keys.has('KeyS') || keys.has('ArrowDown'));
    const right = (keys.has('KeyD') || keys.has('ArrowRight'))
                - (keys.has('KeyA') || keys.has('ArrowLeft'));
    if (fwd)   walk.moveForward(fwd * step);
    if (right) walk.moveRight(right * step);
    /* Giữ mắt trong lô, và giữ nguyên cao độ: không mô phỏng va chạm hay bậc thềm. */
    const p = walk.object.position;
    p.x = Math.max(0.3, Math.min(LOT.w - 0.3, p.x));
    p.z = Math.max(0.3, Math.min(LOT.d - 0.3, p.z));
  }

  /* ═══════════ THANH CÔNG CỤ ═══════════ */
  const planSel = document.getElementById('plan3');
  PLANS.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.label;
    planSel.appendChild(o);
  });

  let plan = PLANS[PLANS.length - 1];
  function openPlan(id){
    plan = PLANS.find(p => p.id === id) || plan;
    planSel.value = plan.id;
    setHtml('planTitle', plan.label);
    setHtml('planNote', plan.note || '');
    build(plan);
  }

  const placeSel = document.getElementById('place');
  Object.entries(PLACES).forEach(([key, p]) => {
    const o = document.createElement('option');
    o.value = key; o.textContent = `${p.name} — ${p.lat}°B`;
    placeSel.appendChild(o);
  });
  placeSel.value = state.place;

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
  on('place', 'change', e => { state.place = e.target.value; updateSun(); });
  on('day',   'input',  e => { state.day   = +e.target.value; updateSun(); });
  on('hour',  'input',  e => { state.hour  = +e.target.value; updateSun(); });

  on('azimuth', 'input', e => { setFrontAzimuth(+e.target.value); updateAzimuth(); });
  on('azReset', 'click', () => { setFrontAzimuth(null); updateAzimuth(); });

  on('vRoof', 'click', e => {
    roofHidden = !roofHidden;
    e.target.classList.toggle('on', roofHidden);
    e.target.textContent = roofHidden ? 'Hiện mái' : 'Ẩn mái';
    applyRoofHidden();
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
