import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildMassing } from '../lib/massing.js';
import { buildSurroundings, buildNeighborHouse } from '../lib/surroundings.js';
import { COLORS } from './palette.js';
import { LOT, neighborLotsOf } from '../lib/lot.js';
import { sunPosition, toSceneVector } from '../lib/sun.js';

const colors={...COLORS,houseWall:0xe7e6d9,floor:0xe1d6bf,metalRoof:0x697b81,
  pvcCeiling:0xf4eee3,ceilingSeam:0xcfc8ba,gableWall:0xd8ddd2,windowFrame:0x374b4e,
  mattress:0xfff4de,stair:0xc6ae8f,stairRail:0x435456,downpipe:0x536b70,siteRoof:0x8b999b};
const roofKinds=new Set(['metalRoof','roofSeam','gableWall','gutter','downpipe']);
const ceilingKinds=new Set(['pvcCeiling','ceilingSeam']);
const furnitureKinds=new Set(['furniture','mattress']);

function prismGeometry(p){
  const c=(x,z,top)=>[p.x+x*p.w,(top?p.yt:p.yb)[p.axis==='x'?x:z],p.z+z*p.d];
  const A=c(0,0,0),B=c(1,0,0),C=c(1,1,0),D=c(0,1,0),a=c(0,0,1),b=c(1,0,1),d=c(1,1,1),e=c(0,1,1);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([A,B,C,A,C,D,a,d,b,a,e,d,A,a,B,a,b,B,D,C,e,C,d,e,A,D,a,D,e,a,B,b,C,b,d,C].flat(),3));g.computeVertexNormals();return g;
}

export function mountHouseScene(host,plan){
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xe8eee9);
  const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  const camera=new THREE.PerspectiveCamera(42,1,.1,200);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.49;controls.minDistance=3;controls.maxDistance=85;
  scene.add(new THREE.HemisphereLight(0xffffff,0x849078,2.5));
  const sun=new THREE.DirectionalLight(0xfff2d9,3);sun.position.set(-12,23,-8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-25,right:25,top:30,bottom:-30,far:100});sun.shadow.bias=-.0004;sun.target.position.set(2.25,0,21);scene.add(sun,sun.target);
  const materials=new Map(),objects=[];
  function material(kind){if(!materials.has(kind))materials.set(kind,new THREE.MeshStandardMaterial({color:colors[kind]??0xb9c5b5,roughness:kind==='metalRoof'?.55:.85,metalness:kind==='metalRoof'?.25:0,side:THREE.DoubleSide}));return materials.get(kind);}
  const glassMaterial=new THREE.MeshStandardMaterial({color:0x92c3cf,transparent:true,opacity:.35,roughness:.2,depthWrite:false,side:THREE.DoubleSide});
  const massing=buildMassing(plan);
  const neighbor=buildNeighborHouse(plan);
  const surroundings=buildSurroundings(plan);
  const context=b=>({...b,environment:true,floorIndex:-1});
  function add(part,geometry,mat){const mesh=new THREE.Mesh(geometry,mat);mesh.userData=part;mesh.castShadow=!mat.transparent;mesh.receiveShadow=true;scene.add(mesh);objects.push(mesh);return mesh;}
  for(const b of [...massing.boxes,...massing.glass,...surroundings.map(context),...neighbor.boxes.map(context)]){
    const geometry=b.shape==='ball'?new THREE.SphereGeometry(.5,14,10):new THREE.BoxGeometry(b.w,b.y1-b.y0,b.d);
    const mesh=add(b,geometry,b.kind==='glass'?glassMaterial:material(b.kind));
    if(b.shape==='ball')mesh.scale.set(b.w,b.y1-b.y0,b.d);
    mesh.position.set(b.x+b.w/2,(b.y0+b.y1)/2,b.z+b.d/2);
  }
  for(const p of [...massing.prisms,...neighbor.prisms.map(context)])add(p,prismGeometry(p),material(p.kind));
  const yard=new THREE.GridHelper(30,30,0xa6b3a1,0xc1cbbb);yard.position.set(4.25,.003,15);scene.add(yard);
  let lastCamera,lastFloor;
  function setView({floor='all',roof=true,ceiling=true,furniture=true,camera:angle='overview',day=172,hour=10}){
    const pos=sunPosition({lat:LOT.lat,lon:LOT.lon,day:+day,hour:+hour}),dir=toSceneVector(pos.azimuth,pos.altitude,LOT.frontAzimuth);
    sun.position.set(2.25+dir.x*50,dir.y*50,21+dir.z*50);sun.visible=pos.up;
    for(const o of objects){const b=o.userData,idx=b.floorIndex??-1;
      o.visible=floor==='all'||idx===-1||idx===+floor||(floor==='1'&&(b.kind==='stair'||b.kind==='stairRail'));
      if(!b.environment&&roofKinds.has(b.kind))o.visible=floor==='all'&&roof;
      if(!b.environment&&ceilingKinds.has(b.kind))o.visible=floor==='all'&&ceiling;
      if(furnitureKinds.has(b.kind)&&!furniture)o.visible=false;
    }
    yard.visible=angle==='site';
    if(lastCamera!==angle||lastFloor!==floor){
      const y=floor==='1'?4.8:floor==='0'?1.5:3.5;
      const lots=neighborLotsOf(plan),siteCenter=(Math.min(0,...lots.map(l=>l.x))+Math.max(LOT.w,...lots.map(l=>l.x+l.w)))/2;
      const target=angle==='site'?[siteCenter,1.6,15]:[2.25,y,21.3];
      const positions={overview:[18,y+16,3],front:[2.25,y+3,-1],rear:[2.25,y+5,45],top:[2.25,32,21.5],site:[siteCenter+35,37,-25]};
      camera.position.set(...positions[angle]);controls.target.set(...target);controls.update();lastCamera=angle;lastFloor=floor;
    }
    // Vẽ ngay khi đổi chế độ, kể cả lúc trình duyệt tạm dừng vòng vẽ ở tab nền.
    renderer.render(scene,camera);
  }
  const observer=new ResizeObserver(()=>{const w=host.clientWidth,d=host.clientHeight;if(w&&d){renderer.setSize(w,d);camera.aspect=w/d;camera.updateProjectionMatrix();}});observer.observe(host);
  let frame;function animate(){frame=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);}setView({});animate();
  return {setView,dispose(){cancelAnimationFrame(frame);observer.disconnect();controls.dispose();objects.forEach(o=>o.geometry.dispose());yard.geometry.dispose();yard.material.dispose();materials.forEach(m=>m.dispose());glassMaterial.dispose();renderer.dispose();renderer.domElement.remove();}};
}
