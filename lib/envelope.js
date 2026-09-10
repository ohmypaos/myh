/* ═══════════ VỎ NHÀ: CỐT SÀN · BẬC · MÁI HIÊN ═══════════
   Những thứ nằm ở ranh giữa trong nhà và ngoài sân. Dùng chung cho lib/massing.js (dựng
   khối), lib/plan.js (phép kiểm), bản vẽ 2D và đặc tả — để cả bốn cùng một cách hiểu phòng nào
   cao, phòng nào thấp.

   Bậc và mái hiên **suy vị trí** từ cửa / tường chứ không khai toạ độ: dịch tường ở thanh
   trượt thì chúng đi theo, không lơ lửng tách khỏi nhà. Xem 3d.md mục 3c. */

import { STEP, heightsOf } from './lot.js';

const EPS = 0.001;
const overlap = (a, b, c, d) => Math.min(b, d) - Math.max(a, c);

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

/* Cốt sàn của một lỗ mở, tính từ cốt sân: cốt cao nhất trong các phòng hai bên — cửa bắt đầu
   từ ngưỡng phía cao. Cửa D11 và ô thoáng W4 của WC khách vì vậy tính từ +0.15. */
export function openingFloor(v, L, ax, pos, a, b){
  const along = roomsAlong(v.rooms, ax, pos, a, b);
  return along.length ? Math.max(...along.map(r => floorOf(v, r, L.floor))) : 0;
}

/* Hướng pháp tuyến từ đường tim về phía phòng `r`: +1 nếu phòng nằm phía toạ độ lớn hơn. */
const sideOf = (r, ax, pos) => Math.abs((ax === 'h' ? r[3] : r[2]) - pos) < EPS ? 1 : -1;

/* Chữ nhật trên mặt bằng: dọc trục tường [a, b], vuông góc từ `pos` đi `depth` về phía `dir`. */
function band(ax, pos, a, b, dir, depth){
  const n0 = dir > 0 ? pos : pos - depth;
  return ax === 'h' ? { x: a, y: n0, w: b - a, h: depth } : { x: n0, y: a, w: depth, h: b - a };
}

/* ═══════════ BẬC TAM CẤP ═══════════
   `v.steps` là danh sách mã cửa. Bậc nằm phía phòng thấp, rộng hơn cửa `STEP.margin` mỗi bên.
   Chênh cốt hai bên cửa chia thành nấc `STEP.rise` (nhà chính 0.45 → 3 nấc), nhưng **nấc trên
   cùng chính là ngưỡng cửa** — chỉ dựng các bậc ngoài (3 nấc → 2 bậc). Còn một nấc thì không
   dựng gì: kéo thanh trượt cốt nền xuống thấp là gặp, không coi là lỗi. Bậc sát cửa (k = 0) thấp
   hơn ngưỡng một nấc, mỗi bậc ra xa thấp thêm một nấc. */
export function stepsOf(v){
  const H = heightsOf(v);
  const level = r => floorOf(v, r, H.floor);

  return (v.steps || []).flatMap(id => {
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

    const a = da - STEP.margin, b = db + STEP.margin, depth = count * STEP.tread;
    return [{ id, ax, pos, a, b, dir, depth, count, rise: drop / risers, tread: STEP.tread,
              top: level(high), base: level(low), room: low[0],
              rect: band(ax, pos, a, b, dir, depth) }];
  });
}

/* ═══════════ MÁI HIÊN ═══════════
   `v.overhangs`: [trục, vị trí tường, từ, đến, đua ra, mô tả]. Bản mái đổ dư ra ngoài tường,
   về phía **không** có phòng kín. */
export function overhangsOf(v){
  return (v.overhangs || []).map(([ax, pos, a, b, depth, desc]) => {
    const inside = roomsAlong(v.rooms, ax, pos, a, b).find(isEnclosed);
    if (!inside) return { ax, pos, a, b, error: `Mái hiên trục ${ax} ${pos}: không áp vào phòng kín nào` };
    const dir = -sideOf(inside, ax, pos);
    return { ax, pos, a, b, depth, desc, dir, rect: band(ax, pos, a, b, dir, depth) };
  });
}
