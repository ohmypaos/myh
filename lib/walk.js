/* ═══════════ ĐI BỘ: ĐỨNG Ở ĐÂU, VƯỚNG VÀO ĐÂU ═══════════
   Hình học thuần như lib/massing.js, không dính three.js — trang 3D gọi mỗi khung hình, còn
   scripts/check-3d.mjs gọi y hệt để đi thử qua từng cửa. Chạy trên đúng danh sách khối đã dựng,
   không suy lại từ mặt bằng: vướng cái gì thì cái đó phải nhìn thấy được trong cảnh.

   Người đi bộ là một khối trụ đứng trên `foot` (cao độ mặt đang đứng, tính từ cốt sân):

     - Khối nào có mặt trên thấp hơn `foot + climb` thì **bước lên được** — bậc tam cấp, ngưỡng
       cửa, sàn bếp +0.15. Cao hơn thế mà chìa vào trong chiều cao người thì **vướng**.
     - Vướng tính theo hai bán kính: vật cao quá đầu gối (tường, lan can, bệ cửa sổ) chặn từ xa
       `radius`, còn vật thấp (mép sàn nhà chính cao 0.45 ở phương án không có bậc) chỉ chặn khi
       mũi chân chạm tới — `feet`. Chỉ một bán kính lớn thì kẹt trước bậc tam cấp: khi tâm còn
       dưới sân, vòng tròn đã chạm bậc thứ hai, cao hơn tầm bước.
     - Không có trọng lực hay nhảy: rời mép bậc là hạ ngay xuống mặt thấp hơn. Trang 3D làm mượt
       tầm mắt, không phải ở đây.

   Kính (giếng trời, cửa lùa) không nằm trong danh sách khối đặc nên đi qua được — cửa lùa coi như
   đang mở. Nội thất và cánh cửa đang mở là hộp đặc nên vướng như tường. */

import { STEP } from './lot.js';

/* Người cao 1.70 m (chủ nhà chốt 11/9/2026) — tầm mắt thấp hơn đỉnh đầu chừng 12 cm. */
export const WALK = {
  body:   1.70,               // đỉnh đầu — khối nào thấp hơn thế mới cản
  eye:    1.58,               // cao mắt so với mặt đang đứng
  radius: 0.25,               // nửa bề ngang vai: cửa rộng 0.8 m lọt thoải mái, khe 0.5 m thì không
  feet:   0.08,               // mũi chân — với vật thấp dưới đầu gối
  knee:   0.50,
  climb:  STEP.rise + 0.05,   // bước lên được một nấc, không trèo được hai
  speed:  2.4,                // m/s
  substep: 0.05,              // bước tối đa mỗi lần soi va chạm — mỏng hơn tường ngăn 0.10
};

const EPS = 1e-6;

/* Khối đặc để soi: hộp và lăng trụ mặt nghiêng (theo hộp bao — mái dốc, đầu hồi đều ở trên đầu). */
export function walkSolids(massing){
  return [...massing.boxes, ...massing.prisms].map(b =>
    ({ x0: b.x, x1: b.x + b.w, z0: b.z, z1: b.z + b.d, y0: b.y0, y1: b.y1, kind: b.kind }));
}

/* Khoảng cách từ điểm tới chữ nhật trên mặt bằng — 0 nếu nằm trong. */
function reach(s, x, z){
  const dx = Math.max(s.x0 - x, 0, x - s.x1), dz = Math.max(s.z0 - z, 0, z - s.z1);
  return Math.hypot(dx, dz);
}

/* Mặt cao nhất ngay dưới chân tại (x, z) mà từ `foot` bước lên được. Ra ngoài lô (qua cổng) thì
   không có khối nền nào — coi như mặt đường ngang cốt sân. */
export function supportAt(solids, x, z, foot){
  let best = -Infinity;
  for (const s of solids)
    if (s.y1 <= foot + WALK.climb + EPS && s.y1 > best
        && x >= s.x0 - EPS && x <= s.x1 + EPS && z >= s.z0 - EPS && z <= s.z1 + EPS)
      best = s.y1;
  return best === -Infinity ? 0 : best;
}

/* Khối cản bước từ (x0, z0) sang (x1, z1) trên mặt `foot`, hoặc null. Chỉ cản khi bước **tiến lại
   gần** khối trong tầm bán kính: vừa bước xuống khỏi ngưỡng cửa 0.45 thì mép ngưỡng sau lưng đã cao
   hơn tầm bước và vẫn nằm sát chân — soi mỗi vị trí mới thì kẹt cứng tại đó, không đi tiếp được. */
export function blockerOn(solids, x0, z0, x1, z1, foot){
  for (const s of solids) {
    if (s.y1 <= foot + WALK.climb + EPS || s.y0 >= foot + WALK.body) continue;
    const r = s.y1 > foot + WALK.knee ? WALK.radius : WALK.feet;
    const d = reach(s, x1, z1);
    if (d < r && d < reach(s, x0, z0) - EPS) return s;
  }
  return null;
}

/* Đi (dx, dz) từ `p = { x, z, foot }`. Chia nhỏ bước cho khỏi xuyên qua tường mỏng khi khung hình
   giật, và soi riêng từng trục để vướng tường thì trượt dọc theo tường chứ không đứng khựng. */
export function stepWalk(solids, p, dx, dz){
  const n = Math.max(1, Math.ceil(Math.hypot(dx, dz) / WALK.substep));
  let { x, z, foot } = p, hit = null;
  for (let i = 0; i < n; i++) {
    if (dx) {
      const b = blockerOn(solids, x, z, x + dx / n, z, foot);
      if (b) hit = b; else x += dx / n;
    }
    if (dz) {
      const b = blockerOn(solids, x, z, x, z + dz / n, foot);
      if (b) hit = b; else z += dz / n;
    }
    foot = supportAt(solids, x, z, foot);
  }
  return { x, z, foot, hit };
}
