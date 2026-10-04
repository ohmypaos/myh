/* Tương tác cửa trong nhà hai tầng: cùng hình học cho gợi ý, va chạm và bộ kiểm. */
import { houseFloor } from './house.js';
import { WALK, walkSolids } from './walk.js';

export function houseDoors(plan){
  return plan.house.floors.flatMap((_,index)=>{
    const f=houseFloor(plan,index);
    return f.openings.filter(o=>o.type==='door').map(o=>({...o,base:f.base,floorIndex:index,
      pos:o.pos+(o.ax==='h'?plan.house.front:0),a:o.a+(o.ax==='v'?plan.house.front:0),b:o.b+(o.ax==='v'?plan.house.front:0)}));
  });
}

export function houseWalkSolids(massing,doors,furniture=true){
  const ids=new Set(doors.map(d=>d.id));
  // Kính cửa đi cũng đặc; kính cửa sổ giữ hành vi cũ. Cửa lùa mở vẫn còn hai cánh ngoài.
  return walkSolids({...massing,boxes:[...massing.boxes.filter(b=>furniture||!['furniture','mattress'].includes(b.kind)),
    ...massing.glass.filter(b=>ids.has(b.id))]});
}

function wallBetween(s,p,x,z){
  if(s.kind!=='houseWall'||p.foot+WALK.eye<=s.y0||p.foot+WALK.eye>=s.y1)return false;
  let lo=0,hi=1;
  for(const [from,to,min,max] of [[p.x,x,s.x0,s.x1],[p.z,z,s.z0,s.z1]]){
    const delta=to-from;
    if(Math.abs(delta)<1e-7){if(from<min||from>max)return false;}
    else {const a=(min-from)/delta,b=(max-from)/delta;lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));}
    if(lo>hi)return false;
  }
  return hi>1e-6&&lo<1-1e-6;
}

export function nearestHouseDoor(doors,p,solids,range=1.3){
  let best=null,distance=range;
  for(const d of doors){
    if(Math.abs(p.foot-d.base)>WALK.climb+.05)continue;
    const along=Math.max(d.a+.05,Math.min(d.b-.05,d.ax==='h'?p.x:p.z));
    const x=d.ax==='h'?along:d.pos,z=d.ax==='h'?d.pos:along,dist=Math.hypot(p.x-x,p.z-z);
    if(dist<=distance&&!solids.some(s=>wallBetween(s,p,x,z))){best=d;distance=dist;}
  }
  return best;
}

export function doorTouchesWalker(massing,id,p){
  return [...massing.boxes,...massing.glass].some(b=>b.id===id&&b.y0<p.foot+WALK.body&&b.y1>p.foot+WALK.climb
    &&Math.hypot(Math.max(b.x-p.x,0,p.x-b.x-b.w),Math.max(b.z-p.z,0,p.z-b.z-b.d))<WALK.radius+.02);
}
