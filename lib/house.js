/* Nhà hai tầng: dữ liệu lọt lòng dùng chung cho bản vẽ, mô hình và đặc tả.
   X tăng sang lô phụ, Y tính từ mặt tiền nhà chính; không xoay riêng cầu thang. */
import { buildAccess } from './access.js';
import { HEIGHTS, heightsOf } from './lot.js';
import { plantersOf, flowerBedsOf, treesOf, racksOf } from './envelope.js';
import { furnitureOf, furnitureClearance, FURNITURE_SOURCES } from './furniture.js';

export function withHouse(plan) {
  const h=plan.house, front=h.front, w=h.width;
  const f=h.floors[0],s=h.stair,bed=f.rooms.find(r=>r.id==='bed1'),kitchen=f.rooms.find(r=>r.id==='kitchen'),wc=f.rooms.find(r=>r.id==='wc1');
  const rooms=[['L1','SÂN TRƯỚC',0,0,w,front,'yard'],
    ...f.rooms.map((r,i)=>[`L${i+2}`,r.name,r.x,front+r.y,r.w,r.d,r.type]),
    ['L6','CẦU THANG',s.x,front+s.y,s.w,s.d,'circ'],
    ['L7','HÀNH LANG CẦU THANG',.2,front+s.y,.9,kitchen.y-s.y,'circ'],
    ['L9','HÀNH LANG WC',.2,front+kitchen.y+kitchen.d,.9,bed.y-kitchen.y-kitchen.d,'circ'],
    ...(30-front-h.depth>1e-7?[['L8','SÂN SAU',0,front+h.depth,w,30-front-h.depth,'yard']]:[]),
    ['R1','SÂN CHÍNH',w,0,4,25,'yard'],['R4','SÂN PHƠI / GIẶT',w,25,4,5,'yard']];
  const kin=rooms.filter(r=>r[6]!=='yard').reduce((sum,r)=>sum+r[4]*r[5],0);
  const ground=houseFloor(plan,0);
  return {...plan, label:'Hiện hành — nhà 2 tầng, mái tôn hai dốc',
    note:`Nhà chính ${h.width} × ${h.depth} m = ${(h.width*h.depth).toFixed(2)} m² mỗi tầng (chưa cộng hiên và ban công trước). Sân trước ${front} m, tường sau nhà tại Y=30 m làm tường bao, bỏ đoạn tường bao riêng phía sau nhà. Giữ ba phòng ngủ; thu gọn khách, bếp, master và làm việc. Phòng thờ lọt lòng 3,2 × 2 m. Bỏ hiên / ban công sau, thay cửa đi bằng cửa sổ lùa có bệ ở cả hai tầng. Ban công trước đua 1,8 m. Thang U ngang nhà 3 × 2 m ở ngay sau khách; bếp + ăn lùi sau thang. Tầng 2: làm việc trước thang (3,2 × 1,6 m), thờ sau thang (3,2 × 2 m); WC thẳng tầng; mái tôn hai dốc + trần nhựa.`,
    warn:'Kích thước phòng và cao tầng là phương án tạm để hiệu chỉnh. Chưa tính móng, cột, dầm, kèo và tải trọng nâng tầng. Tường 100 mm không tự chứng minh kết cấu hiện tại đủ chịu lực. Chưa triển khai chi tiết điện nước.',
    changes:['Đổi thứ tự tầng 1 thành khách → thang → bếp + ăn → WC → phòng ngủ; thang chuyển từ Y=7,2 về Y=4,7 m tính từ mặt tiền nhà.','Tầng 2 giữ master; làm việc 3,2 × 1,6 m trước thang, phòng thờ 3,2 × 2 m sau thang.','Thân nhà 4,5 × 13,4 m, mặt sàn 60,3 m² mỗi tầng; mặt tiền Y=16,6 m, tường sau nhà Y=30 m làm tường bao; chỉ giữ tường bao sau phía sân phơi.','Phòng thờ 3,2 × 2 m; thu gọn các phòng phía trước để giữ thang và phòng ngủ sau.','Bỏ hiên / ban công sau, tường bên, lan can và tam cấp sau; hai tầng chỉ mở cửa sổ lùa 2 × 1,3 m, bệ cao 0,9 m.','Giữ hiên và ban công trước; WC hai tầng thẳng vị trí.'],
    rooms,areas:{kin:+kin.toFixed(2),hl:0,san:+(255-kin).toFixed(2)},
    dims:{left:[...new Set([0,front,front+s.y,front+s.y+s.d,front+bed.y,front+h.depth,30])],bottom:[0,4.5,8.5],innerY:front+wc.y,innerX:[0,1.15,4.5]},
    walls:ground.walls.map(w=>[w.ax,w.pos+(w.ax==='h'?front:0),w.a+(w.ax==='v'?front:0),w.b+(w.ax==='v'?front:0),w.t]),
    doors:ground.openings.filter(o=>o.type==='door').map(o=>[o.id,o.ax,o.pos+(o.ax==='h'?front:0),o.a+(o.ax==='v'?front:0),o.b+(o.ax==='v'?front:0),o.style,'','','',o.name]),
    windows:ground.openings.filter(o=>o.type==='window').map(o=>[o.id,o.ax,o.pos+(o.ax==='h'?front:0),o.a+(o.ax==='v'?front:0),o.b+(o.ax==='v'?front:0),'',o.name]),
    skylights:[],furn:[],stairs:[],tum:null,roofRailings:[],tanks:[],overhangs:[],fullHeightWalls:[],roofInsulation:null,
    lights:[],wallLights:[],lightGroups:[],switches:[],lux:{},dropCeilings:{},floorLevels:{},steps:{},strips:[[0,front]],
  };
}

export function houseFloor(plan,index) {
  const h=plan.house, floor=h.floors[index], t=floor.wall, W=h.width, D=h.depth-h.rearBalcony;
  const room=id=>floor.rooms.find(r=>r.id===id), wc=room(`wc${index+1}`), bed=room(`bed${index+1}`);
  const wcWall=wc.y-.05, bedWall=bed.y-.05;
  const wall=(ax,pos,a,b,th=t)=>({ax,pos,a,b,t:th});
  const walls=[wall('h',t/2,0,W),wall('h',D-t/2,0,W),wall('v',t/2,t,D-t),wall('v',W-t/2,t,D-t)];
  if(index===1) walls.push(wall('h',room('office').y-.05,t,W-t,.1),wall('h',room('office').y+room('office').d+.05,1.15,W-t,.1),wall('h',room('altar').y-.05,1.15,W-t,.1),wall('h',room('altar').y+room('altar').d+.05,1.15,W-t,.1),wall('v',1.15,room('office').y-.05,room('office').y+room('office').d+.05,.1),wall('v',1.15,room('altar').y-.05,room('altar').y+room('altar').d+.05,.1));
  walls.push(wall('v',1.15,wcWall,bedWall,.1),wall('h',wcWall,1.15,W-t,.1),wall('h',bedWall,t,W-t,.1));
  if(h.rearBalcony>0&&h.rearBalconyWalls.left)walls.push(wall('v',t/2,D,D+h.rearBalcony));
  if(h.rearBalcony>0&&h.rearBalconyWalls.right)walls.push(wall('v',W-t/2,D,D+h.rearBalcony));
  const opening=(id,type,ax,pos,a,b,sill,head,name)=>({id:`F${index+1}-${id}`,type,ax,pos,a,b,sill,head,name,
    style:type==='window'||(id==='entry'&&index===1)?'slide':id==='entry'?'double':'swing',
    swingSign:id==='wc'?(h.doorDesign.wc?.swingSign??1):['master','rear'].includes(id)?-1:1});
  const entry=index?h.doorDesign.balcony:h.doorDesign.main, rear=h.doorDesign.balcony;
  const wideDoor=(id,pos,cfg,name)=>({...opening(id,'door','h',pos,(W-cfg.width)/2,(W+cfg.width)/2,0,cfg.height,name),style:'slide',panels:cfg.panels});
  const openings=[wideDoor('entry',t/2,entry,index?'Master → ban công trước':'Cửa chính'),
    opening('wc','door','v',1.15,wc.y+.15,wc.y+.95,0,2.1,'Hành lang → WC'),
    opening('bed','door','h',bedWall,.3,1.1,0,2.1,'Hành lang → phòng ngủ sau'),
    h.rearBalcony>0?wideDoor('rear',D-t/2,rear,index?'Phòng ngủ phụ → ban công sau':'Phòng ngủ 1 → hiên sau'):opening('rear','window','h',D-t/2,1.25,3.25,.9,2.2,'Cửa sổ lùa phòng ngủ sau')];
  if(index===1) openings.push(opening('master','door','h',room('office').y-.05,.25,1.05,0,2.1,'Hành lang → master'),
    opening('office','door','v',1.15,room('office').y+.3,room('office').y+1.1,0,2.1,'Hành lang → làm việc'),opening('altar','door','v',1.15,room('altar').y+.3,room('altar').y+1.1,0,2.1,'Hành lang → phòng thờ'));
  const ws=floor.rooms.map(r=>[r.y+Math.min(.5,r.d/4),r.y+Math.min(.5,r.d/4)+Math.min(1.2,r.d-.4),r.type==='wet'?1.7:.9]);
  ws.push([h.stair.y+.5,h.stair.y+1.5,.9]);
  ws.forEach(([a,b,sill],i)=>{
    if(index===0&&h.stair.groundFloorWindow===false&&a>=h.stair.y&&b<=h.stair.y+h.stair.d)return;
    const bedroom=floor.rooms.some(r=>(r.id==='master'||r.id.startsWith('bed'))&&a>=r.y&&b<=r.y+r.d);
    if(bedroom&&h.bedroomSideWindows===false)return;
    openings.push(opening(`side-${i}`,'window','v',W-t/2,a,b,sill,2.2,'Cửa sổ lùa bên phải khi nhìn ra cổng'));
  });
  return {...floor,walls,openings,index,base:h.base+index*h.floorRise};
}

/* Bốn cánh mở giữa; hai cánh trên hai ray trượt chồng sang trái hoặc phải, mở nửa bộ cửa. */
export function slidingPanels(o,open=true){
  const count=o.panels??2,span=(o.b-o.a)/count;
  return Array.from({length:count},(_,i)=>{
    const movable=count===4?i===1||i===2:true;
    const a=open&&movable?(count===4&&i===2||count===2&&o.openSide==='right'?o.b-span:o.a):o.a+i*span;
    return {a,b:a+span,offset:count===2?i*.045:movable?.045:0,index:i,movable};
  });
}

/* Hai mặt bậc thấp; mặt hiên là nấc thứ ba. Xuống theo trục X sang lô phụ. */
export function rearStepsOf(plan){
  const h=plan.house,s=h.rearSteps;
  if(!s)return [];
  return Array.from({length:s.risers-1},(_,i)=>({x:h.width+(s.risers-2-i)*s.tread,z:h.front+h.depth-h.rearBalcony+s.offset,
    w:s.tread,d:s.width,y0:0,y1:h.base*(i+1)/s.risers,kind:'step',floorIndex:0,id:'rear-step'}));
}

/* Cắt tường theo ô cửa trước khi dựng, không đặt kính lên một bức tường còn kín. */
function wallPieces(w,openings,base,top,front,index) {
  const cuts=openings.filter(o=>o.ax===w.ax&&Math.abs(o.pos-w.pos)<.001&&o.a>=w.a-.001&&o.b<=w.b+.001);
  const coords=[w.a,w.b,...cuts.flatMap(o=>[o.a,o.b])].sort((a,b)=>a-b), out=[];
  const add=(a,b,y0,y1)=>{if(b-a<1e-7||y1-y0<1e-7)return;out.push(w.ax==='h'
    ?{x:a,w:b-a,z:front+w.pos-w.t/2,d:w.t,y0,y1,kind:'houseWall',floorIndex:index}
    :{x:w.pos-w.t/2,w:w.t,z:front+a,d:b-a,y0,y1,kind:'houseWall',floorIndex:index});};
  for(let i=1;i<coords.length;i++){const a=coords[i-1],b=coords[i],c=cuts.find(o=>(a+b)/2>o.a&&(a+b)/2<o.b);
    if(c){add(a,b,base,base+c.sill);add(a,b,base+c.head,top);}else add(a,b,base,top);}
  return out;
}

export function buildHouseMassing(plan,{doorsOpen=true,doorStates={}}={}) {
  const h=plan.house,D=h.depth-h.rearBalcony,H={...HEIGHTS,...heightsOf(plan)},boxes=[],prisms=[],glass=[];
  const box=(x,z,w,d,y0,y1,kind,floorIndex,extra={})=>boxes.push({x,z,w,d,y0,y1,kind,floorIndex,...extra});
  const access=buildAccess(plan);boxes.push(...access.boxes.filter(b=>b.w>0&&b.d>0));prisms.push(...access.prisms);
  if(!access.boxes.length)box(0,0,8.5,30,-.2,0,'ground',-1);
  // Rào thấp + song thoáng giữ cao độ sân trên; đoạn mặt cổng xây kín.
  function fence(x,z,w,d,solid=.8,top=1.8){box(x,z,w,d,-.8,solid,'fenceWall',-1);
    if(top>solid){box(x,z,w,d,top-.05,top,'railing',-1);const horizontal=w>d,len=horizontal?w:d,count=Math.ceil(len/.12);
      for(let i=0;i<=count;i++)box(x+(horizontal?i*len/count:0),z+(horizontal?0:i*len/count),.025,.025,solid,top,'railing',-1);}}
  fence(-.11,0,.22,1,2.1,2.1);fence(-.11,1,.22,h.front-1);fence(8.39,0,.22,30);
  fence(4.39,-.11,4.22,.22,2.1,2.1);const rearFenceStart=h.rearWallAsFence?h.width:-.11;
  fence(rearFenceStart,29.89,8.61-rearFenceStart,.22,1.8,1.8);
  // Cổng mở: cánh quay vào sân từ bản lề thật, không dịch cả tấm ra giữa sân.
  for(const [x,side] of [[.11,1],[4.39,-1]]){
    const ax=doorsOpen?'v':'h',pos=doorsOpen?x:0,a=doorsOpen?0:(side===1?x:x-2.14),b=a+2.14;
    const gateBox=(a0,b0,y0,y1)=>ax==='h'?box(a0,pos-.03,b0-a0,.06,y0,y1,'gateDoor',-1):box(pos-.03,a0,.06,b0-a0,y0,y1,'gateDoor',-1);
    for(const y of [-.8,.2,1.24])gateBox(a,b,y,y+.06);
    for(let u=a;u<b;u+=.12)gateBox(u,Math.min(b,u+.025),-.8,1.3);
  }
  h.floors.forEach((_,index)=>{
    const f=houseFloor(plan,index),b=f.base,top=index?b+h.upperWallHeight:h.base+h.floorRise-h.slab;
    boxes.push(...f.walls.flatMap(w=>wallPieces(w,f.openings,b,top,h.front,index)));
    // Sàn tầng 2 chừa đúng lỗ thang, không che các vế thang phía dưới.
    if(index===0){box(0,h.front,h.width,h.depth,0,b,'floor',0);
      box(0,h.front-h.frontPorch,h.width,h.frontPorch,0,b,'floor',0);
      for(let i=1;i<=2;i++)box(0,h.front-h.frontPorch-.6+(i-1)*.3,h.width,.3,0,b*i/3,'step',0);}
    else {const s=h.stair;box(0,h.front,4.5,s.y,b-h.slab,b,'floor',1);
      box(0,h.front+s.y+s.d,h.width,D-s.y-s.d,b-h.slab,b,'floor',1);
      box(0,h.front+s.y,s.x,s.d,b-h.slab,b,'floor',1);
      box(s.x+s.w,h.front+s.y,4.5-s.x-s.w,s.d,b-h.slab,b,'floor',1);
      box(0,h.front-h.frontBalcony,4.5,h.frontBalcony,b-h.slab,b,'floor',1);
      if(h.rearBalcony>0)box(0,h.front+D,h.width,h.rearBalcony,b-h.slab,b,'floor',1);
    }
    for(const o of f.openings){
      const open=doorStates[o.id]??doorsOpen;
      const y0=b+o.sill,y1=b+o.head,th=.025;
      if(o.type==='door'&&o.style==='slide'){
        const frame=.035;
        const at=(a,span,y0,y1,offset,kind,extra={})=>{
          const rect=o.ax==='h'?{x:a,w:span,z:h.front+o.pos+offset-.015,d:.03}:{x:o.pos+offset-.015,w:.03,z:h.front+a,d:span};
          const part={...rect,y0,y1,kind,floorIndex:index,id:o.id,...extra};(kind==='glass'?glass:boxes).push(part);
        };
        for(const p of slidingPanels(o,open)){
          at(p.a+frame,p.b-p.a-2*frame,y0+frame,y1-frame,p.offset,'glass',{paneIndex:p.index});
          for(const a of [p.a,p.b-frame])at(a,frame,y0,y1,p.offset,'windowFrame');
          for(const y of [y0,y1-frame])at(p.a,p.b-p.a,y,y+frame,p.offset,'windowFrame');
          if(p.movable)at(p.index===(o.panels===2?0:1)?p.b-.07:p.a+.05,.015,y0+.95,y0+1.2,p.offset-.025,'windowFrame');
        }
        // Khuôn bao và ray sát sàn, không xây bệ cửa sổ dưới ô cửa đi.
        for(const a of [o.a,o.b-frame])at(a,frame,y0,y1,-.025,'windowFrame');
        at(o.a,o.b-o.a,y1-frame,y1,-.025,'windowFrame');
        at(o.a,o.b-o.a,y0,y0+.015,-.025,'windowFrame');
        continue;
      }
      if(o.type==='window'||o.style==='slide'){const span=(o.style==='slide'&&o.type==='door'&&open)?(o.b-o.a)/2:o.b-o.a;
        glass.push(o.ax==='h'
        ?{x:o.a,w:span,z:h.front+o.pos-th/2,d:th,y0,y1,kind:'glass',floorIndex:index,id:o.id}
        :{x:o.pos-th/2,w:th,z:h.front+o.a,d:span,y0,y1,kind:'glass',floorIndex:index,id:o.id});}
      else {
        const count=o.style==='double'?2:1,span=(o.b-o.a)/count;
        for(let k=0;k<count;k++){
          const hinge=o.a+k*span;
          if(!open){if(o.ax==='h')box(hinge,h.front+o.pos-.018,span,.036,y0,y1,'doorLeaf',index,{id:o.id});
            else box(o.pos-.018,h.front+hinge,.036,span,y0,y1,'doorLeaf',index,{id:o.id});}
          else if(o.ax==='h')box(count===2&&k===1?o.b-.018:hinge-.018,h.front+o.pos+(o.swingSign<0?-span:0),.036,span,y0,y1,'doorLeaf',index,{id:o.id});
          else box(o.pos+(o.swingSign<0?-span:0),h.front+hinge-.018,span,.036,y0,y1,'doorLeaf',index,{id:o.id});
        }
      }
      // Khuôn và đố giữa cửa sổ lùa hiện cả khi cửa đang mở.
      if(o.type==='window'){
        const along=o.b-o.a;
        if(o.ax==='v'){for(const z of [o.a,o.b-.035,(o.a+o.b)/2-.0175])box(o.pos-.03,h.front+z,.06,.035,y0,y1,'windowFrame',index);
          for(const y of [y0,y1-.035])box(o.pos-.03,h.front+o.a,.06,along,y,y+.035,'windowFrame',index);
        }else{for(const x of [o.a,o.b-.035,(o.a+o.b)/2-.0175])box(x,h.front+o.pos-.03,.035,.06,y0,y1,'windowFrame',index);
          for(const y of [y0,y1-.035])box(o.a,h.front+o.pos-.03,along,.06,y,y+.035,'windowFrame',index);}
      }
    }
    for(const [kind,x,y,w,d,meta={}] of f.furniture){
      const z=h.front+y;
      const extra={id:meta.id,name:meta.name};
      if(kind==='bed'){box(x,z,w,d,b+.16,b+.33,'furniture',index,extra);box(x+.045,z+.08,w-.09,d-.16,b+.33,b+.5,'mattress',index,extra);box(x+w-.06,z,.06,d,b+.16,b+(meta.height??.95),'furniture',index,extra);}
      else if(kind==='sofa'){
        box(x,z,w,d,b+.15,b+.43,'furniture',index,extra);
        const alongX=meta.facing==='front'||meta.facing==='rear';
        if(alongX){
          box(x,z+(meta.facing==='front'?d-.12:0),w,.12,b+.43,b+meta.height,'furniture',index,extra);
          for(const xx of [x,x+w-.1])box(xx,z,.1,d,b+.43,b+.62,'furniture',index,extra);
        }else{
          box(x+(meta.facing==='left'?w-.12:0),z,.12,d,b+.43,b+meta.height,'furniture',index,extra);
          for(const zz of [z,z+d-.1])box(x,zz,w,.1,b+.43,b+.62,'furniture',index,extra);
        }
        for(const xx of [x+.05,x+w-.1])for(const zz of [z+.05,z+d-.1])box(xx,zz,.05,.05,b,b+.15,'furniture',index,extra);
      }
      else if(kind==='shelf'){
        for(const height of [.1,.53,.96,meta.height])box(x,z,w,d,b+height-.04,b+height,'furniture',index,extra);
        for(let i=0;i<=3;i++)box(x+i*(w-.04)/3,z,.04,d,b,b+meta.height,'furniture',index,extra);
      }
      else if(kind==='chair'){
        box(x,z,w,d,b+.4,b+.45,'furniture',index,extra);
        box(x+(meta.facing==='left'?w-.05:0),z,.05,d,b+.45,b+meta.height,'furniture',index,extra);
        for(const xx of [x,x+w-.04])for(const zz of [z,z+d-.04])box(xx,zz,.04,.04,b,b+.4,'furniture',index,extra);
      }else box(x,z,w,d,b,b+(meta.height??({cab:2,desk:.75,altar:1.2,sofa:.7,table:.75,kitchen:.85,wc:.75,shower:.08,lav:.8,wash:.85}[kind]??.6)),'furniture',index,extra);
    }
  });
  const s=h.stair,rise=h.floorRise/18,base=h.base;
  for(let i=1;i<=8;i++)box(s.x+(i-1)*.25,h.front+s.y,.25,.95,base,base+i*rise,'stair',0);
  box(s.x+2,h.front+s.y,1,2,base+9*rise-.18,base+9*rise,'stair',0);
  for(let i=1;i<=8;i++){const y=base+(9+i)*rise;box(s.x+2-i*.25,h.front+s.y+1.05,.25,.95,y-.18,y,'stair',0);}
  // Tay vịn hai vế: dốc theo bậc, trụ đứng trên mặt bậc; không xoay thang dọc nhà.
  for(const [z,ys] of [[s.y+.93,[base+rise+.9,base+9*rise+.9]],[s.y+1.05,[base+18*rise+.9,base+9*rise+.9]]]){
    prisms.push({x:s.x,w:2,z:h.front+z,d:.025,axis:'x',yb:ys,yt:ys.map(y=>y+.04),y0:Math.min(...ys),y1:Math.max(...ys)+.04,kind:'stairRail',floorIndex:0});
    for(let i=0;i<8;i++){const y=z===s.y+.93?base+(i+1)*rise:base+(17-i)*rise;box(s.x+i*.25+.12,h.front+z,.025,.025,y,y+.94,'stairRail',0);}
  }
  // Lan can ban công và mép lỗ thang: dựng thanh đứng để nhìn được nắng lọt qua.
  function rail(x,z,w,d,base,idx,kind='stairRail'){box(x,z,w,d,base+1.02,base+1.08,kind,idx);
    const count=Math.ceil(Math.max(w,d)/.12);for(let i=0;i<=count;i++)box(x+(w>d?i*w/count:0),z+(d>w?i*d/count:0),.025,.025,base,base+1.04,kind,idx);}
  const upper=h.base+h.floorRise;
  rail(0,h.front-h.frontBalcony,4.5,.04,upper,1);rail(0,h.front-h.frontBalcony,.04,h.frontBalcony,upper,1);rail(4.46,h.front-h.frontBalcony,.04,h.frontBalcony,upper,1);
  const sideWalls=h.rearBalconyWalls,t=h.floors[1].wall,railStart=sideWalls.left?t:0;
  if(h.rearBalcony>0)rail(railStart,h.front+h.depth-.04,h.width-railStart-(sideWalls.right?t:0)-.025,.04,upper,1);
  for(let i=0;i<2&&h.rearBalcony>0;i++){
    const base=h.base+i*h.floorRise,kind=i?'stairRail':'railing';
    if(!sideWalls.left)rail(0,h.front+D,.04,h.rearBalcony,base,i,kind);
    if(!sideWalls.right&&(i!==0||!h.rearSteps))rail(h.width-.04,h.front+D,.04,h.rearBalcony,base,i,kind);
  }
  boxes.push(...rearStepsOf(plan));
  // Chặn ba cạnh lỗ thang; để hở đầu vế 2 phía hành lang.
  rail(s.x,h.front+s.y,s.w,.03,upper,1);rail(s.x+s.w-.03,h.front+s.y,.03,s.d,upper,1);rail(s.x,h.front+s.y+s.d-.03,s.w,.03,upper,1);
  const ceiling=upper+h.ceiling, eave=upper+h.upperWallHeight, ridge=eave+Math.tan(h.roof.pitch*Math.PI/180)*h.width/2;
  // Bịt phần tam giác nhỏ trên tường bên ban công, áp kín mặt dưới mái tôn.
  const capRise=Math.tan(h.roof.pitch*Math.PI/180)*t;
  for(const [enabled,x,yt] of [[sideWalls.left,0,[eave,eave+capRise]],[sideWalls.right,h.width-t,[eave+capRise,eave]]])if(enabled&&h.rearBalcony>0)prisms.push({x,w:t,z:h.front+D,d:h.rearBalcony,axis:'x',yb:[eave,eave],yt,y0:eave,y1:eave+capRise,kind:'houseWall',floorIndex:1});
  box(0,h.front,h.width,D,ceiling,ceiling+.02,'pvcCeiling',2);
  for(let x=.2;x<4.5;x+=.2)box(x,h.front,.008,D,ceiling-.003,ceiling,'ceilingSeam',2);
  const roofDepth=h.depth+.4+Math.min(.4,30-h.front-h.depth);
  const panel=(x,w,yb,kind='metalRoof',z=h.front-.4,d=roofDepth)=>{
    prisms.push({x,w,z,d,axis:'x',yb,yt:yb.map(y=>y+.03),y0:Math.min(...yb),y1:Math.max(...yb)+.03,kind,floorIndex:2});};
  panel(0,2.25,[eave,ridge]);panel(2.25,2.25,[ridge,eave]);
  // Đầu hồi bám hai mái; không thêm tầng áp mái hay sàn bê tông trên tầng 2.
  for(const z of [h.front,h.front+D-.1]){panel(0,2.25,[eave,eave],'gableWall',z,.1);prisms.at(-1).yt=[eave,ridge];prisms.at(-1).y1=ridge;
    panel(2.25,2.25,[eave,eave],'gableWall',z,.1);prisms.at(-1).yt=[ridge,eave];prisms.at(-1).y1=ridge;}
  for(const x of [.04,4.31]){box(x,h.front-.4,.15,roofDepth,eave-.12,eave,'gutter',2);box(x,Math.min(h.front+h.depth+.2,29.95),.09,.09,-.1,eave-.12,'downpipe',2);}
  // Mái sân phơi độc lập và hai cột giữ vị trí cũ.
  prisms.push({x:4.5,w:4,z:25,d:3,axis:'z',yb:[3.5,3.2],yt:[3.53,3.23],y0:3.2,y1:3.53,kind:'siteRoof',floorIndex:-1});
  for(const z of [25,28])box(8.4,z-.05,.1,.1,0,(z===25?3.5:3.2),'post',-1);
  // Cây và giàn phơi dùng lại dữ liệu sân, không kéo theo nội thất nhà một tầng cũ.
  const put=(r,kind,extra={})=>box(r.x,r.y,r.w,r.h,r.y0,r.y1,kind,-1,extra);
  for(const p of plantersOf(plan)){
    const supports=boxes.filter(b=>(b.kind==='step'||b.kind==='floor'&&b.floorIndex===0&&b.z<h.front)&&p.rect.x>=b.x&&p.rect.x+p.rect.w<=b.x+b.w&&p.rect.y>=b.z&&p.rect.y+p.rect.h<=b.z+b.d);
    const base=Math.max(p.base,...supports.map(b=>b.y1)),lift=base-p.base;
    // Chậu trước cửa đứng trực tiếp trên hiên cùng cốt sàn nhà.
    put({...p.rect,y0:base,y1:p.top+lift},'pot');put({...p.crown,y0:p.crown.y0+lift,y1:p.crown.y1+lift},'plant',{shape:'ball'});
  }
  for(const b of flowerBedsOf(plan)){for(const c of b.curbs)put(c,'bedCurb');if(b.soil)put(b.soil,'soil');for(const c of b.clumps)put(c,'plant',{shape:'ball'});for(const c of b.blooms)put(c,'bloom',{shape:'ball'});}
  for(const t of treesOf(plan)){for(const c of t.curbs)put(c,'bedCurb');put(t.soil,'soil');put(t.trunk,'trunk');put(t.crown,'plant',{shape:'ball'});}
  for(const r of racksOf(plan)){for(const p of [...r.posts,...r.bars])put(p,'rack');for(const p of r.arms)prisms.push({x:p.x,w:p.w,z:p.y,d:p.h,axis:p.axis,yb:p.yb,yt:p.yt,y0:Math.min(...p.yb),y1:Math.max(...p.yt),kind:'rack',floorIndex:-1});}
  for(const [kind,x,z,w,d] of plan.siteFurniture??[])box(x,z,w,d,0,kind==='tap'?1:.85,'furniture',-1);
  return {H,levels:{floor:h.base,ceiling,houseTop:ceiling,top:ridge+.03},boxes:boxes.filter(b=>b.w>0&&b.d>0&&b.y1>b.y0),prisms,glass};
}

export function validateHouse(plan) {
  const h=plan.house,errors=[], add=(n,msg)=>errors.push({n,msg});
  const furnitureIds=new Set();
  if(h.front<0||h.front+h.depth>30||h.width!==4.5)add(1,'Khối chính phải nằm trong lô 4,5 × 30 m.');
  h.floors.forEach((f,i)=>{
    for(const r of f.rooms){if(r.x<f.wall-1e-7||r.x+r.w>h.width-f.wall+1e-7||r.y<f.wall-1e-7||r.y+r.d>h.depth-h.rearBalcony-f.wall+1e-7)add(2,`Tầng ${i+1}: ${r.name} vượt mặt trong tường.`);}
    for(let a=0;a<f.rooms.length;a++)for(let b=a+1;b<f.rooms.length;b++){const p=f.rooms[a],q=f.rooms[b];if(Math.min(p.x+p.w,q.x+q.w)-Math.max(p.x,q.x)>1e-7&&Math.min(p.y+p.d,q.y+q.d)-Math.max(p.y,q.y)>1e-7)add(3,'Các phòng chồng nhau.');}
    const sf=houseFloor(plan,i);for(const o of sf.openings)if(!sf.walls.some(w=>w.ax===o.ax&&Math.abs(w.pos-o.pos)<.001&&o.a>=w.a-.001&&o.b<=w.b+.001))add(4,`Lỗ mở ${o.id} không nằm trên tường.`);
  });
  if(h.floors[1].wall!==.1)add(5,'Tường tầng 2 phải dày 100 mm.');
  if(h.stair.w!==3||h.stair.d!==2||h.stair.width!==.95)add(6,'Thang phải nằm ngang nhà 3 × 2 m, vế 0,95 m.');
  const wc=h.floors.map(f=>f.rooms.find(r=>r.type==='wet'));if(wc[0].y!==wc[1].y)add(7,'WC hai tầng không thẳng nhau.');
  const m=buildHouseMassing(plan);
  if(m.prisms.filter(p=>p.kind==='metalRoof').length!==2||!m.boxes.some(b=>b.kind==='pvcCeiling'))add(8,'Thiếu hai mái tôn hoặc trần nhựa.');
  const hole=h.stair;for(const b of m.boxes.filter(b=>b.kind==='floor'&&b.floorIndex===1))if(Math.min(b.x+b.w,hole.x+hole.w)-Math.max(b.x,hole.x)>1e-7&&Math.min(b.z+b.d,h.front+hole.y+hole.d)-Math.max(b.z,h.front+hole.y)>1e-7)add(9,'Sàn tầng 2 bịt lỗ thang.');
  for(const b of [...m.boxes,...m.prisms,...m.glass])if(![b.x,b.z,b.w,b.d,b.y0,b.y1].every(Number.isFinite)||b.w<=0||b.d<=0||b.y1<=b.y0)add(10,'Khối 3D có kích thước không hợp lệ.');
  const contains=(b,x,y,z)=>x>b.x+1e-7&&x<b.x+b.w-1e-7&&z>b.z+1e-7&&z<b.z+b.d-1e-7&&y>b.y0+1e-7&&y<b.y1-1e-7;
  h.floors.forEach((f,i)=>{
    const sf=houseFloor(plan,i),walls=m.boxes.filter(b=>b.kind==='houseWall'&&b.floorIndex===i);
    for(const o of sf.openings)for(const u of [.15,.5,.85])for(const v of [.05,.5,.95]){
      const along=o.a+(o.b-o.a)*u,x=o.ax==='h'?along:o.pos,z=h.front+(o.ax==='h'?o.pos:along),y=sf.base+o.sill+(o.head-o.sill)*v;
      if(walls.some(b=>contains(b,x,y,z)))add(11,`Tầng ${i+1}: tường bịt ô cửa ${o.id}.`);
    }
    for(const id of ['entry','rear']){const o=sf.openings.find(o=>o.id===`F${i+1}-${id}`);
      if(id==='rear'&&!h.rearBalcony){if(!o||o.type!=='window'||o.sill<=0)add(17,`Tầng ${i+1}: phía sau phải là cửa sổ có bệ.`);continue;}
      const count=i===0&&id==='entry'?4:2;
      if(!o||o.type!=='door'||o.style!=='slide'||o.sill!==0||o.b-o.a<3||o.head<2.5||o.panels!==count)add(17,`Tầng ${i+1}: ${id} phải là cửa đi lùa ${count} cánh rộng, từ sàn lên.`);
    }
    const wcDoor=sf.openings.find(o=>o.id===`F${i+1}-wc`);
    if(wcDoor.style!=='swing'||wcDoor.swingSign!==1)add(17,`Tầng ${i+1}: cửa WC phải mở vào trong.`);
    for(const [kind,x,y,w,d] of f.furniture){
      const inside=f.rooms.some(r=>x>=r.x-1e-7&&y>=r.y-1e-7&&x+w<=r.x+r.w+1e-7&&y+d<=r.y+r.d+1e-7);
      if(!inside&&kind!=='wash')add(12,`Tầng ${i+1}: đồ ${kind} vượt phòng.`);
      for(const leaf of m.boxes.filter(b=>b.kind==='doorLeaf'&&b.floorIndex===i))if(Math.min(x+w,leaf.x+leaf.w)-Math.max(x,leaf.x)>1e-7&&Math.min(h.front+y+d,leaf.z+leaf.d)-Math.max(h.front+y,leaf.z)>1e-7)add(13,`Tầng ${i+1}: cửa đang mở chạm đồ ${kind}.`);
    }
    for(let a=0;a<f.furniture.length;a++)for(let b=a+1;b<f.furniture.length;b++){const [,x,y,w,d]=f.furniture[a],[,xx,yy,ww,dd]=f.furniture[b];if(Math.min(x+w,xx+ww)-Math.max(x,xx)>1e-7&&Math.min(y+d,yy+dd)-Math.max(y,yy)>1e-7)add(14,`Tầng ${i+1}: hai món đồ chồng nhau.`);}
    const items=furnitureOf(plan,i);
    const overlaps=(p,q)=>Math.min(p.x+p.w,q.x+q.w)-Math.max(p.x,q.x)>1e-7&&Math.min(p.y+p.d,q.y+q.d)-Math.max(p.y,q.y)>1e-7;
    for(const item of items){
      if(!item.id||furnitureIds.has(item.id))add(19,`Tầng ${i+1}: món ${item.name??item.kind} thiếu mã hoặc trùng mã.`);
      furnitureIds.add(item.id);
      if(!(item.height>0)||!item.name||!item.note)add(19,`${item.id}: thiếu kích thước cao hoặc chú thích.`);
      const space=furnitureClearance(item),room=f.rooms.find(r=>r.id===item.roomId);
      if(space){
        if(room&&(space.x<room.x-1e-7||space.y<room.y-1e-7||space.x+space.w>room.x+room.w+1e-7||space.y+space.d>room.y+room.d+1e-7))add(20,`${item.id}: khoảng sử dụng vượt phòng.`);
        for(const other of items)if(other.id!==item.id&&overlaps(space,other))add(20,`${item.id}: khoảng sử dụng bị ${other.id} chắn.`);
      }
      // Soi cả vùng quét 90° của cửa quay, không chỉ cánh đã mở hết.
      for(const o of sf.openings.filter(o=>o.style==='swing')){
        const span=o.b-o.a,area=o.ax==='h'?{x:o.a,y:o.pos+(o.swingSign<0?-span:0),w:span,d:span}
          :{x:o.pos+(o.swingSign<0?-span:0),y:o.a,w:span,d:span};
        if(overlaps(item,area))add(21,`${item.id}: vướng vùng quét cửa ${o.id}.`);
      }
    }
  });
  for(const b of m.boxes.filter(b=>b.kind==='stair')){
    const x=b.x+b.w/2,z=b.z+b.d/2,above=m.boxes.filter(p=>['floor','pvcCeiling'].includes(p.kind)&&p.y0>=b.y1&&x>p.x&&x<p.x+p.w&&z>p.z&&z<p.z+p.d);
    if(above.some(p=>p.y0-b.y1<2))add(15,'Khoảng đầu trên cầu thang dưới 2 m.');
  }
  if(m.boxes.some(b=>b.kind==='floor'&&b.y0>h.base+h.floorRise+.001))add(16,'Không được dựng sàn bê tông phía trên tầng 2.');
  if(h.rearSteps){const r=h.rearSteps;
    if(!Number.isInteger(r.risers)||r.risers<2||h.base/r.risers>.18||r.tread<.25||r.width<.8||r.offset<0||r.offset+r.width>h.rearBalcony||h.rearBalconyWalls.right)
      add(18,'Tam cấp hiên sau phải đủ rộng, cao bậc không quá 18 cm và nằm gọn ở cạnh thông sang sân.');
  }
  return errors;
}

export function houseSpec(plan) {
  const h=plan.house;let s=`# Đặc tả nhà hai tầng - ${plan.label}\n\n> Sinh tự động từ \`lib/versions/current.js\`. Không sửa tay.\n\n${plan.note}\n\n`;
  s+=`- Khối chính: ${h.width} × ${h.depth} m, mặt tiền tại Y=${h.front} m. Diện tích thân nhà ${(h.width*h.depth).toFixed(2)} m² mỗi tầng, chưa cộng hiên và ban công trước. Ban công trước ${h.frontBalcony} m; tường sau nhà Y=30 m làm tường bao, bỏ tường bao riêng sau nhà; giữ đoạn phía sân phơi. Không có sân sau hoặc hiên / ban công sau.\n- Cao từ sàn tầng 1 đến tầng 2: ${h.floorRise} m (giả định để dựng mô hình).\n- Tường tầng 1: ${h.floors[0].wall*1000} mm; tầng 2: ${h.floors[1].wall*1000} mm; vách ngăn 100 mm.\n- Mái tôn hai dốc ${h.roof.pitch}°, sống mái chạy dọc nhà, đầu hồi nhìn ra cổng; trần nhựa phẳng cách sàn tầng 2 ${h.ceiling} m. Không có sàn mái bê tông.\n- Thang nằm ngang nhà 3 × 2 m, vế 0,95 m; minh họa 18 nấc cao ${(h.floorRise/18).toFixed(2)} m, 8 mặt bậc 0,25 m mỗi vế và chiếu nghỉ 1 m.\n\n`;
  s+=`Hiên trước ngang ${h.width} m, sâu ${h.frontPorch} m, cùng cốt sàn nhà +${h.base} m. Hai bậc dưới sâu 0,3 m mỗi bậc, chạy hết ngang lô chính; tổng phần hiên và bậc đua ra ${(h.frontPorch+.6).toFixed(2)} m. Hai cây trước cửa đứng trên hiên, giữ thoáng lối giữa.\n\n`;
  for(const [i,f] of h.floors.entries()){s+=`## Tầng ${i+1}\n\n| Phòng | Lọt lòng ngang × sâu (m) | Diện tích (m²) |\n|---|---:|---:|\n`;for(const r of f.rooms)s+=`| ${r.name} | ${r.w.toFixed(2)} × ${r.d.toFixed(2)} | ${(r.w*r.d).toFixed(2)} |\n`;s+='\n';}
  s+='## Mã và bảng chú thích nội thất\n\nSố đo là kích thước bao ngoài dài × rộng/sâu × cao, đơn vị mét; đã tính khung giường, không chỉ đệm. Chiều cao giường là đỉnh đầu giường; mặt đệm ở khoảng 0,50 m. Vùng tắm chỉ dựng bệ sàn thấp, chưa dựng vách kính. Mã của từng món cố định trên bản vẽ 2D và bảng dưới; mô hình 3D không hiện nhãn. Đây là kích thước bố trí tham khảo, cần đối chiếu mẫu sản phẩm khi mua.\n\n';
  for(let i=0;i<h.floors.length;i++){
    s+=`### Nội thất tầng ${i+1}\n\n| Mã | Đồ vật | Phòng | Dài × rộng/sâu × cao (m) | X / Y từ mặt tiền nhà (m) | Vị trí và khoảng sử dụng |\n|---|---|---|---|---|---|\n`;
    for(const item of furnitureOf(plan,i))s+=`| ${item.id} | ${item.name} | ${item.room} | ${[item.length,item.depth,item.height].map(v=>v.toFixed(2)).join(' × ')} | ${item.x.toFixed(2)} / ${item.y.toFixed(2)} | ${item.note} |\n`;
    s+='\n';
  }
  s+='Kích thước sản phẩm làm mốc tham khảo: '+FURNITURE_SOURCES.map(r=>`[${r.name}](${r.url})`).join('; ')+'.\n\n';
  s+='## Cửa chính và cửa ra ban công / hiên\n\nKhung nhôm ghi đậm, kính. Chỉ cửa chính có 4 cánh: hai cánh ngoài cố định, hai cánh giữa trượt về hai bên để mở giữa. Cửa phòng ngủ ra ban công / hiên có 2 cánh trên hai ray, trượt chồng sang trái hoặc phải; mô hình mặc định chồng sang trái. Lối đi rộng bằng nửa bề ngang bộ cửa. Ray sát sàn, không xây bệ cửa sổ. Cửa WC cả hai tầng là cửa quay một cánh mở vào trong WC.\n\n| Tầng | Cửa | Số cánh | Rộng × cao (m) | Cao bệ từ sàn (m) | Lối đi (m) |\n|---|---|---:|---:|---:|---:|\n';
  for(let i=0;i<2;i++)for(const o of houseFloor(plan,i).openings.filter(o=>o.type==='door'&&['entry','rear'].some(id=>o.id.endsWith(`-${id}`))))s+=`| ${i+1} | ${o.name} | ${o.panels} | ${(o.b-o.a).toFixed(2)} × ${o.head.toFixed(2)} | ${o.sill.toFixed(2)} | ${((o.b-o.a)/2).toFixed(2)} |\n`;
  s+=`\nTham khảo dáng cửa: [cửa đi nhôm kính lùa 4 cánh](${h.doorDesign.reference}). Đây là chọn hình thức cho mô hình, chưa chỉ định hệ nhôm / phụ kiện để đặt mua.\n\n`;
  s+=`## Cửa sổ phòng ngủ và ban công sau\n\n${h.bedroomSideWindows===false?'Cả ba phòng ngủ bỏ cửa sổ bên hông hướng lô B, master giữ cửa đi ra ban công trước; hai phòng ngủ sau dùng cửa sổ lùa có bệ. Cửa sổ khách, bếp, làm việc, thờ và WC theo vị trí phòng mới.':''}\n\n`;
  if(h.stair.groundFloorWindow===false)s+='Bỏ cửa sổ cầu thang tầng 1, xây kín ô cũ; giữ cửa sổ cầu thang tầng 2.\n\n';
  if(h.rearBalcony>0) s+='Giữ hiên / ban công sau.\n\n';
  else s+='Bỏ toàn bộ hiên / ban công sau, tường bên, lan can và tam cấp sau. Hai tầng mở cửa sổ lùa rộng 2 m, cao 1,3 m, bệ cao 0,9 m; không có cửa đi phía sau.\n\n';
  if(h.rearSteps){const r=h.rearSteps;s+=`Tam cấp bên hiên sau tầng 1 rộng ${r.width.toFixed(2)} m, mặt bậc sâu ${r.tread.toFixed(2)} m, ${r.risers} nấc cao ${(h.base/r.risers).toFixed(2)} m tính cả mặt hiên; hai mặt bậc thấp đua ${(r.tread*(r.risers-1)).toFixed(2)} m sang sân lô phụ. Chậu CC4 chuyển sang sân phơi để thông lối xuống.\n\n`;}
  s+='## Giới hạn của bản dựng\n\nMô hình công năng, chưa có tính móng/cột/dầm/kèo, chống thấm và tải trọng. Tường 100 mm không tự chứng minh kết cấu nâng tầng phù hợp. Chưa chốt chi tiết đèn và đường ống; WC đã xếp thẳng tầng.\n';
  const errors=validateHouse(plan);s+=`\n## Kiểm tra\n\n${errors.length?errors.map(e=>`- ${e.msg}`).join('\n'):'Các kiểm tra hai tầng, ô cửa, lỗ thang, vật liệu mái và bề dày tường đều đạt.'}\n`;return s;
}
