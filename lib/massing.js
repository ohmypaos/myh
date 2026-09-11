/* ═══════════ DỰNG KHỐI 3D TỪ DỮ LIỆU MẶT BẰNG ═══════════
   Thuần hình học, không đụng tới three.js: trả về một danh sách hộp chữ nhật thẳng trục
   để trang 3D chỉ việc đổ ra mesh. Nhờ vậy chạy được cả trong node (kiểm tra bằng script).

   Không dùng CSG (xem 3d.md mục 5). Mọi lỗ mở đều là chữ nhật trên tường thẳng trục nên
   mỗi đoạn tường chỉ cần cắt thành mảnh dưới bệ / hai bên / trên lanh tô rồi ghép — nhẹ,
   không thêm thư viện, tự nhiên có luôn lanh tô và bệ cửa sổ.

   Hệ toạ độ: x, z = x, y của bản vẽ (mét, tim tường). y = lên trời, gốc y = 0 ở cốt sân. */

import { LOT, ROOF, RAILING, FURNITURE, DOOR_LEAF, PURLIN, heightsOf } from './lot.js';
import { isEnclosed, floorOf, roomsAlong, openingFloor, stepsOf, overhangsOf, jointHalf, wallThickness,
         levels, roofOver, roofCovering, roofPanels, gutters, downpipes, postsOf, beamsOf, purlinsOf, dropCeilingsOf, wallTopOf, clearRect,
         roofInsulationOf } from './envelope.js';

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

  for (const [ax, pos, a, b, t, material] of v.walls) {
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
      const kind = material === 'plastic' ? 'partitionWall' : kinds[tier];

      /* Đỉnh tường: mặc định theo bậc, nhưng mái nhẹ đè lên thì bám mép mái (lib/envelope.js).
         Phần mái nhô cao hơn đỉnh phẳng ấy dựng thành đầu hồi — lăng trụ mặt trên nghiêng. */
      /* Vách nhựa chỉ ngăn phòng, không nhận mái: dựng tới trần và không sinh đầu hồi. */
      const { top, cap } = material === 'plastic'
        ? { top:L.ceiling, cap:null }
        : wallTopOf(v, ax, pos, s, e, t, { forced, capSpan });
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

  /* Trần giả hạ thấp (WC khách) — tấm mỏng dưới bản mái, phủ phần lọt lòng. Loại riêng chứ không phải
     'ceiling': phòng vẫn có bản bê tông che, phép kiểm diện tích mái không được tính hai lần. */
  for (const c of dropCeilingsOf(v)) {
    if (c.error) continue;
    boxes.push({ x: c.rect.x, w: c.rect.w, z: c.rect.y, d: c.rect.h,
                 y0: c.y, y1: c.y + ROOF.ceiling, kind: 'dropCeiling', id: c.id });
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

  /* Dầm biên mái nhẹ (lib/envelope.js) — đoạn nghiêng theo mái là lăng trụ, đoạn phẳng là hộp. */
  for (const b of beamsOf(v)) {
    const { x, y, w, h } = b.rect;
    if (b.sloped)
      prisms.push({ x, w, z: y, d: h, axis: b.ax === 'h' ? 'x' : 'z', yb: b.yb, yt: b.yt,
                    y0: Math.min(...b.yb), y1: Math.max(...b.yt), kind: 'beam', id: b.id });
    else boxes.push({ x, w, z: y, d: h, y0: b.yb[0], y1: b.yt[0], kind: 'beam', id: b.id });
  }

  /* Xà gồ nằm ngay dưới tấm tôn, chạy vuông góc chiều dốc và dừng ở mặt dầm / tường đỡ. */
  for (const p of purlinsOf(v)) {
    const { x, y, w, h } = p.rect;
    boxes.push({ x, w, z: y, d: h, y0: p.top - PURLIN.depth, y1: p.top,
                 kind: 'purlin', id: p.id, roofId: p.roofId });
  }

  /* Cột đỡ mái nhẹ — từ cốt sân tới đáy dầm (lib/envelope.js). Nằm trên tim tường rào
     nên chồng phần xây đặc và lan can: gỡ ở resolveOverlaps(), cột coi như tường cao hơn rào. */
  for (const p of postsOf(v)) {
    if (p.error) continue;
    boxes.push({ x: p.rect.x, w: p.size, z: p.rect.y, d: p.size, y0: 0, y1: p.top, kind: 'post', id: p.id });
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

/* ═══════════ LỚP CHỐNG NÓNG MÁI ═══════════
   Một lớp phẳng dày bằng tổng cấu tạo (XPS + vữa cán + gạch), đặt ngay trên mặt bản mái bê tông. Vùng
   phủ: bản mái của các phòng đổ bê tông theo tim tường (lib/envelope.js), các bản mái đổ ra ngoài được
   khai, và **mọi đỉnh tường nhà ở cốt mái** — đỉnh tường cũng là mặt mái. Dừng ở tim thì mép lớp hụt nửa
   bề dày tường như trần ban công từng bị, và góc hai tường nâng bên ban công (kéo tới mặt ngoài rào sau)
   để trần. Trừ giếng trời, và trừ mọi khối nhô cao hơn mặt bản mái: đầu hồi tam giác của tường nhà chính
   bên tây bếp đứng giữa lớp, lát qua là gạch cắm vào tường. Bản mái và tường chồng nhau ở nửa bề dày nên
   mỗi mảnh trừ đi các mảnh đã đặt. */
function buildInsulation(v, L, solids){
  const ins = roofInsulationOf(v);
  if (!ins) return [];
  const y0 = L.houseTop, y1 = y0 + ins.thickness;
  const rects = [
    ...ins.rooms.map(([, , x, y, w, h]) => ({ x, z: y, w, d: h })),
    ...ins.overhangs.map(({ rect: { x, y, w, h } }) => ({ x, z: y, w, d: h })),
    ...solids.filter(b => b.kind === 'houseWall' && !b.axis && Math.abs(b.y1 - y0) < EPS)
      .map(({ x, z, w, d }) => ({ x, z, w, d })),
  ];
  const holes = [
    ...v.skylights.map(([, , x, y, w, h]) => ({ x, z: y, w, d: h })),
    ...solids.filter(b => b.y1 > y0 + EPS && b.y0 < y1 - EPS).map(({ x, z, w, d }) => ({ x, z, w, d })),
  ];
  const placed = [];
  for (const rect of rects)
    placed.push(...subtractHoles(rect, [...holes, ...placed]).filter(m => m.w > 0.01 && m.d > 0.01));
  return placed.map(m => ({ ...m, y0, y1, kind: 'roofInsulation' }));
}

/* ═══════════ NỘI THẤT · CÁNH CỬA ═══════════ */

/* Phòng chứa một món nội thất — cùng phép thử với validate() (lọt trong phòng, dung sai 1 cm). */
const roomOfItem = (v, [, x, y, w, h]) => v.rooms.find(([, , rx, ry, rw, rh]) =>
  x >= rx - 0.01 && y >= ry - 0.01 && x + w <= rx + rw + 0.01 && y + h <= ry + rh + 0.01);

/* Chiều cao một món (điểm cao nhất) theo FURNITURE (lib/lot.js); `cab` chia theo chỗ đặt và cỡ. 0 = loại
   lạ, không dựng. */
export function furnitureHeight(v, item){
  const [kind, , , w, h] = item;
  const bedKind = kind === 'bedw' ? 'bed' : kind;
  const H = FURNITURE[bedKind];
  if (bedKind === 'bed') return H.head;
  if (kind === 'sofa') return H.back;
  if (kind === 'chair') return H.back;
  if (kind !== 'cab') return H || 0;
  if (/PHÒNG KHÁCH/.test(roomOfItem(v, item)?.[1] || '')) return H.living;
  return w * h < H.smallArea ? H.small : H.tall;
}

/* Các khối của một món: { x0, x1, z0, z1, y0, y1 } theo toạ độ mặt bằng khai, cao độ tính từ sàn. */
function furnitureParts(v, item, room){
  const [kind, x, y, w, h] = item;
  const part = (x0, x1, z0, z1, y0, y1, surfaceKind, tone) => ({ x0, x1, z0, z1, y0, y1, surfaceKind, tone });

  if (kind === 'bed' || kind === 'bedw') {
    /* Đầu giường ở cạnh trái (`bedw`) hoặc cạnh trên (`bed`) — đúng chỗ 2D vẽ gối. Toạ độ cục bộ: `u`
       dọc chiều dài tính từ đầu giường, `s` theo bề ngang. */
    const B = FURNITURE.bed, alongX = kind === 'bedw';
    const len = alongX ? w : h, wide = alongX ? h : w;
    const at = (u0, u1, s0, s1, y0, y1) => alongX
      ? part(x + u0, x + u1, y + s0, y + s1, y0, y1)
      : part(x + s0, x + s1, y + u0, y + u1, y0, y1);
    const T = B.headThickness, g = B.leg;
    const legs = [[T, T + g], [len - g, len]].flatMap(([u0, u1]) =>
      [[0, g], [wide - g, wide]].map(([s0, s1]) => at(u0, u1, s0, s1, 0, B.legs)));
    return [
      at(0, T, 0, wide, 0, B.head),                                        // đầu giường
      ...legs,
      at(T, len, 0, wide, B.legs, B.frame),                                // khung
      at(T, len - B.inset, B.inset, wide - B.inset, B.frame, B.mattress),  // nệm
    ];
  }

  if (kind === 'sofa') {
    /* Tựa lưng ở cạnh dài phía xa tâm phòng: sofa kê sát tường thì lưng vào tường, cạnh dài của bộ chữ L
       giữa phòng thì lưng quay ra lối đi. */
    const S = FURNITURE.sofa, alongX = w >= h, t = S.backThickness;
    const [, , rx, ry, rw, rh] = room;
    if (alongX) {
      const backLow = y + h / 2 < ry + rh / 2;
      const [b0, b1, s0, s1] = backLow ? [y, y + t, y + t, y + h] : [y + h - t, y + h, y, y + h - t];
      return [part(x, x + w, b0, b1, 0, S.back), part(x, x + w, s0, s1, 0, S.seat)];
    }
    const backLow = x + w / 2 < rx + rw / 2;
    const [b0, b1, s0, s1] = backLow ? [x, x + t, x + t, x + w] : [x + w - t, x + w, x, x + w - t];
    return [part(b0, b1, y, y + h, 0, S.back), part(s0, s1, y, y + h, 0, S.seat)];
  }

  /* Ghế bàn làm việc nhìn sang bàn ở bên phải, nên tựa lưng ở mép trái. Tách mặt ngồi và tựa lưng để không thành khối
     đặc nặng mắt trong góc master; kích thước mặt bằng vẫn là hình vuông khai trong `furn`. */
  if (kind === 'chair') {
    const C = FURNITURE.chair, t = C.backThickness;
    return [part(x, x + w, y, y + h, 0, C.seat), part(x, x + t, y, y + h, C.seat, C.back)];
  }

  /* Máy giặt/sấy là một khối đặt trên bệ sân (`FURNITURE.washPlinth`), bệ chỉ đua ra vài cm quanh
     thân máy. Nước rửa sân vì thế không tràn thẳng vào thiết bị, còn bệ vẫn đủ thấp để bước lên. */
  if (kind === 'washRaised') {
    const { rise, pad } = FURNITURE.washPlinth;
    return [part(x - pad, x + w + pad, y - pad, y + h + pad, 0, rise, 'ground'),
            part(x, x + w, y, y + h, rise, rise + FURNITURE.washRaised)];
  }

  /* Vòi nước âm tường: chỉ dựng đầu vòi nhô ra khỏi mặt trong tường, không có chân hay bệ từ
     sàn. Hình chữ nhật khai bắt đầu ở mặt tường và chiều ngắn là bề dày đầu vòi. Vẫn là
     `furniture` cho phép kiểm và nút ẩn đồ, nhưng tô màu ống xả (`tone`) — kim loại, không phải gỗ. */
  if (kind === 'tap') return [part(x, x + w, y, y + h, 0.95, 1.10, undefined, 'downpipe')];

  return [part(x, x + w, y, y + h, 0, furnitureHeight(v, item))];
}

/* Mặt bằng khai nội thất theo tim tường, dung sai 1 cm (validate()), nên món kê sát tường có thể lấn
   vào nửa bề dày tường chừng ấy — chậu rửa bếp tới 24.90 trong khi mặt tường 220 ở 24.89. Cắt theo
   chữ nhật lọt lòng của phòng: đồ thật không chui vào tường được. Mỗi khối mang `item` — thứ tự món
   trong `furn` — để phép kiểm gom các khối của cùng một món. */
function buildFurniture(v, L){
  const boxes = [];
  (v.furn || []).forEach((item, i) => {
    const room = roomOfItem(v, item);
    if (!room || !(furnitureHeight(v, item) > 0)) return;  // validate() đã báo món lọt ra ngoài phòng
    const c = clearRect(v, room), f = floorOf(v, room, L.floor);
    for (const p of furnitureParts(v, item, room)) {
      const x0 = Math.max(p.x0, c.x), x1 = Math.min(p.x1, c.x + c.w);
      const z0 = Math.max(p.z0, c.y), z1 = Math.min(p.z1, c.y + c.h);
      if (x1 - x0 <= EPS || z1 - z0 <= EPS) continue;
      boxes.push({ x: x0, w: x1 - x0, z: z0, d: z1 - z0, y0: f + p.y0, y1: f + p.y1,
                   kind: p.surfaceKind || 'furniture', id: item[0], item: i, ...(p.tone && { tone: p.tone }) });
    }
  });
  return boxes;
}

/* Cánh cửa quay (1 cánh, bản lề `hinge` = đầu a / b) mở 90° về phía `open` (+1 = phía toạ độ lớn); cửa
   4 cánh thì hai cánh ngoài đóng, hai cánh giữa mở. Chân cánh ở cốt sàn của lỗ mở, đỉnh ở đầu cửa.
   Cánh nằm trong **lọt lòng của phòng phía mở**: bắt đầu từ mặt tường chứ không phải tim (từ tim thì
   đâm vào nửa bề dày tường), bản lề không lùi quá mặt tường vuông góc (lỗ D8 khai tới 4.90 mà mặt
   tường 220 bên cạnh ở 4.89), và không vươn quá mặt tường đối diện — hành lang 0.9 m ở kho đối
   chiếu hẹp hơn cánh 0.8 m cộng tường, cánh dừng ở mặt tường: thật ra là cánh không mở hết 90°. */
function buildDoorLeaves(v, H, L){
  const boxes = [], T = DOOR_LEAF.thickness;
  for (const [id, ax, pos, a, b, style, hinge, open] of v.doors) {
    if ((style !== 'swing' && style !== 'quad') || !(open === 1 || open === -1)) continue;
    const base = openingFloor(v, L, ax, pos, a, b);
    const top = base + ((H.only[id] && H.only[id].door) || H.door);
    const face = pos + open * wallThickness(v, ax, pos, a, b) / 2;

    const mid = (a + b) / 2;
    const room = roomsAlong(v.rooms, ax, pos, a, b).find(r => {
      const [, , x, y, w, h] = r;
      const [edge, u0, u1] = ax === 'h' ? [y, x, x + w] : [x, y, y + h];
      return (Math.abs(edge - pos) < EPS ? 1 : -1) === open && mid > u0 && mid < u1;
    });
    const c = room && clearRect(v, room);
    const [lo, hi, far] = !c ? [a, b, Infinity]
      : ax === 'h' ? [c.x, c.x + c.w, open > 0 ? c.y + c.h : c.y]
                   : [c.y, c.y + c.h, open > 0 ? c.x + c.w : c.x];
    const ua = Math.max(a, lo), ub = Math.min(b, hi), room_ = Math.abs(far - face);
    if (ub - ua < 4 * T) continue;

    /* [u0, u1] dọc trục tường, cánh vươn `reach` vuông góc ra từ mặt tường. */
    const leaf = (u0, u1, reach) => {
      const r = Math.min(reach, room_);
      const n0 = Math.min(face, face + open * r), n1 = Math.max(face, face + open * r);
      boxes.push(ax === 'h'
        ? { x: u0, w: u1 - u0, z: n0, d: n1 - n0, y0: base, y1: top, kind: 'doorLeaf', id }
        : { x: n0, w: n1 - n0, z: u0, d: u1 - u0, y0: base, y1: top, kind: 'doorLeaf', id });
    };
    const span = ub - ua;
    if (style === 'swing') {
      /* Cánh rộng bằng lỗ, xoay quanh bản lề nên vươn ra đúng chừng ấy trừ bề dày nó. */
      if (hinge === 'b') leaf(ub - T, ub, span - T); else leaf(ua, ua + T, span - T);
    } else {
      /* Cửa 4 cánh: hai cánh ngoài **đóng** — nằm trong lỗ, giữa bề dày tường; hai cánh giữa **mở** 90°,
         bản lề ở mép trong cánh ngoài. Chủ nhà chốt tạm ngày 11/9/2026 (DOOR_LEAF trong lib/lot.js). */
      const q = span / 4;
      for (const u0 of [ua, ub - q])
        boxes.push(ax === 'h'
          ? { x: u0, w: q, z: pos - T / 2, d: T, y0: base, y1: top, kind: 'doorLeaf', id }
          : { x: pos - T / 2, w: T, z: u0, d: q, y0: base, y1: top, kind: 'doorLeaf', id });
      leaf(ua + q, ua + q + T, q - T);
      leaf(ub - q - T, ub - q, q - T);
    }
  }
  return boxes;
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

/* Cột đỡ mái gỡ chồng như tường: cao hơn rào nên rào nhường phần chồng, lan can cắt quanh cột. */
const isWall = b => /Wall$/.test(b.kind) || b.kind === 'post';
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
  /* Lớp chống nóng nằm trên mặt bản mái, không chồng tường hay bản mái nào nên không qua resolveOverlaps(). */
  const insulation = buildInsulation(v, L, [...w.boxes, ...s.boxes, ...prisms]);
  /* `top` là đỉnh cao nhất của thiết kế: mái nhà (kể cả lớp chống nóng), hoặc nóc mái tôn nếu nó nhô cao hơn. */
  const top = Math.max(L.houseTop, ...prisms.map(p => p.y1), ...insulation.map(b => b.y1));
  const extra = [...insulation, ...buildFurniture(v, L), ...buildDoorLeaves(v, H, L)];
  return { H, levels: { ...L, top }, boxes: [...resolveOverlaps([...w.boxes, ...s.boxes]), ...extra],
           prisms, glass: [...w.glass, ...s.glass] };
}
