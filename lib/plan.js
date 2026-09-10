/* Diện tích thông thủy và 13 phép kiểm — tách nguyên văn từ bản vẽ HTML cũ,
   không sửa logic. Dùng chung cho trang 2D, trang 3D và script sinh đặc tả. */

/* ═══════════ DIỆN TÍCH SỬ DỤNG (thông thủy) ═══════════
   Toạ độ phòng là tim tường. Trừ nửa bề dày mỗi bức tường bao quanh
   để ra kích thước lọt lòng — đây mới là phần dùng được. */
export function clearOf(room, walls){
  const [,,x,y,w,h] = room;
  // bề dày tường nằm trên cạnh đó; 0 nếu cạnh để trống (thông sang phòng khác)
  const wallOn = (ax,pos,a,b) => {
    let t = 0;
    for(const [wax,wpos,wa,wb,wt] of walls){
      if(wax !== ax || Math.abs(wpos - pos) > 0.001) continue;
      const overlap = Math.min(wb,b) - Math.max(wa,a);
      if(overlap > (b-a)*0.5 - 0.001) t = Math.max(t, wt);
    }
    return t;
  };
  const cw = w - wallOn('v',x,y,y+h)/2 - wallOn('v',x+w,y,y+h)/2;
  const ch = h - wallOn('h',y,x,x+w)/2 - wallOn('h',y+h,x,x+w)/2;
  return {w:cw, h:ch, a:cw*ch};
}
export const sumClear = (rooms, walls) =>
  +rooms.reduce((s,r)=>s+clearOf(r, walls).a,0).toFixed(2);

/* ═══════════ 13 PHÉP KIỂM ═══════════
   Chạy được trên bất kỳ phiên bản nào, trả về danh sách lỗi (rỗng = sạch). */
export const CHECKS = [
  'Cột trái cộng đủ 150.00 m²',
  'Cột phải cộng đủ 135.00 m²',
  'Chuỗi kích thước dọc cộng đủ 30.0 m',
  'Diện tích kín khai báo khớp tính toán',
  'Chuỗi kích thước khớp ranh giới phòng thật',
  'Mọi mã cửa có mô tả',
  'Mọi mã cửa sổ có mô tả',
  'Mã cửa sổ liên tục W1…Wn',
  'Cửa có cánh nằm gọn trên một đoạn tường',
  'Mọi phòng kín có ít nhất một cửa',
  'Hai lỗ mở trên cùng tường không chồng nhau',
  'Nội thất nằm trong phòng và không chồng nhau',
  'Nội thất không nằm trong vùng quét cánh cửa',
];

export function validate(v){
  const e=[], A=r=>r[4]*r[5], n=x=>+x.toFixed(2);
  const ovl=(p,q,s,t)=>Math.min(q,t)-Math.max(p,s);

  const L=v.rooms.filter(r=>r[0][0]==='L').reduce((s,r)=>s+A(r),0);
  if(Math.abs(L-150)>.01) e.push(`Cột trái cộng ra ${n(L)} m², phải là 150.00`);
  const R=v.rooms.filter(r=>r[0][0]==='R'&&r[0]!=='R5').reduce((s,r)=>s+A(r),0);
  if(Math.abs(R-135)>.01) e.push(`Cột phải cộng ra ${n(R)} m², phải là 135.00`);

  const ch=v.dims.left, span=ch[ch.length-1]-ch[0];
  if(Math.abs(span-30)>.01) e.push(`Chuỗi dọc cộng ra ${span} m, phải là 30.0`);

  const kin=v.rooms.filter(r=>r[6]!=='yard'&&r[0]!=='R3').reduce((s,r)=>s+A(r),0);
  if(Math.abs(kin-v.areas.kin)>.01) e.push(`DT kín khai báo ${v.areas.kin} ≠ tính ra ${n(kin)}`);

  const ys=[...new Set(v.rooms.filter(r=>r[0][0]==='L'&&r[4]>=2.4)
             .flatMap(r=>[r[3],r[3]+r[5]]))].sort((a,b)=>a-b);
  if(ys.join(',')!==ch.join(',')) e.push(`Chuỗi kích thước lệch ranh phòng: [${ys}] ≠ [${ch}]`);

  v.doors.forEach(d=>{ if(!d[9]) e.push(`${d[0]} chưa có mô tả`); });
  v.windows.forEach(w=>{ if(!w[6]) e.push(`${w[0]} chưa có mô tả`); });

  const ids=v.windows.map(w=>w[0]);
  if(ids.join(',')!==ids.map((_,i)=>'W'+(i+1)).join(','))
    e.push(`Mã cửa sổ nhảy số: ${ids.join(', ')}`);

  for(const o of [...v.doors.filter(d=>d[5]!=='open'), ...v.windows]){
    const [id,ax,pos,a,b]=o;
    const onWall=v.walls.some(([wax,wpos,wa,wb])=>
      wax===ax&&Math.abs(wpos-pos)<.001&&wa<=a+.001&&wb>=b-.001);
    const onGate=v.gates.some(([gax,gpos])=>gax===ax&&Math.abs(gpos-pos)<.001);
    if(!onWall&&!onGate) e.push(`${id} không nằm trên đoạn tường nào`);
  }

  for(const r of v.rooms){
    if(r[6]==='yard'||r[0]==='R3') continue;      // sân và lối đi hở không cần cửa
    const [id,nm,x,y,w,h]=r;
    const ok=v.doors.some(([,ax,pos,a,b])=>
      ax==='v' ? (Math.abs(pos-x)<.01||Math.abs(pos-(x+w))<.01) && ovl(a,b,y,y+h)>0.01
               : (Math.abs(pos-y)<.01||Math.abs(pos-(y+h))<.01) && ovl(a,b,x,x+w)>0.01);
    if(!ok) e.push(`${id} ${nm} không có cửa nào`);
  }

  const seg=[...v.doors,...v.windows];
  for(let i=0;i<seg.length;i++) for(let j=i+1;j<seg.length;j++){
    const a=seg[i], b=seg[j];
    if(a[1]!==b[1]||Math.abs(a[2]-b[2])>.001) continue;
    if(ovl(a[3],a[4],b[3],b[4])>0.001) e.push(`${a[0]} và ${b[0]} chồng lỗ mở`);
  }

  for(const [k,x,y,w,h] of v.furn){
    const inside=v.rooms.some(([,,rx,ry,rw,rh])=>
      x>=rx-.01&&y>=ry-.01&&x+w<=rx+rw+.01&&y+h<=ry+rh+.01);
    if(!inside) e.push(`Nội thất ${k} @${x},${y} lọt ra ngoài phòng`);
  }
  for(let i=0;i<v.furn.length;i++) for(let j=i+1;j<v.furn.length;j++){
    const [ka,ax,ay,aw,ah]=v.furn[i], [kb,bx,by,bw,bh]=v.furn[j];
    if(ovl(ax,ax+aw,bx,bx+bw)>0.02 && ovl(ay,ay+ah,by,by+bh)>0.02)
      e.push(`Nội thất ${ka} chồng ${kb}`);
  }

  for(const [id,ax,pos,a,b,kind,,open] of v.doors){
    if(kind!=='swing') continue;
    const Ln=b-a;
    const s = ax==='v'
      ? {x0:Math.min(pos,pos+open*Ln), x1:Math.max(pos,pos+open*Ln), y0:a, y1:b}
      : {x0:a, x1:b, y0:Math.min(pos,pos+open*Ln), y1:Math.max(pos,pos+open*Ln)};
    for(const [k,x,y,w,h] of v.furn)
      if(ovl(x,x+w,s.x0,s.x1)>0.08 && ovl(y,y+h,s.y0,s.y1)>0.08)
        e.push(`${id} quét vào nội thất ${k} @${x},${y}`);
  }
  return e;
}
