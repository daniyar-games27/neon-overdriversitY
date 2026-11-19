import * as THREE from 'three';
const CFG={followDistance:9.5,followHeight:5.2,lookHeight:1.8,lookDistance:7,positionSmoothness:4.5,rotationSmoothness:3.5,laneTilt:.055,accelerationTilt:.035,jumpCameraOffset:.7,slideCameraOffset:-.45,speedFov:7,baseFov:70,maxFov:84,movementAmplitude:.035,movementFrequency:8,shakeDecay:1.8};
export function createCamera(camera){camera.fov=CFG.baseFov;camera.updateProjectionMatrix();return{camera,position:new THREE.Vector3(),targetPosition:new THREE.Vector3(),lookTarget:new THREE.Vector3(),targetLook:new THREE.Vector3(),currentTilt:0,targetTilt:0,currentFov:CFG.baseFov,time:0,shake:0,initialized:false};}
const smooth=(a,b,s,d)=>THREE.MathUtils.lerp(a,b,1-Math.exp(-s*d));
export function updateCamera(state,player,delta,options={}){
 if(!state||!player||!state.camera||!Number.isFinite(delta)||delta<=0||options.paused)return;
 delta=Math.min(delta,.05);const c=state.camera,speed=options.speed||0,max=Math.max(options.maxSpeed||30,1),ratio=THREE.MathUtils.clamp(speed/max,0,1);
 const lane=options.lane||0,jump=!!options.jumping,slide=!!options.sliding;
 state.time+=delta;
 state.targetPosition.set(player.position.x*.55,CFG.followHeight+(jump?CFG.jumpCameraOffset:0)+(slide?CFG.slideCameraOffset:0),player.position.z+CFG.followDistance);
 state.targetLook.set(player.position.x*.3,CFG.lookHeight+(jump?.3:0),player.position.z-CFG.lookDistance);
 if(!state.initialized){state.position.copy(state.targetPosition);state.lookTarget.copy(state.targetLook);state.initialized=true;}
 state.position.lerp(state.targetPosition,1-Math.exp(-CFG.positionSmoothness*delta));
 state.lookTarget.lerp(state.targetLook,1-Math.exp(-CFG.rotationSmoothness*delta));
 c.position.copy(state.position);c.position.y+=Math.sin(state.time*CFG.movementFrequency)*CFG.movementAmplitude*ratio;
 c.lookAt(state.lookTarget);
 state.targetTilt=-lane*CFG.laneTilt-(options.accelerating?CFG.accelerationTilt:0);if(slide)state.targetTilt*=.6;
 state.currentTilt=smooth(state.currentTilt,state.targetTilt,5,delta);
 const roll=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),state.currentTilt);
 const baseQuaternion=c.quaternion.clone();
 c.quaternion.copy(baseQuaternion).multiply(roll);
 state.currentFov=smooth(state.currentFov,CFG.baseFov+ratio*CFG.speedFov,2.5,delta);c.fov=state.currentFov;c.updateProjectionMatrix();
 if(state.shake>0){const a=state.shake;c.position.x+=(Math.random()-.5)*a;c.position.y+=(Math.random()-.5)*a;state.shake=Math.max(0,a-delta*CFG.shakeDecay);}
}
export function cameraShake(state,intensity=.35){if(state)state.shake=Math.max(state.shake,intensity);}
export function resetCamera(state,player){if(!state||!player)return;state.position.set(player.position.x*.55,CFG.followHeight,player.position.z+CFG.followDistance);state.targetPosition.copy(state.position);state.lookTarget.set(player.position.x*.3,CFG.lookHeight,player.position.z-CFG.lookDistance);state.targetLook.copy(state.lookTarget);state.currentTilt=state.targetTilt=0;state.currentFov=CFG.baseFov;state.time=state.shake=0;state.initialized=true;state.camera.position.copy(state.position);state.camera.fov=CFG.baseFov;state.camera.updateProjectionMatrix();state.camera.lookAt(state.lookTarget);}
export function getCameraConfig(){return{...CFG};}
