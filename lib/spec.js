import { clearOf, validate, CHECKS } from './plan.js';
import { stepsOf, overhangsOf, lightRoofs, roofPanels, roofOver, floorOf, gutters, downpipes, postsOf, beamsOf, purlinsOf, dropCeilingsOf, roofInsulationOf,
         stairsOf, tumOf, roofRailingsOf, tanksOf, racksOf } from './envelope.js';
import { ROOF, ROOF_INSULATION, RAILING, POST, BEAM, PURLIN, STAIR, TUM, TANK, RACK, ROOF_RAILING, heightsOf } from './lot.js';
import { buildMassing } from './massing.js';

/* ═══════════ SINH ĐẶC TẢ MARKDOWN ═══════════ */
export function specMarkdown(v, PLANS){
  const n=(x,d=2)=>x.toFixed(d), clear=r=>clearOf(r, v.walls);
  const KIND={swing:'Mở quay',slide:'Lùa 2 cánh',slide1:'Lùa 1 cánh',open:'Mở thông',quad:'4 cánh'};
  const ROOM_TYPE={room:'Phòng',wet:'Vệ sinh',circ:'Lưu thông',storage:'Tủ âm',yard:'Sân'};
  const axisName=a=>a==='h'?'ngang':'dọc';
  const toMd=t=>String(t).replace(/<br><br>/g,'\n\n').replace(/<br>/g,'\n')
              .replace(/<\/?b>/g,'**').replace(/<code>/g,'`').replace(/<\/code>/g,'`');
  const enclosedRooms=v.rooms.filter(r=>r[6]!=='yard'&&r[0]!=='R3');
  const grossEnclosed=enclosedRooms.reduce((a,r)=>a+r[4]*r[5],0);
  const netEnclosed =enclosedRooms.reduce((a,r)=>a+clear(r).a,0);
  const leftRooms=enclosedRooms.filter(r=>r[0][0]==='L');
  const grossMain=leftRooms.reduce((a,r)=>a+r[4]*r[5],0), netMain=leftRooms.reduce((a,r)=>a+clear(r).a,0);
  const houseFrontY=v.rooms.find(r=>r[0]==='L2')[3];
  const sumL=v.rooms.filter(r=>r[0][0]==='L').reduce((a,r)=>a+r[4]*r[5],0);
  const sumR=v.rooms.filter(r=>r[0][0]==='R'&&r[0]!=='R5').reduce((a,r)=>a+r[4]*r[5],0);
  const errors=validate(v);
  let s='';

  s+=`# Đặc tả mặt bằng — ${v.label}\n\n`;
  s+=`> Sinh tự động từ \`lib/versions/${v.id}.js\` lúc ${new Date().toLocaleString('vi-VN')}. Không chép tay.\n`;
  s+=`> **Quy ước:** toạ độ và kích thước là **tim tường**. Gốc (0,0) = góc trên-trái lô. X→phải (0–9.5). Y→xuống (0–30).\n`;
  s+=`> Cột **Sử dụng** là kích thước lọt lòng, đã trừ nửa bề dày mỗi tường bao quanh.\n`;
  s+=`> Tường bao **220 mm** · Tường ngăn **100 mm**.\n\n${v.note}\n\n---\n\n`;

  s+=`## 1. Tổng quan\n\n| Mục | Tim tường | Sử dụng |\n|---|---:|---:|\n`;
  s+=`| Lô đất 9.5 × 30 | 285.00 m² | — |\n`;
  s+=`| **Khối nhà chính** | **${n(grossMain)} m²** | ${n(netMain)} m² |\n`;
  s+=`| **Toàn bộ phần kín** | **${n(grossEnclosed)} m²** | ${n(netEnclosed)} m² |\n`;
  s+=`| Hành lang ngoài (có mái, hở) | ${n(v.areas.hl)} m² | — |\n`;
  s+=`| Sân trống | ${n(v.areas.san)} m² | — |\n`;
  s+=`| Tường chiếm chỗ | ${n(grossEnclosed-netEnclosed)} m² | — |\n\n`;
  s+=`Nhà chính chạy từ \`y = ${n(houseFrontY,1)}\` tới \`y = 30.0\` → **dài ${n(30-houseFrontY,1)} m**.\n\n`;

  s+=`## 2. Bảng phòng\n\n| # | Phòng | x₁ | y₁ | x₂ | y₂ | Tim tường | DT tim | Sử dụng | DT sd | Loại |\n`;
  s+=`|---|---|---:|---:|---:|---:|---|---:|---|---:|---|\n`;
  for(const r of v.rooms){ const c=clear(r);
    s+=`| ${r[0]} | ${r[1]} | ${n(r[2],1)} | ${n(r[3],1)} | ${n(r[2]+r[4],1)} | ${n(r[3]+r[5],1)}`
     +` | ${n(r[4],1)} × ${n(r[5],1)} | ${n(r[4]*r[5])} | ${n(c.w)} × ${n(c.h)} | ${n(c.a)} | ${ROOM_TYPE[r[6]]} |\n`; }
  s+=`\n**Kiểm tra:** cột trái ${n(sumL)} + cột phải ${n(sumR)} = **${n(sumL+sumR)} m²**`
   +` (WC khách nằm trong sân phơi, không cộng riêng)\n`;
  s+=`**Chuỗi dọc lô chính:** `
   +v.dims.left.map((y,i,a)=>i?n(a[i]-a[i-1],1):null).filter(Boolean).join(' + ')+` = **30.0**\n\n`;

  s+=`## 3. Bảng cửa\n\n| Mã | Trục | Vị trí | Từ | Đến | Rộng | Loại | Chiều mở | Nối |\n`;
  s+=`|---|---|---:|---:|---:|---:|---|---|---|\n`;
  for(const [id,ax,pos,a,b,kind,hinge,open,,desc] of v.doors){
    const dir = kind==='swing'
      ? `bản lề ${hinge==='a'?'đầu nhỏ':'đầu lớn'}, mở ${open>0?'+':'−'}` : '—';
    s+=`| ${id} | ${axisName(ax)} | ${n(pos,1)} | ${n(a)} | ${n(b)} | ${n(b-a)} | ${KIND[kind]} | ${dir} | ${toMd(desc)} |\n`;
  }

  s+=`\n## 4. Bảng cửa sổ\n\n| Mã | Trục | Vị trí | Từ | Đến | Rộng | Vị trí |\n|---|---|---:|---:|---:|---:|---|\n`;
  for(const [id,ax,pos,a,b,,desc] of v.windows)
    s+=`| ${id} | ${axisName(ax)} | ${n(pos,1)} | ${n(a)} | ${n(b)} | ${n(b-a)} | ${toMd(desc)} |\n`;
  if(!v.windows.length) s+=`| — | | | | | | Bản này không có cửa sổ nào |\n`;

  if(v.skylights.length){
    s+=`\n## 5. Lấy sáng trên mái\n\n| Mã | Tên | x | y | Kích thước | Ghi chú |\n|---|---|---:|---:|---|---|\n`;
    for(const [id,nm,x,y,w,h,desc] of v.skylights)
      s+=`| ${id} | ${nm} | ${n(x)} | ${n(y)} | ${n(w,1)} × ${n(h,1)} | ${toMd(desc)} |\n`;
  }

  s+=`\n## 6. Cổng, bậc, mái\n\n| Trục | Vị trí | Từ | Đến | Rộng | Tên |\n|---|---:|---:|---:|---:|---|\n`;
  for(const [ax,pos,a,b,nm] of v.gates)
    s+=`| ${axisName(ax)} | ${n(pos,1)} | ${n(a)} | ${n(b)} | ${n(b-a)} | ${nm} |\n`;

  const steps=stepsOf(v).filter(x=>!x.error), overs=overhangsOf(v).filter(x=>!x.error);
  if(steps.length){
    s+=`\n### Bậc tam cấp\n\nVị trí suy từ cửa, đặt phía thấp, bắt đầu từ mặt tường. `
     +`Số bậc không tính nấc trên cùng — nấc đó chính là ngưỡng cửa.\n\n`;
    s+=`| Cửa | Xuống | x₁ | y₁ | x₂ | y₂ | Dư mỗi bên | Số bậc | Cao bậc | Mặt bậc |\n|---|---|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
    for(const b of steps){
      const r=b.rect, room=v.rooms.find(x=>x[0]===b.room);
      s+=`| ${b.id} | ${room[1]} | ${n(r.x)} | ${n(r.y)} | ${n(r.x+r.w)} | ${n(r.y+r.h)} | ${n(b.margin)} | ${b.count} | ${n(b.rise)} | ${n(b.tread)} |\n`;
    }
  }
  if(overs.length){
    s+=`\n### Bản mái đổ ra ngoài tường\n\nMái hiên, trần ban công — cùng cốt bản mái nhà, bề đua tính từ mặt tường.\n\n`;
    s+=`| Trục | Vị trí | Từ | Đến | Đua ra | Ghi chú |\n|---|---:|---:|---:|---:|---|\n`;
    for(const o of overs)
      s+=`| ${axisName(o.ax)} | ${n(o.pos,1)} | ${n(o.a,1)} | ${n(o.b,1)} | ${n(o.depth)} | ${toMd(o.desc||'')} |\n`;
  }
  const ins=roofInsulationOf(v);
  if(ins){
    const I=ROOF_INSULATION, H=heightsOf(v), top=H.floor+H.ceiling+H.slab;
    const area=buildMassing(v).boxes.filter(b=>b.kind==='roofInsulation').reduce((a,b)=>a+b.w*b.d,0);
    s+=`\n### Lớp chống nóng mái\n\nKiểu **mái ngược**: chống thấm nằm dưới tấm cách nhiệt, được che nắng và đỡ co giãn nhiệt. `
     +`Phủ mọi sàn mái bê tông (${ins.rooms.map(r=>r[1]).join(', ')})`
     +`${ins.overhangs.length?` và ${ins.overhangs.map(o=>toMd(o.desc||`mái đổ ra ngoài tường trục ${o.ax} ${o.pos}`).split(' — ')[0].toLowerCase()).join(', ')}`:''}, `
     +`tới mặt ngoài tường; chừa giếng trời — quanh mỗi lỗ xây gờ chắn nước cao hơn mặt lát. `
     +`Diện tích lát **${n(area)} m²**, mặt lát cốt **${n(top+ins.thickness)}** (bản mái ${n(top)}, chưa tính vữa tạo dốc). `
     +`Lát **rời**, không cán vữa: xây tầng 2 thì nhấc tấm, cuộn vải địa, gỡ XPS — không phải đục, không phạm vào lớp chống thấm.\n\n`;
    s+=`| Lớp (dưới lên) | Dày (m) | Ghi chú |\n|---|---:|---|\n`;
    s+=`| Bản mái BTCT | ${n(H.slab)} | |\n`;
    s+=`| Vữa tạo dốc | thay đổi | dốc về chỗ thoát nước; không dựng trong 3D |\n`;
    s+=`| Chống thấm | — | gốc xi măng hoặc màng dán nguội; **không** khò bitum nóng, **không** sơn gốc dầu — dung môi làm chảy XPS |\n`;
    s+=`| Tấm XPS | ${n(I.xps)} | cường độ nén ≥ ${I.xpsStrength} kPa, ghép so le; phủ kín ngay, không để phơi nắng; không nhầm xốp trắng EPS |\n`;
    s+=`| Vải địa kỹ thuật | — | lớp lọc trên XPS, giữ rác và cát khỏi lọt xuống khe tấm |\n`;
    s+=`| Tấm bê tông đúc sẵn | ${n(I.paver)} | ${Math.round(I.paverSize*1000)} × ${Math.round(I.paverSize*1000)} mm **đặt rời** — không vữa, không keo; mặt lát đi theo dốc mái, khe giữa các tấm để hở cho nước xuống |\n`;
  }
  const roofs=lightRoofs(v);
  if(roofs.length){
    s+=`\n### Mái nhẹ\n\nMái phụ lợp tôn, không phải bản bê tông liền mái nhà. Vùng phủ khai theo tim tường; `
     +`tấm mái thật lùi vào mặt trong bức tường nào cao hơn nó và đua ra mặt ngoài bức nào thấp hơn, `
     +`nên hai cột dưới đây lệch nhau nửa bề dày tường. Cao độ là **mặt dưới** mái, tấm lợp dày ${n(ROOF.sheet)} m.\n\n`;
    s+=`| Mã | Tên | Vùng khai | Tấm mái dựng | Dạng | Cao độ mặt dưới | Vật liệu |\n|---|---|---|---|---|---|---|\n`;
    for(const r of roofs){
      const ps=roofPanels(v).filter(p=>p.id===r.id);
      const bx=[Math.min(...ps.map(p=>p.x0)),Math.min(...ps.map(p=>p.y0)),
                Math.max(...ps.map(p=>p.x1)),Math.max(...ps.map(p=>p.y1))];
      const shape = r.kind==='flat' ? 'bằng'
                  : r.kind==='mono' ? `dốc một mái theo ${r.axis}`
                  : `hai mái, nóc theo ${r.axis} ở ${n(r.ridge,1)}`;
      const slope = r.kind==='flat' ? '' :
        ` (dốc ${(Math.abs(r.h[1]-r.h[0])/(r.kind==='gable'?(r.a1-r.a0)/2:(r.a1-r.a0))*100).toFixed(0)}%)`;
      s+=`| ${r.id} | ${r.name} | ${r.at.map(x=>n(x,1)).join(' · ')} | ${bx.map(x=>n(x)).join(' · ')}`
       +` | ${shape}${slope} | ${r.h.map(x=>n(x)).join(' → ')} | ${r.mat||'—'} |\n`;
    }
    const ceil=roofs.filter(r=>r.ceiling!==undefined);
    if(ceil.length) s+=`\n`+ceil.map(r=>{
      const room=v.rooms.find(x=>roofOver(v,x)?.id===r.id);
      return `- ${r.id} có **trần tôn cốt ${n(r.ceiling)}** — ${room?room[1]:'?'} không đổ mái bê tông; `
           + `cách sàn phòng ${n(r.ceiling-(room?floorOf(v,room):0))} m`;
    }).join('\n')+'\n';
    const gs=gutters(v);
    if(gs.length){
      s+=`\n**Máng xối** — suy ra ở mép thấp của mái nhẹ. Không có máng ở đoạn mép nối liền mạch sang mái khác `
       +`cùng cao độ (nước chảy tiếp) và đoạn đua ra trên một mái thấp hơn (nước rơi xuống mái ấy). `
       +`Miệng máng ngang mặt dưới mái ở mép, rộng ${n(ROOF.gutterWidth)} m, sâu ${n(ROOF.gutterDepth)} m.\n\n`;
      s+=`| Mái | Mép | Từ | Đến | Dài | Miệng máng | Đặt |\n|---|---|---:|---:|---:|---:|---|\n`;
      for(const g of gs)
        s+=`| ${g.id} | ${g.ax==='h'?'y':'x'} = ${n(g.pos)} | ${n(g.a)} | ${n(g.b)} | ${n(g.b-g.a)} | ${n(g.top)}`
         +` | ${g.wall?'trong mép, sát chân tường cao hơn mái':'dưới mép mái'} |\n`;
      const ps=downpipes(v);
      if(ps.length){
        s+=`\n**Ống xả đứng** — mỗi dải máng một ống ${Math.round(ROOF.pipe*1000)} mm ở đầu sát tường bao, chạy thẳng `
         +`xuống, cắm dưới cốt sân vào ống ngầm — không đổ ra sân.\n\n`;
        s+=`| Mái | x₁ | y₁ | x₂ | y₂ | Từ cốt (đáy máng) | Áp |\n|---|---:|---:|---:|---:|---:|---|\n`;
        for(const p of ps){
          const r=p.rect;
          s+=`| ${p.id} | ${n(r.x)} | ${n(r.y)} | ${n(r.x+r.w)} | ${n(r.y+r.h)} | ${n(p.top)} | ${p.boundary?'mặt trong tường bao':'không có tường bao — ngay dưới đầu máng'} |\n`;
        }
      }
    }
    const cs=postsOf(v).filter(c=>!c.error);
    if(cs.length){
      s+=`\n**Cột đỡ mái nhẹ** — ${POST.mat}, đứng ở chỗ mép mái không tựa lên tường cao tới mái. Vị trí khai `
       +`theo tâm cột; chiều cao suy ra: từ cốt sân tới đáy dầm biên trên đầu cột. Nhịp giữa hai chỗ đỡ dọc một mép `
       +`mái không quá ${n(POST.maxSpan,1)} m.\n\n`;
      s+=`| Mã | x | y | Đỉnh cột | Đỡ mái | Dưới dầm |\n|---|---:|---:|---:|---|---|\n`;
      for(const c of cs)
        s+=`| ${c.id} | ${n(c.x)} | ${n(c.y)} | ${n(c.top)} | ${c.roofs.join(', ')} | ${c.beam?'có':'—'} |\n`;
    }
    const bs=beamsOf(v);
    if(bs.length){
      s+=`\n**Dầm biên** — ${BEAM.mat}, suy ra dọc mọi đoạn mép mái nhẹ không tựa lên tường cao tới mái, từ mặt `
       +`tường tới mặt tường, đi qua đầu cột. Mặt trên chạm mặt dưới mái (dầm dọc chiều dốc nghiêng theo mái); `
       +`ở mép có máng thì dầm lùi vào sau máng, đoạn chui dưới máng hạ xuống đáy máng.\n\n`;
      s+=`| Mái | Tuyến | Từ | Đến | Dài | Mặt trên | Ghi chú |\n|---|---|---:|---:|---:|---|---|\n`;
      for(const b of bs)
        s+=`| ${b.id} | ${b.ax==='h'?'y':'x'} = ${n(b.pos)} | ${n(b.a)} | ${n(b.b)} | ${n(b.b-b.a)} | ${b.yt.map(y=>n(y)).join(' → ')}`
         +` | ${b.underGutter?'dưới máng':b.sloped?'nghiêng theo mái':''} |\n`;
    }
    const ps=purlinsOf(v);
    if(ps.length){
      s+=`\n**Xà gồ** — ${PURLIN.mat}, đặt vuông góc chiều dốc, mặt trên chạm mặt dưới tôn. Số hàng suy ra để `
       +`bước dọc mái không quá ${n(PURLIN.maxPitch)} m; mỗi thanh dừng ở mặt tường hoặc dầm biên, nhịp không quá ${n(PURLIN.maxSpan)} m.\n\n`;
      s+=`| Mái | Mã | Tuyến | Từ | Đến | Nhịp | Mặt trên |\n|---|---|---|---:|---:|---:|---:|\n`;
      for(const p of ps)
        s+=`| ${p.roofId} | ${p.id} | ${p.ax==='h'?'y':'x'} = ${n(p.pos)} | ${n(p.a)} | ${n(p.b)} | ${n(p.b-p.a)} | ${n(p.top)} |\n`;
    }
  }
  const stairs=stairsOf(v).filter(x=>!x.error), tum=tumOf(v);
  if(stairs.length){
    s+=`\n### Cầu thang lên mái\n\nCao bậc suy ra từ mặt sàn tới mặt mái đi lại được chia đều số nấc; nấc cuối mỗi vế lên chiếu nghỉ / mặt mái, `
     +`nên số mặt bậc ít hơn số nấc một. Bản thang dày ${n(STAIR.flight)} m dưới mặt bậc, gầm thang hở. Lỗ thang cũng là lỗ khoét bản mái.\n\n`;
    s+=`| Mã | Tên | Lỗ thang x₁ · y₁ · x₂ · y₂ | Rộng vế | Nấc (vế 1 + vế 2) | Cao bậc | Mặt bậc | Chiếu nghỉ | Từ cốt → tới cốt |\n|---|---|---|---:|---|---:|---:|---:|---|\n`;
    for(const x of stairs){
      const hl=x.hole;
      s+=`| ${x.id} | ${x.name} | ${[hl.x,hl.y,hl.x+hl.w,hl.y+hl.h].map(q=>n(q)).join(' · ')} | ${n(x.width)} | ${x.risers.join(' + ')}`
       +` | ${n(x.rise,3)} | ${n(x.tread)} | ${n(x.landingTop)} | ${n(x.base)} → ${n(x.top)} |\n`;
    }
    s+=`\nLan can thang cao ${n(STAIR.rail)} m dọc mép vế 2 giáp phòng khách (trên bức lửng cao ${n(STAIR.parapet)} m) và ở mép lỗ thang trên mặt mái. `
     +`Khe giữa hai vế rộng ${stairs.map(x=>n(x.hole.h-2*x.width)).join(' · ')} m: mỗi vế một tay vịn ở mép trong, chết vào một trụ ở đầu khe trên chiếu nghỉ.\n`;
  }
  if(tum){
    s+=`\n### Tum\n\n${TUM.mat[0].toUpperCase()+TUM.mat.slice(1)}. Vùng ${[tum.x0,tum.y0,tum.x1,tum.y1].map(q=>n(q)).join(' · ')} (tim vách), `
     +`sàn là mặt mái cốt ${n(tum.base)}, mặt dưới mái tum ${n(tum.under)}; tường dày ${Math.round(TUM.wall*1000)} mm, ô thoáng cao ${n(TUM.vent)} m sát mái trên hai vách dài, gắn ${TUM.louvers} lá kính cố định xếp nghiêng chéo xuống ra ngoài (lá trên chồng mép lá dưới — mưa hắt, lá cây không vào). `
     +`Mái tum đua ngắn ${n(TUM.eave)} m ra khỏi mặt ngoài tường (cạnh trên ranh lô không đua), mép bọc diềm gập cao ${n(TUM.fascia)} m. `
     +`Trên cửa có ô văng đua ${n(TUM.canopy)} m, dài hơn cửa ${n(TUM.canopyMargin)} m mỗi bên. `
     +`Cửa ra mái có cánh mở vào trong tum, chốt từ trong nhà, ngưỡng có gờ chắn nước cao ${n(TUM.curb)} m, cao ${n(TUM.door)} m tính từ mặt mái:${tum.doors.map(d=>d.ax==='h'?`vách y = ${n(d.pos)}, x ${n(d.a)}–${n(d.b)}`:`vách x = ${n(d.pos)}, y ${n(d.a)}–${n(d.b)}`).join('; ')}. Ô polycarbonate đậy trọn lỗ thang. `
     +`Dỡ đi khi xây tầng 2.\n`;
  }
  const rails=roofRailingsOf(v).filter(x=>!x.error);
  if(rails.length){
    s+=`\n### Lan can mái\n\n${ROOF_RAILING.mat[0].toUpperCase()+ROOF_RAILING.mat.slice(1)}, cao ${n(ROOF_RAILING.height)} m từ mặt mái cốt ${n(rails[0].y0)}.\n\n`;
    s+=`| Trục | Vị trí | Từ | Đến | Dài |\n|---|---:|---:|---:|---:|\n`;
    for(const r of rails) s+=`| ${axisName(r.ax)} | ${n(r.pos)} | ${n(r.a)} | ${n(r.b)} | ${n(r.b-r.a)} |\n`;
  }
  const tanks=tanksOf(v).filter(t=>!t.errors.length);
  if(tanks.length){
    s+=`\n### Bồn nước trên mái\n\n${TANK.mat[0].toUpperCase()+TANK.mat.slice(1)}. Thân Ø ${n(TANK.dia)} × ${n(TANK.len)} m `
     +`trên giá cao ${n(TANK.stand)} m; bốn chân thép ${Math.round(TANK.leg*1000)} × ${Math.round(TANK.leg*1000)} mm, mỗi chân một `
     +`**bản đế ${Math.round(TANK.pad*1000)} × ${Math.round(TANK.pad*1000)} mm** dàn tải xuống lớp chống nóng — chân trần đặt thẳng lên tấm lát thì ép quá sức XPS.\n\n`;
    s+=`| Mã | Dung tích | Trục nằm | Hình chiếu x₁ · y₁ · x₂ · y₂ | Chân giá cốt | Đỉnh bồn cốt |\n|---|---:|---|---|---:|---:|\n`;
    for(const t of tanks)
      s+=`| ${t.id} | ${t.volume} L | ${t.axis==='x'?'ngang':'dọc'} | ${[t.x,t.y,t.x+t.w,t.y+t.h].map(q=>n(q)).join(' · ')} | ${n(t.base)} | ${n(t.top)} |\n`;
  }
  const racks=racksOf(v).filter(r=>!r.errors.length);
  if(racks.length){
    s+=`\n### Giàn phơi\n\n${RACK.mat[0].toUpperCase()+RACK.mat.slice(1)}. Trụ cao ${n(RACK.height)} m, `
     +`${RACK.levels.length} thanh phơi ở cao độ ${RACK.levels.map(x=>n(x)).join(' · ')} m tính từ cốt sân. `
     +`Đặt ngoài trời, ở dải sân chừa không lợp mái — treo dưới mái thì mất nắng.\n\n`;
    s+=`| Mã | Sân | Trục | Vị trí | Từ | Đến | Dài tuyến | Tổng dây phơi |\n|---|---|---|---:|---:|---:|---:|---:|\n`;
    for(const r of racks){
      const room=v.rooms.find(x=>x[0]===r.room);
      s+=`| ${r.id} | ${room?room[1]:'—'} | ${axisName(r.ax)} | ${n(r.pos)} | ${n(r.a)} | ${n(r.b)} | ${n(r.b-r.a)} m | ${n(r.length)} m |\n`;
    }
  }
  if((v.fullHeightWalls||[]).length){
    s+=`\n### Tường xây lên hết chiều cao nhà\n\nChiều cao tường mặc định suy từ phòng áp vào; các đoạn dưới đây khai riêng dù chỉ áp vào sân.\n\n`;
    s+=`| Trục | Vị trí | Từ | Đến |\n|---|---:|---:|---:|\n`;
    for(const [ax,pos,a,b] of v.fullHeightWalls)
      s+=`| ${axisName(ax)} | ${n(pos,1)} | ${n(a,1)} | ${n(b,1)} |\n`;
  }
  if(Object.keys(v.floorLevels||{}).length){
    s+=`\n### Cốt sàn riêng\n\nMặc định phòng kín và ban công ở cốt nền nhà, sân ở cốt sân. Các phòng dưới đây khai riêng:\n\n`;
    s+=Object.entries(v.floorLevels).map(([id,lv])=>{
      const r=v.rooms.find(x=>x[0]===id);
      return `- ${id} ${r?r[1]:'(không có phòng mã này)'} — cao hơn sân **${n(lv)} m**`;
    }).join('\n')+'\n';
  }
  const drops=dropCeilingsOf(v).filter(c=>!c.error);
  if(drops.length){
    s+=`\n### Trần giả\n\nTrần thạch cao / nhựa treo dưới bản mái bê tông, phủ phần lọt lòng; bản mái và tường giữ nguyên cốt.\n\n`;
    s+=drops.map(c=>`- ${c.id} ${c.name} — trần cao **${n(c.h)} m** tính từ sàn phòng (cốt ${n(c.y)} so với sân)`).join('\n')+'\n';
  }

  s+=`\n## 7. Tường\n\n`;
  const H=heightsOf(v);
  if(H.fenceSolid!=null && H.fenceSolid<H.fence)
    s+=`**Tường rào** (đoạn chỉ áp sân, không phải tường nâng): xây đặc cao **${n(H.fenceSolid)} m** so với sân, `
     +`phía trên là **lan can song thoáng** tới đỉnh rào **${n(H.fence)} m** — trụ ${Math.round(RAILING.post*1000)} mm `
     +`cách nhau ≤ ${n(RAILING.postGap,1)} m, song ${Math.round(RAILING.bar*1000)} mm bước ${Math.round(RAILING.pitch*1000)} mm; `
     +`chừa trống trên cổng và cửa.\n\n`;
  s+=`| Trục | Vị trí | Từ | Đến | Dày (mm) |\n|---|---:|---:|---:|---:|\n`;
  for(const [ax,pos,a,b,t] of v.walls)
    s+=`| ${axisName(ax)} | ${n(pos,1)} | ${n(a,1)} | ${n(b,1)} | ${Math.round(t*1000)} |\n`;

  s+=`\n## 8. Nội thất\n\n| Loại | x | y | Rộng | Sâu |\n|---|---:|---:|---:|---:|\n`;
  for(const [k,x,y,w,h] of v.furn)
    s+=`| ${k} | ${n(x)} | ${n(y)} | ${n(w)} | ${n(h)} |\n`;

  s+=`\n---\n\n## 9. Điểm cần lưu ý\n\n${toMd(v.warn)}\n`;

  s+=`\n## 10. Kết quả bộ kiểm tra\n\n`;
  s+=errors.length ? `**${errors.length} lỗi:**\n\n`+errors.map(x=>`- ${x}`).join('\n')+'\n\n'
                 : `**Sạch — qua toàn bộ ${CHECKS.length} phép kiểm.**\n\n`;
  s+=CHECKS.map((c,i)=>`${i+1}. ${c}`).join('\n')+'\n';

  s+=`\n---\n\n## 11. Lịch sử phiên bản\n\n| Bản | Nội dung | DT kín |\n|---|---|---:|\n`;
  for(const x of PLANS)
    s+=`| ${x.id}${x===v?' ←':''} | ${x.label.replace(/^[^—]*—\s*/, '')} | ${n(x.areas.kin,1)} |\n`;
  s+=`\n### Thay đổi ở ${v.label}\n\n`+v.changes.map(c=>`- ${toMd(c)}`).join('\n')+'\n';
  return s;
}
