/* ═══════════ VỎ NHÀ: CỐT SÀN · BẬC · MÁI HIÊN ═══════════
   Những thứ nằm ở ranh giữa trong nhà và ngoài sân. Dùng chung cho lib/massing.js (dựng
   khối), lib/plan.js (phép kiểm), bản vẽ 2D và đặc tả — để cả bốn cùng một cách hiểu phòng nào
   cao, phòng nào thấp.

   Bậc và mái hiên **suy vị trí** từ cửa / tường chứ không khai toạ độ: dịch tường ở thanh
   trượt thì chúng đi theo, không lơ lửng tách khỏi nhà. Xem 3d.md mục 3c. */

import { LOT, STEP, ROOF, ROOF_INSULATION, POST, BEAM, PURLIN, RAILING, STAIR, TUM, TANK, RACK, ROOF_RAILING, heightsOf } from './lot.js';

const EPS = 0.001;
const overlap = (a, b, c, d) => Math.min(b, d) - Math.max(a, c);

/* Cao độ tuyệt đối (tính từ cốt sân) của những mốc hay dùng. Ở đây chứ không ở massing.js vì
   phần mái nhẹ dưới đây cũng cần biết đỉnh tường nhà; massing.js xuất lại cho chỗ cũ vẫn gọi được. */
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

/* Phòng kín — cùng định nghĩa với validate(): sân và lối đi hở không tính. */
export const isEnclosed = r => r[6] !== 'yard' && r[0] !== 'R3';

/* Ban công nằm trên cốt nền nhà chứ không phải cốt sân — bước từ master ra không hụt chân.
   Nhận theo tên chứ không theo mã: mã phòng xê dịch giữa các phương án, tên thì không. */
export const isBalcony = r => /^BAN CÔNG/.test(r[1]);

/* Cốt sàn của một phòng, tính từ cốt sân. Phòng kín và ban công mặc định ở cốt nền nhà, sân và
   lối đi hở ở cốt sân. Phòng nào khác thì khai ở `v.floorLevels` theo mã phòng — bếp và WC
   khách hạ còn +0.15: cửa ra sân chỉ còn một nấc ở ngưỡng, không phải dựng bậc, mà nước mưa vẫn
   không tràn vào. */
export function floorOf(v, r, houseFloor = heightsOf(v).floor){
  const own = v.floorLevels?.[r[0]];
  if (own !== undefined) return own;
  return isEnclosed(r) || isBalcony(r) ? houseFloor : 0;
}

/* Phòng áp vào một đoạn tường: nằm sát đúng đường tim và có phần chồng lên đoạn đang xét. */
export function roomsAlong(rooms, ax, pos, s, e){
  return rooms.filter(([, , x, y, w, h]) => ax === 'h'
    ? (Math.abs(y - pos) < EPS || Math.abs(y + h - pos) < EPS) && overlap(x, x + w, s, e) > EPS
    : (Math.abs(x - pos) < EPS || Math.abs(x + w - pos) < EPS) && overlap(y, y + h, s, e) > EPS);
}

/* Bề dày tường nằm dưới đoạn [a, b] trên đường tim — 0 nếu chỗ đó không có tường. */
export function wallThickness(v, ax, pos, a, b){
  return Math.max(0, ...v.walls
    .filter(([wax, wpos, wa, wb]) => wax === ax && Math.abs(wpos - pos) < EPS && overlap(wa, wb, a, b) > EPS)
    .map(w => w[4]));
}

/* Chữ nhật lọt lòng của một phòng — mép trong của tường bốn phía. Trần tôn treo trong khoảng
   này chứ không phủ tới tim tường như bản mái bê tông: nó bắt vào mặt trong tường. */
export function clearRect(v, r){
  const [, , x, y, w, h] = r;
  const l = wallThickness(v, 'v', x, y, y + h) / 2, rt = wallThickness(v, 'v', x + w, y, y + h) / 2;
  const t = wallThickness(v, 'h', y, x, x + w) / 2, b = wallThickness(v, 'h', y + h, x, x + w) / 2;
  return { x: x + l, y: y + t, w: w - l - rt, h: h - t - b };
}

/* ═══════════ TRẦN GIẢ ═══════════
   `v.dropCeilings`: { mã phòng: cao trần tính từ sàn phòng }. Trần thạch cao / nhựa treo dưới bản mái
   bê tông — WC không cần cao như phòng ở, khoảng trên trần giấu ống. Bản mái và tường giữ nguyên cốt.
   Chỉ cho phòng kín đổ bê tông; phòng lợp mái nhẹ đã có trần tôn. Phủ phần lọt lòng như trần tôn.
   Tấm dày ROOF.ceiling, mặt dưới ở cốt `y`. */
export function dropCeilingsOf(v){
  const H = heightsOf(v), L = levels(H);
  return Object.entries(v.dropCeilings || {}).map(([id, h]) => {
    const r = v.rooms.find(x => x[0] === id);
    if (!r) return { id, error: `Trần giả khai cho ${id} nhưng không có phòng mã này` };
    if (!isEnclosed(r)) return { id, error: `Trần giả ${id}: ${r[1]} không phải phòng kín` };
    if (roofOver(v, r)) return { id, error: `Trần giả ${id}: ${r[1]} lợp mái nhẹ, đã có trần tôn` };
    const floor = floorOf(v, r, H.floor), y = floor + h;
    if (!(h > 0) || y + ROOF.ceiling > L.ceiling + EPS)
      return { id, error: `Trần giả ${id} cao ${h} m không nằm giữa sàn và bản mái` };
    return { id, name: r[1], h, floor, y, rect: clearRect(v, r) };
  });
}

/* Nửa bề dày của tường vuông góc dày nhất đi qua đầu `end` của một đoạn trên đường `pos` — 0 nếu
   không có. Tường kéo đầu thêm chừng này để góc kín (massing.js), bản mái đổ ra ngoài cũng kéo
   chừng này để phủ tới mặt ngoài tường hai bên, khớp bề rộng khối nhà. */
export function jointHalf(v, ax, pos, end){
  const t = v.walls
    .filter(([pax, ppos, pa, pb]) => pax !== ax && Math.abs(ppos - end) < EPS
                                     && pa <= pos + EPS && pb >= pos - EPS)
    .map(w => w[4]);
  return t.length ? Math.max(...t) / 2 : 0;
}

/* Cốt sàn của một lỗ mở, tính từ cốt sân: cốt cao nhất trong các phòng hai bên — cửa bắt đầu
   từ ngưỡng phía cao. Cửa D11 và ô thoáng W4 của WC khách vì vậy tính từ +0.15. */
export function openingFloor(v, L, ax, pos, a, b){
  const along = roomsAlong(v.rooms, ax, pos, a, b);
  return along.length ? Math.max(...along.map(r => floorOf(v, r, L.floor))) : 0;
}

/* Hướng pháp tuyến từ đường tim về phía phòng `r`: +1 nếu phòng nằm phía toạ độ lớn hơn. */
const sideOf = (r, ax, pos) => Math.abs((ax === 'h' ? r[3] : r[2]) - pos) < EPS ? 1 : -1;

/* Chữ nhật trên mặt bằng: dọc trục tường [a, b], vuông góc từ `n0` đi `depth` về phía `dir`. */
function band(ax, n0, a, b, dir, depth){
  const lo = dir > 0 ? n0 : n0 - depth;
  return ax === 'h' ? { x: a, y: lo, w: b - a, h: depth } : { x: lo, y: a, w: depth, h: b - a };
}

/* ═══════════ BẬC TAM CẤP ═══════════
   `v.steps` là { mã cửa: { margin, tread } } — `margin` là phần bậc rộng hơn cửa mỗi bên,
   `tread` là mặt bậc, bỏ trống thì lấy STEP.tread. Cửa chính rộng rãi, cửa phụ gọn cho đỡ tốn
   sân. Bậc nằm phía phòng thấp và **đo từ mặt tường**: đo từ tim thì nửa bề dày tường nuốt mất
   một phần bậc trên, bậc trên hiện ra hẹp hơn bậc dưới.

   Chênh cốt hai bên cửa chia thành nấc `STEP.rise` (nhà chính 0.45 → 3 nấc), nhưng **nấc trên
   cùng chính là ngưỡng cửa** — chỉ dựng các bậc ngoài (3 nấc → 2 bậc). Còn một nấc thì không
   dựng gì: kéo thanh trượt cốt nền xuống thấp là gặp, không coi là lỗi. Bậc sát cửa (k = 0) thấp
   hơn ngưỡng một nấc, mỗi bậc ra xa thấp thêm một nấc. */
export function stepsOf(v){
  const H = heightsOf(v);
  const level = r => floorOf(v, r, H.floor);

  return Object.entries(v.steps || {}).flatMap(([id, { margin = 0, tread = STEP.tread } = {}]) => {
    const d = v.doors.find(x => x[0] === id);
    if (!d) return [{ id, error: `Bậc ${id}: không có cửa mã này` }];
    const [, ax, pos, da, db] = d;

    /* Phía bậc là phía ngược với phòng cao nhất, rồi mới tìm phòng thấp ở phía đó. Đừng lấy
       "phòng thấp đầu tiên áp vào tường": cửa vắt qua ranh hai phòng (dịch lưới là gặp) thì
       phòng thấp ấy có thể nằm cùng phía với phòng cao — bậc quay ngược vào trong nhà. */
    const along = roomsAlong(v.rooms, ax, pos, da, db);
    if (!along.length) return [{ id, error: `Bậc ${id}: cửa không nằm giữa hai phòng nào` }];
    const high = along.reduce((p, r) => (level(r) > level(p) ? r : p));
    const dir = -sideOf(high, ax, pos);
    const low = along.filter(r => sideOf(r, ax, pos) === dir)
                     .reduce((p, r) => (!p || level(r) < level(p) ? r : p), null);
    if (!low) return [{ id, error: `Bậc ${id}: phía ngoài cửa không có phòng nào` }];

    const drop = level(high) - level(low);
    const risers = Math.round(drop / STEP.rise), count = risers - 1;
    if (count < 1) return [];

    const face = pos + dir * wallThickness(v, ax, pos, da, db) / 2;
    const a = da - margin, b = db + margin, depth = count * tread;
    return [{ id, ax, pos, face, a, b, margin, dir, depth, count, rise: drop / risers,
              tread, top: level(high), base: level(low), room: low[0],
              rect: band(ax, face, a, b, dir, depth) }];
  });
}

/* ═══════════ MÁI NHẸ ═══════════
   Mái tôn của bếp, mái bàn trà, mái sân phơi — mái phụ, không phải bản bê tông liền mái nhà.
   Khai ở `v.roofs`, mỗi mái một object:

     { id, name, at:[x0,y0,x1,y1], shape, h:[…], ceiling?, mat, desc }

   `at` là vùng phủ theo **tim tường**; `h` là cao độ **mặt dưới** mái so với cốt sân, tấm lợp
   dày ROOF.sheet nằm trên đó. `shape`:

     'flat'      — một cao độ, h:[cao]
     'mono:y'    — dốc một mái dọc trục y, h:[cao ở mép y nhỏ, cao ở mép y lớn]
     'gable:y'   — hai mái, nóc chạy ngang ở **giữa nhịp**, h:[mép, nóc]

   Độ dốc suy ra từ cao độ và nhịp, không khai tay — bếp 3.75 → 4.80 trên nửa nhịp 3.5 m ra
   đúng 30% như đã chốt (3d.md mục 3a). Mái phủ trọn một phòng kín thì phòng đó **không đổ mái
   bê tông** nữa mà có trần tôn ở cốt `ceiling`. Xem 3d.md mục 3, 3a, 3b. */

export function lightRoofs(v){
  return (v.roofs || []).map(r => {
    const [x0, y0, x1, y1] = r.at;
    const [kind, ax] = String(r.shape).split(':');
    const axis = kind === 'flat' ? null : ax;
    const [a0, a1] = axis === 'x' ? [x0, x1] : [y0, y1];
    const h = r.h, mid = (a0 + a1) / 2;
    const under =
      kind === 'flat' ? () => h[0]
    : kind === 'mono' ? u => h[0] + (h[1] - h[0]) * (u - a0) / (a1 - a0)
    :                   u => h[1] - Math.abs(u - mid) * (h[1] - h[0]) / ((a1 - a0) / 2);
    return { ...r, kind, axis, x0, y0, x1, y1, a0, a1, under,
             ridge: kind === 'gable' ? mid : null,
             low: Math.min(...h), high: Math.max(...h) };
  });
}

/* Mái nhẹ trùm trọn phòng `r`, bất kể phòng kín hay hở — mái hành lang ngoài trùm trọn R3. */
export const roofCovering = (v, r) => lightRoofs(v).find(R =>
  r[2] >= R.x0 - EPS && r[3] >= R.y0 - EPS &&
  r[2] + r[4] <= R.x1 + EPS && r[3] + r[5] <= R.y1 + EPS);

/* Mái nhẹ phủ trọn **phòng kín** `r` — phòng đó lợp tôn thay cho bản mái bê tông, có trần tôn, và
   tường chỉ đỡ phòng ấy tự lên tới mặt dưới mái. Phòng hở (hành lang ngoài) có mái trùm thì không
   có gì trong số đó: không trần, và tường rào dọc nó giữ cao rào chứ không đội lên tới mái. */
export const roofOver = (v, r) => isEnclosed(r) ? roofCovering(v, r) : undefined;

/* Mặt dưới mái nhẹ áp lên một đoạn tường: chỉ mái nào phủ phòng áp vào đoạn đó mới tính —
   mái bàn trà chạy sát tường bếp nhưng không đội tường bếp lên.
   Mái dốc **dọc** theo tường thì đỉnh tường nghiêng theo (đầu hồi); dốc **ngang** qua tường thì
   lấy chỗ thấp nhất trong bề dày tường, để mái không cắm vào đỉnh tường ở mép ngoài. */
export function roofCapOnWall(v, ax, pos, s, e, t){
  const along = ax === 'h' ? 'x' : 'y';
  const rooms = roomsAlong(v.rooms, ax, pos, s, e);
  const fns = [], breaks = [];
  for (const R of lightRoofs(v)) {
    if (!rooms.some(r => roofOver(v, r)?.id === R.id)) continue;
    if (!R.axis) { const c = R.under(0); fns.push(() => c); }
    else if (R.axis === along) {
      fns.push(u => R.under(u));
      if (R.ridge > s + EPS && R.ridge < e - EPS) breaks.push(R.ridge);
    } else {
      const c = Math.min(R.under(pos - t / 2), R.under(pos + t / 2));
      fns.push(() => c);
    }
  }
  if (!fns.length) return null;
  const at = u => Math.max(...fns.map(f => f(u)));
  return { at, breaks, min: Math.min(...[s, e, ...breaks].map(at)) };
}

/* Đỉnh **phẳng** của một đoạn tường, và profile mái nhẹ đè lên nó nếu có.
   Không có mái nhẹ thì y như cũ: có phòng kín áp vào là tường nhà, còn lại là rào. Có mái nhẹ
   thì đỉnh hạ xuống mép mái (tường bắc / nam bếp dừng ở mép mái, không lên 4.00) — trừ khi
   bức tường ấy còn đỡ phòng đổ mái bê tông, lúc đó giữ 4.00 và phần nhô lên thành đầu hồi. */
export function wallTopOf(v, ax, pos, s, e, t, { forced = false, capSpan = [s, e] } = {}){
  const L = levels(heightsOf(v));
  const along = roomsAlong(v.rooms, ax, pos, s, e);
  const hard = along.filter(r => !roofOver(v, r));
  const cap = roofCapOnWall(v, ax, pos, capSpan[0], capSpan[1], t);
  const topOf = list => forced || list.some(isEnclosed) ? L.houseTop : L.fenceTop;
  return { top: cap ? Math.max(topOf(hard), cap.min) : topOf(along), cap };
}

/* Tấm mái đã dựng: vùng phủ khai theo tim tường, còn tấm thật thì **lùi vào mặt trong** bức
   tường nào cao hơn mái (mái bếp áp tường nhà chính, mái sân phơi áp tường WC khách — chỗ ấy
   chỉ có viền chống thấm) và **đua ra mặt ngoài** những bức thấp hơn (mép mái có máng xối).
   Cao độ ở phần đua ra là ngoại suy đúng độ dốc ấy, nên mặt mái vẫn phẳng.

   Lùi hay đua là chuyện của **từng đoạn mép**, không phải cả mép: mái sân chính chạy dọc tường bếp
   thì lùi vào mặt tường, nhưng qua khỏi góc bếp (`x` 8.5–9.5) không còn tường nào, phần ấy phải chạy
   thẳng tới mép mái hành lang ngoài cho hai mái liền mạch. Nên tấm được cắt ở đầu mỗi bức tường nằm
   trên mép mái — tính cả phần kéo góc (jointHalf), để mảnh lùi phủ kín đúng tới hết khối góc tường.
   Mái hai mái cắt thêm ở nóc. Các mảnh cùng một mái nằm khít nhau, mặt mái vẫn phẳng.

   `part` là phía nóc (0 / 1) để bản vẽ 2D gộp lại thành một tấm; `lowEdge` là mép thấp nếu nó nằm
   trên mép mái (không phải chỗ cắt bên trong) — gutters() dựng máng ở đó. Trả về toạ độ mặt bằng;
   massing.js đổi y → z. */
function cutSpans(a, b, marks){
  const m = [...new Set([a, b, ...marks.filter(x => x > a + EPS && x < b - EPS)])].sort((p, q) => p - q);
  return m.slice(0, -1).map((s, i) => [s, m[i + 1]]);
}

export function roofPanels(v){
  const out = [];
  for (const R of lightRoofs(v)) {
    /* `outward` = +1 nếu phía ngoài mái là toạ độ lớn. Đoạn mép nào không có tường thì giữ nguyên. */
    const shift = (ax, pos, s, e, outward) => {
      const t = wallThickness(v, ax, pos, s, e);
      if (!t) return 0;
      const edgeAxis = ax === 'h' ? 'y' : 'x';
      const u = R.axis === edgeAxis || !R.axis ? R.under(pos)
              : Math.min(R.under(s), R.under(e));
      return outward * (wallTopOf(v, ax, pos, s, e, t).top > u + EPS ? -t / 2 : t / 2);
    };
    const cuts = (ax, lines) => v.walls
      .filter(([wax, wpos]) => wax === ax && lines.some(l => Math.abs(wpos - l) < EPS))
      .flatMap(([, wpos, a, b]) => [a - jointHalf(v, ax, wpos, a), b + jointHalf(v, ax, wpos, b)]);
    const ridge = R.ridge == null ? [] : [R.ridge];
    const xs = cutSpans(R.x0, R.x1, [...cuts('h', [R.y0, R.y1]), ...(R.axis === 'x' ? ridge : [])]);
    const ys = cutSpans(R.y0, R.y1, [...cuts('v', [R.x0, R.x1]), ...(R.axis === 'y' ? ridge : [])]);

    const rects = [];
    xs.forEach(([xa, xz], i) => ys.forEach(([ya, yz], j) => {
      const lastX = i === xs.length - 1, lastY = j === ys.length - 1;
      let x0 = xa + (i === 0 ? shift('v', R.x0, ya, yz, -1) : 0);
      let x1 = xz + (lastX   ? shift('v', R.x1, ya, yz, +1) : 0);
      let y0 = ya + (j === 0 ? shift('h', R.y0, xa, xz, -1) : 0);
      let y1 = yz + (lastY   ? shift('h', R.y1, xa, xz, +1) : 0);
      if (x1 - x0 < EPS || y1 - y0 < EPS) return;          // mảnh nằm gọn trong bề dày tường

      /* Đua mép thấp (`eave`): mái bếp dài hơn tường một chút để nước rơi xuống mái phụ bên dưới,
         khỏi làm máng. Chỉ ở mép thấp thật của mái, và chỉ khi mép ấy không lùi vào một bức tường. */
      let eave = null;
      if (R.eave && R.axis === 'y') {
        if (R.under(yz) < R.under(ya)) { if (lastY && y1 >= yz - EPS) { y1 += R.eave; eave = 'y1'; } }
        else if (j === 0 && y0 <= ya + EPS) { y0 -= R.eave; eave = 'y0'; }
      } else if (R.eave && R.axis === 'x') {
        if (R.under(xz) < R.under(xa)) { if (lastX && x1 >= xz - EPS) { x1 += R.eave; eave = 'x1'; } }
        else if (i === 0 && x0 <= xa + EPS) { x0 -= R.eave; eave = 'x0'; }
      }
      rects.push({ i, j, xa, xz, ya, yz, lastX, lastY, x0, x1, y0, y1, eave });
    }));

    /* Mép đua là một đường thẳng: mảnh trên tường đã ra tới mặt ngoài tường rồi mới đua, mảnh không có tường
       bên dưới (phần mái bếp trùm hành lang ngoài) đua từ tim — lấy mép xa nhất cho cả mép, không thì tôn gãy
       bậc nửa bề dày tường. */
    for (const k of ['x0', 'x1', 'y0', 'y1']) {
      const on = rects.filter(r => r.eave === k);
      const far = k.endsWith('0') ? Math.min(...on.map(r => r[k])) : Math.max(...on.map(r => r[k]));
      for (const r of on) r[k] = far;
    }

    for (const { i, j, xa, xz, ya, yz, lastX, lastY, x0, x1, y0, y1 } of rects) {
      const [c0, c1] = R.axis === 'x' ? [x0, x1] : [y0, y1];
      const yb = R.axis ? [R.under(c0), R.under(c1)] : [R.under(0), R.under(0)];
      const part = R.ridge != null && (c0 + c1) / 2 > R.ridge ? 1 : 0;

      /* Mép thấp: đầu nào của trục dốc thấp hơn, và chỉ khi đầu ấy là mép mái thật. */
      let lowEdge = null;
      if (R.axis && Math.abs(yb[1] - yb[0]) > EPS) {
        const far = yb[1] < yb[0];                          // thấp ở đầu toạ độ lớn
        const onEdge = R.axis === 'x' ? (far ? lastX : i === 0) : (far ? lastY : j === 0);
        if (onEdge) {
          const wall = R.axis === 'x' ? (far ? x1 < xz - EPS : x0 > xa + EPS)
                                      : (far ? y1 < yz - EPS : y0 > ya + EPS);
          lowEdge = R.axis === 'x'
            ? { ax: 'v', pos: far ? x1 : x0, a: y0, b: y1 }
            : { ax: 'h', pos: far ? y1 : y0, a: x0, b: x1 };
          Object.assign(lowEdge, { h: Math.min(...yb), out: far ? 1 : -1, wall });
        }
      }
      out.push({ id: R.id, name: R.name, mat: R.mat, axis: R.axis, part, x0, x1, y0, y1,
                 yb, yt: yb.map(h => h + ROOF.sheet), lowEdge });
    }
  }
  return out;
}

/* ═══════════ MÁNG XỐI ═══════════
   Suy ra, không khai: mọi mép thấp của mái nhẹ đều có máng — **trừ** hai chỗ nước không rơi xuống
   sân:
   - đoạn nối liền mạch sang một mái khác cùng cao độ — nước chảy tiếp sang mái kia (mái hành lang
     ngoài đổ vào mái sân chính và mái sân phơi);
   - đoạn ngay bên dưới có mái khác thấp hơn — nước rơi xuống mái ấy (mái bếp đua ra trên mái sân
     chính và mái sân phơi).

   Mép tự do thì máng treo **dưới** mép, mép mái nhỏ nước vào giữa lòng máng; mép nào lùi vào mặt một
   bức tường cao hơn (mép thấp mái sân phơi áp tường WC khách) thì máng nằm **trong**, sát chân tường
   — ngoài chỗ đó là tường. Miệng máng ngang mặt dưới mái ở mép, sâu ROOF.gutterDepth. Các đoạn liền
   nhau cùng mép gộp thành một máng. */
export function gutters(v){
  const panels = roofPanels(v);
  const pieces = [];
  for (const p of panels) {
    const g = p.lowEdge;
    if (!g) continue;
    const normal = g.ax === 'h' ? 'y' : 'x';
    const probe = g.pos + g.out * 0.01;                   // ngay ngoài mép — chỗ nước rơi
    let spans = [[g.a, g.b]];
    const cut = (a, b) => {
      spans = spans.flatMap(([s, e]) => [[s, Math.min(e, a)], [Math.max(s, b), e]])
                   .filter(([s, e]) => e - s > EPS);
    };
    for (const q of panels) {
      if (q.id === p.id) continue;
      const [n0, n1, a, b] = g.ax === 'h' ? [q.y0, q.y1, q.x0, q.x1] : [q.x0, q.x1, q.y0, q.y1];
      const flush = (!q.axis || q.axis === normal)
        && Math.abs((g.out > 0 ? n0 : n1) - g.pos) < EPS
        && Math.abs((q.axis && g.out < 0 ? q.yb[1] : q.yb[0]) - g.h) < EPS;
      const top = q.axis !== normal ? Math.max(...q.yt)
                : q.yt[0] + (q.yt[1] - q.yt[0]) * (probe - n0) / (n1 - n0);
      const below = !g.wall && probe > n0 + EPS && probe < n1 - EPS && top < g.h - EPS;
      if (flush || below) cut(a, b);
    }
    for (const [a, b] of spans) pieces.push({ id: p.id, name: p.name, ...g, a, b });
  }

  const merged = [];
  pieces.sort((p, q) => p.ax.localeCompare(q.ax) || p.pos - q.pos || p.a - q.a);
  for (const c of pieces) {
    const l = merged[merged.length - 1];
    if (l && l.id === c.id && l.ax === c.ax && Math.abs(l.pos - c.pos) < EPS && Math.abs(l.h - c.h) < EPS
        && l.out === c.out && l.wall === c.wall && Math.abs(l.b - c.a) < EPS) l.b = c.b;
    else merged.push({ ...c });
  }
  /* Máng dừng ở mặt dầm dọc chiều dốc cắt ngang đầu máng (dầm biên dọc tường bao), có bịt đầu — không chạy
     xuyên qua dầm: chạy qua thì đoạn dầm dưới máng phải hạ xuống, dầm gãy bậc. Chỉ cắt ở đầu máng; phần tôn
     đua qua dầm ra trên đỉnh tường bao chỉ mươi phân. */
  const mains = beamLines(v).filter(l => l.along);
  const cut = (g, c0, c1) => {
    if (c0 >= g.b || c1 <= g.a) return;
    if (g.b - c1 < 0.3) g.b = Math.min(g.b, c0); else if (c0 - g.a < 0.3) g.a = Math.max(g.a, c1);
  };
  for (const g of merged) {
    for (const l of mains)
      if (l.ax !== g.ax && g.pos >= l.a - EPS && g.pos <= l.b + EPS) cut(g, l.pos - BEAM.width / 2, l.pos + BEAM.width / 2);
    /* Cột ở đầu máng (cột góc mép trước mái sân chính): cột dày hơn dầm, máng dừng ở mặt cột — không thì máng
       chồm lên đầu cột, cột phải hạ xuống đáy máng và dầm hẫng trên đầu cột. Lấy vị trí thẳng từ `posts`: postsOf()
       gọi gutters() nên không gọi ngược được. */
    const W = ROOF.gutterWidth / 2, S = POST.size / 2;
    for (const [, px, py] of v.posts || []) {
      const [pu, pn] = g.ax === 'h' ? [px, py] : [py, px];
      if (Math.abs(pn - g.pos) < W + S) cut(g, pu - S, pu + S);
    }
  }
  const W = ROOF.gutterWidth;
  return merged.map(g => ({ ...g, top: g.h, bottom: g.h - ROOF.gutterDepth,
    rect: g.wall ? band(g.ax, g.pos, g.a, g.b, -g.out, W) : band(g.ax, g.pos - W / 2, g.a, g.b, 1, W) }));
}

/* ═══════════ ỐNG XẢ ═══════════
   Mỗi dải máng — các đoạn máng cùng mái nối đầu nhau dọc một mép — có một ống đứng, đặt ở đầu sát
   **tường bao**, áp mặt trong tường bao chạy thẳng xuống, cắm xuống dưới cốt sân vào ống ngầm chứ
   không đổ ra sân. Dải không chạm tường bao nào thì lấy đầu gần tường bao hơn, ống đặt ngay dưới đầu
   máng. Suy ra, không khai. */
export function downpipes(v){
  const runs = [];
  const sorted = [...gutters(v)].sort((p, q) => p.id.localeCompare(q.id) || p.ax.localeCompare(q.ax) || p.a - q.a);
  for (const g of sorted) {
    const r = runs[runs.length - 1];
    if (r && r.id === g.id && r.ax === g.ax && Math.abs(r.b - g.a) < EPS) { r.parts.push(g); r.b = g.b; }
    else runs.push({ id: g.id, ax: g.ax, a: g.a, b: g.b, parts: [g] });
  }
  const D = ROOF.pipe;
  return runs.map(r => {
    const edge = r.ax === 'h' ? LOT.w : LOT.d;           // hai tường bao ở hai đầu dọc trục máng: 0 và edge
    const high = edge - r.b < r.a;
    const part = high ? r.parts[r.parts.length - 1] : r.parts[0];
    const bound = high ? edge : 0, end = high ? r.b : r.a;
    const R = part.rect;
    const [n0, n1] = r.ax === 'h' ? [R.y, R.y + R.h] : [R.x, R.x + R.w];
    const t = Math.abs(end - bound) < 0.3 ? wallThickness(v, r.ax === 'h' ? 'v' : 'h', bound, n0, n1) : 0;
    const face = t ? bound + (high ? -t / 2 : t / 2) : end;
    const s = high ? face - D : face, mid = (n0 + n1) / 2;
    return { id: r.id, boundary: t > 0, top: part.bottom, bottom: ROOF.pipeDepth,
             rect: r.ax === 'h' ? { x: s, y: mid - D / 2, w: D, h: D } : { x: mid - D / 2, y: s, w: D, h: D } };
  });
}

/* ═══════════ CỘT ĐỠ MÁI NHẸ ═══════════
   `v.posts`: [mã, x, y] — tâm cột theo tim. Mái nhẹ nào có mép không tựa lên tường cao tới mái (tuyến
   tường rào phải: rào chỉ xây tới 0.80) thì cần cột; chỗ đặt là quyết định thiết kế nên khai tay. Chiều
   cao thì suy: đỉnh cột chạm vật thấp nhất phủ lên tiết diện cột — đáy dầm biên (beamsOf), hoặc mặt dưới tấm
   mái / đáy máng nếu không có dầm. Máng dừng ở mặt cột (gutters()), nên thực tế là đáy dầm. */
/* ═══════════ DẦM BIÊN MÁI NHẸ ═══════════
   Suy ra, không khai. Dọc mỗi mép vùng phủ (theo tim) của từng mái nhẹ, bỏ các đoạn đã tựa lên tường cao
   tới mặt dưới mái (tường chạy dọc mép, hoặc tường cắt ngang mép) — phần còn lại là dầm, từ mặt tường tới
   mặt tường, đi qua đầu cột. Mép chung hai mái (chỗ nối mái sân chính – mái hành lang) chỉ một dầm.

   Tiết diện BEAM. Mặt trên dầm chạm mặt dưới mái: dầm chạy **dọc** chiều dốc thì nghiêng theo mái
   (tuyến tường rào phải), chạy **ngang** thì phẳng ở chỗ thấp nhất trong bề ngang dầm. Dầm dọc chiều dốc
   đi suốt, dầm ngang dừng ở mặt bên dầm dọc — góc không chồng nhau.

   Máng xối: mép thấp tự do có máng treo giữa mép, nên dầm ở mép ấy **lùi vào sau máng** — máng và ống xả
   vẫn treo ngoài như cũ, tôn đua qua dầm ra tới giữa máng. Đoạn dầm chui dưới một máng cắt ngang thì mặt
   trên hạ xuống đáy máng. */

/* Đỉnh một bức tường tại toạ độ `u` dọc trục nó — tính như massing.js: cắt theo ranh phòng và tường nâng,
   đỉnh mảnh chứa `u` (lấy mảnh cao hơn nếu `u` rơi đúng ranh), mái nhẹ đè lên thì theo mép mái. */
function wallTopAt(v, [ax, pos, a, b, t], u){
  const full = (v.fullHeightWalls || [])
    .filter(([fax, fpos]) => fax === ax && Math.abs(fpos - pos) < EPS).map(([, , fa, fb]) => [fa, fb]);
  const marks = [...roomsAlong(v.rooms, ax, pos, a, b).flatMap(([, , x, y, w, h]) => ax === 'h' ? [x, x + w] : [y, y + h]),
                 ...full.flat()];
  const capSpan = [a - jointHalf(v, ax, pos, a), b + jointHalf(v, ax, pos, b)];
  const cu = Math.min(b, Math.max(a, u));
  let best = -Infinity;
  for (const [s, e] of cutSpans(a, b, marks)) {
    if (cu < s - EPS || cu > e + EPS) continue;
    const forced = full.some(([fa, fb]) => fa <= s + EPS && fb >= e - EPS);
    const { top, cap } = wallTopOf(v, ax, pos, s, e, t, { forced, capSpan });
    best = Math.max(best, cap ? Math.max(top, cap.at(cu)) : top);
  }
  return best;
}

/* Các khoảng dọc mép [a, b] đã có tường cao tới mặt dưới mái đỡ (chừa 6 cm — tường dừng ở chỗ thấp nhất
   trong bề dày nó). */
function wallHolds(v, ax, pos, a, b, under){
  const out = [];
  for (const w of v.walls) {
    if (w[5] === 'plastic') continue;  // vách nhựa không chịu lực đỡ mái / dầm
    const [wax, wpos, wa, wb, t] = w;
    if (wax === ax && Math.abs(wpos - pos) < EPS) {
      const ea = wa - jointHalf(v, ax, pos, wa), eb = wb + jointHalf(v, ax, pos, wb);
      const marks = roomsAlong(v.rooms, ax, pos, wa, wb).flatMap(([, , x, y, ww, h]) => ax === 'h' ? [x, x + ww] : [y, y + h]);
      for (const [s0, e0] of cutSpans(wa, wb, [...marks, ...(v.fullHeightWalls || []).flatMap(f => f[0] === ax && Math.abs(f[1] - pos) < EPS ? [f[2], f[3]] : [])])) {
        const s = Math.abs(s0 - wa) < EPS ? ea : s0, e = Math.abs(e0 - wb) < EPS ? eb : e0;
        const lo = Math.max(s, a), hi = Math.min(e, b);
        if (hi - lo < EPS) continue;
        /* Soi ở hai đầu đoạn chồng — tường đầu hồi nghiêng theo mái nên đỉnh hai đầu khác nhau. Lùi vào trong
           mảnh một chút: đúng ranh thì wallTopAt lấy cả mảnh bên cạnh. */
        const inside = u => Math.min(e0 - 1e-4, Math.max(s0 + 1e-4, u));
        if ([lo, hi].every(u => wallTopAt(v, w, inside(u)) >= under(u) - 0.06)) out.push([lo, hi]);
      }
    } else if (wax !== ax && wpos > a - t / 2 - EPS && wpos < b + t / 2 + EPS
               && wa - jointHalf(v, wax, wpos, wa) <= pos + EPS && wb + jointHalf(v, wax, wpos, wb) >= pos - EPS) {
      if (wallTopAt(v, w, pos) >= under(wpos) - 0.06) out.push([wpos - t / 2, wpos + t / 2]);
    }
  }
  return out;
}

const minusSpans = (spans, holes) => holes.reduce((acc, [h0, h1]) =>
  acc.flatMap(([s, e]) => [[s, Math.min(e, h0)], [Math.max(s, h1), e]]).filter(([s, e]) => e - s > EPS), spans);

/* Bước 1 — các đoạn mép cần dầm, chưa tính tiết diện. Tách riêng vì gutters() cũng cần: máng dừng ở mặt dầm
   dọc tường bao chứ không chạy xuyên qua nó. Bước này không dùng tới máng nên không vòng lặp. */
function beamLines(v){
  const spans = [];
  for (const R of lightRoofs(v)) {
    const edges = [['h', R.y0, R.x0, R.x1, 1], ['h', R.y1, R.x0, R.x1, -1], ['v', R.x0, R.y0, R.y1, 1], ['v', R.x1, R.y0, R.y1, -1]];
    for (const [ax, pos, a, b, dir] of edges) {
      const under = u => { const [x, y] = ax === 'h' ? [u, pos] : [pos, u];
                           return R.axis === 'x' ? R.under(x) : R.axis === 'y' ? R.under(y) : R.under(0); };
      for (const [s, e] of minusSpans([[a, b]], wallHolds(v, ax, pos, a, b, under))) {
        if (e - s < 0.05) continue;
        /* Mép chung với mái khác: cùng cao độ (nối phẳng) thì một dầm; lệch cao độ (mái trên đua chồng lên mái
           dưới — mái bếp + hành lang trên mái sân chính) thì mỗi mái một dầm, lùi hẳn vào phía mái mình để hai
           dầm đứng cạnh nhau chứ không chồng. */
        const twin = spans.find(q => q.ax === ax && Math.abs(q.pos - pos) < EPS && q.a < e - EPS && q.b > s + EPS);
        const mid = twin && (Math.max(s, twin.a) + Math.min(e, twin.b)) / 2;
        const step = twin && Math.abs(twin.under(mid) - under(mid)) > EPS;
        if (twin && !step && Math.abs(twin.a - s) < EPS && Math.abs(twin.b - e) < EPS) continue;
        if (step) twin.inset = true;
        /* Dọc chiều dốc (hoặc trục v nếu mái bằng) là dầm chính, đi suốt. */
        const along = R.axis ? R.axis === (ax === 'h' ? 'x' : 'y') : ax === 'v';
        spans.push({ id: R.id, R, ax, pos, a: s, b: e, dir, along, under, inset: !!step });
      }
    }
  }
  return spans;
}

export function beamsOf(v){
  const W = BEAM.width, gs = gutters(v);
  /* Bề ngang dầm: giữa tim mép, lùi vào sau máng nếu mép ấy có máng treo tự do, hoặc nằm hẳn về phía mái
     mình nếu mép ấy là chỗ hai mái lệch cao độ (beamLines). */
  const spans = beamLines(v).map(s => {
    const g = gs.find(g => !g.wall && g.ax === s.ax && Math.abs(g.pos - s.pos) < EPS && g.a < s.b - EPS && g.b > s.a + EPS);
    const [g0, g1] = g ? (s.ax === 'h' ? [g.rect.y, g.rect.y + g.rect.h] : [g.rect.x, g.rect.x + g.rect.w]) : [0, 0];
    const band = g ? (s.dir > 0 ? [g1, g1 + W] : [g0 - W, g0])
               : s.inset ? (s.dir > 0 ? [s.pos, s.pos + W] : [s.pos - W, s.pos])
               : [s.pos - W / 2, s.pos + W / 2];
    return { ...s, band };
  });

  /* Dầm ngang dừng ở mặt bên dầm dọc cắt qua nó. */
  const main = spans.filter(s => s.along);
  for (const s of spans.filter(s => !s.along)) {
    const holes = main.filter(m => m.ax !== s.ax && m.a < s.band[1] - EPS && m.b > s.band[0] + EPS).map(m => m.band);
    s.parts = minusSpans([[s.a, s.b]], holes).filter(([p, q]) => q - p > 0.05);
  }
  /* Dầm dọc chiều dốc cắt ở nóc — mái hai dốc thì mặt dưới gãy ở đó, nội suy thẳng hai đầu là dầm phẳng dưới nóc. */
  for (const m of main) m.parts = cutSpans(m.a, m.b, m.R.ridge != null ? [m.R.ridge] : []);

  /* Cắt thành đoạn theo máng cắt ngang phía trên, tính mặt trên từng đoạn. */
  const out = [];
  for (const s of spans) for (const [p, q] of s.parts) {
    const [n0, n1] = s.band;
    const over = gs.filter(g => {
      const [c0, c1, u0, u1] = s.ax === 'h' ? [g.rect.y, g.rect.y + g.rect.h, g.rect.x, g.rect.x + g.rect.w]
                                             : [g.rect.x, g.rect.x + g.rect.w, g.rect.y, g.rect.y + g.rect.h];
      return c0 < n1 - EPS && c1 > n0 + EPS && u0 < q - EPS && u1 > p + EPS;
    });
    const marks = over.flatMap(g => s.ax === 'h' ? [g.rect.x, g.rect.x + g.rect.w] : [g.rect.y, g.rect.y + g.rect.h]);
    for (const [u0, u1] of cutSpans(p, q, marks)) {
      const mid = (u0 + u1) / 2;
      const g = over.find(g => (s.ax === 'h' ? g.rect.x <= mid && g.rect.x + g.rect.w >= mid : g.rect.y <= mid && g.rect.y + g.rect.h >= mid));
      const underAt = (u, n) => { const [x, y] = s.ax === 'h' ? [u, n] : [n, u];
                                  return s.R.axis === 'x' ? s.R.under(x) : s.R.axis === 'y' ? s.R.under(y) : s.R.under(0); };
      const top = u => g ? g.bottom : Math.min(underAt(u, n0), underAt(u, n1));
      const yt = s.along && !g ? [top(u0), top(u1)] : [Math.min(top(u0), top(u1)), Math.min(top(u0), top(u1))];
      out.push({ id: s.id, ax: s.ax, pos: s.pos, a: u0, b: u1, band: [n0, n1], sloped: Math.abs(yt[1] - yt[0]) > EPS,
                 yt, yb: yt.map(y => y - BEAM.depth), underGutter: !!g,
                 rect: s.ax === 'h' ? { x: u0, y: n0, w: u1 - u0, h: n1 - n0 } : { x: n0, y: u0, w: n1 - n0, h: u1 - u0 } });
    }
  }
  return out;
}

/* ═══════════ XÀ GỒ MÁI NHẸ ═══════════
   Chỉ mái khai `purlins:true` mới có xà gồ. Tôn chạy theo chiều dốc, xà gồ chạy vuông góc với
   dốc và chạm mặt dưới tôn; số hàng tự chia để bước không quá PURLIN.maxPitch. Mỗi thanh dừng ở
   mặt tường / mặt dầm biên, không chồng thể tích lên chúng. Bản hiện hành dùng cho RF1: bốn hàng
   y = 13.20, 14.40, 15.60, 16.80 m, vượt từ tường phòng khách tới dầm dọc tường rào. */
export function purlinsOf(v){
  const panels = roofPanels(v), beams = beamsOf(v), W = PURLIN.width;
  const remove = (spans, holes) => minusSpans(spans, holes).filter(([a, b]) => b - a >= 0.20);

  return lightRoofs(v).flatMap(R => {
    if (!R.purlins || !R.axis) return [];
    const pitch = typeof R.purlins === 'object' && R.purlins.pitch != null ? R.purlins.pitch : PURLIN.maxPitch;
    const count = Math.ceil((R.a1 - R.a0) / pitch);
    const runAx = R.axis === 'x' ? 'v' : 'h';
    const out = [];

    for (let i = 1; i < count; i++) {
      const pos = R.a0 + (R.a1 - R.a0) * i / count;
      /* Gom các mảnh tôn cùng một hàng thành các nhịp liên tục. */
      const raw = panels.filter(p => p.id === R.id &&
        (R.axis === 'x' ? pos > p.x0 + EPS && pos < p.x1 - EPS : pos > p.y0 + EPS && pos < p.y1 - EPS))
        .map(p => R.axis === 'x' ? [p.y0, p.y1] : [p.x0, p.x1]).sort((a, b) => a[0] - b[0]);
      const spans = [];
      for (const [a, b] of raw) {
        const last = spans[spans.length - 1];
        if (last && a <= last[1] + EPS) last[1] = Math.max(last[1], b); else spans.push([a, b]);
      }
      /* Dầm chạy vuông góc là gối tựa: xà gồ kết thúc ở mặt dầm, không xuyên qua thép hộp. */
      const cuts = beams.filter(b => b.ax !== runAx &&
        (R.axis === 'x'
          ? pos > b.rect.x - EPS && pos < b.rect.x + b.rect.w + EPS
          : pos > b.rect.y - EPS && pos < b.rect.y + b.rect.h + EPS))
        .map(b => R.axis === 'x' ? [b.rect.y, b.rect.y + b.rect.h] : [b.rect.x, b.rect.x + b.rect.w]);
      for (const [a, b] of remove(spans, cuts)) {
        /* Hộp xà gồ phẳng còn tấm tôn dốc: lấy cốt thấp hơn ở hai mép bề rộng thanh để chỉ
           chạm tôn, không xuyên vào nửa mái thấp. */
        const top = Math.min(R.under(pos - W / 2), R.under(pos + W / 2));
        const rect = R.axis === 'x'
          ? { x:pos - W / 2, y:a, w:W, h:b - a }
          : { x:a, y:pos - W / 2, w:b - a, h:W };
        const part = out.filter(q => q.row === i).length;
        out.push({ id:`${R.id}-P${i}${part ? String.fromCharCode(97 + part) : ''}`, roofId:R.id,
                   name:R.name, row:i, ax:runAx, pos, a, b, top, rect });
      }
    }
    return out;
  });
}

export function postsOf(v){
  const panels = roofPanels(v), gs = gutters(v), bs = beamsOf(v), S = POST.size;
  return (v.posts || []).map(([id, x, y]) => {
    const rect = { x: x - S / 2, y: y - S / 2, w: S, h: S };
    const over = (x0, x1, y0, y1) =>
      x0 < rect.x + S - EPS && x1 > rect.x + EPS && y0 < rect.y + S - EPS && y1 > rect.y + EPS;
    const above = panels.filter(p => over(p.x0, p.x1, p.y0, p.y1));
    if (!above.length) return { id, x, y, error: `Cột ${id} ở (${x}, ${y}) không nằm dưới mái nhẹ nào` };
    /* Mặt dưới tấm tuyến tính theo trục dốc — thấp nhất ở một trong hai mép tiết diện cột. */
    const unders = above.map(p => {
      if (!p.axis) return p.yb[0];
      const [c0, c1, r0, r1] = p.axis === 'x' ? [p.x0, p.x1, rect.x, rect.x + S] : [p.y0, p.y1, rect.y, rect.y + S];
      const at = c => p.yb[0] + (p.yb[1] - p.yb[0]) * (c - c0) / (c1 - c0);
      return Math.min(at(Math.max(r0, c0)), at(Math.min(r1, c1)));
    });
    const drops = gs.filter(g => over(g.rect.x, g.rect.x + g.rect.w, g.rect.y, g.rect.y + g.rect.h)).map(g => g.bottom);
    /* Dầm trên đầu cột: đáy dầm tại hai mép tiết diện cột (dầm nghiêng thì thấp ở một mép). */
    const beams = bs.filter(b => over(b.rect.x, b.rect.x + b.rect.w, b.rect.y, b.rect.y + b.rect.h)).flatMap(b => {
      const [u0, u1] = b.ax === 'h' ? [rect.x, rect.x + S] : [rect.y, rect.y + S];
      const at = u => b.yb[0] + (b.yb[1] - b.yb[0]) * (Math.min(b.b, Math.max(b.a, u)) - b.a) / (b.b - b.a);
      return [at(u0), at(u1)];
    });
    return { id, x, y, size: S, rect, top: Math.min(...unders, ...drops, ...beams),
             roofs: [...new Set(above.map(p => p.id))], gutter: drops.length > 0, beam: beams.length > 0 };
  });
}

/* ═══════════ MÁI HIÊN ═══════════
   `v.overhangs`: [trục, vị trí tường, từ, đến, đua ra, mô tả]. Bản mái đổ dư ra ngoài tường,
   về phía **không** có phòng kín; bề đua tính từ mặt tường, cùng lối với bậc. Hai đầu khai theo
   tim tường nhưng bản phủ tới **mặt ngoài** tường vuông góc ở hai đầu — không thì hụt mỗi bên nửa
   bề dày so với khối nhà. */
export function overhangsOf(v){
  return (v.overhangs || []).map(([ax, pos, a, b, depth, desc]) => {
    const inside = roomsAlong(v.rooms, ax, pos, a, b).find(isEnclosed);
    if (!inside) return { ax, pos, a, b, error: `Mái hiên trục ${ax} ${pos}: không áp vào phòng kín nào` };
    const dir = -sideOf(inside, ax, pos);
    const face = pos + dir * wallThickness(v, ax, pos, a, b) / 2;
    const s = a - jointHalf(v, ax, pos, a), e = b + jointHalf(v, ax, pos, b);
    return { ax, pos, face, a: s, b: e, depth, desc, dir, rect: band(ax, face, s, e, dir, depth) };
  });
}

/* ═══════════ LỚP CHỐNG NÓNG MÁI ═══════════
   `v.roofInsulation`: { overhangs: [[trục, vị trí tường], …] }. Khai là **mọi bản mái bê tông phủ phòng
   kín** có lớp chống nóng (cấu tạo ở ROOF_INSULATION) — không liệt kê từng phòng: phòng nào thôi lợp tôn
   thì tự có lớp. Bản mái đổ ra ngoài tường thì khai từng cái: bản nào cũng phơi nắng mưa mặt trên, nhưng khai
   tay để phương án nào muốn chừa một bản thì chừa được. Bản hiện hành phủ cả trần ban công sau lẫn mái hiên
   cửa chính.
   Lớp nằm trên mặt bản mái, phủ tới mặt ngoài tường, chừa giếng trời và chỗ tường nhô cao hơn mái —
   phần hình học ấy ở massing.js vì cần khối đã dựng. Không khai thì trả `null`: kho đối chiếu không có. */
/* ═══════════ CẦU THANG · TUM · LAN CAN MÁI ═══════════
   Mặt mái đi lại được: mặt gạch lớp chống nóng nếu mặt bằng khai, không thì mặt bản mái. */
export function roofWalkTop(v){
  const L = levels(heightsOf(v)), I = ROOF_INSULATION;
  return L.houseTop + (v.roofInsulation ? I.xps + I.paver : 0);
}

/* `v.stairs`: { id, name, room, at:[x0,y0,x1,y1], width, tread, risers:[vế 1, vế 2] } — cầu thang chữ U từ sàn
   phòng `room` lên mặt mái. `at` là **lọt lòng buồng thang** (mặt tường, mép lửng), cũng là lỗ khoét bản mái.
   Chỉ một cách xếp, đúng bản hiện hành: chiếu nghỉ ở đầu x nhỏ, vế 1 dọc mép y lớn leo về phía x nhỏ, vế 2 dọc
   mép y nhỏ leo về phía x lớn và ra tới đúng mép x lớn của lỗ — bước lên bản mái. Vế nào cũng rộng `width`, khe
   giữa hai vế là phần còn lại. Mỗi vế `risers` nấc; nấc cuối vế 1 lên chiếu nghỉ, nấc cuối vế 2 lên mặt mái, nên
   số mặt bậc là `risers − 1`. Cao bậc suy ra, không khai. */
export function stairsOf(v){
  /* Có tum thì thang ra thẳng cửa tum: nấc cuối lên mặt gờ chắn nước ở ngưỡng, không có chiếu tới trong tum. */
  const H = heightsOf(v), top = roofWalkTop(v) + (v.tum ? TUM.curb : 0);
  return (v.stairs || []).map(s => {
    const { id, name, room: roomId, at: [x0, y0, x1, y1], width, tread, risers: [r1, r2] } = s;
    const room = v.rooms.find(r => r[0] === roomId);
    if (!room) return { id, error: `Cầu thang ${id}: không có phòng ${roomId}` };
    const base = floorOf(v, room, H.floor), rise = (top - base) / (r1 + r2);
    const errors = [];
    if (rise > STAIR.maxRise + EPS) errors.push(`Cầu thang ${id}: bậc cao ${rise.toFixed(3)} m, quá ${STAIR.maxRise}`);
    if (tread < STAIR.minTread - EPS) errors.push(`Cầu thang ${id}: mặt bậc ${tread} m, dưới ${STAIR.minTread}`);
    if (2 * width > y1 - y0 + EPS) errors.push(`Cầu thang ${id}: hai vế ${width} m không lọt bề ngang ${(y1 - y0).toFixed(2)} m`);
    const run2 = x0 + width + (r2 - 1) * tread, start1 = x0 + width + (r1 - 1) * tread;
    if (Math.abs(run2 - x1) > EPS) errors.push(`Cầu thang ${id}: vế 2 ra tới ${run2.toFixed(2)}, lỗ thang tới ${x1}`);
    if (start1 > x1 + EPS) errors.push(`Cầu thang ${id}: vế 1 bắt đầu ở ${start1.toFixed(2)}, ra ngoài lỗ thang`);
    const c = clearRect(v, room);
    if (x0 < c.x - 0.06 || y0 < c.y - 0.06 || x1 > c.x + c.w + 0.06 || y1 > c.y + c.h + 0.06)
      errors.push(`Cầu thang ${id} lọt ra ngoài ${room[1]}`);

    const landingTop = base + r1 * rise;
    const treads = [];
    for (let j = 0; j < r1 - 1; j++)
      treads.push({ flight: 1, x: start1 - (j + 1) * tread, y: y1 - width, w: tread, h: width, top: base + (j + 1) * rise });
    for (let j = 0; j < r2 - 1; j++)
      treads.push({ flight: 2, x: x0 + width + j * tread, y: y0, w: tread, h: width, top: landingTop + (j + 1) * rise });
    return { id, name, room: roomId, base, top, rise, tread, width, risers: [r1, r2], start1, landingTop, treads,
             landing: { x: x0, y: y0, w: width, h: y1 - y0, top: landingTop },
             hole: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, errors };
  });
}

/* Lỗ khoét bản mái: giếng trời, cửa trời và lỗ thang. Bản mái, lớp chống nóng và phép kiểm diện tích mái cùng trừ. */
export const roofHoles = v => [
  ...v.skylights.map(([id, , x, y, w, h]) => ({ id, x, y, w, h })),
  ...stairsOf(v).filter(s => !s.error).map(s => ({ id: s.id, ...s.hole })),
];

/* `v.tum`: { at:[x0,y0,x1,y1], doors:[[trục, vị trí, từ, đến, bản lề 'a'|'b', mở ±1], …] } — tum trên mái, vách theo
   tim bốn cạnh `at`, mỗi cửa ra mái nằm trên một cạnh (bản hiện hành: cả hai cạnh y, thông ra mái trước và mái sau).
   Bản hiện hành: tum gọn, **một cửa trên tường đông áp sát đầu vế 2** — bước lên hết thang là qua cửa ra mái. Không có
   chiếu tới nên cánh **mở ra phía mái**; then chốt ở mặt trong cánh, từ mái không vào nhà tự do. Ngưỡng có gờ chắn
   nước, nấc cuối của thang lên mặt gờ (stairsOf). check-3d phép 21 đi bộ qua và soi cánh không đè lên lỗ thang. Sàn tum là mặt mái; mặt dưới mái tum cao TUM.clear; tường gạch có ô thoáng lam sát mái. Ô lấy
   sáng là phần lỗ thang nằm trong tum. Tum phải trùm kín mọi lỗ thang, không thì mưa rơi thẳng xuống. */
export function tumOf(v){
  if (!v.tum) return null;
  const { at: [x0, y0, x1, y1] } = v.tum;
  const doors = (v.tum.doors || []).map(([ax, pos, a, b, hinge = 'b', open]) => ({ ax, pos, a, b, hinge, open }));
  const base = roofWalkTop(v), under = base + TUM.clear;
  const errors = [];
  for (const s of stairsOf(v).filter(s => !s.error)) {
    const hl = s.hole;
    if (hl.x < x0 || hl.y < y0 || hl.x + hl.w > x1 || hl.y + hl.h > y1) errors.push(`Tum không trùm kín lỗ thang ${s.id}`);
  }
  if (!doors.length) errors.push('Tum không có cửa ra mái');
  for (const { ax, pos, a, b, hinge, open } of doors) {
    const [e0, e1, s0, s1] = ax === 'h' ? [y0, y1, x0, x1] : [x0, x1, y0, y1];
    const onEdge = Math.abs(pos - e0) < EPS || Math.abs(pos - e1) < EPS;
    if (!onEdge || !(a >= s0 + TUM.wall && b <= s1 - TUM.wall && b > a))
      errors.push(`Cửa tum trục ${ax} ${pos} (${a}–${b}) không nằm trên vách tum`);
    else if (Math.abs(open) !== 1 || !['a', 'b'].includes(hinge))
      errors.push(`Cửa tum trục ${ax} ${pos} phải có bản lề a / b và chiều mở ±1`);
  }
  /* Thang ra thẳng cửa: tường đông tum áp sát đầu vế 2 (tim cách mép lỗ nửa bề dày tường) và có một cửa trên tường ấy,
     lọt trong bề ngang vế 2. */
  for (const s of stairsOf(v).filter(s => !s.error)) {
    const edge = s.hole.x + s.hole.w + TUM.wall / 2;
    if (Math.abs(x1 - edge) > EPS) errors.push(`Tường tum phía đầu thang ${s.id} phải ở x = ${edge.toFixed(2)} — áp sát đầu vế 2`);
    else if (!doors.some(d => d.ax === 'v' && Math.abs(d.pos - edge) < EPS && d.a >= s.hole.y - EPS && d.b <= s.hole.y + s.width + EPS))
      errors.push(`Không có cửa tum ngay đầu vế 2 của thang ${s.id}`);
  }
  if (base + TUM.door > under - TUM.ventGap - TUM.vent - EPS) errors.push(`Cửa tum cao hơn chân ô thoáng`);
  const skylight = stairsOf(v).filter(s => !s.error).map(s => s.hole);
  /* Mái tum: phủ tới mặt ngoài tường, đua thêm TUM.eave ở mỗi cạnh — trừ cạnh nằm trên ranh lô, không đua sang đất
     nhà bên. */
  const hw = TUM.wall / 2, onLot = (u, edge) => Math.abs(u) < EPS || Math.abs(u - edge) < EPS;
  const roof = { x0: x0 - hw - (onLot(x0, LOT.w) ? 0 : TUM.eave), x1: x1 + hw + (onLot(x1, LOT.w) ? 0 : TUM.eave),
                 y0: y0 - hw - (onLot(y0, LOT.d) ? 0 : TUM.eave), y1: y1 + hw + (onLot(y1, LOT.d) ? 0 : TUM.eave) };
  /* Ô văng trên mỗi cửa: phía ngoài tum (suy từ cạnh chứa cửa, không từ chiều mở), dài hơn cửa mỗi bên, ngay trên đầu
     cửa. */
  const canopies = doors.map(d => {
    const out = Math.abs(d.pos - (d.ax === 'h' ? y0 : x0)) < EPS ? -1 : 1;
    const face = d.pos + out * hw, far = face + out * TUM.canopy;
    const n0 = Math.min(face, far), n1 = Math.max(face, far), a = d.a - TUM.canopyMargin, b = d.b + TUM.canopyMargin;
    const c0 = base + TUM.door + TUM.canopyGap;
    return { door: d, y0: c0, y1: c0 + TUM.canopyThick,
             rect: d.ax === 'h' ? { x: a, y: n0, w: b - a, h: n1 - n0 } : { x: n0, y: a, w: n1 - n0, h: b - a } };
  });
  if (canopies.some(c => c.y1 > under - EPS)) errors.push('Ô văng cửa tum chạm mái tum');
  return { x0, y0, x1, y1, doors, base, under, top: under + ROOF.sheet, skylight, roof, canopies, errors };
}

/* Phần một tuyến lan can bị vật khác chiếm chỗ, trả về các khoảng `[từ, đến]` **theo trục chạy** của tuyến:

     · vách tum — lan can dừng ở tim vách, vách che tiếp phần còn lại;
     · đầu hồi mái nhẹ đội đỉnh tường lên **trên mặt mái đi lại được** — đầu hồi bếp nhô trên mái ở đoạn giữa
       tuyến `x = 5`, lan can đâm thẳng vào nó.

   Suy từ chính profile mái đè lên tường (roofCapOnWall — cùng hàm massing.js dùng để dựng đầu hồi) chứ không
   khai tay: kéo tường bếp hay đổi cao độ mái là đoạn chừa đi theo. Lấy mẫu 1 cm rồi nới ra mép ngoài mẫu. */
function railingBlocks(v, ax, pos, a, b, walkTop){
  const out = [];
  const t = v.walls.find(([wax, wpos, ws, we]) =>
    wax === ax && Math.abs(wpos - pos) < EPS && ws <= b + EPS && we >= a - EPS)?.[4] ?? 0.22;

  const tum = v.tum && tumOf(v);
  if (tum && !tum.errors.length) {
    const [across0, across1, along0, along1] = ax === 'h'
      ? [tum.y0, tum.y1, tum.x0, tum.x1] : [tum.x0, tum.x1, tum.y0, tum.y1];
    if (pos >= across0 - EPS && pos <= across1 + EPS) out.push([along0, along1]);
  }

  const cap = roofCapOnWall(v, ax, pos, a, b, t);
  if (cap) {
    const step = 0.01;
    let s = null;
    for (let i = 0; ; i++) {
      const u = Math.min(a + i * step, b);
      if (cap.at(u) > walkTop + EPS) { if (s == null) s = u - step; }
      else if (s != null) { out.push([s, u]); s = null; }
      if (u >= b - EPS) { if (s != null) out.push([s, b]); break; }
    }
  }
  return out;
}

/* Trừ các khoảng bị chiếm khỏi `[a, b]`, bỏ mẩu ngắn hơn một bước trụ lan can. */
function subtractRuns(a, b, blocks){
  const runs = [];
  let s = a;
  for (const [p, q] of [...blocks].sort((m, n) => m[0] - n[0])) {
    if (q <= s + EPS) continue;
    if (p > s + EPS) runs.push([s, Math.min(p, b)]);
    s = Math.max(s, q);
    if (s >= b - EPS) break;
  }
  if (s < b - EPS) runs.push([s, b]);
  return runs.filter(([p, q]) => q - p > RAILING.pitch);
}

/* `v.roofRailings`: [[trục, vị trí, từ, đến], …] — lan can mép mái. Chân ở mặt mái đi lại được. Tuyến phải nằm
   trên mái bê tông thật (phòng kín đổ bê tông, hoặc bản mái đổ ra ngoài), không thì là lan can đứng giữa trời.

   Khai **tuyến liền**, chỗ vướng vách tum hay đầu hồi mái nhẹ thì cắt ra ở đây (railingBlocks) — trước kia
   khai tay từng đoạn với hai con số 18.8 / 24.2 chép từ hình học đầu hồi bếp, không neo được vào lưới và
   đứng yên khi kéo tường. Trả về **từng đoạn đã cắt**, mỗi đoạn một phần tử. */
/* Các mảng bản mái bê tông đi lại được: phòng kín còn đổ bê tông (không lợp tôn), cộng bản mái đổ ra
   ngoài tường. Lan can mái và bồn nước cùng hỏi một câu "chỗ này có bản mái thật không". */
export function roofSlabs(v){
  return [
    ...v.rooms.filter(r => isEnclosed(r) && !roofOver(v, r)).map(([, , x, y, w, h]) => ({ x, y, w, h })),
    ...overhangsOf(v).filter(o => !o.error).map(o => o.rect),
  ];
}

export function roofRailingsOf(v){
  const y0 = roofWalkTop(v), y1 = y0 + ROOF_RAILING.height, T = 0.12;
  const slabs = roofSlabs(v);
  return (v.roofRailings || []).flatMap(([ax, pos, a, b]) => {
    const pts = Array.from({ length: Math.max(2, Math.ceil((b - a) / 0.25) + 1) }, (_, i) => a + (b - a) * i / Math.max(1, Math.ceil((b - a) / 0.25)));
    const off = pts.find(u => { const [x, y] = ax === 'h' ? [u, pos] : [pos, u];
      return !slabs.some(r => x >= r.x - T && x <= r.x + r.w + T && y >= r.y - T && y <= r.y + r.h + T); });
    if (off != null)
      return [{ ax, pos, a, b, y0, y1, error: `Lan can mái trục ${ax} ${pos} (${a}–${b}) ra ngoài mái bê tông quanh ${off.toFixed(2)}` }];
    return subtractRuns(a, b, railingBlocks(v, ax, pos, a, b, y0))
      .map(([s, e]) => ({ ax, pos, a: s, b: e, y0, y1, error: null }));
  });
}

/* `v.tanks`: [[mã, x, y, trục], …] — bồn nước trên mái. `x`, `y` là **góc nhỏ** của hình chiếu bằng,
   `trục` là chiều nằm của thân bồn ('x' hoặc 'y'). Kích thước và cao độ suy từ TANK: chân giá đứng trên
   mặt mái đi lại được, bốn chân ở bốn góc hình chiếu, mỗi chân một bản đế dàn tải.

   Bồn phải đứng trọn trên bản mái bê tông thật và không đè lên lỗ khoét (lỗ thang, giếng trời) — đứng
   hụt ra ngoài bản hay ngồi lên miệng lỗ thì hoặc là lơ lửng, hoặc là đặt một tấn nước lên chỗ không có
   gì đỡ. */
export function tanksOf(v){
  const base = roofWalkTop(v), T = TANK, slabs = roofSlabs(v), holes = roofHoles(v);
  const seen = new Set();
  return (v.tanks || []).map(([id, x, y, axis]) => {
    const [w, h] = axis === 'x' ? [T.len, T.dia] : [T.dia, T.len];
    const errors = [];
    if (!['x', 'y'].includes(axis)) errors.push(`Bồn nước ${id}: trục '${axis}' phải là 'x' hoặc 'y'`);
    if (seen.has(id)) errors.push(`Bồn nước ${id}: trùng mã`); else seen.add(id);
    /* Bốn góc hình chiếu phải nằm trên cùng loại bản mái; lấy góc chứ không lấy tâm vì bồn dài. */
    for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
      if (!slabs.some(r => cx >= r.x - EPS && cx <= r.x + r.w + EPS && cy >= r.y - EPS && cy <= r.y + r.h + EPS))
        { errors.push(`Bồn nước ${id} có góc ở ${cx.toFixed(2)}, ${cy.toFixed(2)} không đứng trên bản mái bê tông`); break; }
    }
    for (const q of holes)
      if (overlap(x, x + w, q.x, q.x + q.w) > EPS && overlap(y, y + h, q.y, q.y + q.h) > EPS)
        errors.push(`Bồn nước ${id} đè lên lỗ ${q.id} trên bản mái`);

    const standTop = base + T.stand, top = standTop + T.dia;
    const legAt = (lx, ly) => ({ x: lx, y: ly, w: T.leg, h: T.leg, y0: base + T.padThick, y1: standTop });
    const padAt = (lx, ly) => ({ x: lx + (T.leg - T.pad) / 2, y: ly + (T.leg - T.pad) / 2, w: T.pad, h: T.pad,
                                 y0: base, y1: base + T.padThick });
    /* Chân lùi vào một chút để bản đế không chìa ra ngoài hình chiếu bồn. */
    const m = T.pad / 2, cs = [[x + m, y + m], [x + w - m - T.leg, y + m],
                              [x + m, y + h - m - T.leg], [x + w - m - T.leg, y + h - m - T.leg]];
    return { id, axis, x, y, w, h, base, standTop, top, volume: T.volume,
             legs: cs.map(([a, b]) => legAt(a, b)), pads: cs.map(([a, b]) => padAt(a, b)), errors };
  });
}

/* `v.racks`: [[mã, trục, vị trí, từ, đến], …] — giàn phơi ngoài trời, cùng dạng khai với tuyến tường.
   Mặt cắt **tam giác ngược** (RACK): hai trụ ở hai đầu tuyến, mỗi đầu trụ hai tay chìa chéo lên ra hai bên
   đỡ **hai thanh phơi** chạy suốt tuyến, cách nhau `2 × spread` theo phương ngang. Chân đứng trên cốt sân
   của sân chứa nó — giàn phơi phải nằm trong một cái sân, và không đầu nào lọt vào một phòng kín. */
export function racksOf(v){
  const R = RACK, H = heightsOf(v);
  const seen = new Set();
  return (v.racks || []).map(([id, ax, pos, a, b]) => {
    const errors = [];
    if (!['h', 'v'].includes(ax)) errors.push(`Giàn phơi ${id}: trục '${ax}' phải là 'h' hoặc 'v'`);
    if (seen.has(id)) errors.push(`Giàn phơi ${id}: trùng mã`); else seen.add(id);
    if (b - a < 2 * R.post) errors.push(`Giàn phơi ${id}: tuyến dài ${(b - a).toFixed(2)} m, không đủ đặt hai trụ`);
    const ends = [a, b].map(u => (ax === 'h' ? [u, pos] : [pos, u]));
    const holds = (r, x, y) => x >= r[2] - EPS && x <= r[2] + r[4] + EPS
                            && y >= r[3] - EPS && y <= r[3] + r[5] + EPS;
    const yard = v.rooms.find(r => r[6] === 'yard' && ends.every(([x, y]) => holds(r, x, y)));
    if (!yard) errors.push(`Giàn phơi ${id} không đứng trọn trong một cái sân`);
    /* Sân phơi bao trọn WC khách trên mặt bằng, nên "nằm trong sân" chưa đủ: phải **không** nằm trong phòng
       kín nào lọt trong sân ấy. Đặt giàn phơi vào giữa WC khách mà vẫn sạch là lỗi lặng lẽ đúng kiểu. */
    else for (const r of v.rooms) {
      if (!isEnclosed(r)) continue;
      const [x, y] = ends.find(([x, y]) => holds(r, x, y)) || [];
      if (x != null) { errors.push(`Giàn phơi ${id} có đầu ở ${x.toFixed(2)}, ${y.toFixed(2)} nằm trong ${r[1]}`); break; }
    }
    const base = yard ? floorOf(v, yard, H.floor) : 0;
    const half = R.post / 2, headTop = base + R.head, armTop = headTop + R.rise;
    const barMid = armTop + R.arm + R.bar / 2;
    const posts = ends.map(([x, y]) => ({ x: x - half, y: y - half, w: R.post, h: R.post,
                                          y0: base, y1: headTop }));
    /* Tay chìa: lăng trụ mặt nghiêng, chân ở đầu trụ và ngọn ở chỗ thanh phơi. Mỗi trụ hai tay, một mỗi bên. */
    const arms = [];
    for (const [x, y] of ends)
      for (const side of [-1, 1]) {
        const [c0, c1] = side > 0 ? [0, R.spread] : [-R.spread, 0];
        const lo = side > 0 ? headTop : armTop, hi = side > 0 ? armTop : headTop;   // theo chiều trục tăng
        arms.push(ax === 'h'
          ? { x: x - R.arm / 2, w: R.arm, y: y + c0, h: R.spread, axis: 'z',
              yb: [lo, hi], yt: [lo + R.arm, hi + R.arm] }
          : { x: x + c0, w: R.spread, y: y - R.arm / 2, h: R.arm, axis: 'x',
              yb: [lo, hi], yt: [lo + R.arm, hi + R.arm] });
      }
    /* Hai thanh phơi nằm **trên** ngọn tay chìa, chạy suốt tuyến, lệch ra hai bên. */
    const bars = [-1, 1].map(side => ({
      x: ax === 'h' ? a : pos + side * R.spread - R.bar / 2,
      w: ax === 'h' ? b - a : R.bar,
      y: ax === 'h' ? pos + side * R.spread - R.bar / 2 : a,
      h: ax === 'h' ? R.bar : b - a,
      y0: barMid - R.bar / 2, y1: barMid + R.bar / 2, along: ax === 'h' ? 'x' : 'z' }));
    return { id, ax, pos, a, b, room: yard?.[0], base, headTop, barMid, spread: R.spread,
             top: barMid + R.bar / 2, length: (b - a) * bars.length, posts, arms, bars, errors };
  });
}

export function roofInsulationOf(v){
  const d = v.roofInsulation;
  if (!d) return null;
  const all = overhangsOf(v).filter(o => !o.error);
  const overhangs = [], errors = [];
  for (const [ax, pos] of d.overhangs || []) {
    const o = all.find(o => o.ax === ax && Math.abs(o.pos - pos) < EPS);
    if (o) overhangs.push(o);
    else errors.push(`Lớp chống nóng mái khai cho mái đổ ra ngoài tường trục ${ax} ${pos}, nhưng không có mái nào ở đó`);
  }
  const I = ROOF_INSULATION;
  return { thickness: I.xps + I.paver, overhangs, errors,
           rooms: v.rooms.filter(r => isEnclosed(r) && !roofOver(v, r)) };
}
