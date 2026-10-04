/* Cổng hạ xuống đường, sân bằng để mở cánh, rồi dốc trong sân phụ. Mốc cao độ là sân trên. */
import {siteGroundsOf, siteLevelsOf} from './lot.js';
export function accessOf(v){
  const a=v.site?.access, gate=a&&v.gates[a.gate];
  if(!gate || gate[0]!=='h' || gate[1]<0) return null;
  const yard=v.rooms.find(r=>r[0]==='L1'), ground=siteGroundsOf(v).find(b=>b.siteLot==='main');
  const bottom=siteLevelsOf(v).right, gatePos=gate[1], landingEnd=gatePos+a.landing, end=landingEnd+a.length;
  return {...a, bottom, gatePos, landingEnd, end, x:ground.x, w:yard[2]+yard[4]-ground.x, front:ground.z,
    slope: -bottom/a.length, gateBase:bottom};
}
export function accessSurfaceAt(v,x,z){
  const a=accessOf(v);
  if(!a || x<a.x || x>a.x+a.w || z<a.front || z>a.end) return 0;
  return z<=a.landingEnd ? a.bottom : a.bottom*(a.end-z)/a.length;
}
export function buildAccess(v){
  const a=accessOf(v); if(!a) return {boxes:[],prisms:[]};
  const grounds=siteGroundsOf(v), main=grounds.find(b=>b.siteLot==='main');
  const xmin=Math.min(...grounds.map(b=>b.x)), xmax=Math.max(...grounds.map(b=>b.x+b.w));
  return {boxes:[
    {...main, z:a.end, d:main.z+main.d-a.end},
    {...main, x:a.x+a.w, w:main.x+main.w-a.x-a.w, d:a.end-main.z},
    {...main, w:a.w, d:a.landingEnd-main.z, y1:a.bottom},
    {x:xmin,w:xmax-xmin,z:a.front-a.roadWidth,d:a.roadWidth,y0:a.bottom-0.12,y1:a.bottom,kind:'road'},
  ],prisms:[{x:a.x,w:a.w,z:a.landingEnd,d:a.length,axis:'z',yb:[main.y0,main.y0],yt:[a.bottom,0],
    y0:main.y0,y1:0,kind:'ramp',siteLot:'main'}]};
}
