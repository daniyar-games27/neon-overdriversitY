@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
:root{--cyan:#00eaff;--pink:#ff2b9b;--purple:#8a43ff;--bg:#070b16}
*{box-sizing:border-box}
html,body,#game-container{margin:0;width:100%;height:100%;overflow:hidden;background:var(--bg);color:#fff;font-family:Inter,Arial,sans-serif}
#game-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.screen{position:absolute;inset:0;display:none;align-items:center;justify-content:center;padding:22px;background:linear-gradient(120deg,rgba(4,8,20,.88),rgba(5,8,22,.52));backdrop-filter:blur(5px);z-index:5}
.screen.active{display:flex}
#main-menu{align-items:flex-start;flex-direction:column;padding:clamp(24px,7vw,100px)}
.brand{font:900 clamp(25px,5vw,52px) Orbitron,sans-serif;letter-spacing:.08em;text-shadow:0 0 22px #00cfe8}
.brand span,.tagline{color:var(--cyan)}
.tagline{font:600 11px Orbitron,sans-serif;letter-spacing:.24em;margin:8px 0 0}
.menu-panel{width:min(470px,100%);margin:auto 0;background:rgba(8,15,31,.82);border:1px solid rgba(0,234,255,.34);padding:clamp(24px,5vw,42px);box-shadow:0 0 50px rgba(0,210,255,.12),inset 0 0 30px rgba(0,234,255,.035)}
.menu-panel.compact{margin:auto}
.eyebrow{color:var(--pink);font:700 10px Orbitron,sans-serif;letter-spacing:.2em}
h1,h2{font-family:Orbitron,sans-serif;line-height:1.25;margin:14px 0 10px}
h1{font-size:clamp(27px,5vw,42px)}
h1 span{color:var(--cyan)}
h2{font-size:clamp(24px,4vw,34px)}
.muted{color:#9ba9bd;font-size:13px;margin-bottom:26px}
button,select{font:700 12px Orbitron,sans-serif;letter-spacing:.08em}
button{width:100%;padding:15px 18px;margin-top:10px;border:1px solid var(--cyan);background:rgba(0,234,255,.1);color:#fff;cursor:pointer;transition:.2s}
button:hover{background:rgba(0,234,255,.22);box-shadow:0 0 20px rgba(0,234,255,.22)}
button.primary{background:var(--cyan);color:#041019;border-color:var(--cyan)}
button.secondary{border-color:rgba(160,185,220,.3);background:rgba(255,255,255,.035)}
.menu-footer{font:600 10px Orbitron,sans-serif;letter-spacing:.15em;color:#8290a8}
.menu-footer span{color:var(--cyan)}
label{display:flex;flex-direction:column;gap:9px;margin:18px 0;color:#cbd5e5;font-size:13px}
select{padding:12px;background:#111a2c;color:white;border:1px solid #33445c}
input[type=range]{width:100%;accent-color:var(--cyan)}
.hud{position:absolute;inset:0;z-index:3;pointer-events:none}
.hud.hidden,.mobile-controls.hidden{display:none}
.hud-top{display:flex;gap:9px;align-items:flex-start;padding:18px}
.hud-chip{min-width:82px;padding:9px 12px;background:rgba(5,12,27,.72);border:1px solid rgba(0,234,255,.25)}
.hud-chip small,.speed-box small{display:block;color:#8da1bb;font:600 8px Orbitron,sans-serif;letter-spacing:.14em}
.hud-chip strong{font:700 16px Orbitron,sans-serif;color:var(--cyan)}
.pause-btn{pointer-events:auto;margin:0 0 0 auto;width:44px;height:42px;padding:0;font-size:18px}
.speed-box{position:absolute;right:22px;bottom:25%;text-align:right;text-shadow:0 0 15px var(--cyan)}
.speed-box span{font:800 34px Orbitron,sans-serif;color:var(--cyan)}
.mobile-controls{position:absolute;z-index:4;bottom:18px;left:0;right:0;display:flex;justify-content:space-between;padding:0 18px;pointer-events:none}
.mobile-controls button{pointer-events:auto;width:62px;height:58px;padding:0;margin:0;background:rgba(5,14,30,.7);border:1px solid rgba(0,234,255,.5);font-size:15px}
.steer,.actions{display:flex;gap:10px;align-items:flex-end}
.actions button{width:76px;font-size:10px}
.notification{position:absolute;z-index:8;top:20%;left:50%;transform:translate(-50%,-10px);opacity:0;color:var(--cyan);font:700 13px Orbitron,sans-serif;text-shadow:0 0 15px var(--cyan);transition:.25s;pointer-events:none}
.notification.show{opacity:1;transform:translate(-50%,0)}
.result-number{font:800 42px Orbitron,sans-serif;color:var(--cyan);margin:20px 0}
.result-number small{display:block;font-size:9px;letter-spacing:.2em;color:#9ba9bd}
@media(min-width:800px){.mobile-controls{max-width:650px;margin:auto;left:0;right:0}.menu-panel{margin-top:8vh}}
@media(max-width:520px){#main-menu{padding:24px}.hud-top{padding:10px;gap:5px}.hud-chip{min-width:65px;padding:8px}.hud-chip strong{font-size:12px}.speed-box{bottom:22%;right:14px}}

/* v0.5 progression + mobile safe areas */
#main-menu{overflow-y:auto;justify-content:flex-start;gap:12px;padding-top:max(20px,env(safe-area-inset-top));padding-bottom:max(18px,env(safe-area-inset-bottom))}
#main-menu .menu-panel{margin:18px 0 8px;max-height:none}
.profile-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:18px 0 12px}
.profile-strip>div{min-width:0;padding:10px 8px;background:rgba(0,234,255,.055);border:1px solid rgba(0,234,255,.18)}
.profile-strip small,.profile-strip span{display:block;color:#8298b4;font:600 8px Orbitron,sans-serif;letter-spacing:.08em}
.profile-strip strong{display:block;color:var(--cyan);font:800 19px Orbitron,sans-serif;margin:5px 0;overflow:hidden;text-overflow:ellipsis}
.daily-panel{padding:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,43,155,.2);margin:10px 0}
.daily-heading{display:flex;justify-content:space-between;color:#ff78bd;font:700 9px Orbitron,sans-serif;letter-spacing:.1em;margin-bottom:9px}
.daily-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin:8px 0;font-size:10px;color:#c7d4e6}
.daily-row strong{color:var(--cyan);font:700 9px Orbitron,sans-serif}
.daily-track{height:4px;background:#202c40;grid-column:1/-1;overflow:hidden}.daily-track i{display:block;height:100%;background:linear-gradient(90deg,var(--cyan),var(--purple))}
.achievement-list{display:grid;gap:8px;max-height:48vh;overflow:auto;margin:16px 0}
.achievement-item{padding:11px;background:rgba(255,255,255,.035);border:1px solid rgba(160,185,220,.16)}
.achievement-item.unlocked{border-color:rgba(0,234,255,.38)}
.achievement-item strong{display:block;font:700 11px Orbitron,sans-serif;color:var(--cyan);margin-bottom:4px}
.achievement-item span{font-size:10px;color:#9ba9bd}
.progress-panel{max-height:90dvh;overflow:auto}
button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.mobile-controls{bottom:max(14px,env(safe-area-inset-bottom));padding-left:max(14px,env(safe-area-inset-left));padding-right:max(14px,env(safe-area-inset-right))}
.hud-top{padding-top:max(10px,env(safe-area-inset-top))}
@media(max-width:520px){#main-menu{padding-left:18px;padding-right:18px}.menu-panel{padding:20px}.brand{font-size:clamp(22px,7vw,34px)}.daily-row{font-size:9px}.profile-strip strong{font-size:16px}}
@media(orientation:landscape) and (max-height:520px){#main-menu{flex-direction:row;align-items:center;flex-wrap:wrap}.brand{font-size:22px}.tagline{font-size:8px}#main-menu .menu-panel{width:min(420px,58vw);margin:0 0 0 auto;padding:14px}.menu-panel h1{font-size:22px}.profile-strip{margin:8px 0}.daily-panel{margin:6px 0}.menu-panel button{padding:10px;margin-top:6px}}

/* v0.5.1: reliable touch targets and explicit outfit selection */
.costume-list{display:grid;gap:9px;max-height:48vh;overflow:auto;margin:14px 0}
.costume-option{display:flex;flex-direction:column;align-items:flex-start;gap:5px;text-align:left;margin:0;padding:13px;border-color:rgba(0,234,255,.25);background:rgba(255,255,255,.035)}
.costume-option strong{font:700 11px Orbitron,sans-serif;color:var(--cyan)}
.costume-option span{font:600 9px Inter,Arial,sans-serif;color:#9ba9bd}
.costume-option.selected{border-color:var(--cyan);background:rgba(0,234,255,.13);box-shadow:inset 0 0 18px rgba(0,234,255,.08)}
.costume-option:disabled{opacity:.48;cursor:not-allowed}
.character-note{margin:8px 0 14px;line-height:1.5}
.screen button{position:relative;z-index:1;pointer-events:auto}

/* v0.6: power modules, combo and post-run report */
.run-status{margin-top:7px;color:#ff75bf;font:700 10px Orbitron,sans-serif;letter-spacing:.1em}
.power-status{max-width:220px;margin-top:5px;color:#a9c6df;font:600 8px Inter,Arial,sans-serif;letter-spacing:.08em;text-shadow:0 0 10px rgba(0,234,255,.5)}
.result-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px 0 18px}
.result-stats>div{padding:10px 5px;background:rgba(0,234,255,.06);border:1px solid rgba(0,234,255,.2);font:600 8px Orbitron,sans-serif;color:#8fa4bd;text-align:center}
.result-stats strong{display:block;margin-top:6px;color:var(--cyan);font:800 14px Orbitron,sans-serif}
@media(max-width:520px){.power-status{max-width:170px;font-size:7px}.result-stats>div{font-size:7px}.result-stats strong{font-size:12px}}


/* v0.7 difficulty selector and expanded HUD */
.difficulty-picker{display:block;margin:10px 0 12px;color:#7defff;font-size:10px;letter-spacing:2px;text-align:left}
.difficulty-picker select{display:block;width:100%;margin-top:6px;padding:12px;border:1px solid rgba(0,234,255,.35);border-radius:8px;background:#0a1424;color:#e9fbff;font:inherit;letter-spacing:1px}
#difficulty-status{margin-top:5px;color:#ff79ca;font-size:9px;letter-spacing:1.5px}
