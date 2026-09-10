/* ═══════════ DỰNG KHỐI 3D TỪ DỮ LIỆU PHIÊN BẢN ═══════════
   Thuần hình học, không đụng tới three.js: trả về một danh sách hộp chữ nhật thẳng trục
   để trang 3D chỉ việc đổ ra mesh. Nhờ vậy chạy được cả trong node (kiểm tra bằng script).

   Không dùng CSG (xem 3d.md mục 5). Mọi lỗ mở đều là chữ nhật trên tường thẳng trục nên
   mỗi đoạn tường chỉ cần cắt thành mảnh dưới bệ / hai bên / trên lanh tô rồi ghép — nhẹ,
   không thêm thư viện, tự nhiên có luôn lanh tô và bệ cửa sổ.

   Hệ toạ độ: x, z = x, y của bản vẽ (mét, tim tường). y = lên trời, gốc y = 0 ở cốt sân. */

import { LOT, MAI_CHE, caoDo } from './lot.js';

const EPS = 0.001;
const chongLan = (a, b, c, d) => Math.min(b, d) - Math.max(a, c);

/* Phòng kín — cùng định nghĩa với validate() trong plan.js: sân và lối đi hở không tính. */
const laKin = r => r[6] !== 'yard' && r[0] !== 'R3';

/* Ban công nằm trên cốt nền nhà chứ không phải cốt sân — bước từ master ra không hụt chân.
   Nhận theo tên chứ không theo mã: mã phòng xê dịch giữa các phiên bản, tên thì không. */
const laBanCong = r => /^BAN CÔNG/.test(r[1]);

const oCotNha = r => laKin(r) || laBanCong(r);

/* Ba bậc chiều cao của tường. Danh sách walls không phân biệt tường nhà với tường rào,
   nên suy từ phòng áp vào: có phòng kín thì là tường nhà, chỉ có hành lang ngoài thì
   là tường hiên, còn lại là rào. Nhờ vậy v=0 tự ra: y 0–12 rào, 12–28 nhà, 28–30 rào. */
const BAC_RAO = 0, BAC_HIEN = 1, BAC_NHA = 2;

function bacCuaPhong(r){
  if (laKin(r)) return BAC_NHA;
  if (r[0] === 'R3') return BAC_HIEN;
  return BAC_RAO;
}

/* Cao độ tuyệt đối (tính từ cốt sân) của những mốc hay dùng. */
export function mucCao(H){
  return {
    san:      0,
    nen:      H.nen,
    tran:     H.nen + H.tran,
    dinhNha:  H.nen + H.tran + H.mai,
    dinhHien: H.hienNgoai,
    dinhRao:  H.rao,
  };
}

/* ═══════════ CẮT CHỮ NHẬT ═══════════ */

/* Cắt [a,b] tại các mốc nằm hẳn bên trong. */
function catDoan(a, b, mocs){
  const m = [...new Set([a, b, ...mocs.filter(x => x > a + EPS && x < b - EPS)])]
    .sort((p, q) => p - q);
  return m.slice(0, -1).map((s, i) => [s, m[i + 1]]);
}

/* Một mảnh chữ nhật trừ đi một lỗ → tối đa 4 mảnh (cắt ngang trước, rồi cắt dọc dải giữa). */
function truMotLo(m, lo){
  const x0 = Math.max(m.x, lo.x), x1 = Math.min(m.x + m.w, lo.x + lo.w);
  const z0 = Math.max(m.z, lo.z), z1 = Math.min(m.z + m.d, lo.z + lo.d);
  if (x1 <= x0 + EPS || z1 <= z0 + EPS) return [m];          // không giao nhau
  const r = [];
  if (z0 > m.z + EPS)         r.push({ ...m, d: z0 - m.z });
  if (z1 < m.z + m.d - EPS)   r.push({ ...m, z: z1, d: m.z + m.d - z1 });
  if (x0 > m.x + EPS)         r.push({ ...m, z: z0, d: z1 - z0, w: x0 - m.x });
  if (x1 < m.x + m.w - EPS)   r.push({ ...m, x: x1, z: z0, d: z1 - z0, w: m.x + m.w - x1 });
  return r;
}

function truLo(rect, los){
  let manh = [rect];
  for (const lo of los) manh = manh.flatMap(m => truMotLo(m, lo));
  return manh;
}

/* ═══════════ TƯỜNG ═══════════ */

/* Phòng áp vào một đoạn tường: nằm sát đúng đường tim và có phần chồng lên đoạn đang xét. */
function phongApVao(rooms, ax, pos, s, e){
  return rooms.filter(([, , x, y, w, h]) => ax === 'h'
    ? (Math.abs(y - pos) < EPS || Math.abs(y + h - pos) < EPS) && chongLan(x, x + w, s, e) > EPS
    : (Math.abs(x - pos) < EPS || Math.abs(x + w - pos) < EPS) && chongLan(y, y + h, s, e) > EPS);
}

/* Hộp cho một mảnh tường: [s,e] là bề dài dọc trục tường, t là bề dày (chia đều hai bên tim). */
function hopTuong(ax, pos, s, e, t, y0, y1, loai){
  return ax === 'h'
    ? { x: s, w: e - s, z: pos - t / 2, d: t, y0, y1, loai }
    : { x: pos - t / 2, w: t, z: s, d: e - s, y0, y1, loai };
}

/* Lỗ mở trên một đoạn tường, quy về hệ (dọc trục tường, cao độ tuyệt đối).
   'open' bị bỏ qua: đó là chỗ không có tường chứ không phải cửa (xem D3). */
function loMoTren(v, H, M, ax, pos){
  const los = [];

  for (const [id, dax, dpos, a, b, kind] of v.doors) {
    if (kind === 'open' || dax !== ax || Math.abs(dpos - pos) > EPS) continue;
    const cao = (H.rieng[id] && H.rieng[id].cua) || H.cua;
    los.push({ id, a, b, y0: M.nen, y1: M.nen + cao, loai: 'cua', kind });
  }
  for (const [id, wax, wpos, a, b] of v.windows) {
    if (wax !== ax || Math.abs(wpos - pos) > EPS) continue;
    los.push({ id, a, b, y0: M.nen + H.soDuoi, y1: M.nen + H.soTren, loai: 'so' });
  }
  for (const [gax, gpos, a, b, ten] of v.gates) {
    if (gax !== ax || Math.abs(gpos - pos) > EPS) continue;
    los.push({ id: ten, a, b, y0: 0, y1: Infinity, loai: 'cong' });   // cổng hở suốt chiều cao rào
  }
  return los.sort((p, q) => p.a - q.a);
}

function dungTuong(v, H, M){
  const hop = [], kinh = [];
  const dinh = [M.dinhRao, M.dinhHien, M.dinhNha];
  const tenBac = ['tuongRao', 'tuongHien', 'tuongNha'];

  for (const [ax, pos, a, b, t] of v.walls) {
    /* Cắt đoạn tường theo ranh giới phòng để mỗi mảnh có một bậc chiều cao duy nhất. */
    const moc = phongApVao(v.rooms, ax, pos, a, b)
      .flatMap(([, , x, y, w, h]) => ax === 'h' ? [x, x + w] : [y, y + h]);

    for (const [s, e] of catDoan(a, b, moc)) {
      const ap = phongApVao(v.rooms, ax, pos, s, e);
      const bac = ap.length ? Math.max(...ap.map(bacCuaPhong)) : BAC_RAO;
      const top = dinh[bac];
      const loai = tenBac[bac];

      /* Lỗ mở cắt về trong mảnh, và không bao giờ cao hơn đỉnh tường: cửa cao 2.20 m tính
         từ cốt nền mà rơi vào tường rào 2.20 m thì thành khoảng hở suốt, không có lanh tô. */
      const los = loMoTren(v, H, M, ax, pos)
        .map(lo => ({ ...lo, a: Math.max(lo.a, s), b: Math.min(lo.b, e) }))
        .filter(lo => lo.b > lo.a + EPS)
        .map(lo => ({ ...lo, y1: Math.min(lo.y1, top) }));

      let cur = s;
      for (const lo of los) {
        if (lo.a > cur + EPS) hop.push(hopTuong(ax, pos, cur, lo.a, t, 0, top, loai));
        if (lo.y0 > EPS)      hop.push(hopTuong(ax, pos, lo.a, lo.b, t, 0, lo.y0, loai));
        if (lo.y1 < top - EPS) hop.push(hopTuong(ax, pos, lo.a, lo.b, t, lo.y1, top, loai));

        /* Kính: cửa sổ và cửa lùa. Cửa cánh để trống cho thấy được lối đi. */
        if (lo.loai === 'so' || lo.kind === 'slide' || lo.kind === 'slide1')
          kinh.push(hopTuong(ax, pos, lo.a, lo.b, t * 0.3, lo.y0, lo.y1, 'kinh'));

        cur = Math.max(cur, lo.b);
      }
      if (cur < e - EPS) hop.push(hopTuong(ax, pos, cur, e, t, 0, top, loai));
    }
  }
  return { hop, kinh };
}

/* ═══════════ SÀN · MÁI ═══════════ */

function dungSanMai(v, H, M){
  const hop = [], kinh = [];

  /* Nền lô — cốt sân. */
  hop.push({ x: 0, w: LOT.w, z: 0, d: LOT.d, y0: -0.12, y1: 0, loai: 'nenSan' });

  const los = v.skylights.map(([, , x, y, w, h]) => ({ x, z: y, w, d: h }));

  for (const r of v.rooms) {
    const [, , x, y, w, h] = r;
    if (oCotNha(r)) hop.push({ x, w, z: y, d: h, y0: 0, y1: M.nen, loai: 'san' });

    /* Mái chỉ phủ khối nhà kín. Giếng trời và cửa trời khoét thẳng vào bản mái. */
    if (laKin(r))
      for (const m of truLo({ x, w, z: y, d: h }, los))
        hop.push({ ...m, y0: M.tran, y1: M.dinhNha, loai: 'mai' });
  }

  for (const [, , x, y, w, h] of v.skylights)
    kinh.push({ x, w, z: y, d: h, y0: M.tran, y1: M.tran + 0.04, loai: 'kinh' });

  /* Mái hiên hành lang ngoài — thấp hơn mái nhà, nên hành lang có dải sáng phía trên. */
  const r3 = v.rooms.find(r => r[0] === 'R3');
  if (r3) hop.push({ x: r3[2], w: r3[4], z: r3[3], d: r3[5],
                     y0: M.dinhHien - 0.1, y1: M.dinhHien, loai: 'maiHien' });

  /* Mái che sân phụ — chỗ để xe. Chưa vào dữ liệu phiên bản, tạm khai ở lot.js (3d.md mục 3). */
  hop.push({ x: MAI_CHE.x, w: MAI_CHE.w, z: MAI_CHE.tuY - MAI_CHE.dai, d: MAI_CHE.dai,
             y0: MAI_CHE.cao - 0.1, y1: MAI_CHE.cao, loai: 'maiChe' });

  return { hop, kinh };
}

/* ═══════════ ĐẦU RA ═══════════ */

export function dungKhoi(v){
  const H = caoDo(v);
  const M = mucCao(H);
  const t = dungTuong(v, H, M);
  const s = dungSanMai(v, H, M);
  return { H, muc: M, hop: [...t.hop, ...s.hop], kinh: [...t.kinh, ...s.kinh] };
}
