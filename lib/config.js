/* ═══════════ CẤU HÌNH TUỲ CHỈNH ═══════════
   Người xem kéo thanh trượt để thử phương án. Cấu hình sống ở localStorage, **không** ghi
   ngược vào lib/versions/ — trang là tĩnh, không có backend. `current.js` vẫn là nguồn sự
   thật duy nhất và `spec/` vẫn sinh từ nó. Xem roadmap mục E.

   Để ở đây chứ không phải biến trong một trang, vì bản vẽ 2D và mô hình 3D phải thấy cùng
   một thứ. Chạy trong node (gen-spec, check-grid) thì không có localStorage — khi đó
   readConfig() trả về null và applyConfig() trả nguyên mặt bằng gốc.

   `lines` đánh theo **chỉ số đường lưới**, mà chỉ số chỉ có nghĩa trong đúng một mặt bằng,
   nên phải kèm `planId` và bỏ qua nếu mở mặt bằng khác. */

import { LOT } from './lot.js';
import { toGrid, fromGrid, withLine } from './grid.js';

const KEY = 'myh.config';        // cấu hình đang xem
const SAVED = 'myh.saved';       // danh sách cấu hình đã đặt tên

const read = k => { try { const r = globalThis.localStorage?.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } };
const write = (k, v) => { try { if (v) globalThis.localStorage?.setItem(k, JSON.stringify(v)); else globalThis.localStorage?.removeItem(k); } catch { /* không lưu được thì thôi */ } };

export const readConfig = () => read(KEY);
export const writeConfig = cfg => write(KEY, cfg);

export const emptyConfig = planId =>
  ({ planId, lines: { x: {}, y: {} }, heights: {}, azimuth: null });

/* Có gì để áp không — cấu hình rỗng thì đừng dựng lại lưới cho tốn công.
   Cấu hình lưu từ trước có thể còn khoá `carport` (mái che xe, đã bỏ khỏi thiết kế) — cố ý
   không đọc tới, coi như không có. */
export const isEmpty = cfg => !cfg
  || (!Object.keys(cfg.lines?.x || {}).length
   && !Object.keys(cfg.lines?.y || {}).length
   && !Object.keys(cfg.heights || {}).length
   && (cfg.azimuth === null || cfg.azimuth === undefined));

/* ═══════════ HƯỚNG MẶT TIỀN ═══════════
   Nằm trong cấu hình chung chứ không phải khoá riêng, để lưu cấu hình đặt tên là lưu luôn cả
   hướng. Hướng không đụng hình học nên validate() và spec/ không phụ thuộc nó; chạy trong
   node thì không có localStorage và hàm trả về giá trị gốc. */
export function frontAzimuth(){
  const deg = readConfig()?.azimuth;
  return Number.isFinite(deg) ? ((deg % 360) + 360) % 360 : LOT.frontAzimuth;
}

/* deg = null để về hướng thiết kế. */
export function setFrontAzimuth(deg){
  const cfg = readConfig() || emptyConfig(null);
  cfg.azimuth = deg === null ? null : deg;
  writeConfig(cfg);
}

/* ═══════════ CẤU HÌNH ĐẶT TÊN ═══════════
   Lưu ở máy người xem, không phải trong repo. `current.js` vẫn là nguồn sự thật: chốt được
   phương án nào thì vẫn phải sửa tay vào đó rồi `npm run spec`. Xem roadmap mục E3. */

export const listSaved = () => read(SAVED) || [];

export function saveAs(name, cfg){
  const list = listSaved();
  const id = `c${Date.now().toString(36)}`;
  list.push({ id, name, savedAt: new Date().toISOString(), cfg: JSON.parse(JSON.stringify(cfg)) });
  write(SAVED, list);
  return id;
}

export function removeSaved(id){
  write(SAVED, listSaved().filter(x => x.id !== id));
}

/* Cấu hình đang xem trùng khít với bản đã lưu nào không — để nhãn nói đúng tên, và để biết
   khi nào người dùng đã sửa tiếp mà chưa lưu. */
export function activeSaved(cfg){
  const key = JSON.stringify(cfg);
  return listSaved().find(x => JSON.stringify(x.cfg) === key) || null;
}

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

  /* Cao độ không dính lưới nên áp được cho mọi mặt bằng.
     heightsOf() trong lot.js vốn đã biết đọc `heights` của mặt bằng. */
  if (Object.keys(cfg.heights || {}).length)
    out = { ...out, heights: { ...out.heights, ...cfg.heights } };

  return out;
}
