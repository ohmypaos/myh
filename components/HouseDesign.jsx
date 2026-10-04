'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CURRENT } from '../lib/versions/index.js';
import { houseFloor, validateHouse, slidingPanels } from '../lib/house.js';
import { mountHouseScene } from './houseScene.js';
import { KEY_DATES } from '../lib/sun.js';
import { neighborLotsOf } from '../lib/lot.js';
import { buildNeighborHouse } from '../lib/surroundings.js';
import { furnitureOf, FURNITURE_SOURCES } from '../lib/furniture.js';
import '../app/house.css';

const h=CURRENT.house;
const n=x=>x.toFixed(2).replace('.',',');
const cm=x=>(Math.round(x*1000)/10).toString().replace('.',',');

function NeighborDrawing(){
  const neighbor=buildNeighborHouse(CURRENT);
  return <g>
    {neighborLotsOf(CURRENT).map(l=><g key={l.name}><rect x={l.x} y={l.z} width={l.w} height={l.d} fill="#e7ece3" stroke="#8e9d86" strokeWidth=".045"/>
      <text x={l.x+l.w/2} y="4" className="house-yard-label">{l.name} · {n(l.w)} × {n(l.d)} m</text></g>)}
    {[['THÂN NHÀ HÀNG XÓM',neighbor.footprint,'#ded9cc'],['HIÊN NHÀ HÀNG XÓM',neighbor.porch,'#eae5d9'],['MÁI SÂN HÀNG XÓM',neighbor.yard,'#c6d2d4']].map(([name,r,fill])=><g key={name}><rect x={r.x} y={r.z} width={r.w} height={r.d} fill={fill} stroke="#8e9d86" strokeWidth=".035"/><text x={r.x+r.w/2} y={r.z+r.d/2} className="house-yard-label">{name}</text></g>)}
  </g>;
}

function FloorDrawing({index,site=false}) {
  const f=houseFloor(CURRENT,index), front=h.front;
  return <g>
    {site&&<NeighborDrawing/>}
    {site&&<><rect x="0" y="0" width="8.5" height="30" fill="#ecede5" stroke="#7f8974" strokeWidth=".035"/>
      <path d="M4.5 0V30" stroke="#b6beab" strokeWidth=".035"/>
      <text x="2.25" y="5" className="house-yard-label">SÂN TRƯỚC {n(h.front)} m</text>
      <text x="6.5" y="15" className="house-yard-label">LÔ PHỤ 4 m</text>
      <rect x="4.5" y="25" width="4" height="3" fill="#d4ddcf" stroke="#a6b49a" strokeWidth=".025"/>
      <text x="6.5" y="26.5" className="house-yard-label">MÁI SÂN PHƠI</text>
      <rect x="0" y="0" width="4.5" height="2.3" fill="#dddacb"/>
      <rect x="0" y="2.3" width="4.5" height="6.4" fill="#e3dfd4"/>
      <text x="2.25" y="7" className="house-yard-label">DỐC LÊN SÂN</text>
      <path d="M.11 0H4.39" stroke="#4a534d" strokeWidth=".09"/>
      <text x="2.25" y="-.45" className="house-yard-label">CỔNG / ĐƯỜNG</text></>}
    <g transform={`translate(0 ${front})`}>
      <rect width={h.width} height={h.depth-h.rearBalcony} fill="#faf8f2"/>
      {index===1&&<><rect y={-h.frontBalcony} width={h.width} height={h.frontBalcony} fill="#dfeadf" stroke="#678476" strokeWidth=".04"/>
        <text x="2.25" y="-1.05" className="house-room-label">BAN CÔNG TRƯỚC 1,8 m</text>
        <text x="2.25" y="-.62" className="house-small-label">Đua ra sân • che cửa tầng 1</text></>}
      {f.rooms.map(r=><g key={r.id}>
        <rect x={r.x} y={r.y} width={r.w} height={r.d} fill={r.type==='wet'?'#e4edf2':r.id==='altar'?'#f1e5da':'#f7eedc'}/>
      </g>)}
      {f.furniture.map(([kind,x,y,w,d,meta])=><g key={meta.id}>
        <title>{`${meta.id} — ${meta.name} · ${cm(w)} × ${cm(d)} × ${cm(meta.height)} cm · ${meta.note}`}</title>
        <rect x={x} y={y} width={w} height={d} rx=".045" fill={kind==='bed'?'#e7dccb':'#c7b398'} stroke="#9c896e" strokeWidth=".025"/>
        {kind==='sofa'&&<>
          <rect x={x+.12} y={y+.12} width={w-.24} height={d-.24} rx=".05" fill="#f1e5d1"/>
          <path d={meta.facing==='left'?`M${x+w-.1} ${y+.1}v${d-.2}`:meta.facing==='front'?`M${x+.1} ${y+d-.1}h${w-.2}`:`M${x+.1} ${y+.1}h${w-.2}`} stroke="#8c704f" strokeWidth=".06"/>
        </>}
        {kind==='shelf'&&[1,2].map(i=><path key={i} d={`M${x+w*i/3} ${y}v${d}`} stroke="#9c896e" strokeWidth=".025"/>)}
        {kind==='bed'&&<><rect x={x+.045} y={y+.08} width={w-.09} height={d-.16} rx=".04" fill="#fffaf1"/>
          <path d={`M${x+w-.5} ${y+.12}v${d-.24}`} stroke="#c7b398" strokeWidth=".04"/></>}
        <text x={x+w/2} y={y+d/2+.045} className="house-furniture-label">{meta.id}</text>
      </g>)}
      {f.walls.map((w,i)=><rect key={i} x={w.ax==='h'?w.a:w.pos-w.t/2} y={w.ax==='h'?w.pos-w.t/2:w.a} width={w.ax==='h'?w.b-w.a:w.t} height={w.ax==='h'?w.t:w.b-w.a} fill="#3c4846"/>)}
      {f.openings.map(o=><g key={o.id}>
        <path d={o.ax==='h'?`M${o.a} ${o.pos}H${o.b}`:`M${o.pos} ${o.a}V${o.b}`} stroke="#faf8f2" strokeWidth={(f.walls.find(w=>w.ax===o.ax&&w.pos===o.pos)?.t??f.wall)+.014}/>
        {o.style==='slide'?<>
          {o.type==='door'?<>{slidingPanels(o).map(p=><path key={p.index} d={o.ax==='h'?`M${p.a} ${o.pos+p.offset}H${p.b}`:`M${o.pos+p.offset} ${p.a}V${p.b}`} stroke="#374b4e" strokeWidth=".04"/>)}
            <path d={`M${(o.a+o.b)/2-.12} ${o.pos+.2}h-.38l.09-.07m-.09.07.09.07M${(o.a+o.b)/2+.12} ${o.pos+.2}h.38l-.09-.07m.09.07-.09.07`} fill="none" stroke="#2696ad" strokeWidth=".025"/></>:<path d={o.ax==='h'?`M${o.a} ${o.pos-.025}H${o.b}M${o.a} ${o.pos+.025}H${o.b}`:`M${o.pos-.025} ${o.a}V${o.b}M${o.pos+.025} ${o.a}V${o.b}`} stroke="#2696ad" strokeWidth=".025"/>}
          <title>{o.name}</title></>:<>
          {Array.from({length:o.style==='double'?2:1},(_,k)=>{const span=(o.b-o.a)/(o.style==='double'?2:1),hinge=k?o.b:o.a,sign=o.swingSign??1;
            return <g key={k}><path d={o.ax==='h'?`M${hinge} ${o.pos}v${sign*span}`:`M${o.pos} ${hinge}h${sign*span}`} stroke="#8b704b" strokeWidth=".03"/>
            <path d={o.ax==='h'?`M${hinge+(k?-span:span)} ${o.pos}A${span} ${span} 0 0 ${sign*(k?-1:1)>0?1:0} ${hinge} ${o.pos+sign*span}`:`M${o.pos} ${hinge+span}A${span} ${span} 0 0 ${sign>0?0:1} ${o.pos+sign*span} ${hinge}`} fill="none" stroke="#8b704b" strokeWidth=".018" strokeDasharray=".06 .035"/></g>;})}
          <title>{o.name}</title></>}
      </g>)}
      {index===0&&<g stroke="#9b8164" strokeWidth=".025" fill="#ddd5c9">
        <rect y={-h.frontPorch} width={h.width} height={h.frontPorch}/>
        {[0,1].map(i=><rect key={i} y={-h.frontPorch-.6+i*.3} width={h.width} height=".3"/>)}
        <text x="2.25" y={-h.frontPorch/2} className="house-small-label">HIÊN NHỎ · {n(h.frontPorch)} m · CÙNG CỐT SÀN</text>
        {CURRENT.planters.filter(p=>p[0]==='CC1'||p[0]==='CC2').map(([id,x,y,desc])=><circle key={id} cx={x} cy={y-front} r=".22" fill="#78975c" stroke="#567443"><title>{desc}</title></circle>)}
      </g>}
      <g>
        <rect x={h.stair.x} y={h.stair.y} width="3" height="2" fill="#ddd5c9" stroke="#9b8164" strokeWidth=".035"/>
        {Array.from({length:9},(_,i)=><path key={i} d={`M${h.stair.x+i*.25} ${h.stair.y}v.95M${h.stair.x+i*.25} ${h.stair.y+1.05}v.95`} stroke="#9b8164" strokeWidth=".022"/>)}
        <path d={`M${h.stair.x+2} ${h.stair.y}v2`} stroke="#9b8164" strokeWidth=".028"/>
        <path transform={`translate(0 ${h.stair.y-8.8})`} d="M1.5 9.25H3.75V10.3H1.55l.18-.16m-.18.16.18.16" fill="none" stroke="#a05b36" strokeWidth=".035"/>
        <text x="2.55" y={h.stair.y+1.02} className="house-small-label">THANG U · 3 × 2 m</text>
        <text x="3.77" y={h.stair.y+1.26} className="house-small-label">Nghỉ</text>
      </g>
      {f.rooms.map(r=>{
        const living=r.id==='living',x=living?.22:r.x+.06,y=living?3.65:r.y+r.d-.72,w=living?1.2:r.w-.12;
        return <g key={`label-${r.id}`}>
          <rect x={x} y={y} width={w} height=".62" rx=".06" fill="#faf8f2" opacity=".86"/>
          <text x={x+w/2} y={y+.22} className="house-room-label" style={living?{fontSize:'.14px'}:undefined}>{r.name}</text>
          <text x={x+w/2} y={y+.53} className="house-small-label" style={living?{fontSize:'.1px'}:undefined}>{n(r.w)} × {n(r.d)} m · {n(r.w*r.d)} m²</text>
        </g>;
      })}
      <text x=".65" y={index?5.65:h.stair.y+.8} className="house-small-label" transform={`rotate(-90 .65 ${index?5.65:h.stair.y+.8})`}>HÀNH LANG {index?'1,0':'0,9'} m</text>
      <path d={`M0 ${h.depth+.55}H${h.width}M0 ${h.depth+.4}v.3M${h.width} ${h.depth+.4}v.3`} stroke="#a25543" strokeWidth=".022"/>
      <text x="2.25" y={h.depth+.93} className="house-dim-label">4,50 m</text>
      <path d={`M-.4 0V${h.depth}M-.53 0h.26M-.53 ${h.depth}h.26`} stroke="#a25543" strokeWidth=".022"/>
      <text x="-.58" y={h.depth/2} className="house-dim-label" transform={`rotate(-90 -.58 ${h.depth/2})`}>{n(h.depth)} m · {n(h.width*h.depth)} m² / tầng</text>
      <text x="2.25" y="-2.15" className="house-floor-title">TẦNG {index+1} · TƯỜNG {f.wall*1000} mm</text>
      {!site&&<text x="2.25" y="-2.65" className="house-small-label">↑ PHÍA CỔNG CHÍNH</text>}
    </g>
  </g>;
}

function PlanViewer({floor,site}) {
  const svg=useRef(null),drag=useRef(null),[view,setView]=useState(null);
  const initial=site?[-5.5,-1.5,25,33.5]:floor==='both'?[-1,10.8,11.7,21]:[-1,10.8,6.1,21];
  useEffect(()=>setView(null),[floor,site]);
  const v=view??initial;
  const zoom=k=>setView(old=>{const [x,y,w,d]=old??v;return [x+w*(1-k)/2,y+d*(1-k)/2,w*k,d*k];});
  function move(e){if(!drag.current)return;const rect=svg.current.getBoundingClientRect(),scale=Math.min(rect.width/v[2],rect.height/v[3]);const start=drag.current;
    setView([start.view[0]-(e.clientX-start.x)/scale,start.view[1]-(e.clientY-start.y)/scale,start.view[2],start.view[3]]);}
  function save(){const blob=new Blob([new XMLSerializer().serializeToString(svg.current)],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`nha-hai-tang-${floor}.svg`;a.click();URL.revokeObjectURL(url);}
  return <div className="house-drawing"><div className="house-floating-tools">
    <button onClick={()=>zoom(.8)} aria-label="Phóng to">＋</button><button onClick={()=>zoom(1.25)} aria-label="Thu nhỏ">−</button><button onClick={()=>setView(null)}>Vừa khung</button><button onClick={save}>Lưu SVG</button>
  </div><svg ref={svg} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Bản vẽ ${floor==='both'?'hai tầng':`tầng ${+floor+1}`}`} viewBox={v.join(' ')}
    onWheel={e=>zoom(e.deltaY>0?1.1:.9)} onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,view:v};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
    <style>{`.house-room-label{font:700 .21px 'Segoe UI',sans-serif;text-anchor:middle;fill:#263f3b}.house-small-label{font:.16px 'Segoe UI',sans-serif;text-anchor:middle;fill:#6a665c}.house-furniture-label{font:700 .18px 'Segoe UI',sans-serif;text-anchor:middle;fill:#65513e}.house-dim-label{font:.18px 'Segoe UI',sans-serif;text-anchor:middle;fill:#a25543}.house-floor-title{font:700 .26px 'Segoe UI',sans-serif;text-anchor:middle;fill:#263f3b}.house-yard-label{font:.2px 'Segoe UI',sans-serif;text-anchor:middle;fill:#66715e}`}</style>
    <FloorDrawing index={floor==='both'?0:+floor} site={site}/>
    {floor==='both'&&<g transform="translate(5.65 0)"><FloorDrawing index={1}/></g>}
  </svg></div>;
}

function FurnitureLegend({index}){
  return <section><h2>Nội thất tầng {index+1}</h2><table className="house-furniture-table"><thead><tr><th scope="col">Mã</th><th scope="col">Đồ / vị trí</th><th scope="col">D × S × C<br/>(cm)</th></tr></thead><tbody>
    {furnitureOf(CURRENT,index).map(item=><tr key={item.id}><th scope="row">{item.id}</th><td><strong>{item.name}</strong><small>{item.room} · {item.note}</small></td><td>{[item.length,item.depth,item.height].map(cm).join(' × ')}</td></tr>)}
  </tbody></table></section>;
}

function SceneViewer({floor,roof,ceiling,furniture,camera,day,hour,api,onWalkChange}) {
  const host=useRef(null),[error,setError]=useState(''),[doorHint,setDoorHint]=useState('');
  useEffect(()=>{try{api.current=mountHouseScene(host.current,CURRENT,{onWalkChange,onWalkError:setError,onDoorHint:setDoorHint});}catch(e){setError(`Không mở được WebGL: ${e.message}`);}return()=>{api.current?.dispose();api.current=null;};},[]);
  useEffect(()=>api.current?.setView({floor,roof,ceiling,furniture,camera,day,hour}),[floor,roof,ceiling,furniture,camera,day,hour]);
  return <div className="house-scene"><div className="house-scene-canvas" ref={host}/>{doorHint&&<div className="house-door-prompt" role="status"><button onClick={()=>api.current?.interactDoor()}>{doorHint}</button></div>}{error&&<p className="house-scene-message" role="status">{error}</p>}</div>;
}

export default function HouseDesign({mode,onArchive}) {
  const sceneApi=useRef(null),[walking,setWalking]=useState(false);
  const [floor,setFloor]=useState(mode==='3d'?'all':'both'),[roof,setRoof]=useState(true),[ceiling,setCeiling]=useState(true),[furniture,setFurniture]=useState(true),[site,setSite]=useState(false),[camera,setCamera]=useState('overview');
  const [day,setDay]=useState(172),[hour,setHour]=useState(10);
  const errors=validateHouse(CURRENT);
  return <main className="house-app"><header>
    <h1>NHÀ CHÍNH HAI TẦNG — {n(h.width)} × {n(h.depth)} m</h1><p className="sub">Sân trước {n(h.front)} m · Tầng 2 tường 100 mm · Mái tôn hai dốc + trần nhựa</p>
    <div className="bar"><label htmlFor="house-floor">Xem</label><select id="house-floor" value={floor} disabled={walking} onChange={e=>{setFloor(e.target.value);if(mode==='2d')setSite(false);}}>
      <option value={mode==='3d'?'all':'both'}>{mode==='3d'?'Toàn bộ nhà':'Cả hai tầng'}</option><option value="0">Tầng 1</option><option value="1">Tầng 2</option></select>
      {mode==='2d'?<button className={site?'on':''} onClick={()=>{setSite(!site);setFloor(!site?'0':'both');}}>Cả khu đất</button>:<>
        <button className={roof?'on':''} disabled={floor!=='all'} aria-pressed={roof} onClick={()=>setRoof(!roof)}>{roof?'Ẩn mái tôn':'Hiện mái tôn'}</button>
        <button className={ceiling?'on':''} disabled={floor!=='all'} aria-pressed={ceiling} onClick={()=>setCeiling(!ceiling)}>{ceiling?'Ẩn trần nhựa':'Hiện trần nhựa'}</button>
        <button onClick={()=>setFurniture(!furniture)}>{furniture?'Ẩn nội thất':'Hiện nội thất'}</button>
        <select aria-label="Góc nhìn" value={camera} disabled={walking} onChange={e=>setCamera(e.target.value)}><option value="overview">Phối cảnh nhà</option><option value="front">Mặt trước</option><option value="rear">Mặt sau</option><option value="top">Từ trên xuống</option><option value="site">Toàn khu đất</option></select>
        <button className={walking?'on':''} aria-pressed={walking} onClick={()=>{setFloor('all');sceneApi.current?.toggleWalk();}}>Đi bộ trong nhà</button>
      </>}
      <Link className="nav" href={mode==='2d'?'/3d':'/'}>{mode==='2d'?'Xem 3D →':'← Bản vẽ 2D'}</Link><button onClick={onArchive}>Kho phương án cũ</button>
    </div>
  </header><div className="house-content"><section className="house-viewer">
    {mode==='2d'?<PlanViewer floor={floor} site={site}/>:<SceneViewer floor={floor} roof={roof} ceiling={ceiling} furniture={furniture} camera={camera} day={day} hour={hour} api={sceneApi} onWalkChange={setWalking}/>}
    {walking&&<div className="house-walk-hint" role="status">Chuột: nhìn · WASD / ↑ ↓ ← →: đi · E: đóng/mở cửa gần · Esc: thoát</div>}
    <div className="house-help">{mode==='2d'?'Kéo để di chuyển · Lăn chuột để phóng / thu · Kích thước phòng là lọt lòng':walking?'Xuất phát từ cổng · Đi qua sân, vào nhà và lên cầu thang · Tầm mắt 1,58 m':'Kéo để xoay · Chuột phải để dịch · Lăn để phóng / thu · Đi bộ trong nhà: dùng chuột và bàn phím'}</div>
  </section><aside className="house-sidebar">
    {mode==='3d'&&<section><h2>Xem bóng nắng</h2><p>Bắc Giang · mặt tiền Bắc lệch Đông 16°. Giữ cả lô A, lô B và nhà hàng xóm theo mô hình cũ; bóng nắng có tính các khối này.</p>
      <label htmlFor="house-sun-day">Ngày </label><select id="house-sun-day" value={day} onChange={e=>setDay(+e.target.value)}>{KEY_DATES.map(d=><option key={d.n} value={d.n}>{d.name}</option>)}</select>
      <p><label htmlFor="house-sun-hour">Giờ: {Math.floor(hour)}:{Math.round(hour%1*60).toString().padStart(2,'0')}</label><input id="house-sun-hour" type="range" min="6" max="18" step=".25" value={hour} onChange={e=>setHour(+e.target.value)}/></p></section>}
    <h2>Bố trí đã chốt</h2><p>{CURRENT.note}</p><p className={errors.length?'house-error':'house-ok'}>{errors.length?errors.map(e=>e.msg).join(' '):'✓ Kiểm tra bố trí và hình học đạt'}</p>
    {h.floors.map((f,i)=><section key={i}><h2>Tầng {i+1} — tường {f.wall*1000} mm</h2><table><thead><tr><th>Phòng</th><th>Ngang × sâu</th><th>m²</th></tr></thead><tbody>{f.rooms.map(r=><tr key={r.id}><td>{r.name}</td><td>{n(r.w)} × {n(r.d)}</td><td>{n(r.w*r.d)}</td></tr>)}</tbody></table></section>)}
    <p>Mã trên bản vẽ 2D khớp bảng dưới. D × S × C là dài × sâu × cao, tính cả khung giường; đệm 160 × 200 cm, mặt đệm cao 50 cm. Ô tắm ghi chiều cao bệ sàn.</p>
    {h.floors.map((_,i)=>(floor==='all'||floor==='both'||+floor===i)&&<FurnitureLegend key={i} index={i}/>)}
    <details><summary>Kích thước tham khảo</summary><p>Số đo đại diện cho đồ thông dụng, chưa chốt sản phẩm mua.</p>{FURNITURE_SOURCES.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.name}</a></p>)}</details>
    <h2>Cầu thang và mái</h2><p>Thang chữ U 3 × 2 m, đặt ngang nhà. Vế rộng 0,95 m, mặt bậc 25 cm; 18 nấc cao 17 cm theo giả định cao tầng 3,06 m. Đầu thang tầng 2 ra hành lang.</p>
    <h2>Cửa chính và ban công</h2><p>Chỉ cửa chính nhôm kính ghi đậm lùa 4 cánh {n(h.doorDesign.main.width)} × {n(h.doorDesign.main.height)} m, mở giữa. Cửa master ra ban công trước lùa 2 cánh {n(h.doorDesign.balcony.width)} × {n(h.doorDesign.balcony.height)} m, trên hai ray, từ mặt sàn lên; trượt chồng sang trái hoặc phải, lối đi rộng {n(h.doorDesign.balcony.width/2)} m. Mô hình mặc định chồng sang trái. Cửa WC cả hai tầng mở vào trong WC.</p>
    <p>Thân nhà 60,3 m² mỗi tầng, chưa cộng hiên và ban công trước. Phòng thờ 3,2 × 2 m. Bỏ hiên / ban công sau, lan can, tường bên và tam cấp sau; hai phòng ngủ sau mở cửa sổ lùa 2 × 1,3 m, bệ cao 90 cm. Tường sau nhà làm tường bao, bỏ đoạn tường bao riêng phía sau nhà; giữ đoạn phía sân phơi; giữ cửa ra ban công trước của master.</p>
    <p>Sống mái chạy dọc nhà, hai mặt dốc trái / phải. Mô hình lấy dáng mái trong ảnh; mặt tiền dựng đơn giản. Trần nhựa phẳng cao 2,8 m.</p>
    <p className="note">{CURRENT.warn}</p>
  </aside></div></main>;
}
