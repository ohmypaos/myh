/* ═══════════ DỰNG KHỐI 3D TỪ DỮ LIỆU MẶT BẰNG ═══════════
   Thuần hình học, không đụng tới three.js: trả về một danh sách hộp chữ nhật thẳng trục
   để trang 3D chỉ việc đổ ra mesh. Nhờ vậy chạy được cả trong node (kiểm tra bằng script).

   Không dùng CSG (xem 3d.md mục 5). Mọi lỗ mở đều là chữ nhật trên tường thẳng trục nên
   mỗi đoạn tường chỉ cần cắt thành mảnh dưới bệ / hai bên / trên lanh tô rồi ghép — nhẹ,
   không thêm thư viện, tự nhiên có luôn lanh tô và bệ cửa sổ.

   Hệ toạ độ: x, z = x, y của bản vẽ (mét, tim tường). y = lên trời, gốc y = 0 ở cốt sân. */

import { LOT, heightsOf } from './lot.js';
import { isEnclosed, floorOf, roomsAlong, openingFloor, stepsOf, overhangsOf, jointHalf }
  from './envelope.js';

const EPS = 0.001;
const overlap = (a, b, c, d) => Math.min(b, d) - Math.max(a, c);

/* Phòng kín, ban công, cốt sàn từng phòng, bậc và mái hiên: lib/envelope.js — dùng chung với
   validate() và bản vẽ 2D. */

/* Hai bậc chiều cao của tường. Danh sách walls không phân biệt tường nhà với tường rào,
   nên suy từ phòng áp vào: có phòng kín thì là tường nhà, còn lại là rào. Nhờ vậy v=0 tự
   ra: y 0–12 rào, 12–28 nhà, 28–30 rào.
   Hành lang ngoài (R3) cũng chỉ có tường rào: mái hiên của nó đua ra từ tường bếp, không
   cần tường bao phía ngoài cao lên để đỡ.
   Ngoại lệ khai tay duy nhất: `v.fullHeightWalls` — đoạn tường xây lên hết chiều cao nhà dù chỉ
   áp vào sân. Hiện là tường trái ban công sau, đỡ trần ban công và chắn nắng chiều hè (3d.md 2a). */
const TIER_FENCE = 0, TIER_HOUSE = 1;

const tierOf = r => isEnclosed(r) ? TIER_HOUSE : TIER_FENCE;

/* Cao độ tuyệt đối (tính từ cốt sân) của những mốc hay dùng. */
export function levels(H){
  return {
    ground:    0,
    floor:     H.floor,
    ceiling:   H.floor + H.ceiling,
    houseTop:  H.floor + H.ceiling + H.slab,
    alleyTop:  H.alley,
    fenceTop:  H.fence,
  };
}

/* ═══════════ CẮT CHỮ NHẬT ═══════════ */

/* Cắt [a,b] tại các mốc nằm hẳn bên trong. */
function splitSpan(a, b, marks){
  const m = [...new Set([a, b, ...marks.filter(x => x > a + EPS && x < b - EPS)])]
    .sort((p, q) => p - q);
  return m.slice(0, -1).map((s, i) => [s, m[i + 1]]);
}

/* Một mảnh chữ nhật trừ đi một lỗ → tối đa 4 mảnh (cắt ngang trước, rồi cắt dọc dải giữa). */
function subtractOne(m, hole){
  const x0 = Math.max(m.x, hole.x), x1 = Math.min(m.x + m.w, hole.x + hole.w);
  const z0 = Math.max(m.z, hole.z), z1 = Math.min(m.z + m.d, hole.z + hole.d);
  if (x1 <= x0 + EPS || z1 <= z0 + EPS) return [m];          // không giao nhau
  const r = [];
  if (z0 > m.z + EPS)         r.push({ ...m, d: z0 - m.z });
  if (z1 < m.z + m.d - EPS)   r.push({ ...m, z: z1, d: m.z + m.d - z1 });
  if (x0 > m.x + EPS)         r.push({ ...m, z: z0, d: z1 - z0, w: x0 - m.x });
  if (x1 < m.x + m.w - EPS)   r.push({ ...m, x: x1, z: z0, d: z1 - z0, w: m.x + m.w - x1 });
  return r;
}

function subtractHoles(rect, holes){
  let parts = [rect];
  for (const h of holes) parts = parts.flatMap(m => subtractOne(m, h));
  return parts;
}

/* ═══════════ TƯỜNG ═══════════ */

/* Hộp cho một mảnh tường: [s,e] là bề dài dọc trục tường, t là bề dày (chia đều hai bên tim). */
function wallBox(ax, pos, s, e, t, y0, y1, kind){
  return ax === 'h'
    ? { x: s, w: e - s, z: pos - t / 2, d: t, y0, y1, kind }
    : { x: pos - t / 2, w: t, z: s, d: e - s, y0, y1, kind };
}

/* Lỗ mở trên một đoạn tường, quy về hệ (dọc trục tường, cao độ tuyệt đối).
   Cao độ tính từ cốt sàn của lỗ mở, không phải một cốt nền chung: WC khách ở +0.15 nên cửa D11
   bắt đầu từ đó (lib/envelope.js).
   'open' bị bỏ qua: đó là chỗ không có tường chứ không phải cửa (xem D3). */
function openingsOn(v, H, L, ax, pos){
  const list = [];

  for (const [id, dax, dpos, a, b, style] of v.doors) {
    if (style === 'open' || dax !== ax || Math.abs(dpos - pos) > EPS) continue;
    const height = (H.only[id] && H.only[id].door) || H.door;
    const base = openingFloor(v, L, ax, pos, a, b);
    list.push({ id, a, b, y0: base, y1: base + height, kind: 'door', style });
  }
  for (const [id, wax, wpos, a, b] of v.windows) {
    if (wax !== ax || Math.abs(wpos - pos) > EPS) continue;
    const only = H.only[id] || {};   // ô thoáng đặt cao (W4) khai bệ / mép trên riêng
    const base = openingFloor(v, L, ax, pos, a, b);
    list.push({ id, a, b, y0: base + (only.sill ?? H.sill), y1: base + (only.head ?? H.head),
                kind: 'window' });
  }
  for (const [gax, gpos, a, b, name] of v.gates) {
    if (gax !== ax || Math.abs(gpos - pos) > EPS) continue;
    list.push({ id: name, a, b, y0: 0, y1: Infinity, kind: 'gate' });  // cổng hở suốt chiều cao rào
  }
  return list.sort((p, q) => p.a - q.a);
}

function buildWalls(v, H, L){
  const boxes = [], glass = [];
  const tops = [L.fenceTop, L.houseTop];
  const kinds = ['fenceWall', 'houseWall'];

  for (const [ax, pos, a, b, t] of v.walls) {
    const mine = [];

    /* Cắt đoạn tường theo ranh giới phòng — và theo hai đầu đoạn tường nâng — để mỗi mảnh có
       một bậc chiều cao duy nhất. */
    const full = (v.fullHeightWalls || [])
      .filter(([fax, fpos]) => fax === ax && Math.abs(fpos - pos) < EPS)
      .map(([, , fa, fb]) => [fa, fb]);
    const marks = [
      ...roomsAlong(v.rooms, ax, pos, a, b).flatMap(([, , x, y, w, h]) => ax === 'h' ? [x, x + w] : [y, y + h]),
      ...full.flat(),
    ];

    for (const [s, e] of splitSpan(a, b, marks)) {
      const along = roomsAlong(v.rooms, ax, pos, s, e);
      const forced = full.some(([fa, fb]) => fa <= s + EPS && fb >= e - EPS);
      const tier = forced ? TIER_HOUSE
                 : along.length ? Math.max(...along.map(tierOf)) : TIER_FENCE;
      const top = tops[tier];
      const kind = kinds[tier];

      /* Lỗ mở cắt về trong mảnh, và không bao giờ cao hơn đỉnh tường: cửa cao 2.20 m tính
         từ cốt nền mà rơi vào tường rào 2.20 m thì thành khoảng hở suốt, không có lanh tô. */
      const holes = openingsOn(v, H, L, ax, pos)
        .map(o => ({ ...o, a: Math.max(o.a, s), b: Math.min(o.b, e) }))
        .filter(o => o.b > o.a + EPS)
        .map(o => ({ ...o, y1: Math.min(o.y1, top) }));

      let cur = s;
      for (const o of holes) {
        if (o.a > cur + EPS) mine.push(wallBox(ax, pos, cur, o.a, t, 0, top, kind));
        if (o.y0 > EPS)      mine.push(wallBox(ax, pos, o.a, o.b, t, 0, o.y0, kind));
        if (o.y1 < top - EPS) mine.push(wallBox(ax, pos, o.a, o.b, t, o.y1, top, kind));

        /* Kính: cửa sổ và cửa lùa. Cửa cánh để trống cho thấy được lối đi. */
        if (o.kind === 'window' || o.style === 'slide' || o.style === 'slide1')
          glass.push(wallBox(ax, pos, o.a, o.b, t * 0.3, o.y0, o.y1, 'glass'));

        cur = Math.max(cur, o.b);
      }
      if (cur < e - EPS) mine.push(wallBox(ax, pos, cur, e, t, 0, top, kind));
    }

    /* Kéo hai đầu thật của bức tường (không phải chỗ cắt theo phòng hay lỗ mở) thêm nửa bề dày
       tường vuông góc gặp nó — góc ngoài kín: dựng đúng từ tim tới tim thì góc ngoài khuyết một ô
       nửa bề dày, nhìn ra hai tường giao nhau ở tim chứ không vuông. Phần chồng lên tường kia gỡ ở
       resolveOverlaps(). */
    const extA = jointHalf(v, ax, pos, a), extB = jointHalf(v, ax, pos, b);
    for (const bx of mine) {
      if (ax === 'h') {
        if (Math.abs(bx.x - a) < EPS)        { bx.x -= extA; bx.w += extA; }
        if (Math.abs(bx.x + bx.w - b) < EPS)   bx.w += extB;
      } else {
        if (Math.abs(bx.z - a) < EPS)        { bx.z -= extA; bx.d += extA; }
        if (Math.abs(bx.z + bx.d - b) < EPS)   bx.d += extB;
      }
    }
    boxes.push(...mine);
  }
  return { boxes, glass };
}

/* ═══════════ SÀN · MÁI · BẬC ═══════════ */

function buildSlabs(v, H, L){
  const boxes = [], glass = [];

  /* Nền lô — cốt sân. */
  boxes.push({ x: 0, w: LOT.w, z: 0, d: LOT.d, y0: -0.12, y1: 0, kind: 'ground' });

  const holes = v.skylights.map(([, , x, y, w, h]) => ({ x, z: y, w, d: h }));

  for (const r of v.rooms) {
    const [, , x, y, w, h] = r;
    const f = floorOf(v, r, L.floor);
    if (f > EPS) boxes.push({ x, w, z: y, d: h, y0: 0, y1: f, kind: 'floor' });

    /* Mái chỉ phủ khối nhà kín. Giếng trời và cửa trời khoét thẳng vào bản mái. */
    if (isEnclosed(r))
      for (const m of subtractHoles({ x, w, z: y, d: h }, holes))
        boxes.push({ ...m, y0: L.ceiling, y1: L.houseTop, kind: 'roof' });
  }

  for (const [, , x, y, w, h] of v.skylights)
    glass.push({ x, w, z: y, d: h, y0: L.ceiling, y1: L.ceiling + 0.04, kind: 'glass' });

  /* Mái hiên hành lang ngoài — thấp hơn mái nhà, nên hành lang có dải sáng phía trên. Mái đua
     ra từ tường bếp; tường bao phía ngoài vẫn chỉ cao như rào. */
  const r3 = v.rooms.find(r => r[0] === 'R3');
  if (r3) boxes.push({ x: r3[2], w: r3[4], z: r3[3], d: r3[5],
                       y0: L.alleyTop - 0.1, y1: L.alleyTop, kind: 'alleyRoof' });

  /* Mái hiên — bản mái đổ dư ra ngoài tường, cùng cốt với mái nhà. Loại riêng chứ không phải
     'roof': nó không che phòng nào, phép kiểm diện tích mái không được tính nó. */
  for (const o of overhangsOf(v)) {
    if (o.error) continue;
    const { x, y, w, h } = o.rect;
    boxes.push({ x, w, z: y, d: h, y0: L.ceiling, y1: L.houseTop, kind: 'overhang' });
  }

  /* Bậc tam cấp — hộp đặc từ sàn phía thấp lên. Nấc trên cùng là ngưỡng cửa nên không dựng; bậc
     sát cửa thấp hơn ngưỡng một nấc, mỗi bậc ra xa thấp thêm một nấc. */
  for (const s of stepsOf(v)) {
    if (s.error) continue;
    for (let k = 0; k < s.count; k++) {
      const n0 = s.face + s.dir * k * s.tread, n1 = s.face + s.dir * (k + 1) * s.tread;
      const lo = Math.min(n0, n1), hi = Math.max(n0, n1);
      const top = s.top - (k + 1) * s.rise;
      boxes.push(s.ax === 'h'
        ? { x: s.a, w: s.b - s.a, z: lo, d: hi - lo, y0: s.base, y1: top, kind: 'step', id: s.id }
        : { x: lo, w: hi - lo, z: s.a, d: s.b - s.a, y0: s.base, y1: top, kind: 'step', id: s.id });
    }
  }

  return { boxes, glass };
}

/* ═══════════ GỠ CHỒNG ═══════════
   Hai khối đặc chồng lên nhau là có mặt trùng nhau, mà mặt trùng thì card đồ hoạ vẽ lúc mặt này
   lúc mặt kia (z-fighting) — mái nhấp nháy như bị tường xuyên qua mỗi khi xoay. Đã gặp đúng thế:
   tường nhà cao tới đỉnh mái 4.00 lọt vào dưới bản mái, mặt trên tường trùng mặt trên mái.

   Luật gỡ: bản mái (mái nhà, mái hiên, mái hành lang ngoài) giữ nguyên — diện tích mái vẫn đúng
   phòng kín trừ giếng trời — và khoét khỏi tường; tường chồng tường thì tường cao hơn giữ phần
   chồng. Sàn không gỡ: nó lọt trong chân tường, không có mặt nào lộ ra trùng. */

/* Hộp p trừ hộp q → tối đa 6 hộp không chồng nhau (cắt theo x, rồi z, rồi y). */
function subtractBox(p, q){
  const x0 = Math.max(p.x, q.x), x1 = Math.min(p.x + p.w, q.x + q.w);
  const z0 = Math.max(p.z, q.z), z1 = Math.min(p.z + p.d, q.z + q.d);
  const y0 = Math.max(p.y0, q.y0), y1 = Math.min(p.y1, q.y1);
  if (x1 - x0 <= EPS || z1 - z0 <= EPS || y1 - y0 <= EPS) return [p];

  const out = [];
  if (x0 > p.x + EPS)          out.push({ ...p, w: x0 - p.x });
  if (x1 < p.x + p.w - EPS)    out.push({ ...p, x: x1, w: p.x + p.w - x1 });
  const px = { ...p, x: x0, w: x1 - x0 };
  if (z0 > p.z + EPS)          out.push({ ...px, d: z0 - p.z });
  if (z1 < p.z + p.d - EPS)    out.push({ ...px, z: z1, d: p.z + p.d - z1 });
  const pz = { ...px, z: z0, d: z1 - z0 };
  if (y0 > p.y0 + EPS)         out.push({ ...pz, y1: y0 });
  if (y1 < p.y1 - EPS)         out.push({ ...pz, y0: y1 });
  return out;
}

const isWall = b => /Wall$/.test(b.kind);
const isSlab = b => b.kind === 'roof' || b.kind === 'alleyRoof' || b.kind === 'overhang';

function resolveOverlaps(boxes){
  const cut = (list, by) => by.reduce((acc, q) => acc.flatMap(p => subtractBox(p, q)), list);
  const slabs = boxes.filter(isSlab);
  const rest  = boxes.filter(b => !isWall(b) && !isSlab(b));

  /* Tường cao hơn trước, cùng cao thì giữ thứ tự khai — mảnh sau nhường mảnh trước. */
  const walls = boxes.filter(isWall)
    .flatMap(w => cut([w], slabs))
    .map((b, i) => ({ b, i }))
    .sort((p, q) => q.b.y1 - p.b.y1 || p.i - q.i)
    .map(o => o.b);
  const kept = [];
  for (const w of walls) kept.push(...cut([w], kept));

  return [...kept, ...slabs, ...rest];
}

/* ═══════════ ĐẦU RA ═══════════ */

export function buildMassing(v){
  const H = heightsOf(v);
  const L = levels(H);
  const w = buildWalls(v, H, L);
  const s = buildSlabs(v, H, L);
  return { H, levels: L, boxes: resolveOverlaps([...w.boxes, ...s.boxes]),
           glass: [...w.glass, ...s.glass] };
}
