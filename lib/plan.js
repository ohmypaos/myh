/* Diện tích thông thủy và 15 phép kiểm — tách từ bản vẽ HTML một-file trước đây.
   Dùng chung cho trang 2D, trang 3D và script sinh đặc tả. */

import { LOT } from './lot.js';
import { stepsOf, overhangsOf, lightRoofs, roofOver } from './envelope.js';

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

/* ═══════════ 15 PHÉP KIỂM ═══════════
   Chạy được trên bất kỳ phiên bản nào, trả về danh sách lỗi (rỗng = sạch). */
export const CHECKS = [
  'Cột trái lấp kín phần lô của nó, không hở không chồng',
  'Cột phải lấp kín phần lô còn lại',
  'Chuỗi kích thước dọc cộng đủ chiều sâu lô',
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
  'Bậc, mái hiên, tường nâng, cốt sàn riêng khai đúng chỗ; bậc nằm gọn trong sân, không vướng nội thất hay cánh cửa',
  'Mái nhẹ khai đủ và không chồng nhau; mái nào trùm phòng kín thì trùm trọn và có cốt trần',
];

export function validate(v){
  const e=[], A=r=>r[4]*r[5], n=x=>+x.toFixed(2);
  const ovl=(p,q,s,t)=>Math.min(q,t)-Math.max(p,s);

  /* Ranh cột trái/phải suy từ mép phải xa nhất của cột trái, không ghim 5.0: ranh này sắp
     kéo được (xem roadmap E2). Đừng lấy dims.bottom[1] — trông giống nhưng không phải, v2 có
     dims.bottom[1] = 2.4 trong khi ranh cột vẫn ở 5.0.

     Ghim 150 / 135 như trước thì dịch ranh cột một xăng-ti-mét là hai phép kiểm đỏ ngay dù
     mặt bằng đúng. Suy ra thì phép kiểm giữ nguyên ý nghĩa thật của nó: mỗi cột phải lấp
     kín đúng phần lô của mình — hở hay chồng đều lộ. */
  const leftRooms = v.rooms.filter(r=>r[0][0]==='L');
  const edge = leftRooms.length ? Math.max(...leftRooms.map(r=>r[2]+r[4])) : 0;
  const wantL = edge * LOT.d, wantR = (LOT.w - edge) * LOT.d;

  const L=leftRooms.reduce((s,r)=>s+A(r),0);
  if(Math.abs(L-wantL)>.01)
    e.push(`Cột trái cộng ra ${n(L)} m², phải là ${n(wantL)} (ranh cột ${n(edge)} × sâu ${LOT.d})`);
  const R=v.rooms.filter(r=>r[0][0]==='R'&&r[0]!=='R5').reduce((s,r)=>s+A(r),0);
  if(Math.abs(R-wantR)>.01)
    e.push(`Cột phải cộng ra ${n(R)} m², phải là ${n(wantR)} (phần lô còn lại)`);

  const ch=v.dims.left, span=ch[ch.length-1]-ch[0];
  if(Math.abs(span-LOT.d)>.01) e.push(`Chuỗi dọc cộng ra ${span} m, phải là ${LOT.d}`);

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

  const swings = v.doors.filter(d=>d[5]==='swing').map(([id,ax,pos,a,b,,,open])=>{
    const Ln=b-a;
    return ax==='v'
      ? {id, x0:Math.min(pos,pos+open*Ln), x1:Math.max(pos,pos+open*Ln), y0:a, y1:b}
      : {id, x0:a, x1:b, y0:Math.min(pos,pos+open*Ln), y1:Math.max(pos,pos+open*Ln)};
  });
  for(const s of swings)
    for(const [k,x,y,w,h] of v.furn)
      if(ovl(x,x+w,s.x0,s.x1)>0.08 && ovl(y,y+h,s.y0,s.y1)>0.08)
        e.push(`${s.id} quét vào nội thất ${k} @${x},${y}`);

  /* Bậc và mái hiên suy vị trí từ cửa / tường (lib/envelope.js), nên lỗi khai là mã cửa sai
     hoặc đặt ở chỗ không có sân. Còn lại soi bậc như một món nội thất ngoài sân. */
  for(const o of [...stepsOf(v), ...overhangsOf(v)]) if(o.error) e.push(o.error);
  for(const id of Object.keys(v.floorLevels||{}))
    if(!v.rooms.some(r=>r[0]===id)) e.push(`Cốt sàn riêng khai cho ${id} nhưng không có phòng mã này`);
  for(const [ax,pos,a,b] of v.fullHeightWalls||[])
    if(!v.walls.some(([wax,wpos,wa,wb])=>wax===ax&&Math.abs(wpos-pos)<.001&&wa<=a+.001&&wb>=b-.001))
      e.push(`Tường nâng trục ${ax} ${pos} (${a}–${b}) không nằm trên tường nào`);
  for(const s of stepsOf(v)){
    if(s.error) continue;
    const {x,y,w,h} = s.rect, room = v.rooms.find(r=>r[0]===s.room);
    if(!(x>=room[2]-.01 && y>=room[3]-.01 && x+w<=room[2]+room[4]+.01 && y+h<=room[3]+room[5]+.01))
      e.push(`Bậc ${s.id} lọt ra ngoài ${room[1]}`);
    for(const [k,fx,fy,fw,fh] of v.furn)
      if(ovl(x,x+w,fx,fx+fw)>0.02 && ovl(y,y+h,fy,fy+fh)>0.02)
        e.push(`Bậc ${s.id} chồng nội thất ${k} @${fx},${fy}`);
    for(const z of swings)
      if(ovl(x,x+w,z.x0,z.x1)>0.02 && ovl(y,y+h,z.y0,z.y1)>0.02)
        e.push(`${z.id} quét lên bậc ${s.id}`);
  }

  /* Mái nhẹ. Chỗ dễ sai nhất là **phủ dở một phòng kín**: mái nhẹ chỉ thay bản bê tông khi nó
     trùm trọn phòng, phủ 90% thì phòng vẫn đổ bê tông và hai mái chồng lên nhau mà không ai
     thấy trên mặt bằng. Cao độ thì để check-3d soi, ở đây chỉ soi phần khai. */
  const roofs = lightRoofs(v);
  for(const R of roofs){
    const need = R.kind==='flat' ? 1 : 2;
    if(R.h.length!==need) e.push(`Mái ${R.id}: dạng ${R.shape} cần ${need} cao độ, khai ${R.h.length}`);
    if(!['flat','mono','gable'].includes(R.kind)) e.push(`Mái ${R.id}: không hiểu dạng ${R.shape}`);
    if(R.kind!=='flat' && !['x','y'].includes(R.axis)) e.push(`Mái ${R.id}: dạng ${R.shape} thiếu trục dốc`);
    if(R.kind==='gable' && R.h[1]<=R.h[0]) e.push(`Mái ${R.id}: nóc ${R.h[1]} không cao hơn mép ${R.h[0]}`);
    if(!(R.x1>R.x0 && R.y1>R.y0)) e.push(`Mái ${R.id}: vùng phủ ${R.at} không phải chữ nhật`);
    if(R.x0<-.001||R.y0<-.001||R.x1>LOT.w+.001||R.y1>LOT.d+.001)
      e.push(`Mái ${R.id} phủ ra ngoài lô`);
    for(const r of v.rooms){
      if(r[6]==='yard'||r[0]==='R3') continue;
      const ov = Math.max(0,ovl(r[2],r[2]+r[4],R.x0,R.x1))*Math.max(0,ovl(r[3],r[3]+r[5],R.y0,R.y1));
      if(ov>0.01 && !roofOver(v,r)) e.push(`Mái ${R.id} phủ dở ${r[1]} — phải trùm trọn hoặc tránh hẳn`);
    }
  }
  for(const r of v.rooms){
    const R = roofOver(v,r);
    if(R && R.ceiling===undefined) e.push(`Mái ${R.id} trùm ${r[1]} nhưng không khai cốt trần`);
    if(R && R.ceiling>R.low+.001) e.push(`Mái ${R.id}: cốt trần ${R.ceiling} cao hơn mép mái ${R.low}`);
  }
  for(let i=0;i<roofs.length;i++) for(let j=i+1;j<roofs.length;j++){
    const a=roofs[i], b=roofs[j];
    if(ovl(a.x0,a.x1,b.x0,b.x1)>0.01 && ovl(a.y0,a.y1,b.y0,b.y1)>0.01)
      e.push(`Mái ${a.id} và ${b.id} chồng vùng phủ`);
  }
  return e;
}
