/* ═══════════ CẤU HÌNH TUỲ CHỈNH ═══════════
   Người xem kéo thanh trượt để thử phương án. Cấu hình sống ở localStorage, **không** ghi
   ngược vào lib/versions/ — trang là tĩnh, không có backend. `current.js` vẫn là nguồn sự
   thật duy nhất và `spec/` vẫn sinh từ nó. Xem roadmap mục E.

   Để ở đây chứ không phải biến trong một trang, vì bản vẽ 2D và mô hình 3D phải thấy cùng
   một thứ. Chạy trong node (gen-spec, check-grid) thì không có localStorage — khi đó
   readConfig() trả về null và applyConfig() trả nguyên mặt bằng gốc.

   `lines` đánh theo **chỉ số đường lưới**, mà chỉ số chỉ có nghĩa trong đúng một mặt bằng,
   nên phải kèm `planId` và bỏ qua nếu mở mặt bằng khác. */

import { CARPORT_ROOF } from './lot.js';
import { toGrid, fromGrid, withLine } from './grid.js';

const KEY = 'myh.config';

export function readConfig(){
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function writeConfig(cfg){
  try {
    if (cfg) globalThis.localStorage?.setItem(KEY, JSON.stringify(cfg));
    else globalThis.localStorage?.removeItem(KEY);
  } catch { /* không lưu được thì thôi, phiên này vẫn chạy */ }
}

export const emptyConfig = planId => ({ planId, lines: { x: {}, y: {} }, heights: {}, carport: {} });

/* Có gì để áp không — cấu hình rỗng thì đừng dựng lại lưới cho tốn công. */
export const isEmpty = cfg => !cfg
  || (!Object.keys(cfg.lines?.x || {}).length
   && !Object.keys(cfg.lines?.y || {}).length
   && !Object.keys(cfg.heights || {}).length
   && !Object.keys(cfg.carport || {}).length);

/* Mặt bằng sau khi áp cấu hình. Không sửa `plan` gốc. */
export function applyConfig(plan, cfg = readConfig()){
  if (isEmpty(cfg)) return plan;

  let out = plan;

  /* Chỉ số đường chỉ đúng với mặt bằng đã sinh ra nó. */
  if (cfg.planId === plan.id) {
    const moved = { x: cfg.lines?.x || {}, y: cfg.lines?.y || {} };
    if (Object.keys(moved.x).length || Object.keys(moved.y).length) {
      let g = toGrid(plan);
      for (const axis of ['x', 'y'])
        for (const [i, v] of Object.entries(moved[axis])) g = withLine(g, axis, +i, v);
      out = fromGrid(g);
    }
  }

  /* Cao độ và mái che không dính lưới nên áp được cho mọi mặt bằng.
     heightsOf() trong lot.js vốn đã biết đọc `heights` của mặt bằng; massing.js đọc `carport`. */
  if (Object.keys(cfg.heights || {}).length)
    out = { ...out, heights: { ...out.heights, ...cfg.heights } };
  if (Object.keys(cfg.carport || {}).length)
    out = { ...out, carport: { ...CARPORT_ROOF, ...out.carport, ...cfg.carport } };

  return out;
}
