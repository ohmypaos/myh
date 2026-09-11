/* ═══════════ VỎ NHÀ: CỐT SÀN · BẬC · MÁI HIÊN ═══════════
   Những thứ nằm ở ranh giữa trong nhà và ngoài sân. Dùng chung cho lib/massing.js (dựng
   khối), lib/plan.js (phép kiểm), bản vẽ 2D và đặc tả — để cả bốn cùng một cách hiểu phòng nào
   cao, phòng nào thấp.

   Bậc và mái hiên **suy vị trí** từ cửa / tường chứ không khai toạ độ: dịch tường ở thanh
   trượt thì chúng đi theo, không lơ lửng tách khỏi nhà. Xem 3d.md mục 3c. */

import { STEP, ROOF, heightsOf } from './lot.js';

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

/* Mái nhẹ phủ trọn phòng `r` — phòng đó lợp tôn thay cho bản mái bê tông. */
export const roofOver = (v, r) => lightRoofs(v).find(R =>
  r[2] >= R.x0 - EPS && r[3] >= R.y0 - EPS &&
  r[2] + r[4] <= R.x1 + EPS && r[3] + r[5] <= R.y1 + EPS);

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

   Mái hai mái cắt làm hai tấm ở nóc. Trả về toạ độ mặt bằng; massing.js đổi y → z. */
export function roofPanels(v){
  const out = [];
  for (const R of lightRoofs(v)) {
    /* `outward` = +1 nếu phía ngoài mái là toạ độ lớn. Mép nào không có tường thì giữ nguyên. */
    const shift = (ax, pos, s, e, outward) => {
      const t = wallThickness(v, ax, pos, s, e);
      if (!t) return 0;
      const edgeAxis = ax === 'h' ? 'y' : 'x';
      const u = R.axis === edgeAxis || !R.axis ? R.under(pos)
              : Math.min(R.under(s), R.under(e));
      return outward * (wallTopOf(v, ax, pos, s, e, t).top > u + EPS ? -t / 2 : t / 2);
    };
    const x0 = R.x0 + shift('v', R.x0, R.y0, R.y1, -1);
    const x1 = R.x1 + shift('v', R.x1, R.y0, R.y1, +1);
    const y0 = R.y0 + shift('h', R.y0, R.x0, R.x1, -1);
    const y1 = R.y1 + shift('h', R.y1, R.x0, R.x1, +1);

    const spans = R.ridge == null ? [[R.axis === 'x' ? x0 : y0, R.axis === 'x' ? x1 : y1]]
      : R.axis === 'x' ? [[x0, R.ridge], [R.ridge, x1]] : [[y0, R.ridge], [R.ridge, y1]];

    for (const [c0, c1] of spans) {
      const rect = R.axis === 'x' ? { x0: c0, x1: c1, y0, y1 }
                 : R.axis === 'y' ? { x0, x1, y0: c0, y1: c1 }
                 :                  { x0, x1, y0, y1 };
      const yb = R.axis ? [R.under(c0), R.under(c1)] : [R.under(0), R.under(0)];
      out.push({ id: R.id, name: R.name, mat: R.mat, axis: R.axis, ...rect,
                 yb, yt: yb.map(h => h + ROOF.sheet) });
    }
  }
  return out;
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
