/* ═══════════ CẢNH 3D ═══════════
   Cùng lối với ve2d.js: React chỉ dựng khung DOM rỗng rồi gọi khoiTao() một lần sau khi
   mount; toàn bộ việc dựng cảnh nằm ở đây, không dính React.

   Hình khối do lib/khoi3d.js sinh ra từ đúng dữ liệu mà bản vẽ 2D dùng — không chép lại
   con số nào. Vị trí mặt trời do lib/sun.js tính (NOAA). Xem 3d.md.

   Ghi chú lệch với 3d.md mục 7: bản HTML cũ phải ghim three 0.160.1 (UMD) vì mở bằng
   file:// thì ES module gãy. Trong Next thì three đi qua bundler nên dùng bản mới và
   OrbitControls dựng sẵn, không cần tự viết điều khiển camera. */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { LOT } from '../lib/lot.js';
import { VERSIONS } from '../lib/versions/index.js';
import { dungKhoi } from '../lib/khoi3d.js';
import { NOI, MOC_NGAY, matTroi, mocLan, huongTrongCanh, tenHuong, ngayThang } from '../lib/sun.js';

/* Bảng màu giấy can, cùng tông với bản vẽ 2D. */
const MAU = {
  tuongNha: 0xefece4,
  tuongHien:0xe4e0d5,
  tuongRao: 0xd9d3c4,
  san:      0xe8e3d6,
  nenSan:   0xcfccc0,
  mai:      0xc9c2b2,
  maiHien:  0xbdb6a6,
  maiChe:   0xb3aa98,
  kinh:     0xa9cfe0,
};

const TAM = new THREE.Vector3(LOT.w / 2, 0, LOT.d / 2);

/* Màu nắng và màu trời theo cao độ mặt trời — nội suy giữa hai đầu cho gọn. */
const NANG_THAP = new THREE.Color(0xff9c4a);
const NANG_CAO  = new THREE.Color(0xfff4e2);
const TROI_THAP = new THREE.Color(0xc9b9ad);
const TROI_CAO  = new THREE.Color(0xa9c8de);
const TROI_DEM  = new THREE.Color(0x2c3440);

export function khoiTao(){
  const boc = document.getElementById('canvas3d');
  if (!boc) return () => {};

  /* Dọn sạch trước khi dựng: trong dev, React StrictMode gọi effect hai lần, nếu không
     dọn thì canvas và mấy danh sách tự đổ (phiên bản, nơi xây, mốc ngày) dựng chồng nhau. */
  for (const id of ['canvas3d', 'ver3', 'noi', 'mocNgay'])
    document.getElementById(id)?.replaceChildren();

  /* ═══════════ RENDERER · CẢNH ═══════════ */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  boc.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdce6ee);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.maxPolarAngle = Math.PI / 2 - 0.02;    // không chui xuống dưới đất
  orbit.target.copy(TAM);

  const diBo = new PointerLockControls(camera, renderer.domElement);
  scene.add(diBo.object);

  /* ═══════════ ÁNH SÁNG ═══════════ */
  const troi = new THREE.HemisphereLight(0xdfeaf2, 0x9a9384, 1.1);
  scene.add(troi);

  const nang = new THREE.DirectionalLight(0xfff2dc, 3);
  nang.castShadow = true;
  nang.target.position.copy(TAM);
  scene.add(nang, nang.target);

  /* Cảnh dài 30 m: bó khung camera bóng sát đúng lô, nếu để mặc định thì bóng răng cưa
     (3d.md mục 6). Chéo lô ~31.5 m nên nửa khung 18 m là vừa đủ mọi góc mặt trời. */
  const sc = nang.shadow.camera;
  sc.left = -18; sc.right = 18; sc.top = 18; sc.bottom = -18;
  sc.near = 1; sc.far = 140;
  nang.shadow.mapSize.set(2048, 2048);
  nang.shadow.bias = -0.0006;
  nang.shadow.normalBias = 0.02;

  /* ═══════════ VẬT LIỆU ═══════════ */
  const vlDac = {};
  for (const [k, mau] of Object.entries(MAU)) {
    if (k === 'kinh') continue;
    vlDac[k] = new THREE.MeshLambertMaterial({ color: mau });
  }
  const vlKinh = new THREE.MeshLambertMaterial({
    color: MAU.kinh, transparent: true, opacity: 0.34, depthWrite: false });

  const HOP = new THREE.BoxGeometry(1, 1, 1);   // một hình hộp dùng chung, co giãn theo scale

  /* ═══════════ MŨI TÊN CHỈ BẮC ═══════════ */
  function muiTenBac(){
    const g = new THREE.Group();
    const huong = huongTrongCanh(0, 0);          // phương vị 0 = bắc, đổi sang hệ cảnh
    const than = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6),
      new THREE.MeshBasicMaterial({ color: 0x8a1c1c }));
    than.rotation.x = Math.PI / 2;
    than.position.z = -0.8;
    const dau = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5),
      new THREE.MeshBasicMaterial({ color: 0x8a1c1c }));
    dau.rotation.x = -Math.PI / 2;
    dau.position.z = -1.85;
    g.add(than, dau);
    g.position.set(LOT.w + 1.6, 0.05, 2.2);
    /* Thân mũi tên dựng theo chiều −z cục bộ, nên xoay để −z trùng với hướng bắc trong cảnh. */
    g.rotation.y = Math.atan2(-huong.x, -huong.z);
    return g;
  }
  scene.add(muiTenBac());

  /* ═══════════ DỰNG KHỐI ═══════════ */
  let nhom = null, MUC = null, anMai = false;

  function hop(b, vl, nhan){
    const m = new THREE.Mesh(HOP, vl);
    m.scale.set(b.w, b.y1 - b.y0, b.d);
    m.position.set(b.x + b.w / 2, (b.y0 + b.y1) / 2, b.z + b.d / 2);
    m.castShadow = m.receiveShadow = true;
    if (nhan) m.userData.loai = nhan;
    return m;
  }

  function dung(v){
    if (nhom) {
      scene.remove(nhom);
      nhom.traverse(o => { if (o.isMesh && o.geometry !== HOP) o.geometry.dispose(); });
    }
    const k = dungKhoi(v);
    MUC = k.muc;
    nhom = new THREE.Group();
    for (const b of k.hop)  nhom.add(hop(b, vlDac[b.loai] || vlDac.tuongNha, b.loai));
    for (const b of k.kinh) {
      const m = hop(b, vlKinh, 'kinh');
      m.castShadow = false;                    // kính không đổ bóng: để vệt nắng lọt xuống
      nhom.add(m);
    }
    scene.add(nhom);
    apDungAnMai();
  }

  const LA_MAI = l => l === 'mai' || l === 'maiHien' || l === 'maiChe';
  function apDungAnMai(){
    nhom.children.forEach(m => { if (LA_MAI(m.userData.loai)) m.visible = !anMai; });
  }

  /* ═══════════ MẶT TRỜI ═══════════ */
  const S = { noi: 'HN', ngay: 172, gio: 15 };

  function capNhatNang(){
    const { lat, lon } = NOI[S.noi];
    const mt = matTroi({ lat, lon, ngay: S.ngay, gio: S.gio });
    const h = huongTrongCanh(mt.phuongVi, mt.caoDo);

    nang.visible = mt.caoDo > 0;
    nang.position.set(TAM.x + h.x * 60, h.y * 60, TAM.z + h.z * 60);

    /* Mặt trời càng thấp thì càng đỏ và càng yếu; đêm thì chỉ còn ánh trời.
       Ánh trời cố ý để yếu hơn nắng khá nhiều — đây là thứ duy nhất đọc được ở mô hình này
       nên vệt nắng phải nổi rõ, đừng bị ánh nền dìm mất. */
    const t = Math.max(0, Math.min(1, mt.caoDo / 40));
    nang.intensity = mt.caoDo > 0 ? 1.2 + 2.6 * t : 0;
    nang.color.copy(NANG_THAP).lerp(NANG_CAO, t);
    troi.intensity = mt.caoDo > 0 ? 0.45 + 0.45 * t : 0.3;
    scene.background.copy(mt.caoDo > 0 ? TROI_THAP : TROI_DEM).lerp(TROI_CAO, mt.caoDo > 0 ? t : 0);

    const { moc, lan } = mocLan({ lat, lon, ngay: S.ngay });
    const gio = x => `${String(Math.floor(x)).padStart(2, '0')}:${String(Math.round(x % 1 * 60)).padStart(2, '0')}`;
    dat('lblGio', gio(S.gio));
    dat('lblNgay', ngayThang(S.ngay));
    dat('sunInfo', mt.caoDo > 0
      ? `Cao độ <b>${mt.caoDo.toFixed(1)}°</b> · phương vị <b>${mt.phuongVi.toFixed(0)}°</b> (${tenHuong(mt.phuongVi)})`
        + ` · mọc ${gio(moc)}, lặn ${gio(lan)}`
      : `Mặt trời đã lặn (mọc ${gio(moc)}, lặn ${gio(lan)}) — chỉ còn ánh trời khuếch tán`);
  }

  const dat = (id, html) => { const e = document.getElementById(id); if (e) e.innerHTML = html; };

  /* ═══════════ GÓC NHÌN ═══════════ */
  /* Toạ độ ngắm lấy từ tim phòng của phiên bản đang mở, không ghim số. */
  function timPhong(v, khop){
    const r = v.rooms.find(x => khop.test(x[1]));
    return r ? new THREE.Vector3(r[2] + r[4] / 2, 0, r[3] + r[5] / 2) : TAM.clone();
  }

  /* Khung bao cả lô, kể cả mái. */
  const KHUNG = new THREE.Box3(new THREE.Vector3(0, 0, 0),
                               new THREE.Vector3(LOT.w, 4.2, LOT.d));

  /* Ngắm theo một hướng, lùi vừa đủ để lô lọt khung ở mọi tỉ lệ cửa sổ — lô dài 30 m mà
     ngang có 9.5 m nên phải xét cả nửa góc mở dọc lẫn ngang, lấy cái chặt hơn.
     `siet` bù lại chỗ thừa của phép tính theo hình cầu bao: lô là tấm mỏng, không phải quả cầu. */
  function nhinVua(huong, siet = 0){
    thoatDiBo(true);
    const tam = KHUNG.getCenter(new THREE.Vector3());
    const co  = KHUNG.getSize(new THREE.Vector3());
    const r   = 0.5 * Math.hypot(co.x, co.y, co.z);

    const fv = THREE.MathUtils.degToRad(camera.fov) / 2;
    const fh = Math.atan(Math.tan(fv) * camera.aspect);
    const kc = r / Math.sin(Math.min(fv, fh)) * (1 - siet);

    orbit.target.copy(tam);
    camera.position.copy(tam).addScaledVector(new THREE.Vector3(...huong).normalize(), kc);
    orbit.update();
  }

  /* Đứng chếch phía mặt tiền (−z), cao vừa đủ thấy được cả sân lẫn mái. */
  const toanCanh    = () => nhinVua([0.55, 0.70, -1], 0.30);
  const tuTrenXuong = () => nhinVua([0.001, 1, 0.02], 0.02);

  /* ═══════════ ĐI BỘ ═══════════ */
  const phim = new Set();
  let dangDiBo = false;
  const MAT = 1.60;                              // cao mắt so với mặt sàn đang đứng

  const GOI_Y = 'Kéo để xoay · lăn để phóng · giữ chuột phải để dời';

  /* Trạng thái đi bộ bám theo sự kiện khoá chuột thật, không tự đoán: requestPointerLock()
     có thể bị trình duyệt từ chối, đoán trước thì kẹt ở chế độ không điều khiển được gì. */
  function vaoDiBo(v){
    const p = timPhong(v, /HÀNH LANG$/);
    const y = (MUC ? MUC.nen : 0.45) + MAT;

    /* Đứng vào hành lang ở cao độ mắt trước, rồi mới xin khoá chuột. Trình duyệt có thể từ
       chối khoá (thiếu cử chỉ người dùng, iframe không cho) — khi đó vẫn đang đứng đúng chỗ,
       đúng tầm mắt, chỉ là xoay bằng cách kéo chứ không rê được chuột. Đây là câu hỏi chính
       của mô hình (3d.md mục 1) nên không được để nó phụ thuộc vào pointer lock. */
    camera.position.set(p.x, y, p.z);
    orbit.target.set(p.x, y, p.z + 4);         // nhìn dọc hành lang
    orbit.update();

    /* Gọi thẳng requestPointerLock chứ không qua diBo.lock(): three bỏ rơi promise, bị từ
       chối là văng lỗi đỏ mà người xem không hiểu chuyện gì. Trả về undefined ở trình duyệt
       cũ nên phải ?.catch. */
    renderer.domElement.requestPointerLock()?.catch(() => {
      dat('gopy', 'Trình duyệt không cho khoá chuột — vẫn đứng trong hành lang, '
                + 'kéo để nhìn quanh (không đi lại được bằng W A S D)');
    });
  }
  /* doiGocNhin: đang thoát để nhảy sang một góc ngắm đặt sẵn. Mở khoá chuột là bất đồng bộ
     nên nếu không đánh dấu, sự kiện 'unlock' về sau sẽ đạp lên góc ngắm vừa đặt. */
  let doiGocNhin = false;
  function thoatDiBo(doiGoc = false){
    if (!dangDiBo) return;
    doiGocNhin = doiGoc;
    diBo.unlock();
  }

  diBo.addEventListener('lock', () => {
    dangDiBo = true;
    orbit.enabled = false;
    document.getElementById('vDiBo')?.classList.add('on');
    dat('gopy', 'Chuột để nhìn · <b>W A S D</b> để đi · <b>Esc</b> để thoát');
  });
  diBo.addEventListener('unlock', () => {
    dangDiBo = false;
    phim.clear();
    orbit.enabled = true;
    if (!doiGocNhin) {
      /* Thoát tại chỗ: giữ nguyên vị trí đang đứng, lấy điểm đang nhìn làm tâm xoay. */
      orbit.target.copy(camera.position)
        .addScaledVector(diBo.getDirection(new THREE.Vector3()), 4);
      orbit.update();
    }
    doiGocNhin = false;
    document.getElementById('vDiBo')?.classList.remove('on');
    dat('gopy', GOI_Y);
  });

  const xuongPhim = e => {
    if (e.code === 'Escape') return thoatDiBo();
    phim.add(e.code);
  };
  const lenPhim = e => phim.delete(e.code);
  addEventListener('keydown', xuongPhim);
  addEventListener('keyup', lenPhim);

  function diChuyen(dt){
    if (!dangDiBo) return;
    const v = 2.4 * dt;
    const tien = (phim.has('KeyW') || phim.has('ArrowUp')) - (phim.has('KeyS') || phim.has('ArrowDown'));
    const phai  = (phim.has('KeyD') || phim.has('ArrowRight')) - (phim.has('KeyA') || phim.has('ArrowLeft'));
    if (tien) diBo.moveForward(tien * v);
    if (phai)  diBo.moveRight(phai * v);
    /* Giữ mắt trong lô, và giữ nguyên cao độ: không mô phỏng va chạm hay bậc thềm. */
    const p = diBo.object.position;
    p.x = Math.max(0.3, Math.min(LOT.w - 0.3, p.x));
    p.z = Math.max(0.3, Math.min(LOT.d - 0.3, p.z));
  }

  /* ═══════════ THANH CÔNG CỤ ═══════════ */
  const sel = document.getElementById('ver3');
  VERSIONS.forEach(v => {
    const o = document.createElement('option');
    o.value = v.id; o.textContent = v.label;
    sel.appendChild(o);
  });

  let VC = VERSIONS[VERSIONS.length - 1];
  function moPhienBan(id){
    VC = VERSIONS.find(v => v.id === id) || VC;
    sel.value = VC.id;
    dat('v3Title', VC.label);
    dat('v3Note', VC.note || '');
    dung(VC);
  }

  const noi = document.getElementById('noi');
  Object.entries(NOI).forEach(([k, n]) => {
    const o = document.createElement('option');
    o.value = k; o.textContent = `${n.ten} — ${n.lat}°B`;
    noi.appendChild(o);
  });
  noi.value = S.noi;

  const sNgay = document.getElementById('ngay');
  const sGio  = document.getElementById('gio');
  sNgay.value = S.ngay;
  sGio.value  = S.gio;

  const mocBoc = document.getElementById('mocNgay');
  MOC_NGAY.forEach(m => {
    const b = document.createElement('button');
    b.textContent = m.ten;
    b.onclick = () => { S.ngay = m.n; sNgay.value = m.n; capNhatNang(); };
    mocBoc.appendChild(b);
  });

  const nghe = [];
  const on = (id, sk, fn) => {
    const e = document.getElementById(id);
    if (!e) return;
    e.addEventListener(sk, fn);
    nghe.push([e, sk, fn]);
  };

  on('ver3', 'change', e => moPhienBan(e.target.value));
  on('noi',  'change', e => { S.noi = e.target.value; capNhatNang(); });
  on('ngay', 'input',  e => { S.ngay = +e.target.value; capNhatNang(); });
  on('gio',  'input',  e => { S.gio  = +e.target.value; capNhatNang(); });

  on('vMai', 'click', e => {
    anMai = !anMai;
    e.target.classList.toggle('on', anMai);
    e.target.textContent = anMai ? 'Hiện mái' : 'Ẩn mái';
    apDungAnMai();
  });
  on('vToan', 'click', toanCanh);
  on('vTren', 'click', tuTrenXuong);
  on('vDiBo', 'click', () => dangDiBo ? thoatDiBo() : vaoDiBo(VC));

  /* ═══════════ VÒNG VẼ ═══════════ */
  function coLai(){
    const w = boc.clientWidth, h = boc.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(coLai);
  ro.observe(boc);

  let ngung = false, lucTruoc = performance.now();
  function vong(now){
    if (ngung) return;
    requestAnimationFrame(vong);
    const dt = Math.min(0.05, (now - lucTruoc) / 1000);
    lucTruoc = now;
    diChuyen(dt);
    if (!dangDiBo) orbit.update();
    renderer.render(scene, camera);
  }

  moPhienBan(VC.id);
  capNhatNang();
  coLai();                                     // phải có aspect thật trước khi ngắm cho vừa
  toanCanh();
  dat('gopy', GOI_Y);
  requestAnimationFrame(vong);

  /* ═══════════ DỌN ═══════════ */
  return () => {
    ngung = true;
    ro.disconnect();
    removeEventListener('keydown', xuongPhim);
    removeEventListener('keyup', lenPhim);
    for (const [e, sk, fn] of nghe) e.removeEventListener(sk, fn);
    orbit.dispose();
    diBo.dispose();
    HOP.dispose();
    Object.values(vlDac).forEach(m => m.dispose());
    vlKinh.dispose();
    renderer.dispose();
    boc.replaceChildren();
  };
}
