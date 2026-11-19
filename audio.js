const DEFAULT={masterVolume:.7,enabled:true};
export function createAudio(){return{context:null,master:null,volume:DEFAULT.masterVolume,enabled:true,engineOsc:null,engineGain:null,ambientOsc:null,ambientGain:null};}
export async function initializeAudio(a){if(!a)return;try{if(!a.context){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;a.context=new AC();a.master=a.context.createGain();a.master.gain.value=a.enabled?a.volume:0;a.master.connect(a.context.destination);}if(a.context.state==='suspended')await a.context.resume();}catch(e){console.warn('Audio unavailable',e);}}
function tone(a,freq,duration,type='sine',gain=.08){if(!a?.context||!a.master||!a.enabled)return;const c=a.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);o.connect(g);g.connect(a.master);o.start();o.stop(c.currentTime+duration);}
export function startAmbient(a){if(!a?.context||a.ambientOsc)return;const o=a.context.createOscillator(),g=a.context.createGain();o.type='sine';o.frequency.value=48;g.gain.value=.018;o.connect(g);g.connect(a.master);o.start();a.ambientOsc=o;a.ambientGain=g;}
export function playJump(a){tone(a,420,.16,'sine',.08);}
export function playSlide(a){tone(a,180,.22,'sawtooth',.035);}
export function playCollision(a){tone(a,75,.45,'sawtooth',.15);}
export function playCollect(a){tone(a,880,.12,'sine',.08);setTimeout(()=>tone(a,1180,.12,'sine',.06),65);}
export function playLaneChange(a){tone(a,520,.07,'triangle',.035);}
export function startEngine(a){if(!a?.context||a.engineOsc)return;const o=a.context.createOscillator(),g=a.context.createGain();o.type='sawtooth';o.frequency.value=65;g.gain.value=.018;o.connect(g);g.connect(a.master);o.start();a.engineOsc=o;a.engineGain=g;}
export function updateEngine(a,speed=0){if(a?.engineOsc)a.engineOsc.frequency.setTargetAtTime(55+speed*3,a.context.currentTime,.08);}
export function stopEngine(a){if(!a?.engineOsc)return;try{a.engineOsc.stop();}catch{}a.engineOsc.disconnect();a.engineGain?.disconnect();a.engineOsc=null;a.engineGain=null;}
export function setMasterVolume(a,v){if(!a)return;a.volume=Math.max(0,Math.min(1,v));if(a.master)a.master.gain.setTargetAtTime(a.enabled?a.volume:0,a.context.currentTime,.03);}
export function setAudioEnabled(a,on){if(!a)return;a.enabled=!!on;if(a.master)a.master.gain.setTargetAtTime(on?a.volume:0,a.context.currentTime,.03);}
export function stopAmbient(a){if(!a?.ambientOsc)return;try{a.ambientOsc.stop();}catch{}a.ambientOsc.disconnect();a.ambientGain?.disconnect();a.ambientOsc=null;a.ambientGain=null;}
export function pauseAudio(a){if(a?.context?.state==='running')a.context.suspend();}
export async function resumeAudio(a){if(a?.context?.state==='suspended')await a.context.resume();}
export function disposeAudio(a){if(!a)return;stopEngine(a);stopAmbient(a);a.context?.close();}
