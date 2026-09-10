import { clearOf, validate, CHECKS } from './plan.js';

/* ═══════════ SINH ĐẶC TẢ MARKDOWN ═══════════ */
export function specMarkdown(v, VERSIONS){
  const n=(x,d=2)=>x.toFixed(d), C=r=>clearOf(r, v.walls);
  const KIND={swing:'Mở quay',slide:'Lùa 2 cánh',slide1:'Lùa 1 cánh',open:'Mở thông',quad:'4 cánh'};
  const TY={room:'Phòng',wet:'Vệ sinh',circ:'Lưu thông',yard:'Sân'};
  const AX=a=>a==='h'?'ngang':'dọc';
  const md=t=>String(t).replace(/<br><br>/g,'\n\n').replace(/<br>/g,'\n')
              .replace(/<\/?b>/g,'**').replace(/<code>/g,'`').replace(/<\/code>/g,'`');
  const kinR=v.rooms.filter(r=>r[6]!=='yard'&&r[0]!=='R3');
  const timKin=kinR.reduce((a,r)=>a+r[4]*r[5],0);
  const sdKin =kinR.reduce((a,r)=>a+C(r).a,0);
  const Lr=kinR.filter(r=>r[0][0]==='L');
  const timCh=Lr.reduce((a,r)=>a+r[4]*r[5],0), sdCh=Lr.reduce((a,r)=>a+C(r).a,0);
  const front=v.rooms.find(r=>r[0]==='L2')[3];
  const sumL=v.rooms.filter(r=>r[0][0]==='L').reduce((a,r)=>a+r[4]*r[5],0);
  const sumR=v.rooms.filter(r=>r[0][0]==='R'&&r[0]!=='R5').reduce((a,r)=>a+r[4]*r[5],0);
  const errs=validate(v);
  let s='';

  s+=`# Đặc tả mặt bằng — ${v.label}\n\n`;
  s+=`> Sinh tự động từ \`lib/versions/${v.id}.js\` lúc ${new Date().toLocaleString('vi-VN')}. Không chép tay.\n`;
  s+=`> **Quy ước:** toạ độ và kích thước là **tim tường**. Gốc (0,0) = góc trên-trái lô. X→phải (0–9.5). Y→xuống (0–30).\n`;
  s+=`> Cột **Sử dụng** là kích thước lọt lòng, đã trừ nửa bề dày mỗi tường bao quanh.\n`;
  s+=`> Tường bao **220 mm** · Tường ngăn **100 mm**.\n\n${v.note}\n\n---\n\n`;

  s+=`## 1. Tổng quan\n\n| Mục | Tim tường | Sử dụng |\n|---|---:|---:|\n`;
  s+=`| Lô đất 9.5 × 30 | 285.00 m² | — |\n`;
  s+=`| **Khối nhà chính** | **${n(timCh)} m²** | ${n(sdCh)} m² |\n`;
  s+=`| **Toàn bộ phần kín** | **${n(timKin)} m²** | ${n(sdKin)} m² |\n`;
  s+=`| Hành lang ngoài (có mái, hở) | ${n(v.areas.hl)} m² | — |\n`;
  s+=`| Sân trống | ${n(v.areas.san)} m² | — |\n`;
  s+=`| Tường chiếm chỗ | ${n(timKin-sdKin)} m² | — |\n\n`;
  s+=`Nhà chính chạy từ \`y = ${n(front,1)}\` tới \`y = 30.0\` → **dài ${n(30-front,1)} m**.\n\n`;

  s+=`## 2. Bảng phòng\n\n| # | Phòng | x₁ | y₁ | x₂ | y₂ | Tim tường | DT tim | Sử dụng | DT sd | Loại |\n`;
  s+=`|---|---|---:|---:|---:|---:|---|---:|---|---:|---|\n`;
  for(const r of v.rooms){ const c=C(r);
    s+=`| ${r[0]} | ${r[1]} | ${n(r[2],1)} | ${n(r[3],1)} | ${n(r[2]+r[4],1)} | ${n(r[3]+r[5],1)}`
     +` | ${n(r[4],1)} × ${n(r[5],1)} | ${n(r[4]*r[5])} | ${n(c.w)} × ${n(c.h)} | ${n(c.a)} | ${TY[r[6]]} |\n`; }
  s+=`\n**Kiểm tra:** cột trái ${n(sumL)} + cột phải ${n(sumR)} = **${n(sumL+sumR)} m²**`
   +` (WC khách nằm trong sân phơi, không cộng riêng)\n`;
  s+=`**Chuỗi dọc lô chính:** `
   +v.dims.left.map((y,i,a)=>i?n(a[i]-a[i-1],1):null).filter(Boolean).join(' + ')+` = **30.0**\n\n`;

  s+=`## 3. Bảng cửa\n\n| Mã | Trục | Vị trí | Từ | Đến | Rộng | Loại | Chiều mở | Nối |\n`;
  s+=`|---|---|---:|---:|---:|---:|---|---|---|\n`;
  for(const [id,ax,pos,a,b,kind,hinge,open,,desc] of v.doors){
    const dir = kind==='swing'
      ? `bản lề ${hinge==='a'?'đầu nhỏ':'đầu lớn'}, mở ${open>0?'+':'−'}` : '—';
    s+=`| ${id} | ${AX(ax)} | ${n(pos,1)} | ${n(a)} | ${n(b)} | ${n(b-a)} | ${KIND[kind]} | ${dir} | ${md(desc)} |\n`;
  }

  s+=`\n## 4. Bảng cửa sổ\n\n| Mã | Trục | Vị trí | Từ | Đến | Rộng | Vị trí |\n|---|---|---:|---:|---:|---:|---|\n`;
  for(const [id,ax,pos,a,b,,desc] of v.windows)
    s+=`| ${id} | ${AX(ax)} | ${n(pos,1)} | ${n(a)} | ${n(b)} | ${n(b-a)} | ${md(desc)} |\n`;
  if(!v.windows.length) s+=`| — | | | | | | Bản này không có cửa sổ nào |\n`;

  if(v.skylights.length){
    s+=`\n## 5. Lấy sáng trên mái\n\n| Mã | Tên | x | y | Kích thước | Ghi chú |\n|---|---|---:|---:|---|---|\n`;
    for(const [id,nm,x,y,w,h,desc] of v.skylights)
      s+=`| ${id} | ${nm} | ${n(x)} | ${n(y)} | ${n(w,1)} × ${n(h,1)} | ${md(desc)} |\n`;
  }

  s+=`\n## 6. Cổng\n\n| Trục | Vị trí | Từ | Đến | Rộng | Tên |\n|---|---:|---:|---:|---:|---|\n`;
  for(const [ax,pos,a,b,nm] of v.gates)
    s+=`| ${AX(ax)} | ${n(pos,1)} | ${n(a)} | ${n(b)} | ${n(b-a)} | ${nm} |\n`;

  s+=`\n## 7. Tường\n\n| Trục | Vị trí | Từ | Đến | Dày (mm) |\n|---|---:|---:|---:|---:|\n`;
  for(const [ax,pos,a,b,t] of v.walls)
    s+=`| ${AX(ax)} | ${n(pos,1)} | ${n(a,1)} | ${n(b,1)} | ${Math.round(t*1000)} |\n`;

  s+=`\n## 8. Nội thất\n\n| Loại | x | y | Rộng | Sâu |\n|---|---:|---:|---:|---:|\n`;
  for(const [k,x,y,w,h] of v.furn)
    s+=`| ${k} | ${n(x)} | ${n(y)} | ${n(w)} | ${n(h)} |\n`;

  s+=`\n---\n\n## 9. Điểm cần lưu ý\n\n${md(v.warn)}\n`;

  s+=`\n## 10. Kết quả bộ kiểm tra\n\n`;
  s+=errs.length ? `**${errs.length} lỗi:**\n\n`+errs.map(x=>`- ${x}`).join('\n')+'\n\n'
                 : `**Sạch — qua toàn bộ ${CHECKS.length} phép kiểm.**\n\n`;
  s+=CHECKS.map((c,i)=>`${i+1}. ${c}`).join('\n')+'\n';

  s+=`\n---\n\n## 11. Lịch sử phiên bản\n\n| Bản | Nội dung | DT kín |\n|---|---|---:|\n`;
  for(const x of VERSIONS)
    s+=`| ${x.id}${x===v?' ←':''} | ${x.label.replace(/^v\d+\s*—\s*/,'')} | ${n(x.areas.kin,1)} |\n`;
  s+=`\n### Thay đổi ở ${v.label}\n\n`+v.changes.map(c=>`- ${md(c)}`).join('\n')+'\n';
  return s;
}
