const initStars = function(){
  const c=document.getElementById('stars');
  for(let i=0;i<80;i++){
    const s=document.createElement('div');
    const sz=Math.random()*2+0.5;
    const dur=Math.random()*3+1.5;
    const op=Math.random()*0.6+0.1;
    s.className='star';
    s.style.cssText=`width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${dur}s;--o:${op};animation-delay:${Math.random()*dur}s`;
    c.appendChild(s);
  }
}();

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CONSTANTS & CONFIG
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const TILE = 26;

const MAPS = [
  // Level 1
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
  // Level 2
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
    [1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
    [1,1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,1],
    [1,2,2,2,2,2,2,1,1,1,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,2,2,1,2,2,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  // Level 3
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
  // Level 4
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
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  // Level 5
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
const GHOST_COLORS=['#FF3333','#FF88FF','#00FFFF','#FFB852'];
const GHOST_NAMES=['Blinky','Pinky','Inky','Clyde'];
const GHOST_SCATTER=[{x:COLS-2,y:0},{x:1,y:0},{x:COLS-2,y:ROWS-1},{x:1,y:ROWS-1}];
const DIRS=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  DOM
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const menuScreen   = document.getElementById('menuScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const winScreen    = document.getElementById('winScreen');
const hud          = document.getElementById('hud');
const canvasWrap   = document.getElementById('canvasWrap');
const dpad         = document.getElementById('dpad');
const pauseOverlay = document.getElementById('pauseOverlay');
const comboMsg     = document.getElementById('comboMsg');
const scoreUI      = document.getElementById('scoreUI');
const livesUI      = document.getElementById('livesUI');
const levelUI      = document.getElementById('levelUI');
const hsUI         = document.getElementById('hsUI');
const finalScoreUI = document.getElementById('finalScore');
const winScoreUI   = document.getElementById('winScore');
const hsDisplay    = document.getElementById('hsDisplay');
const newHsLabel   = document.getElementById('newHsLabel');
const canvas       = document.getElementById('game');
const ctx          = canvas.getContext('2d');
const ltOverlay    = document.getElementById('levelTransition');
const ltNum        = document.getElementById('ltNum');
const ltMsg        = document.getElementById('ltMsg');
const frightBar    = document.getElementById('frightBar');
let mazeCache=null, mazeCacheScale=0, mazeCacheLevel=0;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  RESPONSIVE CANVAS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let SCALE = 1;
function resizeCanvas() {
  const maxW = Math.min(window.innerWidth * 0.95, 600);
  const maxH = window.innerHeight * 0.72;
  const tileW = maxW / COLS;
  const tileH = maxH / ROWS;
  SCALE = Math.min(tileW, tileH, TILE + 4);
  canvas.width  = Math.floor(COLS * SCALE);
  canvas.height = Math.floor(ROWS * SCALE);
  invalidateMazeCache();
}
// resizeCanvas() se ejecuta desde bootstrap.js después de que todos los scripts se carguen
window.addEventListener('resize', () => { resizeCanvas(); });

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  AUDIO ENGINE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function beep(freq, dur, type='square', vol=0.12, delay=0) {
  try {
    const ac = getAudio();
    const o  = ac.createOscillator();
    const g  = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type; o.frequency.value = freq;
    const t = ac.currentTime + delay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.01);
  } catch(e) {}
}
function playDot()         { beep(440, 0.04, 'square', 0.06); }
function playPowerPellet() {
  [200,280,360,440].forEach((f,i) => beep(f, 0.1, 'sawtooth', 0.15, i*0.08));
}
function playEatGhost() {
  beep(800, 0.07, 'square', 0.2);
  beep(600, 0.07, 'square', 0.2, 0.07);
  beep(1000,0.07, 'square', 0.2, 0.14);
}
function playDeath() {
  [500,440,380,320,260,200,150,100].forEach((f,i) =>
    beep(f, 0.1, 'sawtooth', 0.2, i*0.08));
}
function playLevelUp() {
  [523,659,784,1047].forEach((f,i) => beep(f, 0.15, 'square', 0.15, i*0.1));
}
function playMenuClick() { beep(660, 0.08, 'square', 0.1); }

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  STATE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let highScore = 0;
try { highScore = parseInt(localStorage.getItem('pmhs_ultra') || '0'); } catch(e) {}
updateHsDisplay();

let map=[], player=null, ghosts=[], score=0, lives=3, level=1, dots=0;
let gameRunning=false, paused=false, loopStarted=false;
let pendingDir=null, frightTimer=0, frightMax=0, ghostEatCombo=0;
let modeIndex=0, modeTimer=0, currentMode='scatter';
let mouthAngle=0.05, mouthDir=1;
let invTimer=0;
let comboTimeout=null;
let particles=[];
let flashTimer=0;
let dotSound=0;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MAP HELPERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function cloneMap() { return MAPS[Math.min(level-1, MAX_LEVEL-1)].map(r=>r.slice()); }
function countDots(m) { let c=0; for(const r of m) for(const v of r) if(v===2||v===3) c++; return c; }
function wrap(v, max) { return ((v % max) + max) % max; }
function getTile(x, y) {
  const tx = wrap(Math.floor(x+0.5), COLS);
  const ty = wrap(Math.floor(y+0.5), ROWS);
  return { tx, ty, value: map[ty]?.[tx] ?? 1 };
}
function isWalkable(x, y, fg=false) {
  const { value } = getTile(x, y);
  return value !== 1; // Ambos pueden caminar donde no haya muros
}
function canStep(e, d, fg=false) { return isWalkable(e.x+d.x, e.y+d.y, fg); }
function isCentered(e, tol=0.13) {
  return Math.abs(e.x - Math.round(e.x)) < tol && Math.abs(e.y - Math.round(e.y)) < tol;
}
function distSq(ax,ay,bx,by) { const dx=ax-bx, dy=ay-by; return dx*dx+dy*dy; }

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  HUD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function updateHUD() {
  scoreUI.textContent = score.toLocaleString();
  levelUI.textContent = level;
  livesUI.innerHTML = lives > 0
    ? '❤'.repeat(Math.min(lives, 5)) + (lives > 5 ? `+${lives-5}` : '')
    : '✗';
  if (score > highScore) {
    highScore = score;
    hsUI.textContent = highScore.toLocaleString();
    try { localStorage.setItem('pmhs_ultra', highScore); } catch(e) {}
  } else {
    hsUI.textContent = highScore.toLocaleString();
  }
}

function updateHsDisplay() {
  hsDisplay.textContent = highScore > 0 ? `🏆 RÉCORD: ${highScore.toLocaleString()}` : '';
}

function updateFrightBar() {
  if (frightTimer > 0 && frightMax > 0) {
    const pct = (frightTimer / frightMax) * 100;
    frightBar.style.width = pct + '%';
    frightBar.classList.add('active');
    frightBar.style.background = pct < 25
      ? 'linear-gradient(to right, #ff0000, #ff4444)'
      : 'linear-gradient(to right, #1a1aff, #00ffff)';
  } else {
    frightBar.classList.remove('active');
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  FLOATING SCORE LABELS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function spawnFloatScore(pts, gx, gy) {
  const rect = canvas.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'float-score';
  el.textContent = '+' + pts;
  el.style.left = (rect.left + gx * SCALE) + 'px';
  el.style.top  = (rect.top  + gy * SCALE) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function showCombo(n) {
  const pts = 200 * Math.pow(2, n-1);
  comboMsg.textContent = `ðŸ‘¾ Ã—${n}  +${pts}`;
  comboMsg.style.opacity = '1';
  comboMsg.style.transform = 'translate(-50%,-50%) scale(1.2)';
  setTimeout(() => { comboMsg.style.transform='translate(-50%,-50%) scale(1)'; }, 150);
  if (comboTimeout) clearTimeout(comboTimeout);
  comboTimeout = setTimeout(() => { comboMsg.style.opacity='0'; }, 1100);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PARTICLES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function spawnParticles(x, y, color, count=10, speed=1.5) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
    const spd   = (Math.random() * speed + 0.5);
    particles.push({
      x: x * SCALE, y: y * SCALE,
      vx: Math.cos(angle) * spd * SCALE * 0.05,
      vy: Math.sin(angle) * spd * SCALE * 0.05,
      life: 1, decay: 0.03 + Math.random() * 0.03,
      size: (Math.random() * 3 + 1) * (SCALE / 26),
      color
    });
  }
}

function updateParticles() {
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.03;
    p.life -= p.decay;
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  DIFFICULTY
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function getCurrentPhaseFrames() {
  return currentMode === 'scatter'
    ? Math.max(90, 420 - (level-1)*80)
    : Math.max(900, 1200 + (level-1)*150);
}

function switchModeIfNeeded() {
  modeTimer++;
  if (modeTimer >= getCurrentPhaseFrames()) {
    modeTimer = 0;
    currentMode = currentMode === 'scatter' ? 'chase' : 'scatter';
    modeIndex++;
    reverseActiveGhosts();
  }
}

function playerSpeed()     { return Math.min(0.155, 0.105 + (level-1)*0.012); }
function ghostSpeed(base, fr=false, ea=false) {
  let s = base + (level-1)*0.007;
  if (level >= 4) s += 0.01;
  if (fr) s *= 0.5;
  if (ea) s *= 1.5;
  return s;
}

function reverseActiveGhosts() {
  ghosts.forEach(g => {
    if (!g.inHouse && !g.eaten) g.dir = { x: -g.dir.x, y: -g.dir.y };
  });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  SPAWN
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function spawnGhosts() {
  ghosts = GHOST_COLORS.map((color, i) => ({
    id: i, x:9, y:9,
    dir: i%2===0 ? {x:1,y:0} : {x:-1,y:0},
    color, name: GHOST_NAMES[i],
    frightened: false, eaten: false, inHouse: i>0,
    houseTimer: Math.max(0, [0, 30, 60, 90][i] - (level-1)*20),
    home: {x:9, y:9}, scatter: GHOST_SCATTER[i],
    baseSpeed: 0.074 - i*0.004,
    blinkFrame: 0,
    _elroy: false,       // Blinky Elroy mode flag
    _totalDots: 0,       // se asigna al iniciar ronda
  }));
}

function spawnPlayer() {
  player = { x:9, y:16, dir:{x:0,y:0}, speed:playerSpeed() };
  invTimer = 120;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  SCREEN TRANSITIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function showAll(ids) {
  ['menuScreen','gameOverScreen','winScreen','hud','canvasWrap','dpad'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
  ids.forEach(id => document.getElementById(id).classList.add('active'));
}

function showMenu()  { showAll(['menuScreen']); updateHsDisplay(); }
function showGameUI(){ showAll(['hud','canvasWrap','dpad']); }

function showGameOver() {
  gameRunning = false;
  finalScoreUI.textContent = score.toLocaleString();
  newHsLabel.style.display = (score >= highScore && score > 0) ? 'block' : 'none';
  showAll(['gameOverScreen']);
}

function showWin() {
  gameRunning = false;
  winScoreUI.textContent = score.toLocaleString();
  showAll(['winScreen']);
  for (let i=0; i<5; i++) {
    setTimeout(() => {
      const colors=['#FFD700','#00FFFF','#FF69B4','#00FF7F','#FF8C00'];
      spawnParticles(COLS/2, ROWS/2, colors[i%colors.length], 20, 3);
    }, i*200);
  }
}

async function showLevelTransition(lvl) {
  ltNum.textContent = lvl;
  const msgs = ['Â¡PREPARATE!','Â¡MÃS RÃPIDO!','Â¡A FULL!','Â¡CASI EXPERTO!','Â¡NIVEL Ã‰PICO!'];
  ltMsg.textContent = msgs[Math.min(lvl-1, msgs.length-1)];
  ltOverlay.classList.add('active');
  playLevelUp();
  await new Promise(r => setTimeout(r, 1800));
  ltOverlay.classList.remove('active');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  GAME INIT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function resetModeCycle() { modeIndex=0; modeTimer=0; currentMode='scatter'; }

function startRound(reset=false) {
  if (reset) { score=0; lives=3; level=1; }
  map = cloneMap();
  dots = countDots(map);
  gameRunning=true; paused=false;
  frightTimer=0; frightMax=0; ghostEatCombo=0; pendingDir=null;
  particles=[];
  spawnPlayer();
  spawnGhosts();
  // guardar total de dots para calcular Elroy de Blinky
  ghosts[0]._totalDots = dots;
  resetModeCycle();
  updateHUD();
}

async function nextLevel() {
  level++;
  if (level > MAX_LEVEL) { showWin(); return; }
  gameRunning = false;
  await showLevelTransition(level);
  map = cloneMap(); dots = countDots(map);
  frightTimer=0; frightMax=0; ghostEatCombo=0; pendingDir=null; particles=[];
  spawnPlayer();
  spawnGhosts();
  ghosts[0]._totalDots = dots;
  resetModeCycle();
  updateHUD();
  gameRunning = true;
}

function resetAfterDeath() {
  spawnPlayer();
  spawnGhosts();
  ghosts[0]._totalDots = dots; // dots actuales, no reinicia el nivel
  frightTimer=0; frightMax=0; ghostEatCombo=0;
  pendingDir=null; resetModeCycle();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
