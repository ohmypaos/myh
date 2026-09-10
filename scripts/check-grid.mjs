/* Phép thử khứ hồi cho mô hình lưới: toạ độ tuyệt đối → lưới → toạ độ tuyệt đối.
 *
 *   npm run check:grid
 *
 * Đây là mốc chứng minh mô hình lưới diễn tả đủ mặt bằng (roadmap E2a). Chưa qua thì đừng
 * viết tiếp phần lan truyền — dựng ngược sai nghĩa là mô hình bỏ sót thứ gì đó.
 *
 * So sánh cả `areas` dù nó được tính lại chứ không chép: nếu số khai trong file lệch với số
 * tính ra thì phải biết, đó chính là phép kiểm 4.
 */
import { PLANS } from '../lib/versions/index.js';
import { toGrid, fromGrid } from '../lib/grid.js';

const EPS = 1e-9;

/* So sánh sâu, số thì so theo sai số. Trả về danh sách đường dẫn lệch. */
function diff(a, b, path = '', out = []) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (!(Math.abs(a - b) < EPS)) out.push(`${path}: ${a} ≠ ${b}`);
    return out;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) { out.push(`${path}: dài ${a.length} ≠ ${b.length}`); return out; }
    a.forEach((x, i) => diff(x, b[i], `${path}[${i}]`, out));
    return out;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
    for (const k of keys) diff(a[k], b[k], path ? `${path}.${k}` : k, out);
    return out;
  }
  if (a !== b) out.push(`${path}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`);
  return out;
}

let failed = 0;

for (const plan of PLANS) {
  let grid, rebuilt, errs;
  try {
    grid = toGrid(plan);
    rebuilt = fromGrid(grid);
  } catch (e) {
    failed++;
    console.log(`GÃY    ${plan.id.padEnd(8)} ${e.message}`);
    continue;
  }

  /* `areas` tính lại nên tách ra báo riêng: lệch ở đây là số khai trong file sai, không phải
     mô hình lưới sai. */
  const areasErrs = diff(plan.areas, rebuilt.areas, 'areas');
  errs = diff({ ...plan, areas: 0 }, { ...rebuilt, areas: 0 });

  const lines = `${grid.xs.length}×${grid.ys.length} đường`;
  if (errs.length) {
    failed++;
    console.log(`LỆCH   ${plan.id.padEnd(8)} ${lines}`);
    for (const e of errs.slice(0, 8)) console.log(`         ${e}`);
    if (errs.length > 8) console.log(`         … và ${errs.length - 8} chỗ nữa`);
  } else {
    const note = areasErrs.length ? `  (areas khai lệch: ${areasErrs.join('; ')})` : '';
    console.log(`khớp   ${plan.id.padEnd(8)} ${lines}${note}`);
  }
}

console.log();
console.log(failed
  ? `${failed}/${PLANS.length} phương án dựng ngược không khớp.`
  : `Cả ${PLANS.length} phương án dựng ngược khớp khít — mô hình lưới diễn tả đủ mặt bằng.`);
process.exit(failed ? 1 : 0);
