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
const GHOST_DELAYS=[0,0,0,0];
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

// --- CARGA DE IMÁGENES PNG ---
const imgPlayer = new Image(); 
imgPlayer.src = 'player.png'; // Cambia por el nombre de tu archivo

const imgGhosts = [new Image(), new Image(), new Image(), new Image()];
imgGhosts[0].src = 'fantasma0.png'; // Rojo
imgGhosts[1].src = 'fantasma1.png'; // Rosa
imgGhosts[2].src = 'fantasma2.png'; // Cian
imgGhosts[3].src = 'fantasma3.png'; // Naranja

const imgFrightened = new Image(); 
imgFrightened.src = 'asustado.png'; // Cuando agarraste la pastilla de poder

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

// --- 1. ACTUALIZAR LA VELOCIDAD (Para añadir la "Sobrecarga" del Dron 0) ---
function ghostSpeed(g, fr=false, ea=false){
  let s = g.baseSpeed + (level-1)*0.007; 
  
  // SOBRECARGA: El Dron 0 (Rastreador) acelera si te faltan menos de 30 bits
  if (g.id === 0 && dots < 30) {
    s += 0.015; 
  }
  
  if (level >= 4) s += 0.01; 
  if(fr) s *= 0.58;  // Lentos cuando están corruptos (asustados)
  if(ea) s *= 1.45;  // Muy rápidos cuando vuelven a la base
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
  const pt = getPlayerTile();
  
  switch(g.id) {
    case 0: 
      // ROJO (El Cazador): Va directo a tus coordenadas, sin pensar.
      return pt;
      
    case 1: 
      // ROSA (El Trampero): Intenta cortarte el paso. Apunta 6 casillas por delante de ti.
      if(player.dir.x === 0 && player.dir.y === 0) return pt;
      return getAheadTile(6);
      
    case 2: 
      // CIAN (El Impredecible): Se mueve de forma 100% aleatoria por el mapa. 
      // Nunca te persigue directamente, lo que lo hace muy molesto porque te lo cruzas por accidente.
      // (Cambia su objetivo a un punto al azar constantemente).
      return {x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS)};
      
    case 3: 
      // NARANJA (El Guardián): Defiende su esquina (scatter). 
      // Solo te persigue si te acercas demasiado (a menos de 20 casillas de distancia).
      const dist = distSq(g.x, g.y, player.x, player.y);
      return dist < 20 ? pt : g.scatter;
  }
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
    const sp=ghostSpeed(g, g.frightened, g.eaten);
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

// --- 1. DIBUJAR EL LABERINTO (Placa de Circuitos) ---
function drawMaze(){
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const v=map[r][c],px=c*TILE,py=r*TILE;
      if(v===1){
        // Muros de circuitos neón
        ctx.fillStyle='#08081a'; 
        ctx.fillRect(px,py,TILE,TILE);
        ctx.strokeStyle='#00ffcc'; // Borde brillante
        ctx.lineWidth=2; 
        ctx.strokeRect(px+.5,py+.5,TILE-1,TILE-1);
      }else if(v===4){
        // Casa de los Antivirus (Zona restringida)
        ctx.fillStyle='#2a0000'; 
        ctx.fillRect(px,py,TILE,TILE);
      }else{
        // Fondo del servidor
        ctx.fillStyle='#020205'; 
        ctx.fillRect(px,py,TILE,TILE);
        
        if(v===2){
          // Bits de datos (Cuadrados pequeños)
          ctx.fillStyle='#00ffff'; 
          ctx.fillRect(px+TILE/2-2,py+TILE/2-2,4,4);
        }
        else if(v===3){
          // Rootkits (Cuadrados magenta parpadeantes)
          ctx.fillStyle='#ff00ff';
          const pulse = (Date.now() % 600 < 300) ? 6 : 4; // Efecto de pulso
          ctx.fillRect(px+TILE/2-pulse,py+TILE/2-pulse,pulse*2,pulse*2);
        }
      }
    }
  }
}

function drawPlayer(){
  if(invTimer>0 && Math.floor(invTimer/6)%2===0) return; // Parpadeo de invencibilidad
  
  const px = player.x * TILE;
  const py = player.y * TILE;
  const angle = Math.atan2(player.dir.y, player.dir.x);
  
  ctx.save();
  // Nos movemos al centro del tile para poder rotar la imagen hacia donde miras
  ctx.translate(px + TILE/2, py + TILE/2);
  if(player.dir.x !== 0 || player.dir.y !== 0) {
    ctx.rotate(angle);
  }
  
  // Dibujamos la imagen centrada
  if(imgPlayer.complete) {
    ctx.drawImage(imgPlayer, -TILE/2, -TILE/2, TILE, TILE);
  }
  ctx.restore();
}

function drawGhosts(){
  ghosts.forEach(g => {
    if(g.inHouse) return;
    
    const px = g.x * TILE;
    const py = g.y * TILE;
    
    // Si fue comido, dibujamos solo unos ojos básicos de respaldo
    if(g.eaten){
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + TILE/4, py + TILE/4, TILE/2, TILE/4);
      return;
    }
    
    // Decidimos qué imagen usar
    let currentImg = imgGhosts[g.id];
    if (g.frightened) {
      // Parpadeo cuando se está por acabar el efecto
      if (frightTimer < 80 && Math.floor(frightTimer/10)%2===0) {
        currentImg = imgGhosts[g.id]; // Vuelve a su color normal brevemente
      } else {
        currentImg = imgFrightened; // Imagen de asustado
      }
    }
    
    if(currentImg.complete) {
      ctx.drawImage(currentImg, px, py, TILE, TILE);
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