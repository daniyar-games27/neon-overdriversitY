let elements={};
export function createInterface(){
 const ids=['main-menu','pause-menu','results-screen','settings-menu','game-hud','mobile-controls','distance','score','energy','speed-display','final-distance','final-score','notification','menu-best','progress-screen','characters-screen'];
 elements={};ids.forEach(id=>elements[id]=document.getElementById(id));
 const best=Number(localStorage.getItem('neon-best')||0);if(elements['menu-best'])elements['menu-best'].textContent=best;
 return elements;
}
export function showScreen(id){['main-menu','pause-menu','results-screen','settings-menu','progress-screen','characters-screen'].forEach(x=>elements[x]?.classList.toggle('active',x===id));elements['game-hud']?.classList.add('hidden');elements['mobile-controls']?.classList.add('hidden');}
export function showGameInterface(){['main-menu','pause-menu','results-screen','settings-menu','progress-screen','characters-screen'].forEach(x=>elements[x]?.classList.remove('active'));elements['game-hud']?.classList.remove('hidden');elements['mobile-controls']?.classList.remove('hidden');}
export function updateHUD(d={}){if(elements.distance)elements.distance.textContent=`${Math.floor(d.distance||0)} m`;if(elements.score)elements.score.textContent=Math.floor(d.score||0);if(elements.energy)elements.energy.textContent=`${Math.floor(d.energy??100)}%`;if(elements['speed-display'])elements['speed-display'].textContent=Math.floor(d.speed||0);}
export function resetHUD(){updateHUD({distance:0,score:0,energy:100,speed:0});}
export function showResults(d={}){if(elements['final-distance'])elements['final-distance'].textContent=Math.floor(d.distance||0);if(elements['final-score'])elements['final-score'].textContent=Math.floor(d.score||0);showScreen('results-screen');const best=saveBestScore(d.score||0);if(elements['menu-best'])elements['menu-best'].textContent=best;}
export function getBestScore(){return Number(localStorage.getItem('neon-best')||0);}
export function saveBestScore(score){const best=Math.max(getBestScore(),Math.floor(score));localStorage.setItem('neon-best',String(best));return best;}
export function showNotification(message){const el=elements.notification;if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(showNotification.timer);showNotification.timer=setTimeout(()=>el.classList.remove('show'),1200);}
export function updateEnergy(value){if(elements.energy)elements.energy.textContent=`${Math.floor(value)}%`;}
export function addScore(value){if(elements.score)elements.score.textContent=String(Number(elements.score.textContent||0)+value);}
export function addDistance(value){if(elements.distance)elements.distance.textContent=`${Math.floor(value)} m`;}
export function getResults(){return{distance:Number((elements['final-distance']?.textContent)||0),score:Number((elements['final-score']?.textContent)||0)};}
export function disposeInterface(){clearTimeout(showNotification.timer);}
