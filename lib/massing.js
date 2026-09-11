/* ═══════════ DỰNG KHỐI 3D TỪ DỮ LIỆU MẶT BẰNG ═══════════
   Thuần hình học, không đụng tới three.js: trả về một danh sách hộp chữ nhật thẳng trục
   để trang 3D chỉ việc đổ ra mesh. Nhờ vậy chạy được cả trong node (kiểm tra bằng script).

   Không dùng CSG (xem 3d.md mục 5). Mọi lỗ mở đều là chữ nhật trên tường thẳng trục nên
   mỗi đoạn tường chỉ cần cắt thành mảnh dưới bệ / hai bên / trên lanh tô rồi ghép — nhẹ,
   không thêm thư viện, tự nhiên có luôn lanh tô và bệ cửa sổ.

   Hệ toạ độ: x, z = x, y của bản vẽ (mét, tim tường). y = lên trời, gốc y = 0 ở cốt sân. */

import { LOT, ROOF, RAILING, heightsOf } from './lot.js';
import { isEnclosed, floorOf, roomsAlong, openingFloor, stepsOf, overhangsOf, jointHalf,
         levels, roofOver, roofCovering, roofPanels, gutters, downpipes, wallTopOf, clearRect } from './envelope.js';

export { levels };

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

/* Cao độ tuyệt đối của các mốc: levels() ở lib/envelope.js, xuất lại ở trên.

   Ngoài hộp thẳng trục còn một loại khối thứ hai — **lăng trụ mặt nghiêng** (`prisms`): mái tôn
   dốc và đầu hồi tam giác của bếp. Vẫn là chữ nhật trên mặt bằng, chỉ khác là cao độ mặt trên
   (và mặt dưới) đổi tuyến tính theo một trục. Tách riêng khỏi `boxes` để mọi chỗ đang coi hộp
   là thẳng trục không phải đoán. */

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

/* Lăng trụ mặt trên nghiêng cho một mảnh tường — đầu hồi dưới mái dốc. `yb` / `yt` là cao độ
   mặt dưới và mặt trên ở hai đầu đoạn, theo trục dọc bức tường. */
function wallPrism(ax, pos, s, e, t, yb, yt, kind){
  const base = ax === 'h' ? { x: s, w: e - s, z: pos - t / 2, d: t }
                          : { x: pos - t / 2, w: t, z: s, d: e - s };
  return { ...base, axis: ax === 'h' ? 'x' : 'z', yb, yt,
           y0: Math.min(...yb), y1: Math.max(...yt), kind };
}

/* Lan can thoáng trên một đoạn tường rào thấp: [s, e] dọc trục tường, từ cốt `y0` (đỉnh phần xây)
   tới `y1` (đỉnh rào). Chừa trống trên các lỗ mở `gaps` — cổng và cửa đi xuyên suốt chiều cao rào.
   Mỗi khúc liền có trụ ở hai đầu và cách đều không quá RAILING.postGap, song đứng giữa các trụ, tay
   vịn chạy suốt trên cùng. Chỗ lan can đâm vào tường nhà hay lan can tuyến vuông góc ở góc thì
   resolveOverlaps() gỡ. */
function railing(ax, pos, s, e, gaps, y0, y1){
  const { post, postGap, rail, bar, pitch } = RAILING;
  const out = [];
  const piece = (a, b, t, lo, hi) => out.push(wallBox(ax, pos, a, b, t, lo, hi, 'railing'));
  const runs = gaps
    .reduce((acc, [ga, gb]) => acc.flatMap(([p, q]) => [[p, Math.min(q, ga)], [Math.max(p, gb), q]]), [[s, e]])
    .filter(([p, q]) => q - p > 2 * post);
  const head = y1 - rail;
  for (const [p, q] of runs) {
    piece(p, q, rail, head, y1);
    const n = Math.max(1, Math.ceil((q - p) / postGap));
    const at = Array.from({ length: n + 1 }, (_, i) => p + (q - p) * i / n);
    const faces = at.map((c, i) => i === 0 ? [p, p + post] : i === n ? [q - post, q] : [c - post / 2, c + post / 2]);
    faces.forEach(([a, b]) => piece(a, b, post, y0, head));
    for (let i = 0; i < n; i++) {
      const a = faces[i][1], b = faces[i + 1][0];
      const m = Math.max(0, Math.round((b - a) / pitch) - 1);
      for (let k = 1; k <= m; k++) {
        const c = a + (b - a) * k / (m + 1);
        piece(c - bar / 2, c + bar / 2, bar, y0, head);
      }
    }
  }
  return out;
}

function buildWalls(v, H, L){
  const boxes = [], glass = [], prisms = [], rails = [];
  const tops = [L.fenceTop, L.houseTop];
  const kinds = ['fenceWall', 'houseWall'];

  for (const [ax, pos, a, b, t] of v.walls) {
    const mine = [];

    /* Hai đầu thật của bức tường được kéo dài thêm nửa bề dày tường vuông góc (xem cuối vòng
       lặp). Mái nhẹ phải soi trên đúng bề dài đã kéo ấy: đỉnh tường lấy theo chỗ mái thấp
       nhất, mà chỗ thấp nhất của mái dốc lại rơi vào chính phần kéo thêm. */
    const extA = jointHalf(v, ax, pos, a), extB = jointHalf(v, ax, pos, b);
    const capSpan = [a - extA, b + extB];

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
      const kind = kinds[tier];

      /* Đỉnh tường: mặc định theo bậc, nhưng mái nhẹ đè lên thì bám mép mái (lib/envelope.js).
         Phần mái nhô cao hơn đỉnh phẳng ấy dựng thành đầu hồi — lăng trụ mặt trên nghiêng. */
      const { top, cap } = wallTopOf(v, ax, pos, s, e, t, { forced, capSpan });
      if (cap) {
        const segS = Math.abs(s - a) < EPS ? s - extA : s;
        const segE = Math.abs(e - b) < EPS ? e + extB : e;
        const marks = [segS, ...cap.breaks.filter(m => m > segS + EPS && m < segE - EPS), segE];
        for (let i = 0; i < marks.length - 1; i++) {
          let [u0, u1] = [marks[i], marks[i + 1]];
          let h0 = cap.at(u0) - top, h1 = cap.at(u1) - top;
          if (h0 < EPS && h1 < EPS) continue;              // mái không nhô trên đỉnh phẳng
          if (h0 < 0) { u0 += (u1 - u0) * -h0 / (h1 - h0); h0 = 0; }
          if (h1 < 0) { u1 += (u0 - u1) * -h1 / (h0 - h1); h1 = 0; }
          prisms.push(wallPrism(ax, pos, u0, u1, t, [top, top], [top + h0, top + h1], kind));
        }
      }

      /* Tường rào có lan can: chỉ xây đặc tới `fenceSolid`, phần trên tới đỉnh rào là lan can
         thoáng. Chỉ tường rào thật — tường nâng (`forced`) và tường bám mái nhẹ giữ xây kín. */
      const solid = kind === 'fenceWall' && !cap && H.fenceSolid != null ? Math.min(top, H.fenceSolid) : top;

      /* Lỗ mở cắt về trong mảnh, và không bao giờ cao hơn đỉnh phần xây: cửa cao 2.20 m tính
         từ cốt nền mà rơi vào tường rào 2.20 m thì thành khoảng hở suốt, không có lanh tô. */
      const holes = openingsOn(v, H, L, ax, pos)
        .map(o => ({ ...o, a: Math.max(o.a, s), b: Math.min(o.b, e) }))
        .filter(o => o.b > o.a + EPS)
        .map(o => ({ ...o, y1: Math.min(o.y1, solid) }));

      if (solid < top - EPS) rails.push(...railing(ax, pos, s, e, holes.map(o => [o.a, o.b]), solid, top));

      let cur = s;
      for (const o of holes) {
        if (o.a > cur + EPS) mine.push(wallBox(ax, pos, cur, o.a, t, 0, solid, kind));
        if (o.y0 > EPS)      mine.push(wallBox(ax, pos, o.a, o.b, t, 0, o.y0, kind));
        if (o.y1 < solid - EPS) mine.push(wallBox(ax, pos, o.a, o.b, t, o.y1, solid, kind));

        /* Kính: cửa sổ và cửa lùa. Cửa cánh để trống cho thấy được lối đi. */
        if (o.kind === 'window' || o.style === 'slide' || o.style === 'slide1')
          glass.push(wallBox(ax, pos, o.a, o.b, t * 0.3, o.y0, o.y1, 'glass'));

        cur = Math.max(cur, o.b);
      }
      if (cur < e - EPS) mine.push(wallBox(ax, pos, cur, e, t, 0, solid, kind));
    }

    /* Kéo hai đầu thật của bức tường (không phải chỗ cắt theo phòng hay lỗ mở) thêm nửa bề dày
       tường vuông góc gặp nó — góc ngoài kín: dựng đúng từ tim tới tim thì góc ngoài khuyết một ô
       nửa bề dày, nhìn ra hai tường giao nhau ở tim chứ không vuông. Phần chồng lên tường kia gỡ ở
       resolveOverlaps(). Đầu hồi ở trên đã dựng thẳng trên bề dài đã kéo, không qua vòng này. */
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
  return { boxes: [...boxes, ...rails], glass, prisms };
}

/* ═══════════ SÀN · MÁI · BẬC ═══════════ */

function buildSlabs(v, H, L){
  const boxes = [], glass = [], prisms = [];

  /* Nền lô — cốt sân. */
  boxes.push({ x: 0, w: LOT.w, z: 0, d: LOT.d, y0: -0.12, y1: 0, kind: 'ground' });

  const holes = v.skylights.map(([, , x, y, w, h]) => ({ x, z: y, w, d: h }));

  for (const r of v.rooms) {
    const [, , x, y, w, h] = r;
    const f = floorOf(v, r, L.floor);
    if (f > EPS) boxes.push({ x, w, z: y, d: h, y0: 0, y1: f, kind: 'floor' });

    /* Mái chỉ phủ khối nhà kín. Giếng trời và cửa trời khoét thẳng vào bản mái.
       Phòng nào có mái nhẹ phủ trọn (bếp) thì không đổ bản bê tông mà treo trần tôn ở cốt
       khai trong chính mái ấy — mặt dưới trần là cao trần thật của phòng. */
    if (!isEnclosed(r)) continue;
    const light = roofOver(v, r);
    if (light) {
      /* Trần tôn bắt vào mặt trong tường nên chỉ phủ phần lọt lòng — khác bản bê tông, vốn
         đổ liền tới tim tường. Phủ tới tim thì nó đâm vào đầu hồi và vào chính tấm mái ở chỗ
         mép mái đua ra ngoài tường, nơi mặt dưới mái còn thấp hơn cốt trần. */
      const c = clearRect(v, r);
      boxes.push({ x: c.x, w: c.w, z: c.y, d: c.h,
                   y0: light.ceiling, y1: light.ceiling + ROOF.ceiling, kind: 'ceiling' });
    } else {
      for (const m of subtractHoles({ x, w, z: y, d: h }, holes))
        boxes.push({ ...m, y0: L.ceiling, y1: L.houseTop, kind: 'roof' });
    }
  }

  /* Mái nhẹ — tấm tôn, mặt dốc nên là lăng trụ chứ không phải hộp (lib/envelope.js). */
  for (const p of roofPanels(v))
    prisms.push({ x: p.x0, w: p.x1 - p.x0, z: p.y0, d: p.y1 - p.y0,
                  axis: p.axis === 'x' ? 'x' : 'z', yb: p.yb, yt: p.yt,
                  y0: Math.min(...p.yb), y1: Math.max(...p.yt), kind: 'metalRoof', id: p.id });

  /* Máng xối ở mép thấp mái nhẹ — hộp dưới mép, miệng ngang mặt dưới mái — và ống xả đứng từ đáy
     máng áp tường bao xuống ống ngầm (lib/envelope.js). */
  for (const g of gutters(v)) {
    const { x, y, w, h } = g.rect;
    boxes.push({ x, w, z: y, d: h, y0: g.bottom, y1: g.top, kind: 'gutter', id: g.id });
  }
  for (const p of downpipes(v)) {
    const { x, y, w, h } = p.rect;
    boxes.push({ x, w, z: y, d: h, y0: p.bottom, y1: p.top, kind: 'downpipe', id: p.id });
  }

  for (const [, , x, y, w, h] of v.skylights)
    glass.push({ x, w, z: y, d: h, y0: L.ceiling, y1: L.ceiling + 0.04, kind: 'glass' });

  /* Mái hiên hành lang ngoài của kho đối chiếu — tấm phẳng ở cốt HEIGHTS.alley, thấp hơn mái nhà
     nên hành lang có dải sáng phía trên. Mặt bằng nào khai mái nhẹ trùm R3 (bản hiện hành) thì mái
     ấy thay chỗ tấm này. Tường bao phía ngoài vẫn chỉ cao như rào. */
  const r3 = v.rooms.find(r => r[0] === 'R3');
  if (r3 && !roofCovering(v, r3))
    boxes.push({ x: r3[2], w: r3[4], z: r3[3], d: r3[5],
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

  return { boxes, glass, prisms };
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
/* Trần tôn tính là bản mái: nó cũng phủ kín một phòng, và cũng phải khoét khỏi tường — tường
   nhà chính bên tây bếp xây suốt lên 4.00 nên tấm trần đâm vào nửa trong của nó. */
const isSlab = b => b.kind === 'roof' || b.kind === 'alleyRoof' || b.kind === 'overhang'
                 || b.kind === 'ceiling';

function resolveOverlaps(boxes){
  const cut = (list, by) => by.reduce((acc, q) => acc.flatMap(p => subtractBox(p, q)), list);
  const slabs = boxes.filter(isSlab);
  const rest  = boxes.filter(b => !isWall(b) && !isSlab(b) && b.kind !== 'railing');

  /* Tường cao hơn trước, cùng cao thì giữ thứ tự khai — mảnh sau nhường mảnh trước. */
  const walls = boxes.filter(isWall)
    .flatMap(w => cut([w], slabs))
    .map((b, i) => ({ b, i }))
    .sort((p, q) => q.b.y1 - p.b.y1 || p.i - q.i)
    .map(o => o.b);
  const kept = [];
  for (const w of walls) kept.push(...cut([w], kept));

  /* Lan can nhường tường: đâm vào tường nhà (rào gặp nhà) thì cắt phần trong tường. Hai tuyến lan can
     gặp nhau ở góc thì tuyến khai trước giữ phần chồng. Chỉ soi các khối nằm quanh nó cho đỡ tốn. */
  const near = (p, q) => q.x < p.x + p.w + EPS && p.x < q.x + q.w + EPS && q.z < p.z + p.d + EPS && p.z < q.z + q.d + EPS;
  const rails = [];
  for (const r of boxes.filter(b => b.kind === 'railing'))
    rails.push(...cut([r], [...kept, ...slabs, ...rails].filter(q => near(r, q))));

  return [...kept, ...slabs, ...rails, ...rest];
}

/* ═══════════ ĐẦU RA ═══════════ */

export function buildMassing(v){
  const H = heightsOf(v);
  const L = levels(H);
  const w = buildWalls(v, H, L);
  const s = buildSlabs(v, H, L);
  const prisms = [...w.prisms, ...s.prisms];
  /* `top` là đỉnh cao nhất của thiết kế: mái nhà, hoặc nóc mái tôn nếu nó nhô cao hơn. */
  const top = Math.max(L.houseTop, ...prisms.map(p => p.y1));
  return { H, levels: { ...L, top }, boxes: resolveOverlaps([...w.boxes, ...s.boxes]),
           prisms, glass: [...w.glass, ...s.glass] };
}
