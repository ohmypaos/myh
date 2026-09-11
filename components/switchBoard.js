/* ═══════════ BẢNG CÔNG TẮC — GIAO DIỆN DÙNG CHUNG ═══════════
   Trang 2D và trang 3D cùng dựng một bảng: mỗi bảng công tắc khai trong mặt bằng (`switches`) là một hàng nút, mỗi
   nút là một hạt — bấm thì bật / tắt cả cụm đèn của nó (`lightGroups`). Cụm có hạt ở hai bảng (công tắc hai chiều)
   hiện ở cả hai hàng và cùng một trạng thái, đúng như ngoài đời: bấm ở đầu nào đèn cũng đổi.

   Không dính React, cùng lối với savedConfigs.js. Trang truyền `onChange` để tự vẽ lại; module chỉ giữ trạng thái
   bật / tắt (trong bộ nhớ, mặc định tắt hết) và nút bấm. */

import { switchesOf } from '../lib/envelope.js';

export function mountSwitchBoard(hostId, { onChange } = {}){
  let groups = [], plates = [], lampGroup = new Map();
  const on = new Set();

  const changed = () => { render(); onChange?.(); };
  const button = (label, active, click, title) => {
    const b = document.createElement('button');
    b.textContent = label;
    if (active) b.classList.add('on');
    if (title) b.title = title;
    b.onclick = click;
    return b;
  };

  function render(){
    const host = document.getElementById(hostId);
    if (!host) return;
    host.replaceChildren();
    host.classList.add('swboard');
    if (!groups.length) {
      const p = document.createElement('p');
      p.className = 'vmeta';
      p.textContent = 'Phương án này chưa khai công tắc.';
      host.appendChild(p);
      return;
    }
    const top = document.createElement('div');
    top.className = 'swall';
    const count = document.createElement('span');
    const lit = groups.filter(g => on.has(g.id)).reduce((s, g) => s + g.lights.length, 0);
    count.textContent = `${on.size}/${groups.length} cụm bật · ${lit} đèn sáng`;
    top.append(
      button('Bật hết', false, () => { groups.forEach(g => on.add(g.id)); changed(); }),
      button('Tắt hết', false, () => { on.clear(); changed(); }),
      count);
    host.appendChild(top);

    const byId = new Map(groups.map(g => [g.id, g]));
    for (const p of plates) {
      const box = document.createElement('div');
      box.className = 'swplate';
      const name = document.createElement('div');
      name.className = 'swname';
      name.innerHTML = `<b>${p.id}</b> ${p.desc || ''}`;
      const gangs = document.createElement('div');
      gangs.className = 'swgangs';
      for (const id of p.groups) {
        const g = byId.get(id);
        if (!g) continue;
        const two = g.plates.length > 1;
        gangs.appendChild(button(`${two ? '⇄ ' : ''}${g.name}`, on.has(id), () => {
          on.has(id) ? on.delete(id) : on.add(id);
          changed();
        }, `${g.id}: ${g.lights.join(', ')}${two ? ` — hai chiều, cùng hạt ở ${g.plates.join(', ')}` : ''}`));
      }
      box.append(name, gangs);
      host.appendChild(box);
    }
  }

  return {
    /* Đổi mặt bằng: giữ trạng thái những cụm vẫn còn, bỏ cụm không có trong mặt bằng mới. */
    setPlan(plan){
      const s = switchesOf(plan);
      groups = s.groups;
      plates = s.plates.filter(p => !p.errors.length);
      lampGroup = new Map(groups.flatMap(g => g.lights.map(l => [l, g.id])));
      for (const id of [...on]) if (!groups.some(g => g.id === id)) on.delete(id);
      render();
    },
    isGroupOn: id => on.has(id),
    isLampOn: id => on.has(lampGroup.get(id)),
  };
}
