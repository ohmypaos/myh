/* ═══════════ CẤU HÌNH ĐẶT TÊN — GIAO DIỆN DÙNG CHUNG ═══════════
   Cả trang 2D lẫn trang 3D đều cần lưu / mở / xoá cấu hình, nên dựng ở đây một lần rồi gắn
   vào cả hai. Không dính React, cùng lối với draw2d.js và scene3d.js.

   `getCfg` / `setCfg` do trang truyền vào: mỗi trang tự biết cách vẽ lại sau khi đổi cấu
   hình, module này chỉ lo phần danh sách và nút bấm. */

import { listSaved, saveAs, removeSaved, activeSaved, isEmpty } from '../lib/config.js';

export function mountSavedConfigs(hostId, { getCfg, setCfg }){
  const host = document.getElementById(hostId);
  if (!host) return () => {};
  host.replaceChildren();

  const row = document.createElement('div');
  row.className = 'cfgsaved';

  const sel = document.createElement('select');
  const name = document.createElement('input');
  name.type = 'text';
  name.placeholder = 'Tên cấu hình';
  name.maxLength = 40;

  const btnSave = document.createElement('button');
  btnSave.textContent = 'Lưu';
  const btnDel = document.createElement('button');
  btnDel.textContent = 'Xoá';

  const note = document.createElement('p');
  note.className = 'vmeta';

  row.append(sel, name, btnSave, btnDel);
  host.append(row, note);

  function refresh(){
    const cfg = getCfg();
    const active = activeSaved(cfg);
    const list = listSaved();

    sel.replaceChildren();
    const none = document.createElement('option');
    none.value = '';
    none.textContent = list.length ? '— chọn cấu hình đã lưu —' : '— chưa lưu cấu hình nào —';
    sel.appendChild(none);
    for (const s of list) {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.name;
      sel.appendChild(o);
    }
    sel.value = active ? active.id : '';

    btnDel.disabled = !active;
    btnSave.disabled = isEmpty(cfg);

    note.innerHTML = active
      ? `Đang xem cấu hình <b>${escapeHtml(active.name)}</b>.`
      : isEmpty(cfg)
        ? 'Đang xem kích thước gốc — chưa có gì để lưu.'
        : '<b>Bản tuỳ chỉnh chưa lưu.</b> Đặt tên rồi bấm Lưu để mở lại sau.';
  }

  sel.onchange = () => {
    const s = listSaved().find(x => x.id === sel.value);
    if (s) setCfg(JSON.parse(JSON.stringify(s.cfg)));
    refresh();
  };

  btnSave.onclick = () => {
    const cfg = getCfg();
    if (isEmpty(cfg)) return;
    const label = name.value.trim() || `Cấu hình ${listSaved().length + 1}`;
    saveAs(label, cfg);
    name.value = '';
    refresh();
  };

  btnDel.onclick = () => {
    const active = activeSaved(getCfg());
    if (active) removeSaved(active.id);
    refresh();
  };

  refresh();
  return refresh;
}

const escapeHtml = s => s.replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
