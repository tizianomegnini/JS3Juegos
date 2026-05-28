const TILE = 28;

// El bloque central (la casa de los fantasmas y el túnel) se mantiene constante 
// para evitar atascos, pero los laberintos exteriores cambian en cada nivel.
const MAPS = [
  // NIVEL 1 (Tu mapa original)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,0,0,0,1,1,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,4,4,4,1,0,1,2,1,1,1,1],
    [0,0,0,0,2,0,0,1,4,4,4,1,0,0,2,0,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,3,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,3,1],
    [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  // NIVEL 2 (Más espacios abiertos)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,1,1,2,1,2,2,2,1,2,2,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,1,1,2,1,2,1,1,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,0,0,0,1,1,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,4,4,4,1,0,1,2,1,1,1,1],
    [0,0,0,0,2,0,0,1,4,4,4,1,0,0,2,0,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
    [1,3,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,3,1],
    [1,1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,1],
    [1,2,2,2,2,2,2,1,1,1,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,2,2,1,2,2,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  // NIVEL 3 (Más bloques centrales y verticalidad)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,3,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
    [1,1,1,1,2,1,1,1,0,0,0,1,1,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,4,4,4,1,0,1,2,1,1,1,1],
    [0,0,0,0,2,0,0,1,4,4,4,1,0,0,2,0,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,3,2,2,2,1,2,2,2,0,2,2,2,1,2,2,2,3,1],
    [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  // NIVEL 4 (Enfoque en anillos)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,3,1],
    [1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1],
    [1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1],
    [1,2,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1,2,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
    [1,1,1,1,2,1,1,1,0,0,0,1,1,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,4,4,4,1,0,1,2,1,1,1,1],
    [0,0,0,0,2,0,0,1,4,4,4,1,0,0,2,0,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,2,1,2,1,1,2,1,1,1,2,1],
    [1,3,1,1,1,2,1,1,2,0,2,1,1,2,1,1,1,3,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  // NIVEL 5 (Mínimos muros, alto riesgo)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
    [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1],
    [1,2,1,1,1,2,2,2,2,1,2,2,2,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,1,2,1,2,1,1,2,2,2,2,2,1],
    [1,2,1,1,1,2,2,2,2,1,2,2,2,2,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
    [1,1,1,1,2,1,1,1,0,0,0,1,1,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,4,4,4,1,0,1,2,1,1,1,1],
    [0,0,0,0,2,0,0,1,4,4,4,1,0,0,2,0,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1],
    [1,3,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,3,1],
    [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ]
];

const ROWS=MAPS[0].length, COLS=MAPS[0][0].length, MAX_LEVEL=5;
const GHOST_COLORS=['#FF0000','#FFB8FF','#00FFFF','#FFB852'];
const GHOST_SCATTER=[{x:COLS-2,y:0},{x:1,y:0},{x:COLS-2,y:ROWS-1},{x:1,y:ROWS-1}];
const GHOST_DELAYS=[0,60,120,180];
const DIRS=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];

const menuScreen=document.getElementById('menuScreen');
const gameOverScreen=document.getElementById('gameOverScreen');
const winScreen=document.getElementById('winScreen');
const hud=document.getElementById('hud');
const canvasWrap=document.getElementById('canvasWrap');
const dpad=document.getElementById('dpad');
const pauseOverlay=document.getElementById('pauseOverlay');
const comboMsg=document.getElementById('comboMsg');
const scoreUI=document.getElementById('scoreUI');
const livesUI=document.getElementById('livesUI');
const levelUI=document.getElementById('levelUI');
const hsUI=document.getElementById('hsUI');
const finalScoreUI=document.getElementById('finalScore');
const winScoreUI=document.getElementById('winScore');
const hsDisplay=document.getElementById('hsDisplay');
const newHsLabel=document.getElementById('newHsLabel');
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
canvas.width=COLS*TILE;
canvas.height=ROWS*TILE;

let highScore=0;
try{highScore=parseInt(localStorage.getItem('pmhs')||'0');}catch(e){}
hsDisplay.textContent=highScore>0?`RÉCORD: ${highScore}`:'';
hsUI.textContent=highScore;

let map=[],player=null,ghosts=[],score=0,lives=3,level=1,dots=0;
let gameRunning=false,paused=false,loopStarted=false;
let pendingDir=null,frightTimer=0,ghostEatCombo=0;
let modeIndex=0,modeTimer=0,currentMode='scatter';
let mouthAngle=0.05,mouthDir=1;
let invTimer=0;
let comboTimeout=null;

let audioCtx=null;
function getAudio(){
  if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}
function beep(freq,dur,type='square',vol=0.15){
  try{
    const ac=getAudio();
    const o=ac.createOscillator();
    const g=ac.createGain();
    o.connect(g);g.connect(ac.destination);
    o.type=type;o.frequency.value=freq;
    g.gain.setValueAtTime(vol,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+dur);
    o.start();o.stop(ac.currentTime+dur);
  }catch(e){}
}
function playDot(){beep(440,0.04,'square',0.08);}
function playPowerPellet(){beep(200,0.12,'sawtooth',0.18);setTimeout(()=>beep(280,0.12,'sawtooth',0.18),100);}
function playEatGhost(){beep(800,0.08,'square',0.2);setTimeout(()=>beep(600,0.08,'square',0.2),80);}
function playDeath(){
  let t=0;
  [440,380,320,260,200,150].forEach((f,i)=>{setTimeout(()=>beep(f,0.1,'sawtooth',0.2),i*90);});
}

// Carga el mapa de forma dinámica según el nivel actual
function cloneMap(){ 
  return MAPS[Math.min(level - 1, MAX_LEVEL - 1)].map(r=>r.slice()); 
}
function countDots(m){let c=0;for(const r of m)for(const v of r)if(v===2||v===3)c++;return c;}
function wrap(v,max){return((v%max)+max)%max;}
function getTile(x,y){const tx=wrap(Math.round(x),COLS),ty=wrap(Math.round(y),ROWS);return{tx,ty,value:map[ty]?.[tx]??1};}
function isWalkable(x,y,fg=false){const{value}=getTile(x,y);return fg?value!==1:value!==1&&value!==4;}
function canStep(e,d,fg=false){return isWalkable(e.x+d.x,e.y+d.y,fg);}
function isCentered(e,tol=0.12){return Math.abs(e.x-Math.round(e.x))<tol&&Math.abs(e.y-Math.round(e.y))<tol;}
function distSq(ax,ay,bx,by){const dx=ax-bx,dy=ay-by;return dx*dx+dy*dy;}

function updateHUD(){
  scoreUI.textContent=score;
  levelUI.textContent=level;
  livesUI.textContent=lives>0?'❤'.repeat(lives):'✗';
  if(score>highScore){highScore=score;hsUI.textContent=highScore;try{localStorage.setItem('pmhs',highScore);}catch(e){}}
  else hsUI.textContent=highScore;
}

function showCombo(n){
  const pts=200*Math.pow(2,n-1);
  comboMsg.textContent=`+${pts} × ${n}!`;
  comboMsg.style.opacity='1';
  if(comboTimeout)clearTimeout(comboTimeout);
  comboTimeout=setTimeout(()=>{comboMsg.style.opacity='0';},900);
}

function resetModeCycle(){modeIndex=0;modeTimer=0;currentMode='scatter';}

// DIFICULTAD: Tiempos de descanso (scatter) más cortos en niveles altos.
function getCurrentPhaseFrames(){
  return currentMode==='scatter' 
    ? Math.max(90, 420 - (level-1)*80) 
    : Math.max(900, 1200 + (level-1)*150);
}

function switchModeIfNeeded(){modeTimer++;if(modeTimer>=getCurrentPhaseFrames()){modeTimer=0;currentMode=currentMode==='scatter'?'chase':'scatter';modeIndex++;}}

// DIFICULTAD: El jugador es levemente más rápido, pero los fantasmas crecen mucho más en velocidad.
function playerSpeed(){return Math.min(0.145, 0.105+(level-1)*0.01);}

// DIFICULTAD: Escalado agresivo de fantasmas a partir del nivel 4
function ghostSpeed(base,fr=false,ea=false){
  let s = base + (level-1)*0.007; 
  if (level >= 4) s += 0.01; 
  if(fr) s *= 0.58;
  if(ea) s *= 1.45;
  return s;
}

function spawnGhosts(){
  ghosts=GHOST_COLORS.map((color,i)=>({
    id:i,x:9,y:9,dir:i%2===0?{x:1,y:0}:{x:-1,y:0},color,
    frightened:false,eaten:false,inHouse:i>0,
    // DIFICULTAD: Los fantasmas salen antes de la caja a medida que pasas de nivel
    houseTimer: Math.max(0, GHOST_DELAYS[i] - (level-1)*35),
    home:{x:9,y:9},scatter:GHOST_SCATTER[i],baseSpeed:0.074-i*0.004,
  }));
}

function spawnPlayer(){
  player={x:9,y:16,dir:{x:0,y:0},speed:playerSpeed()};
  invTimer=120;
}

function showGame(){
  menuScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
  winScreen.classList.remove('active');
  hud.classList.add('active');
  canvasWrap.classList.add('active');
  dpad.classList.add('active');
}

function showMenu(){
  menuScreen.classList.add('active');
  hud.classList.remove('active');
  canvasWrap.classList.remove('active');
  dpad.classList.remove('active');
  hsDisplay.textContent=highScore>0?`RÉCORD: ${highScore}`:'';
}

function showGameOver(){
  gameRunning=false;
  finalScoreUI.textContent=score;
  if(score>=highScore&&score>0){newHsLabel.style.display='block';}else{newHsLabel.style.display='none';}
  menuScreen.classList.remove('active');
  hud.classList.remove('active');
  canvasWrap.classList.remove('active');
  dpad.classList.remove('active');
  gameOverScreen.classList.add('active');
}

function showWin(){
  gameRunning=false;
  winScoreUI.textContent=score;
  hud.classList.remove('active');
  canvasWrap.classList.remove('active');
  dpad.classList.remove('active');
  winScreen.classList.add('active');
}

function startRound(rs=false){
  if(rs){score=0;lives=3;level=1;}
  map=cloneMap();dots=countDots(map);
  gameRunning=true;paused=false;
  frightTimer=0;ghostEatCombo=0;pendingDir=null;
  spawnPlayer();spawnGhosts();resetModeCycle();updateHUD();
}

function startLevel(ks=true){
  map=cloneMap();dots=countDots(map);
  if(!ks)score=0;
  frightTimer=0;ghostEatCombo=0;pendingDir=null;
  spawnPlayer();spawnGhosts();resetModeCycle();updateHUD();
}

function nextLevel(){
  level++;
  if(level>MAX_LEVEL){showWin();return;}
  startLevel(true);
}

function resetAfterDeath(){
  spawnPlayer();spawnGhosts();frightTimer=0;ghostEatCombo=0;pendingDir=null;resetModeCycle();
}

function getPlayerTile(){return{x:Math.round(player.x),y:Math.round(player.y)};}
function getAheadTile(steps=4){return{x:wrap(Math.round(player.x+player.dir.x*steps),COLS),y:wrap(Math.round(player.y+player.dir.y*steps),ROWS)};}
function getInkyTarget(){
  const b=ghosts[0],ahead=getAheadTile(2);
  return{x:wrap(Math.round(ahead.x*2-b.x),COLS),y:wrap(Math.round(ahead.y*2-b.y),ROWS)};
}

function chooseGhostTarget(g){
  const pt=getPlayerTile();
  if(g.id===0)return pt;
  if(g.id===1)return getAheadTile(4);
  if(g.id===2)return getInkyTarget();
  // DIFICULTAD: Clyde se vuelve más agresivo con cada nivel y huye menos frecuentemente.
  const clydeThreshold = Math.max(16, 64 - (level-1)*16);
  return distSq(g.x,g.y,player.x,player.y) < clydeThreshold ? g.scatter : pt;
}

function getBestDir(g,target){
  const valid=DIRS.filter(d=>{
    if(d.x===-g.dir.x&&d.y===-g.dir.y)return false;
    return isWalkable(g.x+d.x,g.y+d.y,true);
  });
  if(!valid.length)return{x:-g.dir.x,y:-g.dir.y};
  let best=valid[0],bs=Infinity;
  for(const d of valid){
    const nx=wrap(Math.round(g.x+d.x),COLS),ny=wrap(Math.round(g.y+d.y),ROWS);
    const sc=distSq(nx,ny,target.x,target.y);
    if(sc<bs){bs=sc;best=d;}
  }
  return best;
}

function movePlayer(){
  player.speed=playerSpeed();
  if(invTimer>0)invTimer--;

  if(pendingDir&&isCentered(player)&&canStep(player,pendingDir,false)){
    player.dir=pendingDir;pendingDir=null;
  }
  if(isCentered(player)&&!canStep(player,player.dir,false)){player.dir={x:0,y:0};}

  player.x=wrap(player.x+player.dir.x*player.speed,COLS);
  player.y=wrap(player.y+player.dir.y*player.speed,ROWS);
  if(Math.abs(player.x-Math.round(player.x))<player.speed)player.x=Math.round(player.x);
  if(Math.abs(player.y-Math.round(player.y))<player.speed)player.y=Math.round(player.y);

  const{tx,ty,value}=getTile(player.x,player.y);
  if(value===2){map[ty][tx]=0;score+=10;dots--;playDot();updateHUD();}
  if(value===3){
    map[ty][tx]=0;score+=50;dots--;playPowerPellet();
    // DIFICULTAD: El poder asusta a los fantasmas por mucho menos tiempo a medida que avanzas.
    frightTimer=Math.max(60, 350-(level-1)*70); 
    ghostEatCombo=0;
    ghosts.forEach(g=>{if(!g.inHouse&&!g.eaten){g.frightened=true;g.dir={x:-g.dir.x,y:-g.dir.y};}});
    updateHUD();
  }
  if(dots<=0)nextLevel();
}

function moveGhosts(){
  switchModeIfNeeded();
  if(frightTimer>0){frightTimer--;if(frightTimer===0){ghosts.forEach(g=>{g.frightened=false;});ghostEatCombo=0;}}

  ghosts.forEach(g=>{
    if(g.inHouse){
      g.houseTimer--;
      if(g.houseTimer<=0){g.inHouse=false;g.eaten=false;g.frightened=false;g.x=g.home.x;g.y=g.home.y;g.dir={x:0,y:-1};}
      return;
    }
    const sp=ghostSpeed(g.baseSpeed,g.frightened,g.eaten);
    if(isCentered(g)){
      if(g.eaten){g.dir=getBestDir(g,g.home);}
      else if(g.frightened){
        const ch=DIRS.filter(d=>{
          if(d.x===-g.dir.x&&d.y===-g.dir.y)return false;
          return isWalkable(g.x+d.x,g.y+d.y,true);
        });
        g.dir=ch.length?ch[Math.floor(Math.random()*ch.length)]:{x:-g.dir.x,y:-g.dir.y};
      }else{
        const tgt=currentMode==='scatter'?g.scatter:chooseGhostTarget(g);
        g.dir=getBestDir(g,tgt);
      }
    }
    g.x=wrap(g.x+g.dir.x*sp,COLS);g.y=wrap(g.y+g.dir.y*sp,ROWS);
    if(Math.abs(g.x-Math.round(g.x))<sp)g.x=Math.round(g.x);
    if(Math.abs(g.y-Math.round(g.y))<sp)g.y=Math.round(g.y);

    if(g.eaten&&Math.round(g.x)===g.home.x&&Math.round(g.y)===g.home.y){
      g.eaten=false;g.inHouse=true;g.houseTimer=80;g.dir={x:0,y:-1};return;
    }

    if(invTimer>0)return;
    const hit=Math.hypot(g.x-player.x,g.y-player.y)<0.72;
    if(hit){
      if(g.frightened){
        ghostEatCombo++;score+=200*Math.pow(2,ghostEatCombo-1);
        playEatGhost();showCombo(ghostEatCombo);updateHUD();
        g.frightened=false;g.eaten=true;g.dir={x:0,y:0};g.x=Math.round(g.x);g.y=Math.round(g.y);
      }else if(!g.eaten){loseLife();}
    }
  });
}

function loseLife(){
  playDeath();lives--;updateHUD();
  if(lives<=0){setTimeout(showGameOver,600);return;}
  resetAfterDeath();
}

function togglePause(){
  if(!gameRunning)return;
  paused=!paused;
  pauseOverlay.classList.toggle('active',paused);
}

function drawMaze(){
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const v=map[r][c],px=c*TILE,py=r*TILE;
      if(v===1){
        ctx.fillStyle='#1a1aff';ctx.fillRect(px,py,TILE,TILE);
        ctx.strokeStyle='#3a3aff';ctx.lineWidth=1;ctx.strokeRect(px+.5,py+.5,TILE-1,TILE-1);
      }else if(v===4){
        ctx.fillStyle='#110022';ctx.fillRect(px,py,TILE,TILE);
      }else{
        ctx.fillStyle='#000';ctx.fillRect(px,py,TILE,TILE);
        if(v===2){ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(px+TILE/2,py+TILE/2,2.5,0,Math.PI*2);ctx.fill();}
        else if(v===3){
          ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(px+TILE/2,py+TILE/2,5.5,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='rgba(255,215,0,0.25)';ctx.beginPath();ctx.arc(px+TILE/2,py+TILE/2,10,0,Math.PI*2);ctx.fill();
        }
      }
    }
  }
}

function drawPlayer(){
  if(invTimer>0&&Math.floor(invTimer/6)%2===0)return;
  mouthAngle+=0.15*mouthDir;
  if(mouthAngle>0.35)mouthDir=-1;if(mouthAngle<0.02)mouthDir=1;
  const mouth=(player.dir.x===0&&player.dir.y===0)?0.05:mouthAngle;
  const angle=Math.atan2(player.dir.y,player.dir.x);
  const px=player.x*TILE+TILE/2,py=player.y*TILE+TILE/2,r=TILE/2-2;
  ctx.save();ctx.translate(px,py);ctx.rotate(angle);
  ctx.fillStyle='#FFD700';ctx.beginPath();ctx.moveTo(0,0);
  ctx.arc(0,0,r,mouth*Math.PI,(2-mouth)*Math.PI);ctx.closePath();ctx.fill();
  ctx.restore();
}

function drawGhosts(){
  ghosts.forEach(g=>{
    if(g.inHouse)return;
    const px=g.x*TILE+TILE/2,py=g.y*TILE+TILE/2,r=TILE/2-2;
    if(g.eaten){
      ctx.fillStyle='#fff';
      ctx.beginPath();ctx.ellipse(px-4,py-3,4,5,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(px+4,py-3,4,5,0,0,Math.PI*2);ctx.fill();
      const ex=g.dir.x*2,ey=g.dir.y*2;
      ctx.fillStyle='#00f';
      ctx.beginPath();ctx.arc(px-4+ex,py-3+ey,2.5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(px+4+ex,py-3+ey,2.5,0,Math.PI*2);ctx.fill();
      return;
    }
    let col=g.color;
    if(g.frightened){col=(frightTimer<80&&Math.floor(frightTimer/10)%2===0)?'#ffffff':'#0000cc';}
    ctx.fillStyle=col;
    ctx.beginPath();ctx.arc(px,py-2,r,Math.PI,0);ctx.lineTo(px+r,py+r);
    const ww=(r*2)/3;
    for(let i=3;i>=0;i--)ctx.arc(px-r+ww*i+ww/2,py+r,ww/2,0,Math.PI,i%2===0);
    ctx.closePath();ctx.fill();
    if(!g.frightened){
      ctx.fillStyle='#fff';
      ctx.beginPath();ctx.ellipse(px-4,py-3,4,5,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(px+4,py-3,4,5,0,0,Math.PI*2);ctx.fill();
      const ex=g.dir.x*2,ey=g.dir.y*2;
      ctx.fillStyle='#00f';
      ctx.beginPath();ctx.arc(px-4+ex,py-3+ey,2.5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(px+4+ex,py-3+ey,2.5,0,Math.PI*2);ctx.fill();
    }
  });
}

function loop(){
  ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);
  drawMaze();drawPlayer();drawGhosts();
  if(gameRunning&&!paused){movePlayer();moveGhosts();}
  requestAnimationFrame(loop);
}

const KEY_MAP={ArrowUp:{x:0,y:-1},w:{x:0,y:-1},W:{x:0,y:-1},ArrowDown:{x:0,y:1},s:{x:0,y:1},S:{x:0,y:1},ArrowLeft:{x:-1,y:0},a:{x:-1,y:0},A:{x:-1,y:0},ArrowRight:{x:1,y:0},d:{x:1,y:0},D:{x:1,y:0}};

document.addEventListener('keydown',e=>{
  const d=KEY_MAP[e.key];
  if(d){e.preventDefault();pendingDir=d;return;}
  if(e.key==='p'||e.key==='P')togglePause();
  if(e.key==='r'||e.key==='R'){showGame();startRound(true);gameRunning=true;paused=false;}
});

document.querySelectorAll('.dpbtn').forEach(btn=>{
  const setDir=()=>{
    const dir=btn.dataset.dir;
    if(dir==='up')pendingDir={x:0,y:-1};
    if(dir==='down')pendingDir={x:0,y:1};
    if(dir==='left')pendingDir={x:-1,y:0};
    if(dir==='right')pendingDir={x:1,y:0};
  };
  btn.addEventListener('click',setDir);
  btn.addEventListener('touchstart',e=>{e.preventDefault();setDir();},{passive:false});
});

function startGame(){
  showGame();startRound(true);gameRunning=true;paused=false;
  pauseOverlay.classList.remove('active');
  if(!loopStarted){loopStarted=true;loop();}
}

document.getElementById('playBtn').addEventListener('click',startGame);
document.getElementById('goBtn').addEventListener('click',startGame);
document.getElementById('winBtn').addEventListener('click',startGame);