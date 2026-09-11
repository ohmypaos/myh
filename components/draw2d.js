/* Mã vẽ SVG chuyển nguyên văn từ bản vẽ HTML một-file trước đây — cố ý KHÔNG viết lại theo lối React.
   Nó đã qua bộ kiểm tra và hàng chục vòng chỉnh tay; bọc lại rẻ và an toàn hơn viết lại.
   React chỉ dựng khung DOM rỗng rồi gọi init() một lần sau khi mount. */
import { LOT } from '../lib/lot.js';
import { PLANS } from '../lib/versions/index.js';
import { clearOf, sumClear, CHECKS, validate } from '../lib/plan.js';
import { compassName } from '../lib/sun.js';
import { MIN_CLEAR, FURNITURE, SWITCH } from '../lib/lot.js';
import { toGrid, movableLines } from '../lib/grid.js';
import { applyConfig, readConfig, writeConfig, emptyConfig, frontAzimuth } from '../lib/config.js';
import { mountSavedConfigs } from './savedConfigs.js';
import { stepsOf, overhangsOf, roofPanels, gutters, downpipes, postsOf, beamsOf, purlinsOf,
         stairsOf, tumOf, roofRailingsOf, tanksOf, racksOf, gateRoofsOf, gateDoorsOf, lightsOf, lightingOf, switchesOf,
         plantersOf, flowerBedsOf, treesOf } from '../lib/envelope.js';
import { mountSwitchBoard } from './switchBoard.js';

export function init(){
  /* Dọn sạch trước khi dựng: trong dev, React StrictMode gọi effect hai lần, nếu không
     dọn thì SVG và dropdown bị dựng chồng lên nhau. */
  document.getElementById('plan').replaceChildren();
  document.getElementById('ver').replaceChildren();

  /* ═══════════ TRẠNG THÁI ═══════════ */
  let V, ROOMS, WALLS, DOORS, WINDOWS, SKYLIGHTS, FURN, GATES, STRIPS, DIMS;
  let ROT = 0;
  let LABELMODE = 'tim';        // 'tim' = tim tường (mặc định) · 'sd' = sử dụng, đã trừ tường

  /* ═══════════ NỀN SVG ═══════════ */
  const M = v => v*100;                          // 1 m = 100 đơn vị (=1cm @1:100)
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('plan');
  const PAD = {l:265, r:265, t:225, b:415};
  const BOX = {x:-PAD.l, y:-PAD.t, w:M(LOT.w)+PAD.l+PAD.r, h:M(LOT.d)+PAD.t+PAD.b};
  const BCX = BOX.x + BOX.w/2, BCY = BOX.y + BOX.h/2;

  const scene = document.createElementNS(NS,'g');
  svg.appendChild(scene);

  const el = (n,a={},p)=>{const e=document.createElementNS(NS,n);
    for(const k in a){ if(a[k]==null) continue; e.setAttribute(k.replace(/_/g,'-'),a[k]); }
    (p||scene).appendChild(e); return e;};
  const g = (a={})=>el('g',a);

  const defs = el('defs');
  defs.innerHTML = `
  <pattern id="pYard" width="14" height="14" patternUnits="userSpaceOnUse">
    <rect width="14" height="14" fill="#f4f2ec"/><circle cx="7" cy="7" r="1.1" fill="#cfcabb"/></pattern>
  <pattern id="pWet" width="20" height="20" patternUnits="userSpaceOnUse">
    <rect width="20" height="20" fill="#eef3f5"/>
    <path d="M0 0h20M0 0v20" stroke="#c3d3da" stroke-width="1.1"/></pattern>
  <pattern id="pCirc" width="26" height="26" patternUnits="userSpaceOnUse">
    <rect width="26" height="26" fill="#f8f5ec"/>
    <path d="M0 26L26 0" stroke="#e2d9c2" stroke-width="1.2"/></pattern>`;

  const FILL = {yard:'url(#pYard)', wet:'url(#pWet)', circ:'url(#pCirc)', storage:'#fbf8f0', room:'#ffffff'};
  const DC = '#8a1c1c';


  // các lớp vẽ — tạo lại mỗi lần đổi phiên bản
  let gRoom,gStep,gWall,gHole,gSky,gF,gLight,gW,gD,gDim,gL,gT,TB;

  /* ═══════════ CÁC LỚP VẼ ═══════════ */

  function drawRooms(){
    for(const [id,name,x,y,w,h,type] of ROOMS)
      el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),
        fill:FILL[type],stroke:'#d5d1c6',stroke_width:1},gRoom);
  }

  function drawWalls(){
    for(const [ax,pos,a,b,t,material] of WALLS){
      const o = M(t)/2;
      const r = ax==='h' ? {x:M(a)-o, y:M(pos)-o, width:M(b-a)+2*o, height:M(t)}
                         : {x:M(pos)-o, y:M(a)-o, width:M(t), height:M(b-a)+2*o};
      el('rect',{...r, fill:material==='plastic'?'#778083':material==='low'?'#9c968a':'#141414'},gWall);
    }
    // khoét lỗ cửa, cửa sổ, cổng
    const hole = (ax,pos,a,b,t=0.24)=>{
      const o=M(t)/2;
      const r = ax==='h' ? {x:M(a), y:M(pos)-o, width:M(b-a), height:M(t)}
                         : {x:M(pos)-o, y:M(a), width:M(t), height:M(b-a)};
      el('rect',{...r, fill:'#fdfdfb'},gHole);
    };
    for(const d of DOORS)   hole(d[1],d[2],d[3],d[4]);
    for(const w of WINDOWS) hole(w[1],w[2],w[3],w[4]);
    for(const [ax,pos,a,b] of GATES) hole(ax,pos,a,b);
    const gateRoofs = gateRoofsOf(V);
    const gateDoors = gateDoorsOf(V);
    for(const [i,[ax,pos,a,b,nm]] of GATES.entries()){
      const roof = gateRoofs.find(r=>r.gate===i && !r.error);
      const gateDoor = gateDoors.find(d=>d.gate===i && !d.error);
      if(roof){
        const {x,z,w,d} = roof.rect;
        /* Mái nằm trên đầu nên vẽ mờ, sống mái là nét giữa. Hai ô vuông là hai trụ xây
           thay phần rào sát mép cổng; khoảng giữa vẫn là bề rộng thông xe đã ghi. */
        el('rect',{x:M(x),y:M(z),width:M(w),height:M(d),fill:'#b85c47',fill_opacity:.20,
          stroke:'#9e4f3d',stroke_width:1.8,stroke_dasharray:'10 6'},gHole);
        if(ax==='h') el('line',{x1:M(x),y1:M(pos),x2:M(x+w),y2:M(pos),stroke:'#9e4f3d',stroke_width:2.2},gHole);
        else el('line',{x1:M(pos),y1:M(z),x2:M(pos),y2:M(z+d),stroke:'#9e4f3d',stroke_width:2.2},gHole);
        for(const p of roof.pillars)
          el('rect',{x:M(p.x),y:M(p.z),width:M(roof.pillar),height:M(roof.pillar),fill:'#d9d3c4',stroke:'#141414',stroke_width:1.5},gHole);
      }
      /* Cổng hai cánh đang mở vào sân: hai nét đậm là khung cánh, các nét nhỏ là nan sắt. */
      if(gateDoor){
        const L=(b-a)/2, F=gateDoor.frame, ends=ax==='h'
          ? [[a,pos,a,pos+L],[b,pos,b,pos+L]] : [[pos,a,pos+L,a],[pos,b,pos+L,b]];
        for(const [x1,y1,x2,y2] of ends){
          el('line',{x1:M(x1),y1:M(y1),x2:M(x2),y2:M(y2),stroke:'#30363a',stroke_width:5},gHole);
          const N=Math.max(2,Math.ceil(L/gateDoor.slatPitch));
          for(let k=1;k<N;k++){
            const t=k/N, dx=(x2-x1)*t, dy=(y2-y1)*t;
            const nx=Math.sign(y2-y1)*F, ny=-Math.sign(x2-x1)*F;
            el('line',{x1:M(x1+dx-nx),y1:M(y1+dy-ny),x2:M(x1+dx+nx),y2:M(y1+dy+ny),stroke:'#30363a',stroke_width:1.4},gHole);
          }
        }
      }
      el('line',{x1:M(a),y1:M(pos),x2:M(b),y2:M(pos),
        stroke:'#999',stroke_width:2.5,stroke_dasharray:'12 8'},gHole);
      const t=el('text',{x:M((a+b)/2),y:M(pos)-(roof ? M(roof.run)+16 : 16),font_size:19,text_anchor:'middle',
        fill:'#444',font_family:'ui-sans-serif,system-ui,sans-serif',font_weight:600},gHole);
      t.textContent=nm;
    }
    // ranh lô chính / lô phụ ở phần sân
    for(const [a,b] of STRIPS)
      el('line',{x1:M(5),y1:M(a),x2:M(5),y2:M(b),stroke:'#a9a394',stroke_width:2,
        stroke_dasharray:'18 8 4 8'},gHole);
  }

  function drawSkylights(){
    for(const [id,name,x,y,w,h] of SKYLIGHTS){
      el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),rx:4,
        fill:'#dceaf2',fill_opacity:.5,stroke:'#3f88ad',stroke_width:2,
        stroke_dasharray:'13 9'},gSky);
      el('path',{d:`M${M(x)} ${M(y+h)}L${M(x+w)} ${M(y)}`,stroke:'#8fb9cd',
        stroke_width:1.4,fill:'none'},gSky);
    }
  }

  /* Bậc tam cấp — vị trí suy từ cửa (lib/envelope.js), bắt đầu từ mặt tường. Vạch ngang là mép
     từng bậc. */
  function drawSteps(){
    for(const s of stepsOf(V)){
      if(s.error) continue;
      const {x,y,w,h} = s.rect;
      el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),fill:'#ebe6d8',
        stroke:'#8d8778',stroke_width:1.4},gStep);
      for(let k=1;k<s.count;k++){
        const t = s.face + s.dir*k*s.tread;
        const d = s.ax==='h' ? {x1:M(s.a),y1:M(t),x2:M(s.b),y2:M(t)}
                             : {x1:M(t),y1:M(s.a),x2:M(t),y2:M(s.b)};
        el('line',{...d,stroke:'#8d8778',stroke_width:1.2},gStep);
      }
    }
  }

  /* Cầu thang — mặt bậc và chiếu nghỉ (lib/envelope.js), đường đi lên vẽ từ chân vế 1 qua chiếu nghỉ tới đầu vế 2,
     mũi tên ở đầu trên kèm chữ LÊN. Nét đứt dọc mép vế 2 giáp phòng khách là lan can trên bức lửng. */
  function drawStairs(){
    const S = {stroke:'#8d8778', stroke_width:1.4};
    for(const s of stairsOf(V)){
      if(s.error) continue;
      const g = s.landing;
      el('rect',{x:M(g.x),y:M(g.y),width:M(g.w),height:M(g.h),fill:'#ebe6d8',...S},gStep);
      for(const t of s.treads)
        el('rect',{x:M(t.x),y:M(t.y),width:M(t.w),height:M(t.h),fill:'#f3efe4',...S},gStep);
      const c1 = s.hole.y + s.hole.h - s.width/2, c2 = s.hole.y + s.width/2, xl = g.x + s.width/2;
      const x0 = s.start1 - 0.1, x1 = s.hole.x + s.hole.w - 0.15;
      el('path',{d:`M${M(x0)} ${M(c1)}L${M(xl)} ${M(c1)}L${M(xl)} ${M(c2)}L${M(x1)} ${M(c2)}`,
        stroke:'#5d5a52',stroke_width:2,fill:'none'},gStep);
      el('path',{d:`M${M(x1)} ${M(c2)}l-16 -9M${M(x1)} ${M(c2)}l-16 9`,stroke:'#5d5a52',stroke_width:2,fill:'none'},gStep);
      el('circle',{cx:M(x0),cy:M(c1),r:5,fill:'#5d5a52'},gStep);
      const t=el('text',{x:M(x0)-8,y:M(c1)+6,font_size:15,text_anchor:'end',fill:'#5d5a52',
        font_family:'ui-sans-serif,system-ui,sans-serif',font_weight:600},gStep);
      t.textContent='LÊN';
      el('line',{x1:M(g.x),y1:M(s.hole.y)+3,x2:M(s.hole.x+s.hole.w),y2:M(s.hole.y)+3,
        stroke:'#4f4c46',stroke_width:2,stroke_dasharray:'6 5'},gStep);
      /* Tay vịn hai bên khe giữa hai vế: mép trong vế 2 chạy hết vế, mép trong vế 1 dừng ở chân thang. */
      const gap = s.hole.y + s.width, inner1 = s.hole.y + s.hole.h - s.width;
      if(inner1 > gap + 1e-6){
        const R = {stroke:'#4f4c46',stroke_width:2,stroke_dasharray:'6 5'};
        el('line',{x1:M(g.x+g.w),y1:M(gap)-3,x2:M(s.hole.x+s.hole.w),y2:M(gap)-3,...R},gStep);
        el('line',{x1:M(g.x+g.w),y1:M(inner1)+3,x2:M(s.start1),y2:M(inner1)+3,...R},gStep);
        el('line',{x1:M(g.x+g.w),y1:M(gap)-3,x2:M(g.x+g.w),y2:M(inner1)+3,...R},gStep);
      }
    }
  }

  /* Tum và lan can mái — nằm trên mái nên vẽ nét chấm như mái nhẹ. Lan can mái là nét chấm màu đất chạy dọc tim
     tường bao, cho khỏi lẫn với tường đen bên dưới. */
  function drawTum(){
    const t = tumOf(V);
    if(t){
      el('rect',{x:M(t.x0),y:M(t.y0),width:M(t.x1-t.x0),height:M(t.y1-t.y0),fill:'none',
        stroke:'#6f6a5e',stroke_width:2.2,stroke_dasharray:'14 6 3 6'},gSky);
      /* Mép mái tum đua ra — nét chấm mảnh bao ngoài; ô văng trên cửa — viền chấm như mái hiên. */
      el('rect',{x:M(t.roof.x0),y:M(t.roof.y0),width:M(t.roof.x1-t.roof.x0),height:M(t.roof.y1-t.roof.y0),fill:'none',
        stroke:'#8d8778',stroke_width:1.4,stroke_dasharray:'3 5'},gSky);
      for(const c of t.canopies)
        el('rect',{x:M(c.rect.x),y:M(c.rect.y),width:M(c.rect.w),height:M(c.rect.h),fill:'none',
          stroke:'#6f6a5e',stroke_width:2,stroke_dasharray:'3 7'},gSky);
      for(const d of t.doors){
        const ln = d.ax==='h' ? {x1:M(d.a),y1:M(d.pos),x2:M(d.b),y2:M(d.pos)} : {x1:M(d.pos),y1:M(d.a),x2:M(d.pos),y2:M(d.b)};
        el('line',{...ln,stroke:'#fdfdfb',stroke_width:5},gSky);
        /* Cánh mở ra ngoài tum: nét cánh từ bản lề, cung quét tới đầu kia lỗ. */
        const r = d.b-d.a, hu = d.hinge==='a' ? d.a : d.b, fu = d.hinge==='a' ? d.b : d.a;
        const P = (u,n) => d.ax==='h' ? [M(u),M(n)] : [M(n),M(u)];
        const [hx,hy]=P(hu,d.pos), [ex,ey]=P(hu,d.pos+d.open*r), [sx,sy]=P(fu,d.pos);
        el('line',{x1:hx,y1:hy,x2:ex,y2:ey,stroke:'#6f6a5e',stroke_width:2},gSky);
        const cw = (ex-hx)*(sy-hy)-(ey-hy)*(sx-hx) > 0 ? 0 : 1;
        el('path',{d:`M${sx} ${sy}A${M(r)} ${M(r)} 0 0 ${cw} ${ex} ${ey}`,stroke:'#6f6a5e',stroke_width:1.2,
          stroke_dasharray:'5 4',fill:'none'},gSky);
      }
      const tx=el('text',{x:M(t.x1)-10,y:M(t.y1)-10,font_size:15,text_anchor:'end',fill:'#6f6a5e',
        font_family:'ui-sans-serif,system-ui,sans-serif',font_weight:600},gSky);
      tx.textContent='TUM XÂY (trên mái)';
    }
    /* Bồn nước trên mái — nét chấm như mọi thứ nằm trên đầu, kèm mã và dung tích. */
    for(const t of tanksOf(V)){
      if(t.errors.length) continue;
      el('rect',{x:M(t.x),y:M(t.y),width:M(t.w),height:M(t.h),rx:M(Math.min(t.w,t.h)/2),
        fill:'none',stroke:'#7d8582',stroke_width:2,stroke_dasharray:'2 4'},gSky);
      const tt=el('text',{x:M(t.x+t.w/2),y:M(t.y+t.h/2)+5,font_size:13,text_anchor:'middle',fill:'#7d8582',
        font_family:'ui-sans-serif,system-ui,sans-serif',font_weight:600},gSky);
      tt.textContent=`${t.id} ${t.volume}L`;
    }
    for(const r of roofRailingsOf(V)){
      if(r.error) continue;
      const d = r.ax==='h' ? {x1:M(r.a),y1:M(r.pos),x2:M(r.b),y2:M(r.pos)} : {x1:M(r.pos),y1:M(r.a),x2:M(r.pos),y2:M(r.b)};
      el('line',{...d,stroke:'#c89b3c',stroke_width:3,stroke_dasharray:'3 6'},gSky);
    }
  }

  /* Giàn phơi — mặt cắt tam giác ngược nên trên mặt bằng thấy **hai thanh phơi** lệch hai bên tuyến, hai
     trụ nằm giữa. Nằm trong tầm mắt nên nét liền, không phải nét chấm như đồ trên cao. */
  function drawRacks(){
    for(const r of racksOf(V)){
      if(r.errors.length) continue;
      for(const q of r.bars){
        const [x0,y0,x1,y1] = r.ax==='h'
          ? [q.x, q.y+q.h/2, q.x+q.w, q.y+q.h/2] : [q.x+q.w/2, q.y, q.x+q.w/2, q.y+q.h];
        el('line',{x1:M(x0),y1:M(y0),x2:M(x1),y2:M(y1),stroke:'#7d8582',stroke_width:1.6},gF);
      }
      /* Tay chìa: nét mảnh nối tim trụ ra hai thanh, cho thấy hai thanh treo trên cùng một giàn. */
      for(const p of r.posts){
        const cx=p.x+p.w/2, cy=p.y+p.h/2;
        const [ax0,ay0,ax1,ay1] = r.ax==='h'
          ? [cx, cy-r.spread, cx, cy+r.spread] : [cx-r.spread, cy, cx+r.spread, cy];
        el('line',{x1:M(ax0),y1:M(ay0),x2:M(ax1),y2:M(ay1),stroke:'#7d8582',stroke_width:1},gF);
        el('rect',{x:M(p.x),y:M(p.y),width:M(p.w),height:M(p.h),fill:'#6a716e'},gF);
      }
      /* Nhãn về phía toạ độ nhỏ: giàn hay áp sát một bức tường, đặt phía kia là chữ rơi lên tường. */
      const mid = (r.a+r.b)/2;
      const [tx,ty] = r.ax==='h' ? [mid, r.pos-r.spread] : [r.pos-r.spread, mid];
      const t=el('text',{x:M(tx)-(r.ax==='h'?0:8),y:M(ty)+(r.ax==='h'?-6:4),font_size:12,
        text_anchor:r.ax==='h'?'middle':'end',fill:'#7d8582',
        font_family:'ui-sans-serif,system-ui,sans-serif',font_weight:600},gF);
      t.textContent=r.id;
    }
  }

  /* Cây xanh (lib/envelope.js plantersOf, flowerBedsOf). Bồn hoa: bó vỉa màu rào xây, lòng đất nâu nhạt, khóm hoa là
     vòng xanh chấm hồng. Chậu cây: vòng chậu đất nung, tán xanh trong mờ chồm ra ngoài miệng chậu. */
  function drawGarden(){
    const sq = (q,o) => el('rect',{x:M(q.x),y:M(q.y),width:M(q.w),height:M(q.h),...o},gF);
    for(const b of flowerBedsOf(V)){
      if(b.errors.length) continue;
      sq(b.rect,{fill:'#d9d3c4',stroke:'#8d8778',stroke_width:1.2});
      sq(b.soil,{fill:'#cdbba1',stroke:'none'});
      for(const c of b.clumps)
        el('circle',{cx:M(c.x+c.w/2),cy:M(c.y+c.h/2),r:M(c.w/2),fill:'#9cc281',stroke:'#5f8f4a',stroke_width:1},gF);
      for(const c of b.blooms)
        el('circle',{cx:M(c.x+c.w/2),cy:M(c.y+c.h/2),r:M(c.w/4),fill:'#d8577e',stroke:'none'},gF);
      /* Nhãn đặt ngoài bồn phía sân, chạy dọc bồn. */
      const mid=(b.a+b.b)/2, off=b.face+b.dir*(GARDEN_LABEL+b.rect[b.ax==='h'?'h':'w']);
      const [tx,ty] = b.ax==='h' ? [mid,off] : [off,mid];
      const t=el('text',{x:M(tx),y:M(ty),font_size:12,text_anchor:'middle',dominant_baseline:'middle',fill:'#5f8f4a',stroke:'none',
        font_family:'ui-sans-serif,system-ui,sans-serif',font_weight:600,
        transform:b.ax==='v'?`rotate(-90 ${M(tx)} ${M(ty)})`:null},gF);
      t.textContent=`${b.id} · BỒN HOA`;
    }
    for(const p of plantersOf(V)){
      if(p.errors.length) continue;
      el('circle',{cx:M(p.x),cy:M(p.y),r:M(p.rect.w/2),fill:'#ecd3c4',stroke:'#a9644a',stroke_width:1.6},gF);
      el('circle',{cx:M(p.x),cy:M(p.y),r:M(p.crown.w/2),fill:'#5f8f4a',fill_opacity:.35,stroke:'#5f8f4a',stroke_width:1},gF);
    }
    /* Cây bóng mát: ô gốc vuông bó vỉa, chấm thân; tán ở trên đầu nên nét đứt, nền xanh rất nhạt — như mái hiên. */
    for(const t of treesOf(V)){
      if(t.errors.length) continue;
      sq(t.pit,{fill:'#d9d3c4',stroke:'#8d8778',stroke_width:1.2});
      sq(t.soil,{fill:'#cdbba1',stroke:'none'});
      el('circle',{cx:M(t.x),cy:M(t.y),r:M(t.crown.w/2),fill:'#5f8f4a',fill_opacity:.10,stroke:'#5f8f4a',stroke_width:1.8,
        stroke_dasharray:'14 8'},gF);
      el('circle',{cx:M(t.x),cy:M(t.y),r:M(t.trunk.w/2),fill:'#6b5440',stroke:'none'},gF);
      const tx=el('text',{x:M(t.x),y:M(t.pit.y)-8,font_size:13,text_anchor:'middle',fill:'#5f8f4a',stroke:'none',
        font_family:'ui-sans-serif,system-ui,sans-serif',font_weight:600},gF);
      tx.textContent=t.id;
    }
  }
  const GARDEN_LABEL = 0.12;

  /* Bảng công tắc (lib/envelope.js switchesOf) — ô chữ nhật mảnh áp mặt tường phía nó quay vào, kèm mã. Cụm đèn nào
     đang bật thì kẻ nét đứt từ mọi bảng có hạt của cụm ấy tới từng đèn trong cụm: bật một cụm là đọc ra ngay nó do
     công tắc nào điều khiển, hai chiều thì thấy hai bó dây. Vẽ trước đèn để ký hiệu đèn nằm trên nét dây. */
  function drawSwitches(){
    const C = '#9a6b00', sw = switchesOf(V), plates = sw.plates.filter(p=>!p.errors.length);
    const lamps = new Map(lightsOf(V).filter(l=>!l.errors.length).map(l=>[l.id,l]));
    const at = o => o.ax==='h' ? [M(o.u), M(o.face)] : [M(o.face), M(o.u)];
    for(const g of sw.groups){
      if(!board.isGroupOn(g.id)) continue;
      for(const p of plates.filter(p=>g.plates.includes(p.id))){
        const [px,py] = at(p);
        for(const id of g.lights){
          const l = lamps.get(id);
          if(!l) continue;
          const [lx,ly] = l.mount==='wall' ? at(l) : [M(l.x), M(l.y)];
          el('line',{x1:px,y1:py,x2:lx,y2:ly,stroke:'#d19a00',stroke_width:1.8,stroke_dasharray:'8 5'},gLight);
        }
      }
    }
    for(const p of plates){
      const [px,py] = at(p), w = M(SWITCH.width)+6, t = 10;
      const r = p.ax==='h' ? {x:px-w/2, y:p.dir>0?py:py-t, width:w, height:t}
                           : {x:p.dir>0?px:px-t, y:py-w/2, width:t, height:w};
      const lit = p.groups.some(id=>board.isGroupOn(id));
      el('rect',{...r, fill:lit?'#ffd54a':'#fff', stroke:C, stroke_width:1.8},gLight);
      const [tx,ty] = p.ax==='h' ? [px, py + p.dir*(p.dir>0?28:18)] : [px + p.dir*16, py+4];
      const txt = el('text',{x:tx, y:ty, font_size:11, fill:C, font_weight:700,
        text_anchor: p.ax==='h' ? 'middle' : (p.dir>0 ? 'start' : 'end'),
        font_family:'ui-sans-serif,system-ui,sans-serif'},gLight);
      txt.textContent = p.id;
    }
  }

  /* Đèn (lib/envelope.js lightsOf). Ký hiệu điện quen dùng: đèn trần là vòng tròn gạch chéo cỡ đúng thân đèn, đèn thả
     là vòng tròn có chấm giữa, đèn tường là nửa vòng tròn áp mặt tường, bụng quay về phía rọi. Đèn có cấp chống nước
     (ngoài trời, chống ẩm) tô vàng đậm. Mã đèn nhỏ cạnh ký hiệu. */
  function drawLights(){
    const C = '#9a6b00';
    for(const l of lightsOf(V)){
      if(l.errors.length) continue;
      const T = l.spec, fill = T.ip ? '#f2c14e' : '#fff6d6';
      const r = Math.max(M(T.size/2), 8);
      const mark = gLight.childNodes.length;
      let cx, cy;
      if(l.mount === 'wall'){
        [cx, cy] = l.ax==='h' ? [M(l.u), M(l.face)] : [M(l.face), M(l.u)];
        const sweep = l.dir > 0 ? 1 : 0;
        const d = l.ax==='v'
          ? `M${cx} ${cy-r}A${r} ${r} 0 0 ${sweep} ${cx} ${cy+r}Z`
          : `M${cx+r} ${cy}A${r} ${r} 0 0 ${sweep} ${cx-r} ${cy}Z`;
        el('path',{d, fill, stroke:C, stroke_width:1.8},gLight);
      } else {
        [cx, cy] = [M(l.x), M(l.y)];
        el('circle',{cx, cy, r, fill, stroke:C, stroke_width:1.8},gLight);
        if(l.mount === 'pendant') el('circle',{cx, cy, r:4, fill:C},gLight);
        else {
          const k = r*0.7;
          el('path',{d:`M${cx-k} ${cy-k}L${cx+k} ${cy+k}M${cx+k} ${cy-k}L${cx-k} ${cy+k}`, stroke:C, stroke_width:1.4},gLight);
        }
      }
      /* Đèn đang bật (bảng công tắc): quầng vàng dưới ký hiệu. */
      if(board.isLampOn(l.id))
        gLight.insertBefore(el('circle',{cx, cy, r:r+12, fill:'#ffd54a', fill_opacity:.55},gLight), gLight.childNodes[mark]);
      const t = el('text',{x:cx+r+3, y:cy-r+2, font_size:12, fill:C, font_weight:700,
        font_family:'ui-sans-serif,system-ui,sans-serif'},gLight);
      t.textContent = l.id;
    }
  }

  /* Mái hiên — nằm phía trên đầu nên chỉ vẽ viền chấm, giống cách vẽ lấy sáng mái. */
  function drawOverhangs(){
    for(const o of overhangsOf(V)){
      if(o.error) continue;
      const {x,y,w,h} = o.rect;
      el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),fill:'none',
        stroke:'#6f6a5e',stroke_width:2.4,stroke_dasharray:'3 7'},gSky);
    }
  }

  /* Mái nhẹ — nằm trên đầu nên vẽ viền chấm như mái hiên, thêm vạch nóc và mũi tên chỉ chiều
     nước chảy. Vẽ theo tấm đã dựng (lib/envelope.js) chứ không theo vùng khai: mép mái lùi vào
     hay đua ra theo tường, khác nhau tới cả gang tay. Tấm dựng bị cắt vụn theo đầu tường (mép lùi
     từng đoạn), nên gộp lại theo mái và phía nóc rồi vẽ khung bao — không thì hiện vạch cắt lạ. */
  function drawRoofs(){
    const groups = new Map();
    for(const p of roofPanels(V)){
      const k = `${p.id}:${p.part}`, q = groups.get(k);
      if(!q) groups.set(k, {...p});
      else Object.assign(q, {x0:Math.min(q.x0,p.x0), x1:Math.max(q.x1,p.x1),
                             y0:Math.min(q.y0,p.y0), y1:Math.max(q.y1,p.y1)});
    }
    /* Máng xối — dải đặc mảnh dọc mép thấp. */
    for(const gt of gutters(V)){
      const {x,y,w,h} = gt.rect;
      el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),fill:'#8d8778',fill_opacity:.5},gSky);
    }
    /* Ống xả — chấm tròn đặc ở chân máng, áp tường bao. */
    for(const pp of downpipes(V)){
      const {x,y,w,h} = pp.rect;
      el('circle',{cx:M(x+w/2),cy:M(y+h/2),r:M(Math.max(w,h)/2)+2,fill:'#5d5a52'},gSky);
    }
    /* Xà gồ — các thanh mảnh dưới tấm tôn, vuông góc chiều dốc. Vẽ trước dầm để dầm biên vẫn đọc rõ. */
    for(const p of purlinsOf(V)){
      const {x,y,w,h} = p.rect;
      el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),fill:'#73787a',fill_opacity:.7},gSky);
    }
    /* Dầm biên — dải xám mờ dưới mép mái, nằm trên đầu nên không đậm như tường. */
    for(const b of beamsOf(V)){
      const {x,y,w,h} = b.rect;
      el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),fill:'#55595a',fill_opacity:.6},gSky);
    }
    /* Cột đỡ mái — ô vuông đặc trên tim tường rào, kèm mã. Cột đứng từ sân lên nên vẽ đậm như tường. */
    for(const c of postsOf(V)){
      if(c.error) continue;
      const {x,y,w,h} = c.rect;
      el('rect',{x:M(x)-2,y:M(y)-2,width:M(w)+4,height:M(h)+4,fill:'#1a1a1a'},gSky);
      el('text',{x:M(x)-6,y:M(y+h/2)+4,text_anchor:'end',font_size:11,fill:'#1a1a1a'},gSky).textContent=c.id;
    }
    const seen = new Set();
    for(const p of groups.values()){
      const x=Math.min(p.x0,p.x1), y=Math.min(p.y0,p.y1), w=Math.abs(p.x1-p.x0), h=Math.abs(p.y1-p.y0);
      el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),fill:'none',
        stroke:'#6f6a5e',stroke_width:2,stroke_dasharray:'10 7'},gSky);
      /* Chiều dốc: mũi tên chạy từ mép cao xuống mép thấp, giữa tấm. */
      if(p.axis && Math.abs(p.yb[1]-p.yb[0])>0.001){
        const down = p.yb[1] < p.yb[0];
        const [c0,c1] = p.axis==='x' ? [p.x0,p.x1] : [p.y0,p.y1];
        const [s,e] = down ? [c0,c1] : [c1,c0];
        const mid = p.axis==='x' ? (p.y0+p.y1)/2 : (p.x0+p.x1)/2;
        const pt = t => p.axis==='x' ? [M(t),M(mid)] : [M(mid),M(t)];
        const [x1,y1]=pt(s+(e-s)*0.25), [x2,y2]=pt(s+(e-s)*0.75);
        el('line',{x1,y1,x2,y2,stroke:'#8d8778',stroke_width:2},gSky);
        const ux=(x2-x1), uy=(y2-y1), L=Math.hypot(ux,uy)||1, nx=ux/L*22, ny=uy/L*22;
        el('path',{d:`M${x2} ${y2}l${-nx-ny*0.5} ${-ny+nx*0.5}M${x2} ${y2}l${-nx+ny*0.5} ${-ny-nx*0.5}`,
          stroke:'#8d8778',stroke_width:2,fill:'none'},gSky);
      }
      if(seen.has(p.id)) continue;              // mái hai mái: nhãn một lần ở tấm đầu
      seen.add(p.id);
      /* Mái hẹp (hành lang ngoài, 1 m) không chứa nổi nhãn nằm ngang — dựng đứng dọc mái. */
      const narrow = w < 1.6;
      const [tx,ty] = narrow ? [M(x+w)-14, M(y+h/2)] : [M(x+w/2), M(y)+26];
      const t=el('text',{x:tx,y:ty,font_size:18,text_anchor:'middle',fill:'#6f6a5e',
        transform:narrow?`rotate(-90 ${tx} ${ty})`:null,
        font_family:'ui-sans-serif,system-ui,sans-serif',font_weight:600},gSky);
      t.textContent=p.name;
    }
  }

  function drawFurniture(){
    const fr=(x,y,w,h,o={})=>el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),rx:3,...o},gF);
    for(const [k,x,y,w,h] of FURN){
      if(k==='sofa'||k==='cab'||k==='tbl'||k==='altar'||k==='shrine'||k==='wash'||k==='washRaised'||k==='dishwasher'){
        if(k==='washRaised'){                      // bệ sân nâng dưới máy
          const p=FURNITURE.washPlinth.pad;
          fr(x-p,y-p,w+2*p,h+2*p,{fill:FILL.yard,stroke:'#a6a096'});
        }
        fr(x,y,w,h, k==='altar'||k==='shrine'?{fill:'#f0e6d2'}:k==='washRaised'?{fill:'#d8e7eb'}:{});
        if(k==='shrine'){                          // vách ngăn cao tới trần phía kệ tivi
          el('line',{x1:M(x+w),y1:M(y),x2:M(x+w),y2:M(y+h),stroke:'#5c5c5c',stroke_width:5},gF);
          const t=el('text',{x:M(x+w/2),y:M(y+h/2)+5,font_size:13,text_anchor:'middle',fill:'#6f6a5e',stroke:'none',
            font_family:'ui-sans-serif,system-ui,sans-serif'},gF);
          t.textContent='THỜ';
        }
        if(k==='cab') for(let i=1;i<3;i++)
          el('line',{x1:M(x),y1:M(y+h*i/3),x2:M(x+w),y2:M(y+h*i/3),stroke:'#b9b9b9'},gF);
        if(k==='wash'||k==='washRaised'||k==='dishwasher')
          el('circle',{cx:M(x+w/2),cy:M(y+h/2),r:M(Math.min(w,h)*0.28),fill:'#f7f7f5'},gF);
      } else if(k==='tvShelf'){                    // kệ tivi thấp hai tầng
        fr(x,y,w,h);
        const horiz=w>=h;
        if(horiz) el('line',{x1:M(x),y1:M(y+h/2),x2:M(x+w),y2:M(y+h/2),stroke:'#b9b9b9'},gF);
        else      el('line',{x1:M(x+w/2),y1:M(y),x2:M(x+w/2),y2:M(y+h),stroke:'#b9b9b9'},gF);
        const t=el('text',{x:M(x+w/2),y:M(y+h/2)+5,font_size:13,text_anchor:'middle',fill:'#6f6a5e',stroke:'none',
          font_family:'ui-sans-serif,system-ui,sans-serif'},gF);
        t.textContent='KỆ TV';
      } else if(k==='tap') {
        const horiz=w>h, cx=M(x+w/2), cy=M(y+h/2);
        if(horiz){
          el('line',{x1:M(x),y1:cy,x2:M(x+w),y2:cy,stroke:'#5d5a52',stroke_width:2},gF);
          el('line',{x1:M(x+w),y1:cy-M(h*.65),x2:M(x+w),y2:cy+M(h*.65),stroke:'#5d5a52',stroke_width:2},gF);
        } else {
          el('line',{x1:cx,y1:M(y),x2:cx,y2:M(y+h),stroke:'#5d5a52',stroke_width:2},gF);
          el('line',{x1:cx-M(w*.65),y1:M(y+h),x2:cx+M(w*.65),y2:M(y+h),stroke:'#5d5a52',stroke_width:2},gF);
        }
      } else if(k==='bed'){                        // đầu giường ở cạnh trên
        fr(x,y,w,h);
        el('rect',{x:M(x+.05),y:M(y+.05),width:M(w-.1),height:M(h*0.28),rx:4,fill:'#eceff2'},gF);
        el('line',{x1:M(x),y1:M(y+h*0.33),x2:M(x+w),y2:M(y+h*0.33)},gF);
      } else if(k==='bedw'){                       // đầu giường ở cạnh trái
        fr(x,y,w,h);
        el('rect',{x:M(x+.05),y:M(y+.05),width:M(w*0.28),height:M(h-.1),rx:4,fill:'#eceff2'},gF);
        el('line',{x1:M(x+w*0.33),y1:M(y),x2:M(x+w*0.33),y2:M(y+h)},gF);
      } else if(k==='wc'){
        el('rect',{x:M(x),y:M(y),width:M(w),height:M(h*0.34),rx:3},gF);
        el('ellipse',{cx:M(x+w/2),cy:M(y+h*0.68),rx:M(w/2),ry:M(h*0.33)},gF);
      } else if(k==='lav'){
        fr(x,y,w,h); el('circle',{cx:M(x+w/2),cy:M(y+h/2),r:M(Math.min(w,h)*0.32)},gF);
      } else if(k==='shower'){
        fr(x,y,w,h,{fill:'#e4edf1'});
        el('circle',{cx:M(x+w*0.75),cy:M(y+h*0.25),r:8},gF);
        el('path',{d:`M${M(x)} ${M(y+h)}L${M(x+w)} ${M(y)}`,stroke:'#a9c3cf',fill:'none'},gF);
      } else if(k==='kit'||k==='kitsink'||k==='kithob'){  // kệ bếp: tự xoay theo chiều dài
        fr(x,y,w,h,{fill:'#f2f2ef'});
        const horiz = w >= h, Ln = horiz ? w : h;
        const at = t => horiz ? [x+t, y+h/2] : [x+w/2, y+t];
        if(k!=='kitsink') for(const t of [Ln*0.20, Ln*0.36]){   // bếp nấu
          const [cx,cy] = at(t);
          el('circle',{cx:M(cx),cy:M(cy),r:M(0.20)},gF);
        }
        if(k!=='kithob'){                                       // chậu rửa
          const sc = Ln*0.72, sl = Math.min(1.0, Ln*0.28);
          if(horiz) el('rect',{x:M(x+sc-sl/2),y:M(y+.08),width:M(sl),height:M(h-.16),rx:4},gF);
          else      el('rect',{x:M(x+.08),y:M(y+sc-sl/2),width:M(w-.16),height:M(sl),rx:4},gF);
        }
      } else if(k==='desk'){                       // bàn làm việc áp tường phải
        fr(x, y, w, h, {fill:'#f6f4ee'});
        el('line',{x1:M(x+.15),y1:M(y),x2:M(x+.15),y2:M(y+h),stroke:'#cfcfcf'},gF);
      } else if(k==='chair'){                      // ghế làm việc rời, tựa quay về phía bàn
        fr(x, y, w, h, {fill:'#e7e4dc'});
        el('line',{x1:M(x+.07),y1:M(y),x2:M(x+.07),y2:M(y+h),stroke:'#aaa69d',stroke_width:2},gF);
      } else if(k==='dine'){
        fr(x,y,w,h);
        for(let i=0;i<3;i++){ fr(x-0.42,y+0.25+i*0.7,0.36,0.45); fr(x+w+0.06,y+0.25+i*0.7,0.36,0.45); }
      } else if(k==='round'){
        el('circle',{cx:M(x+w/2),cy:M(y+h/2),r:M(w/2)},gF);
        for(let i=0;i<4;i++){const a=i*Math.PI/2+0.78;
          el('circle',{cx:M(x+w/2+Math.cos(a)*1.05),cy:M(y+h/2+Math.sin(a)*1.05),r:M(0.24)},gF);}
      } else if(k==='car'){
        el('rect',{x:M(x),y:M(y),width:M(w),height:M(h),rx:M(0.55),fill:'#eef0f2',stroke:'#8d949b'},gF);
        el('rect',{x:M(x+.16),y:M(y+.75),width:M(w-.32),height:M(1.35),rx:M(0.22),fill:'#cfd6dc',stroke:'#8d949b'},gF);
        el('rect',{x:M(x+.16),y:M(y+2.6),width:M(w-.32),height:M(1.2),rx:M(0.2),fill:'#cfd6dc',stroke:'#8d949b'},gF);
      }
    }
  }

  function drawWindows(){
    for(const [id,ax,pos,a,b,flag] of WINDOWS){
      const c = flag==='warn' ? '#c0392b' : (flag==='new' ? '#0a6b3d' : '#1a1a1a');
      const t=0.24, o=M(t)/2;
      if(ax==='h'){
        el('rect',{x:M(a),y:M(pos)-o,width:M(b-a),height:M(t),fill:'#fff',stroke:c,stroke_width:2},gW);
        el('line',{x1:M(a),y1:M(pos),x2:M(b),y2:M(pos),stroke:c,stroke_width:2},gW);
      } else {
        el('rect',{x:M(pos)-o,y:M(a),width:M(t),height:M(b-a),fill:'#fff',stroke:c,stroke_width:2},gW);
        el('line',{x1:M(pos),y1:M(a),x2:M(pos),y2:M(b),stroke:c,stroke_width:2},gW);
      }
    }
  }

  function drawDoors(){
    for(const [id,ax,pos,a,b,kind,hinge,open,flag] of DOORS){
      const col = flag==='new' ? '#0a6b3d' : '#1a1a1a';
      const L = b-a;
      if(kind==='open'){                                 // ô mở thông
        const d = ax==='h' ? [[a,pos],[b,pos]] : [[pos,a],[pos,b]];
        el('line',{x1:M(d[0][0]),y1:M(d[0][1]),x2:M(d[1][0]),y2:M(d[1][1]),
          stroke:'#999',stroke_width:2,stroke_dasharray:'10 7'},gD);
        continue;
      }
      if(kind==='quad'){                                 // cửa 4 cánh
        const q = L/4;
        if(ax==='h'){
          el('rect',{x:M(a),y:M(pos)-3,width:M(L),height:6,fill:col},gD);
          for(let i=1;i<4;i++) el('line',{x1:M(a+q*i),y1:M(pos)-9,x2:M(a+q*i),y2:M(pos)+9,
            stroke:col,stroke_width:2},gD);
        } else {
          el('rect',{x:M(pos)-3,y:M(a),width:6,height:M(L),fill:col},gD);
          for(let i=1;i<4;i++) el('line',{x1:M(pos)-9,y1:M(a+q*i),x2:M(pos)+9,y2:M(a+q*i),
            stroke:col,stroke_width:2},gD);
        }
        // hai cánh ngoài đóng (nằm trong thanh đậm), hai cánh giữa mở — bản lề ở mép trong cánh ngoài
        for(const [hv,dir] of [[a+q,1],[b-q,-1]]){
          const hx = ax==='h' ? hv : pos, hy = ax==='h' ? pos : hv;
          const px = ax==='h' ? hx : hx + open*q, py = ax==='h' ? hy + open*q : hy;
          const ox = ax==='h' ? hx + dir*q : pos,  oy = ax==='h' ? pos : hy + dir*q;
          const cr = (px-hx)*(oy-hy) - (py-hy)*(ox-hx);
          el('path',{d:`M${M(px)} ${M(py)}A${M(q)} ${M(q)} 0 0 ${cr>0?1:0} ${M(ox)} ${M(oy)}`,
            fill:'none',stroke:'#9a9a9a',stroke_width:1.6},gD);
          el('line',{x1:M(hx),y1:M(hy),x2:M(px),y2:M(py),stroke:col,stroke_width:5},gD);
        }
        continue;
      }
      if(kind==='slide1'){                               // cửa lùa 1 cánh
        const s = 0.055;
        if(ax==='h'){
          el('rect',{x:M(a),y:M(pos-s*1.6),width:M(L),height:M(s*1.5),fill:col},gD);
          el('line',{x1:M(a),y1:M(pos),x2:M(b),y2:M(pos),stroke:'#aaa',
            stroke_width:1.4,stroke_dasharray:'6 5'},gD);
        } else {
          el('rect',{x:M(pos-s*1.6),y:M(a),width:M(s*1.5),height:M(L),fill:col},gD);
          el('line',{x1:M(pos),y1:M(a),x2:M(pos),y2:M(b),stroke:'#aaa',
            stroke_width:1.4,stroke_dasharray:'6 5'},gD);
        }
        continue;
      }
      if(kind==='slide'){                                // cửa lùa
        const s = 0.055;
        if(ax==='h'){
          el('rect',{x:M(a),y:M(pos-s*1.6),width:M(L*0.52),height:M(s*1.5),fill:col},gD);
          el('rect',{x:M(a+L*0.48),y:M(pos+s*0.1),width:M(L*0.52),height:M(s*1.5),fill:col},gD);
        } else {
          el('rect',{x:M(pos-s*1.6),y:M(a),width:M(s*1.5),height:M(L*0.52),fill:col},gD);
          el('rect',{x:M(pos+s*0.1),y:M(a+L*0.48),width:M(s*1.5),height:M(L*0.52),fill:col},gD);
        }
        continue;
      }
      // cửa mở quay
      const hx = ax==='h' ? (hinge==='a'?a:b) : pos;
      const hy = ax==='h' ? pos               : (hinge==='a'?a:b);
      const ox = ax==='h' ? (hinge==='a'?b:a) : pos;
      const oy = ax==='h' ? pos               : (hinge==='a'?b:a);
      const px = ax==='h' ? hx : hx + open*L;
      const py = ax==='h' ? hy + open*L : hy;
      const v1=[px-hx,py-hy], v2=[ox-hx,oy-hy];
      const sweep = (v1[0]*v2[1]-v1[1]*v2[0]) > 0 ? 1 : 0;
      el('path',{d:`M${M(px)} ${M(py)}A${M(L)} ${M(L)} 0 0 ${sweep} ${M(ox)} ${M(oy)}`,
        fill:'none',stroke:'#9a9a9a',stroke_width:1.6},gD);
      el('line',{x1:M(hx),y1:M(hy),x2:M(px),y2:M(py),stroke:col,stroke_width:5.5},gD);
    }
  }

  /* ── đường kích thước ── */
  const F = n => n.toFixed(n%1?1:0)+' m';

  function drawDims(){
    const txt=(x,y,s,o={})=>{const t=el('text',{x,y,fill:DC,font_size:o.fs||30,
      text_anchor:'middle',font_weight:600,transform:o.tr||null,dy:o.dy||null},gDim);
      t.textContent=s; return t;};
    const tick=(x,y,ang)=>el('line',{x1:x-9,y1:y-9,x2:x+9,y2:y+9,stroke:DC,stroke_width:2.2,
      transform:`rotate(${ang} ${x} ${y})`},gDim);

    function dimH(a,b,y,label,ext){
      el('line',{x1:M(a),y1:y,x2:M(b),y2:y,stroke:DC,stroke_width:1.6},gDim);
      [a,b].forEach(v=>{
        tick(M(v),y,0);
        el('line',{x1:M(v),y1:ext,x2:M(v),y2:y+(ext<y?14:-14),stroke:DC,stroke_width:.9,
          stroke_dasharray:'6 5'},gDim);
      });
      txt((M(a)+M(b))/2, y-13, label);
    }
    function dimV(a,b,x,label,ext){
      el('line',{x1:x,y1:M(a),x2:x,y2:M(b),stroke:DC,stroke_width:1.6},gDim);
      [a,b].forEach(v=>{
        tick(x,M(v),90);
        el('line',{x1:ext,y1:M(v),x2:x+(ext<x?14:-14),y2:M(v),stroke:DC,stroke_width:.9,
          stroke_dasharray:'6 5'},gDim);
      });
      const cy=(M(a)+M(b))/2;
      txt(0,0,label,{tr:`translate(${x-13},${cy}) rotate(${ROT?90:-90})`, dy: ROT?24:null});
    }

    // ngang — trên
    dimH(0,5.0,-95,F(5.0),0); dimH(5.0,9.5,-95,F(4.5),0);
    dimH(0,9.5,-175,'9.5 m',0);
    // dọc — trái (chuỗi theo phiên bản)
    const cl = DIMS.left;
    for(let i=0;i<cl.length-1;i++) dimV(cl[i],cl[i+1],-105,F(cl[i+1]-cl[i]),0);
    dimV(0,30,-215,'30.0 m',0);
    // dọc — phải
    [[0,18],[18,25],[25,30]].forEach(([a,b])=>dimV(a,b,M(9.5)+105,F(b-a),M(9.5)));
    dimV(0,30,M(9.5)+215,'30.0 m',M(9.5));
    // ngang — dưới (chuỗi theo phiên bản)
    const cb = DIMS.bottom;
    for(let i=0;i<cb.length-1;i++) dimH(cb[i],cb[i+1],M(30)+95,F(cb[i+1]-cb[i]),M(30));
    // ngang — trong: bề rộng phòng / hành lang
    const ix = DIMS.innerX, iy = M(DIMS.innerY)-95;
    for(let i=0;i<ix.length-1;i++) dimH(ix[i],ix[i+1],iy,F(ix[i+1]-ix[i]),M(DIMS.innerY));
  }

  /* ── nhãn phòng ── */
  function drawLabels(){
    const SMALL = new Set(ROOMS.filter(r=>r[4]*r[5] < 8).map(r=>r[0]));
    for(const [id,name,x,y,w,h,type] of ROOMS){
      const cx=M(x+w/2), cy=M(y+h/2), sm=SMALL.has(id);
      const sw = ROT ? M(h) : M(w), sh = ROT ? M(w) : M(h);
      const rot = sw < 200 && sh > sw;
      // chừa 26 đơn vị mỗi chiều để chữ không chạm bề dày tường (tường bao 22 → nhô 11 vào trong)
      const avail = (rot ? sh : sw) - 26;
      const fs = sm?21:30, lh=sm?24:34;
      const ang = (ROT ? 90 : 0) + (rot ? -90 : 0);
      const gg = g({transform: ang ? `rotate(${ang} ${cx} ${cy})` : null});
      gL.appendChild(gg);

      let lines=[name];
      if(avail < name.length*fs*0.58){
        lines=[]; let cur='';
        for(const wd of name.split(' ')){
          if((cur+' '+wd).trim().length*fs*0.58 > avail && cur){lines.push(cur);cur=wd;}
          else cur=(cur+' '+wd).trim();
        }
        lines.push(cur);
      }
      const total = lines.length+2;
      const texts = [];
      lines.forEach((ln,i)=>{
        const t=el('text',{x:cx, y:cy - total*lh/2 + lh*(i+0.78), font_size:fs, font_weight:700,
          fill:'#111', letter_spacing:'0.02em'},gg); t.textContent=ln; texts.push(t);
      });
      // R4 bị WC khách chiếm một góc → trừ ra
      const r5 = ROOMS.find(r=>r[0]==='R5');
      let sub;
      if(LABELMODE === 'sd'){
        const c = clearOf(ROOMS.find(r=>r[0]===id), WALLS);
        const a = id==='R4' ? c.a - clearOf(r5, WALLS).a : c.a;
        sub = [`${c.w.toFixed(2)} × ${c.h.toFixed(2)} m`, `${a.toFixed(2)} m² sd`];
      } else {
        const a = id==='R4' ? w*h - r5[4]*r5[5] : w*h;
        sub = [`${w.toFixed(1)} × ${h.toFixed(1)} m`, `${a.toFixed(2)} m²`];
      }
      sub.forEach((s,i)=>{
        const d=el('text',{x:cx, y:cy - total*lh/2 + lh*(lines.length+i+0.78),
          font_size:fs*(i?0.8:0.85), fill:i?'#6a6a6a':'#444', font_weight:i?600:400},gg);
        d.textContent = s; texts.push(d);
      });

      // nền ôm sát chữ, đo bằng bbox thật — không lấy nguyên bề rộng phòng nữa
      let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
      for(const t of texts){
        const b = t.getBBox();
        x0=Math.min(x0,b.x); y0=Math.min(y0,b.y);
        x1=Math.max(x1,b.x+b.width); y1=Math.max(y1,b.y+b.height);
      }
      if(isFinite(x0)){
        const px=8, py=5;
        const bg = el('rect',{x:x0-px, y:y0-py, width:(x1-x0)+px*2, height:(y1-y0)+py*2,
          fill:'#fdfdfb', opacity:.86, rx:3},gg);
        gg.insertBefore(bg, gg.firstChild);
      }
    }
  }

  /* ── mã cửa / cửa sổ / lấy sáng ── */
  function drawTags(){
    const placed=[];
    for(const [,,x,y,w,h] of ROOMS) placed.push([x+w/2, y+h/2]);   // giữ chỗ cho nhãn phòng
    const clear=(x,y)=>!placed.some(([px,py])=>Math.abs(px-x)<0.52 && Math.abs(py-y)<0.46);

    const tag=(x,y,s,c)=>{
      const gg = ROT ? g({transform:`rotate(90 ${M(x)} ${M(y)})`}) : gT;
      if(ROT) gT.appendChild(gg);
      el('rect',{x:M(x)-21,y:M(y)-13,width:42,height:24,rx:4,
        fill:'#fff',stroke:c,stroke_width:1.4},gg);
      const t=el('text',{x:M(x),y:M(y)+5,fill:c,font_weight:700},gg); t.textContent=s;
      placed.push([x,y]);
    };
    const place=(ax,pos,a,b,id,c,side)=>{
      const mid=(a+b)/2, half=(b-a)/2;
      for(const off of [0.42,0.78,1.14,1.50])
        for(const sl of [0,0.45,-0.45,0.9,-0.9]){
          if(Math.abs(sl) > half + 0.5) continue;
          const x = ax==='h' ? mid + sl : pos + side*off;
          const y = ax==='h' ? pos + side*off : mid + sl;
          if(clear(x,y)){ tag(x,y,id,c); return; }
        }
      ax==='h' ? tag(mid,pos+side*0.42,id,c) : tag(pos+side*0.42,mid,id,c);
    };

    for(const [id,ax,pos,a,b,,,,flag] of DOORS)
      place(ax,pos,a,b,id, flag==='new' ? '#0a6b3d' : '#444', -1);
    for(const [id,ax,pos,a,b,flag] of WINDOWS){
      const c = flag==='warn' ? '#c0392b' : (flag==='new' ? '#0a6b3d' : '#444');
      place(ax,pos,a,b,id,c, (ax==='v' && pos===0) ? 1 : (ax==='h' ? 1 : -1));
    }
    for(const [id,,x,y,w,h] of SKYLIGHTS){
      const cx = x + w/2, cy = y + h/2;
      const cands = [[cx,y+0.8],[cx,y+h-0.8],[cx,y-0.4],[cx,y+h+0.4],
                     [x-0.45,cy],[x+w+0.45,cy],[cx,cy]];
      const p = cands.find(([px,py]) => clear(px,py)) || [cx,cy];
      tag(p[0], p[1], id, '#2f7897');
    }
  }

  /* ── khung tên, thang tỉ lệ, mũi tên mặt tiền ── */
  function drawTitleBlock(){
    const ty = M(30)+185;
    const tt=(x,y,s,fs,fw,col)=>{const t=el('text',{x,y,font_size:fs,font_weight:fw||400,
      fill:col||'#111'},TB); t.textContent=s;};
    el('rect',{x:0,y:ty,width:M(9.5),height:200,fill:'#fff',stroke:'#141414',stroke_width:2.5},TB);
    el('line',{x1:0,y1:ty+62,x2:M(9.5),y2:ty+62,stroke:'#141414',stroke_width:1.4},TB);
    el('line',{x1:M(6.4),y1:ty,x2:M(6.4),y2:ty+200,stroke:'#141414',stroke_width:1.4},TB);
    tt(16, ty+40, 'MẶT BẰNG TẦNG TRỆT', 23, 700);
    const kinRooms = ROOMS.filter(r=>r[6]!=='yard' && r[0]!=='R3');
    const sdKin   = sumClear(kinRooms, WALLS);
    const sdChinh = sumClear(kinRooms.filter(r=>r[0][0]==='L'), WALLS);
    const timChinh = kinRooms.filter(r=>r[0][0]==='L').reduce((s,r)=>s+r[4]*r[5],0);
    tt(16, ty+96, `Lô đất 285.0 m² · Sân ${V.areas.san.toFixed(1)} m²`
        + ` · Sử dụng ${sdChinh.toFixed(1)} / ${sdKin.toFixed(1)} m²`, 20);
    tt(16, ty+130, `TIM TƯỜNG — nhà chính ${timChinh.toFixed(1)} m² · toàn bộ ${V.areas.kin.toFixed(1)} m²`, 20, 700);
    tt(16, ty+164,'Toàn bộ kích thước ghi theo TIM TƯỜNG · Tường bao 220 · Tường ngăn 100', 19, 400, '#555');
    tt(M(6.4)+16, ty+40, 'TỈ LỆ 1:100', 25, 700);
    tt(M(6.4)+16, ty+96, V.date, 19, 400, '#555');
    tt(M(6.4)+16, ty+130,'Mặt tiền hướng ĐÔNG BẮC', 19, 400, '#555');
    tt(M(6.4)+16, ty+164,'Nguồn: original-drawing.png', 19, 400, '#555');

    const sy = M(30)+110;
    for(let i=0;i<5;i++)
      el('rect',{x:M(i),y:sy,width:M(1),height:15,fill:i%2?'#fff':'#141414',
        stroke:'#141414',stroke_width:1.4},TB);
    [0,1,2,3,4,5].forEach(i=>{const t=el('text',{x:M(i),y:sy+38,font_size:20,
      text_anchor:'middle',fill:'#333'},TB); t.textContent=i;});
    tt(M(5)+18, sy+14, 'mét', 20, 400, '#333');

    const ax0=M(9.5)-40, ay0=-160;
    el('path',{d:`M${ax0} ${ay0+70}L${ax0} ${ay0}M${ax0} ${ay0}l-13 22M${ax0} ${ay0}l13 22`,
      stroke:'#141414',stroke_width:2.6,fill:'none'},TB);
    const mt=el('text',{x:ax0,y:ay0+96,font_size:19,text_anchor:'middle',
      fill:'#141414',font_weight:600},TB);
    mt.textContent='MẶT TIỀN · ĐÔNG BẮC';
  }

  /* ── lớp ghi chú: vẽ lại khi xoay ── */
  function drawAnnot(){
    gDim.textContent=''; gL.textContent=''; gT.textContent='';
    drawDims(); drawLabels(); drawTags();
  }

  /* ── dựng toàn bộ bản vẽ cho phiên bản đang chọn ── */
  function buildPlan(){
    [...scene.children].forEach(c => { if(c !== defs) c.remove(); });
    gRoom = g(); gStep = g(); gWall = g(); gHole = g(); gSky = g();
    gF    = g({stroke:'#5c5c5c', stroke_width:1.6, fill:'#fff'});
    gLight = g();
    gW    = g(); gD = g();
    gDim  = g({font_family:'ui-sans-serif,system-ui,sans-serif'});
    gL    = g({font_family:'ui-sans-serif,system-ui,sans-serif',text_anchor:'middle'});
    gT    = g({font_family:'ui-monospace,SFMono-Regular,Menlo,monospace',
               font_size:17,text_anchor:'middle'});
    TB    = g({font_family:'ui-sans-serif,system-ui,sans-serif'});

    drawRooms(); drawSteps(); drawStairs(); drawWalls(); drawSkylights(); drawOverhangs(); drawRoofs(); drawTum();
    drawFurniture(); drawGarden(); drawRacks(); drawSwitches(); drawLights();
    drawWindows(); drawDoors(); drawAnnot(); drawTitleBlock();
    scene.setAttribute('transform', ROT ? `rotate(${ROT} ${BCX} ${BCY})` : '');
  }

  /* ═══════════ BẢNG BÊN PHẢI ═══════════ */
  const TYPE={room:'Phòng', wet:'Vệ sinh', circ:'Lưu thông', storage:'Tủ âm', yard:'Sân'};

  function buildTables(){
    let rows='<tr><th>#</th><th>Phòng</th><th class="n">Tim tường<br>R × S (m)</th>'
           + '<th class="n">DT<br>m²</th><th class="n">Sử dụng<br>m²</th><th>Loại</th></tr>';
    for(const r of ROOMS){
      const [id,name,,,w,h,type] = r, c = clearOf(r, WALLS);
      rows+=`<tr><td>${id}</td><td>${name}</td>`
          + `<td class="n">${w.toFixed(1)} × ${h.toFixed(1)}</td>`
          + `<td class="n"><b>${(w*h).toFixed(2)}</b></td>`
          + `<td class="n" style="color:#888">${c.a.toFixed(2)}</td>`
          + `<td>${TYPE[type]}</td></tr>`;
    }
    const kinRooms = ROOMS.filter(r=>r[6]!=='yard' && r[0]!=='R3');
    const timChinh = +kinRooms.filter(r=>r[0][0]==='L').reduce((s,r)=>s+r[4]*r[5],0).toFixed(2);
    const sdKin = sumClear(kinRooms, WALLS);
    const sdChinh = sumClear(kinRooms.filter(r=>r[0][0]==='L'), WALLS);
    rows+=`<tr class="tot"><td colspan="3">Khối nhà chính</td>`
        + `<td class="n">${timChinh.toFixed(2)}</td>`
        + `<td class="n" style="color:#888">${sdChinh.toFixed(2)}</td><td>—</td></tr>`;
    rows+=`<tr class="tot"><td colspan="3">Toàn bộ phần kín</td>`
        + `<td class="n">${V.areas.kin.toFixed(2)}</td>`
        + `<td class="n" style="color:#888">${sdKin.toFixed(2)}</td><td>—</td></tr>`;
    rows+=`<tr class="tot"><td colspan="3">Tổng lô đất</td><td class="n">285.00</td>`
        + `<td class="n" style="color:#888">—</td><td>—</td></tr>`;
    document.getElementById('sched').innerHTML=rows;

    // ── bảng cửa ──
    const KIND={swing:'Mở quay', slide:'Lùa 2 cánh', slide1:'Lùa 1 cánh',
                open:'Mở thông', quad:'4 cánh'};
    let dr='<tr><th>Mã</th><th class="n">Rộng</th><th>Loại</th><th>Nối</th></tr>';
    for(const d of V.doors){
      const [id,,,a,b,kind,,,flag,desc] = d;
      const c = flag==='new' ? ' style="color:#0a6b3d;font-weight:700"' : '';
      dr+=`<tr><td${c}>${id}</td><td class="n">${(b-a).toFixed(2)}</td>`
        + `<td>${KIND[kind]||kind}</td><td>${desc||''}</td></tr>`;
    }
    document.getElementById('tblDoors').innerHTML = dr;

    // ── bảng cửa sổ ──
    const secWin = document.getElementById('secWin');
    if(V.windows.length){
      secWin.hidden = false;
      let wr='<tr><th>Mã</th><th class="n">Rộng</th><th>Vị trí</th></tr>';
      for(const [id,,,a,b,flag,desc] of V.windows){
        const c = flag==='new' ? ' style="color:#0a6b3d;font-weight:700"'
                : flag==='warn' ? ' style="color:#c0392b;font-weight:700"' : '';
        wr+=`<tr><td${c}>${id}</td><td class="n">${(b-a).toFixed(2)}</td><td>${desc||''}</td></tr>`;
      }
      document.getElementById('tblWins').innerHTML = wr;
    } else secWin.hidden = true;

    // ── bảng lấy sáng mái ──
    const secSky = document.getElementById('secSky');
    if(V.skylights.length){
      secSky.hidden = false;
      let sr='<tr><th>Mã</th><th>Tên</th><th class="n">Kích thước</th><th>Ghi chú</th></tr>';
      for(const [id,name,,,w,h,desc] of V.skylights)
        sr+=`<tr><td style="color:#2f7897;font-weight:700">${id}</td><td>${name}</td>`
          + `<td class="n">${w.toFixed(1)} × ${h.toFixed(1)}</td><td>${desc||''}</td></tr>`;
      document.getElementById('tblSky').innerHTML = sr;
    } else secSky.hidden = true;

    // ── bảng đèn: độ rọi từng phòng rồi danh sách đèn ──
    const secLights = document.getElementById('secLights');
    const lamps = lightsOf(V).filter(l=>!l.errors.length);
    if(secLights) secLights.hidden = !lamps.length;
    if(secLights && lamps.length){
      const watt = lamps.reduce((s,l)=>s+l.spec.watt,0);
      let xr='<tr><th>Phòng</th><th class="n">Đèn</th><th class="n">W</th><th class="n">Độ rọi chung</th></tr>';
      for(const r of lightingOf(V).filter(r=>r.count||r.target!=null)){
        const lux = r.target==null ? '<span style="color:#888">—</span>'
          : `<b style="color:${r.ok?'#0a6b3d':'#c0392b'}">${Math.round(r.lux)}</b> / ${r.target} lx`;
        xr+=`<tr><td>${r.name}</td><td class="n">${r.count}</td><td class="n">${r.watt}</td><td class="n">${lux}</td></tr>`;
      }
      const roof = lamps.filter(l=>!l.room);
      if(roof.length) xr+=`<tr><td>MÁI</td><td class="n">${roof.length}</td><td class="n">${roof.reduce((s,l)=>s+l.spec.watt,0)}</td><td class="n"><span style="color:#888">—</span></td></tr>`;
      xr+=`<tr class="tot"><td>Toàn nhà</td><td class="n">${lamps.length}</td><td class="n">${watt}</td><td>—</td></tr>`;
      document.getElementById('tblLux').innerHTML = xr;
      let lr='<tr><th>Mã</th><th>Loại</th><th class="n">W</th><th>Vị trí</th></tr>';
      for(const l of lamps)
        lr+=`<tr><td style="color:#9a6b00;font-weight:700">${l.id}</td><td>${l.spec.name}${l.spec.ip?` IP${l.spec.ip}`:''}</td>`
          + `<td class="n">${l.spec.watt}</td><td>${l.desc||''}</td></tr>`;
      document.getElementById('tblLights').innerHTML = lr;
    }

    document.getElementById('vTitle').textContent = V.label;
    document.getElementById('vMeta').textContent  = V.note;
    document.getElementById('vChanges').innerHTML = V.changes.map(c=>`<li>${c}</li>`).join('');
    document.getElementById('warn').innerHTML     = V.warn;

    const errs = validate(V);
    document.getElementById('vCheck').innerHTML = errs.length
      ? `<div class="chk bad"><b>${errs.length}/${CHECKS.length} phép kiểm không đạt</b><ul>`
        + errs.map(e=>`<li>${e}</li>`).join('') + `</ul></div>`
      : `<div class="chk ok"><b>✓ Qua toàn bộ ${CHECKS.length} phép kiểm</b></div>`;
    document.getElementById('subline').innerHTML  =
      `285 m² &nbsp;·&nbsp; Tỉ lệ 1:100 &nbsp;·&nbsp; Tim tường &nbsp;·&nbsp; <b>${V.label}</b> &nbsp;·&nbsp; `
      + `<b>Nhà chính ${timChinh.toFixed(2)} m² · toàn bộ ${V.areas.kin.toFixed(2)} m²</b>`
      + ` &nbsp;<span style="color:#888">(sử dụng ${sdChinh.toFixed(2)} / ${sdKin.toFixed(2)})</span>`;
  }

  document.getElementById('legend').innerHTML = `
  <tr><th>Ký hiệu</th><th>Ý nghĩa</th></tr>

  <tr><td colspan="2" style="background:#f6f4ee;font-weight:700">Mã trên bản vẽ</td></tr>
  <tr><td><b>D#</b></td><td>Cửa đi — chi tiết ở <b>Bảng cửa</b></td></tr>
  <tr><td><b>W#</b></td><td>Cửa sổ — chi tiết ở <b>Bảng cửa sổ</b></td></tr>
  <tr><td style="color:#2f7897"><b>SK#</b></td><td>Lấy sáng mái — chi tiết ở <b>Bảng lấy sáng mái</b></td></tr>
  <tr><td><b>L# / R#</b></td><td>Mã phòng lô chính / lô phụ — <b>Bảng thống kê phòng</b></td></tr>
  <tr><td style="color:#9a6b00"><b>Đ#</b></td><td>Đèn — chi tiết ở <b>Bảng đèn</b></td></tr>

  <tr><td colspan="2" style="background:#f6f4ee;font-weight:700">Hệ kích thước</td></tr>
  <tr><td>Mặc định</td><td><b>Tim tường</b> — nhãn phòng và đường kích thước đều tính tới tim tường, cộng dồn ra đúng 30.0 m</td></tr>
  <tr><td>Nút "Nhãn"</td><td>Gạt sang <b>Sử dụng</b> để xem số lọt lòng, đã trừ hết tường. Nhãn khi đó có hậu tố "sd"</td></tr>
  <tr><td>Bảng thống kê</td><td>Luôn có cả hai cột để đối chiếu</td></tr>

  <tr><td colspan="2" style="background:#f6f4ee;font-weight:700">Nét vẽ</td></tr>
  <tr><td>Nét đen đặc</td><td>Tường xây — bao 220mm, ngăn 100mm</td></tr>
  <tr><td>Cung quét + vạch đậm</td><td>Cửa mở quay, cung chỉ chiều mở</td></tr>
  <tr><td>2 vạch song song lệch</td><td>Cửa lùa 2 cánh</td></tr>
  <tr><td>1 vạch + nét đứt</td><td>Cửa lùa 1 cánh — nét đứt là khoảng thông</td></tr>
  <tr><td>Vạch đậm chia 4 + 2 cung</td><td>Cửa 4 cánh</td></tr>
  <tr><td>Nét đứt xám ngắn</td><td>Ô mở thông, không có cánh cửa</td></tr>
  <tr><td>Ô trắng viền đen mảnh</td><td>Cửa sổ</td></tr>
  <tr><td style="color:#2f7897">Nét đứt xanh + gạch chéo</td><td>Lấy sáng trên mái (nằm phía trên đầu)</td></tr>
  <tr><td style="color:#6f6a5e">Viền chấm xám</td><td>Mái hiên, trần ban công — bản mái đổ ra ngoài tường (nằm phía trên đầu)</td></tr>
  <tr><td>Ô be kẻ vạch</td><td>Bậc tam cấp phía sân — mỗi vạch là mép một bậc</td></tr>
  <tr><td style="color:#9a6b00">Vòng tròn gạch chéo</td><td>Đèn trần ốp nổi — cỡ vòng là cỡ thân đèn</td></tr>
  <tr><td style="color:#9a6b00">Vòng tròn chấm giữa</td><td>Đèn thả</td></tr>
  <tr><td style="color:#9a6b00">Nửa vòng tròn áp tường</td><td>Đèn tường — bụng quay về phía rọi</td></tr>
  <tr><td style="color:#9a6b00">Ô chữ nhật mảnh áp tường, mã BCT#</td><td>Bảng công tắc — bấm hạt ở mục <b>Bảng công tắc</b>; ô tô vàng khi có cụm đang bật</td></tr>
  <tr><td style="color:#9a6b00">Quầng vàng + nét đứt vàng</td><td>Đèn đang bật, nét đứt nối về các bảng công tắc điều khiển nó</td></tr>
  <tr><td style="color:#9a6b00">Nền vàng đậm</td><td>Đèn chống nước (ngoài trời IP65, WC IP44); nền vàng nhạt là đèn trong nhà</td></tr>
  <tr><td>Nét đứt xám trên tường rào</td><td>Cổng — có nhãn kèm bề rộng</td></tr>
  <tr><td>Nét gạch–chấm</td><td>Ranh lô chính / lô phụ ở phần sân</td></tr>
  <tr><td style="color:#8a1c1c">Nét đỏ mảnh + gạch chéo đầu</td><td>Đường kích thước, đơn vị mét</td></tr>

  <tr><td colspan="2" style="background:#f6f4ee;font-weight:700">Màu mã</td></tr>
  <tr><td><span class="new">Xanh lá</span></td><td>Cửa / cửa sổ <b>mới hoặc thay đổi</b> ở phiên bản đang xem</td></tr>
  <tr><td style="color:#c0392b">Đỏ</td><td>Cửa sổ có vấn đề — xem ghi chú cuối mục</td></tr>
  <tr><td>Đen</td><td>Giữ nguyên như phiên bản trước</td></tr>

  <tr><td colspan="2" style="background:#f6f4ee;font-weight:700">Nền phòng</td></tr>
  <tr><td>Ô chấm</td><td>Sân trống, không mái</td></tr>
  <tr><td>Ô caro xanh</td><td>Khu vệ sinh / khu ướt</td></tr>
  <tr><td>Ô gạch chéo vàng</td><td>Lưu thông — hành lang, tủ, lối phụ</td></tr>
  <tr><td>Nền trắng</td><td>Phòng ở, có mái</td></tr>

  <tr><td colspan="2" style="background:#f6f4ee;font-weight:700">Nội thất</td></tr>
  <tr><td>Chữ nhật có dải đầu</td><td>Giường — dải đậm là đầu giường, chỉ hướng nằm</td></tr>
  <tr><td>Chữ nhật kẻ 3 ngăn</td><td>Tủ quần áo / tủ kệ</td></tr>
  <tr><td>Chữ nhật bo góc</td><td>Sofa, bàn</td></tr>
  <tr><td>Chữ nhật nâu nhạt</td><td>Bàn thờ</td></tr>
  <tr><td>Bầu dục + hộp nhỏ</td><td>Bồn cầu</td></tr>
  <tr><td>Hộp có vòng tròn</td><td>Lavabo</td></tr>
  <tr><td>Ô xanh có gạch chéo</td><td>Khu vực sen tắm</td></tr>
  <tr><td>Dải dài + 2 vòng tròn</td><td>Kệ bếp — 2 vòng tròn là bếp nấu, ô bo góc là chậu rửa</td></tr>
  <tr><td>Chữ nhật hẹp có vạch</td><td>Bàn làm việc</td></tr>
  <tr><td>Ô vuông bo có tựa</td><td>Ghế làm việc</td></tr>
  <tr><td>Chữ nhật + 6 ghế</td><td>Bàn ăn</td></tr>
  <tr><td>Vòng tròn + 4 ghế</td><td>Bàn ngoài sân</td></tr>

  <tr><td colspan="2" style="background:#f6f4ee;font-weight:700">Cây xanh</td></tr>
  <tr><td style="color:#a9644a">Vòng nâu + tán xanh mờ</td><td>Chậu cây — vòng trong là miệng chậu, vòng xanh là tán</td></tr>
  <tr><td style="color:#5f8f4a">Dải be viền xám, chấm xanh tâm hồng</td><td>Bồn hoa xây áp tường — viền là bó vỉa, mỗi chấm một khóm hoa</td></tr>
  <tr><td style="color:#5f8f4a">Vòng xanh nét đứt + ô vuông, mã CX#</td><td>Cây bóng mát — vòng nét đứt là tán (trên đầu), ô vuông là ô gốc bó vỉa, chấm nâu là thân</td></tr>

  <tr><td colspan="2" style="background:#f6f4ee;font-weight:700">Khác</td></tr>
  <tr><td>Mũi tên "MẶT TIỀN"</td><td>Mặt tiền quay hướng ${compassName(frontAzimuth())} (phương vị ${+frontAzimuth().toFixed(1)}°)</td></tr>
  <tr><td>Thanh đen–trắng 0–5</td><td>Thang tỉ lệ, mỗi ô 1 mét</td></tr>
  <tr><td>Khung dưới bản vẽ</td><td>Khung tên: tên bản, tỉ lệ, diện tích</td></tr>`;


  /* Bảng công tắc bấm được (components/switchBoard.js) — bật / tắt cụm đèn chỉ vẽ lại bản vẽ, không đụng số liệu. */
  const board = mountSwitchBoard('switchBoard', { onChange: () => buildPlan() });

  /* ═══════════ CHỌN PHIÊN BẢN ═══════════ */
  const sel = document.getElementById('ver');
  PLANS.forEach((v,i)=>{
    const o=document.createElement('option'); o.value=i; o.textContent=v.label; sel.appendChild(o);
  });
  sel.value = PLANS.length-1;                 // mặc định mở bản mới nhất

  let BASE, CFG, GRID;
  /* Gán sau khi dựng phần "Cấu hình đã lưu"; để hàm rỗng trước đó cho những chỗ gọi sớm. */
  let refreshSaved = () => {};

  function loadVersion(i){
    BASE = PLANS[i];
    GRID = toGrid(BASE);

    /* Chỉ số đường lưới chỉ có nghĩa trong đúng một mặt bằng, nên đổi mặt bằng là bỏ phần
       `lines`. Cao độ không dính lưới nên giữ nguyên. */
    const saved = readConfig();
    CFG = emptyConfig(BASE.id);
    CFG.heights = saved?.heights || {};
    if (saved && saved.planId === BASE.id) CFG.lines = saved.lines || CFG.lines;

    draw(true);
    buildSizePanel();
    refreshSaved();
  }
  sel.onchange = () => loadVersion(+sel.value);

  /* ═══════════ TUỲ CHỈNH KÍCH THƯỚC ═══════════
     Kéo một thanh = dịch một đường lưới. Mọi thứ bám vào đường đó tự đi theo (lib/grid.js),
     nên ở đây chỉ còn việc dựng lại và vẽ. `refit` chỉ đúng khi mới mở mặt bằng — kéo thanh
     mà nhảy về vừa khung thì mất chỗ đang nhìn. */
  function draw(refit){
    V = applyConfig(BASE, CFG);
    ROOMS=V.rooms; WALLS=V.walls; DOORS=V.doors; WINDOWS=V.windows;
    SKYLIGHTS=V.skylights; FURN=V.furn; GATES=V.gates; STRIPS=V.strips; DIMS=V.dims;
    board.setPlan(V);
    buildPlan(); buildTables();
    if(refit){ mode='fit'; fit(); }
  }

  const movedLines = () =>
    Object.keys(CFG.lines.x).length + Object.keys(CFG.lines.y).length;

  /* Giá trị hiện hành của từng đường: giá trị gốc, đè bằng phần đã kéo. */
  function liveLines(){
    return {
      x: GRID.xs.map((v,i)=> CFG.lines.x[i] ?? v),
      y: GRID.ys.map((v,i)=> CFG.lines.y[i] ?? v),
    };
  }

  /* Kích thước lọt lòng theo chiều vuông góc với đường — đây mới là số người dùng quan tâm. */
  function clearAcross(room, axis){
    const c = clearOf(room, WALLS);
    return axis==='x' ? c.w : c.h;
  }

  function buildSizePanel(){
    const box = document.getElementById('cfgSliders');
    if(!box) return;
    box.replaceChildren();

    for(const line of movableLines(GRID)){
      const row = document.createElement('div');
      row.className = 'cfgrow';

      const lab = document.createElement('label');
      const sides = [line.before.join(' · ') || 'cạnh lô', line.after.join(' · ') || 'cạnh lô'];
      lab.textContent = `${sides[0]}  ↕  ${sides[1]}`;

      const sl = document.createElement('input');
      sl.type='range'; sl.step='0.1';
      sl.oninput = () => {
        CFG.lines[line.axis][line.index] = +(+sl.value).toFixed(2);
        writeConfig(CFG);
        draw(false);
        refreshSizePanel();
        refreshSaved();
      };

      const sizes = document.createElement('div');
      sizes.className = 'cfgsizes';

      row.append(lab, sl, sizes);
      row._line = line; row._sl = sl; row._sizes = sizes; row._lab = lab;
      box.appendChild(row);
    }
    refreshSizePanel();
  }

  function refreshSizePanel(){
    const box = document.getElementById('cfgSliders');
    if(!box) return;
    const live = liveLines();

    for(const row of box.children){
      const { axis, index } = row._line;
      const lines = live[axis];

      /* Khoảng kéo là hai đường kề — chừa 0.1 m để hai đường không trùng nhau, vì trùng là
         phòng bẹp bằng 0 và mọi thứ dựa trên nó thành vô nghĩa. Đây không phải "chặn khi
         chật": chật thì vẫn kéo được, chỉ tô đỏ. */
      row._sl.min = (lines[index-1] + 0.1).toFixed(1);
      row._sl.max = (lines[index+1] - 0.1).toFixed(1);
      row._sl.value = lines[index];

      const moved = CFG.lines[axis][index] !== undefined;
      row.classList.toggle('moved', moved);

      const touching = V.rooms.filter(r => {
        const lo = axis==='x' ? r[2] : r[3], hi = lo + (axis==='x' ? r[4] : r[5]);
        return Math.abs(lo - lines[index]) < 1e-6 || Math.abs(hi - lines[index]) < 1e-6;
      });

      row._sizes.replaceChildren();
      for(const r of touching){
        const size = clearAcross(r, axis);
        const min = MIN_CLEAR[r[6]] ?? 0;
        const span = document.createElement('span');
        if(size < min - 1e-9) span.className = 'tight';
        span.innerHTML = `${r[1]} <b>${size.toFixed(2)}</b>`;
        row._sizes.appendChild(span);
      }
    }

    const n = movedLines();
    const st = document.getElementById('cfgState');
    if(st) st.innerHTML = n
      ? `<b>Đang xem bản tuỳ chỉnh</b> — ${n} tường đã dịch. Số đỏ là phòng hẹp hơn ngưỡng tạm.`
      : 'Đang xem đúng kích thước gốc.';
    const rs = document.getElementById('cfgReset');
    if(rs) rs.disabled = !n;
  }

  const cfgReset = document.getElementById('cfgReset');
  if(cfgReset) cfgReset.onclick = () => {
    CFG.lines = { x:{}, y:{} };
    writeConfig(CFG);
    draw(false);
    refreshSizePanel();
    refreshSaved();
  };

  /* Cấu hình đặt tên — dùng chung với trang 3D (components/savedConfigs.js). */
  refreshSaved = mountSavedConfigs('cfgSaved', {
    getCfg: () => CFG,
    setCfg: cfg => {
      /* Mở một cấu hình lưu cho mặt bằng khác thì bỏ phần `lines` — chỉ số đường không
         chuyển được sang mặt bằng này. Cao độ và hướng thì vẫn dùng được. */
      CFG = { ...cfg, planId: BASE.id };
      if (cfg.planId !== BASE.id) CFG.lines = { x:{}, y:{} };
      writeConfig(CFG);
      draw(false);
      refreshSizePanel();
    },
  });

  /* ═══════════ PAN / ZOOM ═══════════ */
  const view  = svg.parentNode;
  const zVal  = document.getElementById('zVal');
  const MINS = 0.04, MAXS = 6;
  let S = {cx:BCX, cy:BCY, scale:1, rot:0};

  const boxEff = () => S.rot
    ? {x:BCX-BOX.h/2, y:BCY-BOX.w/2, w:BOX.h, h:BOX.w}
    : BOX;
  const rect  = () => view.getBoundingClientRect();
  const clampS = s => Math.min(MAXS, Math.max(MINS, s));

  function apply(){
    const r = rect();
    if(!r.width || !r.height) return;
    const w = r.width/S.scale, h = r.height/S.scale;
    svg.setAttribute('viewBox', `${S.cx-w/2} ${S.cy-h/2} ${w} ${h}`);
    zVal.textContent = Math.round(S.scale*100) + '%';
  }
  function fit(pad=0.995){
    const r = rect(), B = boxEff();
    S.scale = clampS(Math.min(r.width/B.w, r.height/B.h)*pad);
    S.cx = B.x + B.w/2; S.cy = B.y + B.h/2;
    apply();
  }
  function fitWidth(){
    const r = rect(), B = boxEff();
    S.scale = clampS(r.width/B.w*0.995);
    S.cx = B.x + B.w/2;
    S.cy = B.y + (r.height/S.scale)/2;
    apply();
  }
  function rotate(){
    S.rot = ROT = S.rot ? 0 : -90;
    scene.setAttribute('transform', S.rot ? `rotate(${S.rot} ${BCX} ${BCY})` : '');
    drawAnnot();
    mode='fit'; fit();
  }
  function bestOrientation(){
    const r = rect();
    const portrait  = Math.min(r.width/BOX.w, r.height/BOX.h);
    const landscape = Math.min(r.width/BOX.h, r.height/BOX.w);
    const want = landscape > portrait ? -90 : 0;
    if(S.rot !== want) rotate(); else fit();
  }
  function zoomAt(clientX, clientY, factor){
    const r = rect();
    const dx = clientX - r.left - r.width/2;
    const dy = clientY - r.top  - r.height/2;
    const px = S.cx + dx/S.scale, py = S.cy + dy/S.scale;
    const ns = clampS(S.scale*factor);
    if(ns === S.scale) return;
    S.scale = ns; S.cx = px - dx/ns; S.cy = py - dy/ns;
    apply();
  }
  const zoomCenter = f => { const r=rect(); zoomAt(r.left+r.width/2, r.top+r.height/2, f); };

  let mode = 'fit';
  const relayout = () => mode==='fit' ? fit() : mode==='wide' ? fitWidth() : apply();

  svg.addEventListener('wheel', e => {
    e.preventDefault(); mode='free';
    zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0016)));
  }, {passive:false});

  let drag = null;
  svg.addEventListener('pointerdown', e => {
    mode='free'; drag = {x:e.clientX, y:e.clientY};
    svg.setPointerCapture(e.pointerId); svg.classList.add('drag');
  });
  svg.addEventListener('pointermove', e => {
    if(!drag) return;
    S.cx -= (e.clientX - drag.x)/S.scale;
    S.cy -= (e.clientY - drag.y)/S.scale;
    drag = {x:e.clientX, y:e.clientY};
    apply();
  });
  const endDrag = () => { drag = null; svg.classList.remove('drag'); };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  document.getElementById('zIn').onclick   = () => { mode='free'; zoomCenter(1.25); };
  document.getElementById('zOut').onclick  = () => { mode='free'; zoomCenter(1/1.25); };
  document.getElementById('zFit').onclick  = () => { mode='fit';  fit(); };
  document.getElementById('zWide').onclick = () => { mode='wide'; fitWidth(); };
  document.getElementById('z100').onclick  = () => { mode='free'; S.scale = 1; apply(); };
  document.getElementById('zRot').onclick  = rotate;

  const btnDim = document.getElementById('zDim');
  btnDim.onclick = () => {
    LABELMODE = LABELMODE === 'tim' ? 'sd' : 'tim';
    btnDim.textContent = LABELMODE === 'tim' ? 'Nhãn: Tim tường' : 'Nhãn: Sử dụng';
    drawAnnot();
  };

  const side = document.querySelector('.side');
  const btnSide = document.getElementById('zSide');
  function setSide(show){
    show ? side.removeAttribute('hidden') : side.setAttribute('hidden','');
    btnSide.textContent = show ? 'Ẩn bảng' : 'Hiện bảng';
  }
  btnSide.onclick = () => setSide(side.hasAttribute('hidden'));

  /* toàn màn hình */
  const btnFull = document.getElementById('zFull');
  const sheet   = document.querySelector('.sheet');
  const btnExit = document.getElementById('zExit');

  function toggleFull(){
    if(document.fullscreenElement) document.exitFullscreen();
    else sheet.requestFullscreen?.().catch(()=>{
      btnFull.textContent = '⛶ Không bật được';
      setTimeout(() => btnFull.textContent = '⛶ Toàn màn hình', 2000);
    });
  }
  btnFull.onclick = toggleFull;
  btnExit.onclick = () => document.exitFullscreen();

  let exitTimer;
  function pokeExit(){
    btnExit.classList.add('show');
    clearTimeout(exitTimer);
    exitTimer = setTimeout(() => btnExit.classList.remove('show'), 2500);
  }
  btnExit.addEventListener('pointerenter', () => { clearTimeout(exitTimer); btnExit.classList.add('show'); });
  btnExit.addEventListener('pointerleave', pokeExit);
  sheet.addEventListener('pointermove', () => { if(document.fullscreenElement) pokeExit(); });

  const onFsChange = () => {
    const on = !!document.fullscreenElement;
    btnExit.classList.remove('show');
    if(on) pokeExit();
    mode = 'fit';
    if(on) bestOrientation(); else fit();
  };
  document.addEventListener('fullscreenchange', onFsChange);

  const onKey = e => {
    if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if(e.key === '+' || e.key === '=') { mode='free'; zoomCenter(1.25); e.preventDefault(); }
    else if(e.key === '-' || e.key === '_') { mode='free'; zoomCenter(1/1.25); e.preventDefault(); }
    else if(e.key === '0') { mode='fit'; fit(); e.preventDefault(); }
    else if(e.key === 'r' || e.key === 'R') { rotate(); e.preventDefault(); }
    else if(e.key === 'f' || e.key === 'F') { toggleFull(); e.preventDefault(); }
  };
  addEventListener('keydown', onKey);

  const ro = new ResizeObserver(relayout); ro.observe(view);
  loadVersion(PLANS.length-1);
  return function donDep(){
    ro.disconnect();
    removeEventListener('keydown', onKey);
    document.removeEventListener('fullscreenchange', onFsChange);
  };
}
