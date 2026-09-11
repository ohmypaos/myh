/* Diện tích thông thủy và 18 phép kiểm — tách từ bản vẽ HTML một-file trước đây.
   Dùng chung cho trang 2D, trang 3D và script sinh đặc tả. */

import { LOT, RACK } from './lot.js';
import { stepsOf, overhangsOf, lightRoofs, roofOver, dropCeilingsOf, postsOf, roofInsulationOf,
         stairsOf, tumOf, roofRailingsOf, tanksOf, racksOf, gateRoofsOf, gateDoorsOf, lightsOf, lightingOf, switchesOf,
         plantersOf, flowerBedsOf, treesOf } from './envelope.js';

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

/* ═══════════ 18 PHÉP KIỂM ═══════════
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
  'Bậc, mái hiên, tường nâng, cốt sàn riêng, lớp chống nóng mái khai đúng chỗ; bậc nằm gọn trong sân, không vướng nội thất hay cánh cửa',
  'Mái nhẹ khai đủ và không chồng nhau; mái nào trùm phòng kín thì trùm trọn và có cốt trần; cột đỡ mái nằm trong lô, dưới một mái nhẹ, không đứng giữa nội thất',
  'Cầu thang lên mái: vế và chiếu nghỉ khớp lỗ thang, cao bậc và mặt bậc trong giới hạn, nằm gọn trong phòng, không vướng nội thất hay cánh cửa; có tum trùm kín lỗ thang, cửa tum trên vách; có lan can mép mái đứng trên mái bê tông',
  'Đèn: mã không trùng, đúng loại; đèn trần có trần hay mái bên trên để gắn, không treo trên lỗ thang; đèn tường nằm trên tường có thật, không đè lỗ cửa; phòng nào cũng có đèn; phòng khai ngưỡng độ rọi thì đèn trần đạt ngưỡng; khai công tắc thì đèn nào cũng thuộc đúng một cụm, cụm nào cũng có hạt công tắc, bảng công tắc trên tường thật, không đè lỗ cửa, không quá số hạt',
  'Cây xanh: chậu cây, bồn hoa, ô gốc cây bóng mát nằm gọn trong lọt lòng một cái sân, không đè phòng kín; tán cây không vươn ra ngoài lô; bồn hoa áp trọn một bức tường, không chắn cửa hay cổng; không chồng bậc, nội thất, giàn phơi, cột, trụ cổng, không nằm trong vùng quét cánh cửa hay cánh cổng, không chồng nhau',
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
    if(r[6]==='yard'||r[6]==='storage'||r[0]==='R3') continue; // sân, tủ âm và lối đi hở không cần cửa đi
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
  for(const o of [...stepsOf(v), ...overhangsOf(v), ...dropCeilingsOf(v)]) if(o.error) e.push(o.error);
  e.push(...(roofInsulationOf(v)?.errors || []));
  for(const id of Object.keys(v.floorLevels||{}))
    if(!v.rooms.some(r=>r[0]===id)) e.push(`Cốt sàn riêng khai cho ${id} nhưng không có phòng mã này`);
  for(const [ax,pos,a,b] of v.fullHeightWalls||[])
    if(!v.walls.some(([wax,wpos,wa,wb])=>wax===ax&&Math.abs(wpos-pos)<.001&&wa<=a+.001&&wb>=b-.001))
      e.push(`Tường nâng trục ${ax} ${pos} (${a}–${b}) không nằm trên tường nào`);
  /* Đoạn rào xây kín: phải nằm trên một bức tường có thật, và bức ấy phải là **tường rào** — không phòng
     kín nào áp vào. Khai trên tường nhà thì vô nghĩa (tường nhà vốn đã cao tới mái, xây kín sẵn). */
  for(const [ax,pos,a,b] of v.solidFences||[]){
    if(!v.walls.some(([wax,wpos,wa,wb])=>wax===ax&&Math.abs(wpos-pos)<.001&&wa<=a+.001&&wb>=b-.001))
      { e.push(`Đoạn rào xây kín trục ${ax} ${pos} (${a}–${b}) không nằm trên tường nào`); continue; }
    const along=v.rooms.filter(r=>{
      const [rs,re] = ax==='h' ? [r[2],r[2]+r[4]] : [r[3],r[3]+r[5]];
      const [rc0,rc1] = ax==='h' ? [r[3],r[3]+r[5]] : [r[2],r[2]+r[4]];
      return ovl(rs,re,a,b)>.001 && (Math.abs(rc0-pos)<.12||Math.abs(rc1-pos)<.12);
    });
    if(along.some(r=>r[6]!=='yard'))
      e.push(`Đoạn rào xây kín trục ${ax} ${pos} (${a}–${b}) áp vào phòng kín, không phải tường rào`);
  }
  /* Mái cổng phải bám đúng cổng có thật; hình học trụ / mái và phần rào khoét rộng để thay
     trụ được suy tập trung ở gateRoofsOf(), dùng chung bản vẽ và mô hình 3D. */
  for(const r of gateRoofsOf(v)) if(r.error) e.push(r.error);
  for(const d of gateDoorsOf(v)) if(d.error) e.push(d.error);
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
  /* Cột đỡ mái nhẹ: khai đủ, mã không trùng, trong lô, dưới một mái nhẹ, không đứng giữa món nội thất.
     Chiều cao và nhịp giữa các chỗ đỡ thì check-3d soi trên khối đã dựng. */
  const postIds = new Set();
  for(const c of postsOf(v)){
    if(postIds.has(c.id)) e.push(`Cột ${c.id} khai trùng mã`);
    postIds.add(c.id);
    if(c.error){ e.push(c.error); continue; }
    if(c.x<-.001||c.y<-.001||c.x>LOT.w+.001||c.y>LOT.d+.001) e.push(`Cột ${c.id} nằm ngoài lô`);
    for(const [k,fx,fy,fw,fh] of v.furn)
      if(ovl(fx,fx+fw,c.rect.x,c.rect.x+c.rect.w)>0.001 && ovl(fy,fy+fh,c.rect.y,c.rect.y+c.rect.h)>0.001)
        e.push(`Cột ${c.id} đứng giữa nội thất ${k} @${fx},${fy}`);
  }

  /* Cầu thang lên mái, tum, lan can mái. Hình học suy ở stairsOf() / tumOf() / roofRailingsOf(), ở đây gom lỗi
     khai và soi thêm như bậc tam cấp: không đè nội thất, không nằm trong vùng quét cánh cửa. Đi bộ và khoảng
     đầu thì check-3d soi trên khối đã dựng. */
  for(const s of stairsOf(v)){
    if(s.error){ e.push(s.error); continue; }
    e.push(...s.errors);
    const {x,y,w,h} = s.hole;
    for(const [k,fx,fy,fw,fh] of v.furn)
      if(ovl(x,x+w,fx,fx+fw)>0.02 && ovl(y,y+h,fy,fy+fh)>0.02) e.push(`Cầu thang ${s.id} chồng nội thất ${k} @${fx},${fy}`);
    for(const z of swings)
      if(ovl(x,x+w,z.x0,z.x1)>0.02 && ovl(y,y+h,z.y0,z.y1)>0.02) e.push(`${z.id} quét vào cầu thang ${s.id}`);
  }
  if((v.stairs||[]).length && !v.tum) e.push('Có cầu thang lên mái mà không có tum che lỗ thang');
  const tum = tumOf(v);
  if(tum){
    e.push(...tum.errors);
    if(!(v.roofRailings||[]).length) e.push('Có tum ra mái mà mép mái không có lan can');
  }
  for(const r of roofRailingsOf(v)) if(r.error) e.push(r.error);
  /* Bồn nước trên mái: lỗi khai suy ở tanksOf() (đứng trên bản mái thật, không đè lỗ khoét). Thêm ở đây:
     không đứng chồm lên tuyến lan can mái — lan can đi trước, bồn phải lùi vào trong. */
  const tanks=tanksOf(v);
  for(const t of tanks){
    e.push(...t.errors);
    if(t.errors.length) continue;
    for(const r of roofRailingsOf(v).filter(x=>!x.error)){
      const [rx0,rx1,ry0,ry1] = r.ax==='h' ? [r.a,r.b,r.pos,r.pos] : [r.pos,r.pos,r.a,r.b];
      if(ovl(t.x,t.x+t.w,rx0,rx1)>0.02 && ovl(t.y,t.y+t.h,ry0,ry1)>0.02)
        e.push(`Bồn nước ${t.id} chồm lên lan can mái trục ${r.ax} ${r.pos}`);
    }
  }
  /* Giàn phơi: lỗi khai suy ở racksOf(). Thêm ở đây như bậc tam cấp — không đè nội thất, không nằm trong
     vùng quét cánh cửa, không chồng bậc: trụ đứng giữa lối hay giữa vùng cánh là hỏng cách dùng, không phải
     hỏng hình học nên check-3d không thấy. */
  for(const r of racksOf(v)){
    e.push(...r.errors);
    if(r.errors.length) continue;
    /* Nở tuyến ra đúng bề trụ: tuyến trần là đoạn thẳng bề ngang 0, chồng gì cũng ra 0 nên không bao giờ
       báo — phá thử đặt giàn phơi ngay trên bậc D13 đã lọt đúng vì lý do này. */
    const hp = RACK.post/2;
    const [x0,x1,y0,y1] = r.ax==='h' ? [r.a,r.b,r.pos-hp,r.pos+hp] : [r.pos-hp,r.pos+hp,r.a,r.b];
    for(const [k,fx,fy,fw,fh] of v.furn)
      if(ovl(x0,x1,fx,fx+fw)>0.02 && ovl(y0,y1,fy,fy+fh)>0.02) e.push(`Giàn phơi ${r.id} chồng nội thất ${k} @${fx},${fy}`);
    for(const b of stepsOf(v).filter(s=>!s.error))
      if(ovl(x0,x1,b.rect.x,b.rect.x+b.rect.w)>0.02 && ovl(y0,y1,b.rect.y,b.rect.y+b.rect.h)>0.02)
        e.push(`Giàn phơi ${r.id} chồng bậc cửa ${b.id}`);
    for(const z of swings)
      if(ovl(x0,x1,z.x0,z.x1)>0.02 && ovl(y0,y1,z.y0,z.y1)>0.02) e.push(`${z.id} quét vào giàn phơi ${r.id}`);
  }

  /* Đèn: lỗi khai suy ở lightsOf(). Mặt bằng nào khai đèn thì **phòng nào cũng phải có** — sót một phòng là chuyện
     rất dễ xảy ra khi dời tường, và trên bản vẽ không ai để ý một ô thiếu ký hiệu. Phòng khai ngưỡng ở `lux` thì độ rọi
     chung phải đạt. Chỗ gắn thật (áp đúng mặt dưới trần, lưng áp tường) thì check-3d soi trên khối đã dựng. */
  const lamps = lightsOf(v);
  for(const l of lamps) e.push(...l.errors);
  if(lamps.length){
    for(const r of lightingOf(v)){
      if(!r.count) e.push(`${r.id} ${r.name} không có đèn nào`);
      if(r.target!=null && !r.ok) e.push(`${r.id} ${r.name}: độ rọi chung ${Math.round(r.lux)} lx, dưới ngưỡng ${r.target}`);
    }
    for(const id of Object.keys(v.lux||{}))
      if(!v.rooms.some(r=>r[0]===id)) e.push(`Ngưỡng độ rọi khai cho ${id} nhưng không có phòng mã này`);
  }
  /* Công tắc: lỗi chỗ gắn và lỗi chia cụm suy ở switchesOf() — đèn không thuộc cụm nào là đèn không bật được. */
  const sw = switchesOf(v);
  e.push(...sw.errors, ...sw.plates.flatMap(p=>p.errors));

  /* Cây xanh: lỗi khai suy ở plantersOf() / flowerBedsOf(). Thêm ở đây như giàn phơi — chậu chắn chân bậc hay đứng
     trong vùng quét cánh cổng là hỏng cách dùng, không phải hỏng hình học, check-3d không thấy. Chậu soi theo hình
     chiếu cả tán (`reach`), không chỉ thân chậu. */
  const greens = [
    ...plantersOf(v).map(p=>({ name:`Chậu cây ${p.id}`, errors:p.errors, r:p.reach })),
    ...flowerBedsOf(v).map(b=>({ name:`Bồn hoa ${b.id}`, errors:b.errors, r:b.rect })),
    ...treesOf(v).map(t=>({ name:`Ô gốc cây ${t.id}`, errors:t.errors, r:t.reach })),
  ];
  const hit = (p,q) => ovl(p.x,p.x+p.w,q.x,q.x+q.w)>0.02 && ovl(p.y,p.y+p.h,q.y,q.y+q.h)>0.02;
  const gateLeafZone = d => d.ax==='h' ? {x:d.a, y:d.pos, w:d.b-d.a, h:(d.b-d.a)/2} : {x:d.pos, y:d.a, w:(d.b-d.a)/2, h:d.b-d.a};
  const blocks = [
    ...stepsOf(v).filter(s=>!s.error).map(s=>({ what:`bậc cửa ${s.id}`, r:s.rect })),
    ...v.furn.map(([k,x,y,w,h])=>({ what:`nội thất ${k} @${x},${y}`, r:{x,y,w,h} })),
    ...racksOf(v).filter(r=>!r.errors.length).map(r=>({ what:`giàn phơi ${r.id}`,
      r: r.ax==='h' ? {x:r.a, y:r.pos-r.spread, w:r.b-r.a, h:2*r.spread} : {x:r.pos-r.spread, y:r.a, w:2*r.spread, h:r.b-r.a} })),
    ...postsOf(v).filter(c=>!c.error).map(c=>({ what:`cột ${c.id}`, r:c.rect })),
    ...gateRoofsOf(v).filter(g=>!g.error).flatMap(g=>g.pillars.map(p=>({ what:`trụ cổng ${g.id}`, r:{x:p.x, y:p.z, w:g.pillar, h:g.pillar} }))),
    ...gateDoorsOf(v).filter(d=>!d.error).map(d=>({ what:`vùng quét cánh cổng ${d.id}`, r:gateLeafZone(d) })),
    ...swings.map(z=>({ what:`vùng quét cánh cửa ${z.id}`, r:{x:z.x0, y:z.y0, w:z.x1-z.x0, h:z.y1-z.y0} })),
  ];
  greens.forEach((g,i)=>{
    e.push(...g.errors);
    if(g.errors.length) return;
    for(const b of blocks) if(hit(g.r,b.r)) e.push(`${g.name} chồng ${b.what}`);
    for(const h of greens.slice(i+1)) if(!h.errors.length && hit(g.r,h.r)) e.push(`${g.name} chồng ${h.name}`);
  });
  return e;
}
