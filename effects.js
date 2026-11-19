import * as THREE from 'three';
export function createEffects(scene){
 const rainCount=110,positions=new Float32Array(rainCount*6);for(let i=0;i<rainCount;i++){const x=(Math.random()-.5)*26,y=Math.random()*18,z=-Math.random()*90;positions.set([x,y,z,x-.08,y-.65,z],i*6);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const rain=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0x69cfff,transparent:true,opacity:.24}));scene.add(rain);
 return{scene,particles:[],enabled:true,clock:0,rain,rainCount};
}
export function createParticle(effects,position,options={}){if(!effects?.enabled)return;const mat=new THREE.MeshBasicMaterial({color:options.color||0x00eaff,transparent:true,opacity:1});const mesh=new THREE.Mesh(new THREE.SphereGeometry(options.size||.07,6,6),mat);mesh.position.copy(position);effects.scene.add(mesh);effects.particles.push({mesh,velocity:new THREE.Vector3((Math.random()-.5)*2,Math.random()*2,(Math.random()-.5)*2),life:options.life||.65,maxLife:options.life||.65});}
function burst(e,p,color,count){for(let i=0;i<count;i++)createParticle(e,p,{color,size:.06+Math.random()*.06,life:.45+Math.random()*.4});}
export function spawnCollisionEffect(e,p){burst(e,p,0xff286f,24);}export function spawnCollectionEffect(e,p){burst(e,p,0x00eaff,10);}
export function spawnPlayerTrail(e,p){if(!e?.enabled||Math.random()>.35)return;const pos=p.position.clone();pos.y+=.8;pos.z+=.3;createParticle(e,pos,{color:0x00bfff,size:.035,life:.25});}
export function updateEffects(e,delta,speed=0){if(!e)return;e.clock+=delta;const a=e.rain?.geometry?.attributes?.position;if(a){for(let i=0;i<e.rainCount;i++){let y=a.array[i*6+1]-(8+speed*.2)*delta;if(y<-.5){y=13+Math.random()*5;const x=(Math.random()-.5)*26,z=-Math.random()*90;a.array[i*6]=x;a.array[i*6+2]=z;a.array[i*6+3]=x-.08;a.array[i*6+5]=z;}a.array[i*6+1]=y;a.array[i*6+4]=y-.65;}a.needsUpdate=true;}
 for(let i=e.particles.length-1;i>=0;i--){const p=e.particles[i];p.life-=delta;p.mesh.position.addScaledVector(p.velocity,delta);p.velocity.y-=2*delta;p.mesh.material.opacity=Math.max(0,p.life/p.maxLife);if(p.life<=0){e.scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();e.particles.splice(i,1);}}}
export function resetEffects(e){if(!e)return;for(const p of e.particles){e.scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();}e.particles=[];}
export function setEffectsEnabled(e,enabled){if(e)e.enabled=!!enabled;if(e?.rain)e.rain.visible=!!enabled;}
export function disposeEffects(e){if(!e)return;resetEffects(e);if(e.rain){e.scene.remove(e.rain);e.rain.geometry.dispose();e.rain.material.dispose();}}
