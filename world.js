import * as THREE from 'three';

const C={length:60,count:8,lanes:[-3.8,0,3.8],roadWidth:12};
const M={
 road:new THREE.MeshStandardMaterial({color:0x101722,roughness:.9}),
 sidewalk:new THREE.MeshStandardMaterial({color:0x263044}),
 building:new THREE.MeshStandardMaterial({color:0x101a2c,metalness:.5,roughness:.65}),
 industrial:new THREE.MeshStandardMaterial({color:0x20202d,metalness:.65,roughness:.7}),
 dark:new THREE.MeshStandardMaterial({color:0x080e1a,metalness:.5}),
 cyan:new THREE.MeshStandardMaterial({color:0x00eaff,emissive:0x008da8,emissiveIntensity:2}),
 pink:new THREE.MeshStandardMaterial({color:0xff2b9b,emissive:0x9a0754,emissiveIntensity:2}),
 gold:new THREE.MeshStandardMaterial({color:0xffc857,emissive:0x8b4d08,emissiveIntensity:1.4}),
 crystal:new THREE.MeshStandardMaterial({color:0x00ffff,emissive:0x00aacc,emissiveIntensity:2}),
 carA:new THREE.MeshStandardMaterial({color:0x263d60,metalness:.8,roughness:.25}),
 carB:new THREE.MeshStandardMaterial({color:0x52234d,metalness:.75,roughness:.3})
};
const rand=(a,b)=>a+Math.random()*(b-a);
function box(w,h,d,mat,x=0,y=0,z=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=false;return m;}
function disposeGroup(g){for(const child of [...g.children]){g.remove(child);if(child.userData?.powerupMaterial)child.userData.powerupMaterial.dispose();child.traverse(o=>{if(o.geometry)o.geometry.dispose();});}}
function makeBuilding(seg,side,z,industrial=false,detail=true){
 const w=rand(5,9),h=rand(14,48),d=rand(8,13),g=new THREE.Group();g.position.set(side*rand(11,17),h/2,z);
 g.add(box(w,h,d,industrial?M.industrial:M.building));
 g.add(box(.1,h*.8,.1,industrial?M.gold:M.cyan,side*w*.45,0,-d/2-.06));
 if(detail)for(let y=-h/2+2;y<h/2-1;y+=2.6)for(let x=-w/2+1;x<w/2-1;x+=1.6)if(Math.random()>.45)g.add(box(.38,.65,.05,Math.random()>.5?M.cyan:M.pink,x,y,-d/2-.07));
 seg.add(g);
}
function obstacle(type,x,z){
 const g=new THREE.Group();
 if(type==='drone'){const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(.72,1),M.pink);shell.position.y=1.65;g.add(shell);const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.07,8,24),M.cyan);ring.rotation.x=Math.PI/2;ring.position.y=1.65;g.add(ring);for(const side of [-1,1])g.add(box(.18,.12,.65,M.gold,side*.9,1.65,0));g.position.set(x,0,z);return {mesh:g,type:'drone',height:2.4,width:2,passed:false,phase:Math.random()*6};}
 if(type==='block'){g.add(box(2.1,2.5,1.5,M.dark,0,1.25));g.add(box(2.15,.12,1.55,M.pink,0,1.8));}
 else if(type==='laser'){g.add(box(.18,2,.18,M.dark,-1.15,1));g.add(box(.18,2,.18,M.dark,1.15,1));g.add(box(2.5,.12,.12,M.pink,0,1.6));}
 else{g.add(box(1.8,.8,.6,M.pink,0,.4));g.add(box(1.5,.1,.65,M.cyan,0,.55));}
 g.position.set(x,0,z);return {mesh:g,type,height:type==='block'?2.5:1.6,width:2,passed:false};
}
function makeTrafficCar(x,z,variant=0){
 const g=new THREE.Group(),body=box(1.65,.65,3,variant?M.carB:M.carA,0,.65,0),roof=box(1.15,.48,1.45,M.dark,0,1.18,-.12);
 g.add(body,roof);g.add(box(1.25,.08,.08,M.cyan,0,.72,1.52));g.add(box(.16,.12,.08,M.pink,-.58,.55,-1.52));g.add(box(.16,.12,.08,M.pink,.58,.55,-1.52));
 for(const xw of [-.78,.78])for(const zw of [-.9,.9]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.12,10),M.dark);wheel.rotation.z=Math.PI/2;wheel.position.set(xw,.28,zw);g.add(wheel);}
 g.position.set(x,0,z);return {mesh:g,type:'traffic',height:1.4,width:1.8,passed:false,traffic:true};
}
function crystal(x,z){const g=new THREE.Group(),gem=new THREE.Mesh(new THREE.OctahedronGeometry(.48),M.crystal);gem.position.y=1.1;g.add(gem);const ring=new THREE.Mesh(new THREE.TorusGeometry(.68,.035,8,24),M.pink);ring.rotation.x=Math.PI/2;ring.position.y=1.1;g.add(ring);g.position.set(x,0,z);return{mesh:g,collected:false,value:1,phase:Math.random()*6};}
const POWER_TYPES=['shield','magnet','multiplier','repair'];
function powerup(x,z){
 const type=POWER_TYPES[Math.floor(Math.random()*POWER_TYPES.length)],g=new THREE.Group();
 const colors={shield:0x48a8ff,magnet:0xff4bd8,multiplier:0xffc857,repair:0x59ff9b};
 const mat=new THREE.MeshStandardMaterial({color:colors[type],emissive:colors[type],emissiveIntensity:1.8,metalness:.35,roughness:.25});
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.55,1),mat);core.position.y=1.2;g.add(core);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.78,.045,8,24),M.cyan);ring.rotation.x=Math.PI/2;ring.position.y=1.2;g.add(ring);
 g.position.set(x,0,z);g.userData.powerupMaterial=mat;return{mesh:g,type,collected:false,phase:Math.random()*6,material:mat};
}
function addTunnel(seg){
 for(let z=-8;z>-C.length;z-=12){const arch=new THREE.Group();arch.position.z=z;arch.add(box(.35,6,.4,M.dark,-5.6,3),box(.35,6,.4,M.dark,5.6,3),box(11.5,.35,.5,M.dark,0,6));arch.add(box(.08,.08,.6,M.cyan,0,5.72));seg.add(arch);}
}
function addBridge(seg){
 for(const side of [-1,1]){seg.add(box(.28,1.5,C.length,M.dark,side*6.1,.65,-C.length/2));for(let z=-8;z>-C.length;z-=15){seg.add(box(.22,7,.22,M.dark,side*6.4,3.5,z));seg.add(box(1.4,.08,.08,M.pink,side*6.4,6.9,z));}}
}
function populate(seg,index){
 seg.userData.obstacles=[];seg.userData.pickups=[];seg.userData.powerups=[];seg.userData.traffic=[];const zone=index%4,industrial=zone===1,detail=index<C.count/2;
 seg.add(box(C.roadWidth,.25,C.length,M.road,0,-.2,-C.length/2));
 for(const s of [-1,1]){seg.add(box(3,.4,C.length,M.sidewalk,s*7.5,-.12,-C.length/2));for(let i=0;i<4;i++)makeBuilding(seg,s,-7-i*14,industrial,detail);for(let i=0;i<3;i++){const pole=new THREE.Group();pole.position.set(s*7.1,0,-12-i*20);pole.add(box(.12,5,.12,M.dark,0,2.5));pole.add(box(.8,.1,.1,zone===1?M.gold:M.cyan,-s*.4,4.8));seg.add(pole);}}
 for(const x of [-1.9,1.9])for(let i=0;i<6;i++)seg.add(box(.07,.025,4,M.cyan,x,-.05,-5-i*10));
 if(zone===2)addTunnel(seg);if(zone===3)addBridge(seg);
 const lanes=[...C.lanes].sort(()=>Math.random()-.5),n=1+Math.floor(Math.random()*2);
 for(let i=0;i<n;i++)if(Math.random()<.72){const o=obstacle(['barrier','barrier','block','laser'][Math.floor(Math.random()*4)],lanes[i],-rand(18,53));seg.add(o.mesh);seg.userData.obstacles.push(o);}
 if((zone===0||zone===3)&&Math.random()<.34){const lane=C.lanes[Math.floor(Math.random()*3)],d=obstacle('drone',lane,-rand(24,50));seg.add(d.mesh);seg.userData.obstacles.push(d);}
 if(zone!==2&&Math.random()<.65){const lane=C.lanes[Math.floor(Math.random()*3)],car=makeTrafficCar(lane,-rand(28,54),Math.random()>.5?1:0);seg.add(car.mesh);seg.userData.traffic.push(car);seg.userData.obstacles.push(car);}
 if(Math.random()<.82){const lane=C.lanes[Math.floor(Math.random()*3)],z=-rand(16,25);for(let i=0;i<3;i++){const p=crystal(lane,z-i*3);seg.add(p.mesh);seg.userData.pickups.push(p);}}
 if(Math.random()<.48){const lane=C.lanes[Math.floor(Math.random()*3)],item=powerup(lane,-rand(27,51));seg.add(item.mesh);seg.userData.powerups.push(item);}
 seg.userData.zone=zone;
}
function refresh(w){w.obstacles=w.segments.flatMap(s=>s.userData.obstacles);w.pickups=w.segments.flatMap(s=>s.userData.pickups);w.powerups=w.segments.flatMap(s=>s.userData.powerups||[]);w.traffic=w.segments.flatMap(s=>s.userData.traffic);}
export function createWorld(scene){const w={scene,segments:[],obstacles:[],pickups:[],powerups:[],traffic:[],totalDistance:0,nextIndex:C.count};for(let i=0;i<C.count;i++){const s=new THREE.Group();s.position.z=-i*C.length;populate(s,i);scene.add(s);w.segments.push(s);}refresh(w);return w;}
export function resetWorld(w){if(!w)return;w.totalDistance=0;w.nextIndex=C.count;w.segments.forEach((s,i)=>{disposeGroup(s);s.position.set(0,0,-i*C.length);populate(s,i);});refresh(w);}
export function updateWorld(w,delta,speed){if(!w||delta<=0)return;const move=Math.max(0,speed)*Math.min(delta,.05);w.totalDistance+=move;let changed=false;for(const s of w.segments){s.position.z+=move;for(const car of s.userData.traffic||[]){car.mesh.position.z+=move*.18;if(car.mesh.position.z>-4)car.mesh.position.z=-54;}for(const o of s.userData.obstacles||[]){if(o.type==='drone'){o.phase=(o.phase||0)+delta*2.2;o.mesh.position.y=Math.sin(o.phase)*.22;o.mesh.rotation.y+=delta*.8;}}if(s.position.z>C.length){const min=Math.min(...w.segments.map(x=>x.position.z));s.position.z=min-C.length;disposeGroup(s);populate(s,w.nextIndex++);changed=true;}}if(changed)refresh(w);for(const p of w.pickups){if(p.collected)continue;p.phase+=delta;p.mesh.rotation.y+=delta*1.7;p.mesh.children[0].position.y=1.1+Math.sin(p.phase*2)*.12;}for(const p of w.powerups||[]){if(p.collected)continue;p.phase+=delta;p.mesh.rotation.y+=delta*1.35;p.mesh.position.y=.12+Math.sin(p.phase*2)*.14;}}
export const getObstacles=w=>w?.obstacles||[];export const getPickups=w=>w?.pickups||[];export const getPowerups=w=>w?.powerups||[];
export function collectPowerup(p){if(!p||p.collected)return false;p.collected=true;p.mesh.visible=false;if(p.material)p.material.dispose();return true;}
export function collectCrystal(p){if(!p||p.collected)return false;p.collected=true;p.mesh.visible=false;return true;}
export function disposeWorld(w){if(!w)return;for(const s of w.segments){w.scene.remove(s);disposeGroup(s);}w.segments=[];w.obstacles=[];w.pickups=[];w.powerups=[];w.traffic=[];w.totalDistance=0;}
