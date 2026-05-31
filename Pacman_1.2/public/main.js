const initStars = (function(){
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
})();

// ═══════════════════════════════════════════════════════════════
//  CONSTANTS & CONFIG
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
//  DOM
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
//  RESPONSIVE CANVAS
// ═══════════════════════════════════════════════════════════════
let SCALE = 1;
function resizeCanvas() {
  const maxW = Math.min(window.innerWidth * 0.95, 600);
  const maxH = window.innerHeight * 0.72;
  const tileW = maxW / COLS;
  const tileH = maxH / ROWS;
  SCALE = Math.min(tileW, tileH, TILE + 4);
  canvas.width  = Math.floor(COLS * SCALE);
  canvas.height = Math.floor(ROWS * SCALE);
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); });

// ═══════════════════════════════════════════════════════════════
//  AUDIO ENGINE
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════
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
let flashTimer=0; // screen flash for power pellet
let dotSound=0; // alternating dot pitch

// ═══════════════════════════════════════════════════════════════
//  MAP HELPERS
// ═══════════════════════════════════════════════════════════════
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
  return fg ? value !== 1 : value !== 1 && value !== 4;
}
function canStep(e, d, fg=false) { return isWalkable(e.x+d.x, e.y+d.y, fg); }
function isCentered(e, tol=0.13) {
  return Math.abs(e.x - Math.round(e.x)) < tol && Math.abs(e.y - Math.round(e.y)) < tol;
}
function distSq(ax,ay,bx,by) { const dx=ax-bx, dy=ay-by; return dx*dx+dy*dy; }

// ═══════════════════════════════════════════════════════════════
//  HUD
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
//  FLOATING SCORE LABELS
// ═══════════════════════════════════════════════════════════════
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
  comboMsg.textContent = `👻 ×${n}  +${pts}`;
  comboMsg.style.opacity = '1';
  comboMsg.style.transform = 'translate(-50%,-50%) scale(1.2)';
  setTimeout(() => { comboMsg.style.transform='translate(-50%,-50%) scale(1)'; }, 150);
  if (comboTimeout) clearTimeout(comboTimeout);
  comboTimeout = setTimeout(() => { comboMsg.style.opacity='0'; }, 1100);
}

// ═══════════════════════════════════════════════════════════════
//  PARTICLES
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
//  DIFFICULTY
// ═══════════════════════════════════════════════════════════════
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
  }
}

function playerSpeed()     { return Math.min(0.155, 0.105 + (level-1)*0.012); }
function ghostSpeed(base, fr=false, ea=false) {
  let s = base + (level-1)*0.007;
  if (level >= 4) s += 0.01;
  if (fr) s *= 0.56;
  if (ea) s *= 1.5;
  return s;
}

// ═══════════════════════════════════════════════════════════════
//  SPAWN
// ═══════════════════════════════════════════════════════════════
function spawnGhosts() {
  ghosts = GHOST_COLORS.map((color, i) => ({
    id: i, x:9, y:9,
    dir: i%2===0 ? {x:1,y:0} : {x:-1,y:0},
    color, name: GHOST_NAMES[i],
    frightened: false, eaten: false, inHouse: i>0,
    houseTimer: Math.max(0, [0, 120, 240, 360][i] - (level-1)*35),
    home: {x:9, y:9}, scatter: GHOST_SCATTER[i],
    baseSpeed: 0.074 - i*0.004,
    blinkFrame: 0,
  }));
}

function spawnPlayer() {
  player = { x:9, y:16, dir:{x:0,y:0}, speed:playerSpeed() };
  invTimer = 120;
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN TRANSITIONS
// ═══════════════════════════════════════════════════════════════
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
  // Victory particle burst
  for (let i=0; i<5; i++) {
    setTimeout(() => {
      const colors=['#FFD700','#00FFFF','#FF69B4','#00FF7F','#FF8C00'];
      spawnParticles(COLS/2, ROWS/2, colors[i%colors.length], 20, 3);
    }, i*200);
  }
}

async function showLevelTransition(lvl) {
  ltNum.textContent = lvl;
  const msgs = ['¡PREPARATE!','¡MÁS RÁPIDO!','¡A FULL!','¡CASI EXPERTO!','¡NIVEL ÉPICO!'];
  ltMsg.textContent = msgs[Math.min(lvl-1, msgs.length-1)];
  ltOverlay.classList.add('active');
  playLevelUp();
  await new Promise(r => setTimeout(r, 1800));
  ltOverlay.classList.remove('active');
}

// ═══════════════════════════════════════════════════════════════
//  GAME INIT
// ═══════════════════════════════════════════════════════════════
function resetModeCycle() { modeIndex=0; modeTimer=0; currentMode='scatter'; }

function startRound(reset=false) {
  if (reset) { score=0; lives=3; level=1; }
  map = cloneMap();
  dots = countDots(map);
  gameRunning=true; paused=false;
  frightTimer=0; frightMax=0; ghostEatCombo=0; pendingDir=null;
  particles=[];
  spawnPlayer(); spawnGhosts(); resetModeCycle(); updateHUD();
}

async function nextLevel() {
  level++;
  if (level > MAX_LEVEL) { showWin(); return; }
  gameRunning = false;
  await showLevelTransition(level);
  map = cloneMap(); dots = countDots(map);
  frightTimer=0; frightMax=0; ghostEatCombo=0; pendingDir=null; particles=[];
  spawnPlayer(); spawnGhosts(); resetModeCycle(); updateHUD();
  gameRunning = true;
}

function resetAfterDeath() {
  spawnPlayer(); spawnGhosts();
  frightTimer=0; frightMax=0; ghostEatCombo=0;
  pendingDir=null; resetModeCycle();
}

// ═══════════════════════════════════════════════════════════════
//  GHOST AI
// ═══════════════════════════════════════════════════════════════
function getPlayerTile() { return { x: Math.round(player.x), y: Math.round(player.y) }; }
function getAheadTile(steps=4) {
  return {
    x: wrap(Math.round(player.x + player.dir.x * steps), COLS),
    y: wrap(Math.round(player.y + player.dir.y * steps), ROWS)
  };
}
function getInkyTarget() {
  const b = ghosts[0], ahead = getAheadTile(2);
  return {
    x: wrap(Math.round(ahead.x*2 - b.x), COLS),
    y: wrap(Math.round(ahead.y*2 - b.y), ROWS)
  };
}
function chooseGhostTarget(g) {
  const pt = getPlayerTile();
  if (g.id===0) return pt;
  if (g.id===1) return getAheadTile(4);
  if (g.id===2) return getInkyTarget();
  const threshold = Math.max(16, 64 - (level-1)*16);
  return distSq(g.x, g.y, player.x, player.y) < threshold ? g.scatter : pt;
}
function getBestDir(g, target) {
  const valid = DIRS.filter(d => {
    if (d.x===-g.dir.x && d.y===-g.dir.y) return false;
    return isWalkable(g.x+d.x, g.y+d.y, true);
  });
  if (!valid.length) return { x:-g.dir.x, y:-g.dir.y };
  let best=valid[0], bs=Infinity;
  for (const d of valid) {
    const nx=wrap(Math.round(g.x+d.x),COLS), ny=wrap(Math.round(g.y+d.y),ROWS);
    const sc=distSq(nx, ny, target.x, target.y);
    if (sc < bs) { bs=sc; best=d; }
  }
  return best;
}

// ═══════════════════════════════════════════════════════════════
//  MOVE PLAYER
// ═══════════════════════════════════════════════════════════════
function movePlayer() {
  player.speed = playerSpeed();
  if (invTimer > 0) invTimer--;
  if (flashTimer > 0) flashTimer--;

  if (pendingDir && isCentered(player) && canStep(player, pendingDir, false)) {
    player.dir = pendingDir; pendingDir = null;
  }
  if (isCentered(player) && !canStep(player, player.dir, false)) {
    player.dir = {x:0, y:0};
  }

  player.x = wrap(player.x + player.dir.x * player.speed, COLS);
  player.y = wrap(player.y + player.dir.y * player.speed, ROWS);
  if (Math.abs(player.x - Math.round(player.x)) < player.speed) player.x = Math.round(player.x);
  if (Math.abs(player.y - Math.round(player.y)) < player.speed) player.y = Math.round(player.y);

  const { tx, ty, value } = getTile(player.x, player.y);

  if (value === 2) {
    map[ty][tx] = 0; score += 10; dots--;
    dotSound = !dotSound;
    beep(dotSound ? 440 : 480, 0.04, 'square', 0.06);
    spawnParticles(player.x, player.y, '#FFD700', 3, 0.8);
    updateHUD();
  }

  if (value === 3) {
    map[ty][tx] = 0; score += 50; dots--;
    playPowerPellet();
    const dur = Math.max(60, 360 - (level-1)*70);
    frightTimer = dur; frightMax = dur;
    ghostEatCombo = 0;
    flashTimer = 8;
    ghosts.forEach(g => {
      if (!g.inHouse && !g.eaten) {
        g.frightened = true;
        g.dir = {x: -g.dir.x, y: -g.dir.y};
      }
    });
    spawnParticles(player.x, player.y, '#4444ff', 16, 2);
    updateHUD();
  }

  if (dots <= 0) nextLevel();
}

// ═══════════════════════════════════════════════════════════════
//  MOVE GHOSTS
// ═══════════════════════════════════════════════════════════════
function moveGhosts() {
  switchModeIfNeeded();
  if (frightTimer > 0) {
    frightTimer--;
    if (frightTimer === 0) {
      ghosts.forEach(g => { g.frightened = false; });
      ghostEatCombo = 0;
    }
  }
  updateFrightBar();

  ghosts.forEach(g => {
    if (g.inHouse) {
      g.houseTimer--;
      if (g.houseTimer <= 0) {
        g.inHouse = false; g.eaten = false; g.frightened = false;
        g.x = g.home.x; g.y = g.home.y; g.dir = {x:0, y:-1};
      }
      return;
    }

    const sp = ghostSpeed(g.baseSpeed, g.frightened, g.eaten);

    if (isCentered(g)) {
      if (g.eaten) {
        g.dir = getBestDir(g, g.home);
      } else if (g.frightened) {
        const ch = DIRS.filter(d => {
          if (d.x===-g.dir.x && d.y===-g.dir.y) return false;
          return isWalkable(g.x+d.x, g.y+d.y, true);
        });
        g.dir = ch.length ? ch[Math.floor(Math.random()*ch.length)] : {x:-g.dir.x, y:-g.dir.y};
      } else {
        const tgt = currentMode==='scatter' ? g.scatter : chooseGhostTarget(g);
        g.dir = getBestDir(g, tgt);
      }
    }

    g.x = wrap(g.x + g.dir.x * sp, COLS);
    g.y = wrap(g.y + g.dir.y * sp, ROWS);
    if (Math.abs(g.x - Math.round(g.x)) < sp) g.x = Math.round(g.x);
    if (Math.abs(g.y - Math.round(g.y)) < sp) g.y = Math.round(g.y);

    if (g.eaten && Math.round(g.x)===g.home.x && Math.round(g.y)===g.home.y) {
      g.eaten=false; g.inHouse=true; g.houseTimer=80; g.dir={x:0,y:-1};
      return;
    }

    if (invTimer > 0) return;

    const hit = Math.hypot(g.x-player.x, g.y-player.y) < 0.72;
    if (hit) {
      if (g.frightened) {
        ghostEatCombo++;
        const pts = 200 * Math.pow(2, ghostEatCombo-1);
        score += pts;
        playEatGhost();
        showCombo(ghostEatCombo);
        spawnParticles(g.x, g.y, g.color, 15, 2.5);
        spawnFloatScore(pts, g.x, g.y);
        updateHUD();
        g.frightened = false; g.eaten = true;
        g.dir = {x:0, y:0};
        g.x = Math.round(g.x); g.y = Math.round(g.y);
      } else if (!g.eaten) {
        loseLife();
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//  LOSE LIFE
// ═══════════════════════════════════════════════════════════════
function loseLife() {
  playDeath();
  spawnParticles(player.x, player.y, '#FFD700', 20, 3);
  lives--;
  updateHUD();
  gameRunning = false;
  setTimeout(() => {
    if (lives <= 0) {
      showGameOver();
    } else {
      resetAfterDeath();
      gameRunning = true;
    }
  }, 700);
}

// ═══════════════════════════════════════════════════════════════
//  DRAW MAZE
// ═══════════════════════════════════════════════════════════════
function drawMaze() {
  const S = SCALE;
  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      const v = map[r][c], px=c*S, py=r*S;

      if (v === 1) {
        // Wall with gradient
        const grd = ctx.createLinearGradient(px, py, px+S, py+S);
        grd.addColorStop(0, '#2222cc');
        grd.addColorStop(1, '#1111aa');
        ctx.fillStyle = grd;
        ctx.fillRect(px, py, S, S);
        ctx.strokeStyle = '#4444ff';
        ctx.lineWidth = 1;
        ctx.strokeRect(px+0.5, py+0.5, S-1, S-1);
      } else if (v === 4) {
        ctx.fillStyle = '#110022';
        ctx.fillRect(px, py, S, S);
      } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(px, py, S, S);

        if (v === 2) {
          // Regular dot with glow
          ctx.fillStyle = '#FFD700';
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(px+S/2, py+S/2, S*0.09, 0, Math.PI*2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (v === 3) {
          // Power pellet - pulsing
          const pulse = 0.8 + 0.2 * Math.sin(Date.now()/150);
          ctx.fillStyle = '#FFD700';
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 14 * pulse;
          ctx.beginPath();
          ctx.arc(px+S/2, py+S/2, S*0.21*pulse, 0, Math.PI*2);
          ctx.fill();
          // outer glow ring
          ctx.fillStyle = `rgba(255,215,0,${0.15*pulse})`;
          ctx.beginPath();
          ctx.arc(px+S/2, py+S/2, S*0.4, 0, Math.PI*2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }
  }

  // Screen flash on power pellet
  if (flashTimer > 0) {
    ctx.fillStyle = `rgba(26,26,255,${flashTimer/8*0.25})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ═══════════════════════════════════════════════════════════════
//  DRAW PLAYER
// ═══════════════════════════════════════════════════════════════
function drawPlayer() {
  if (invTimer > 0 && Math.floor(invTimer/6) % 2 === 0) return;

  mouthAngle += 0.14 * mouthDir;
  if (mouthAngle > 0.38) mouthDir = -1;
  if (mouthAngle < 0.02) mouthDir = 1;

  const isMoving = player.dir.x !== 0 || player.dir.y !== 0;
  const mouth = isMoving ? mouthAngle : 0.05;
  const angle = Math.atan2(player.dir.y, player.dir.x);
  const S = SCALE;
  const px = player.x * S + S/2;
  const py = player.y * S + S/2;
  const r  = S/2 - 1;

  // Shadow / glow
  ctx.save();
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur  = 14;

  ctx.translate(px, py);
  ctx.rotate(angle);

  // Body
  const grd = ctx.createRadialGradient(-r*0.2, -r*0.2, 0, 0, 0, r);
  grd.addColorStop(0, '#FFEE00');
  grd.addColorStop(1, '#FF9900');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, mouth*Math.PI, (2-mouth)*Math.PI);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(r*0.35, -r*0.4, r*0.12, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
//  DRAW GHOSTS
// ═══════════════════════════════════════════════════════════════
function drawGhosts() {
  const S = SCALE;
  ghosts.forEach(g => {
    if (g.inHouse) return;

    const px = g.x*S + S/2;
    const py = g.y*S + S/2;
    const r  = S/2 - 1;

    ctx.save();

    if (g.eaten) {
      // Eyes only
      ctx.shadowBlur = 0;
      [-4, 4].forEach(ox => {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(px + ox*(S/26), py - 3*(S/26), 4*(S/26), 5*(S/26), 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#00f';
        const ex = g.dir.x*2*(S/26), ey = g.dir.y*2*(S/26);
        ctx.beginPath();
        ctx.arc(px+ox*(S/26)+ex, py-3*(S/26)+ey, 2.5*(S/26), 0, Math.PI*2);
        ctx.fill();
      });
      ctx.restore();
      return;
    }

    let col = g.color;
    const blinking = frightTimer < 80 && Math.floor(frightTimer/10)%2===0;
    if (g.frightened) col = blinking ? '#ffffff' : '#0000cc';

    ctx.shadowColor = col;
    ctx.shadowBlur  = 10;
    ctx.fillStyle   = col;

    // Ghost body
    ctx.beginPath();
    ctx.arc(px, py-2*(S/26), r, Math.PI, 0);
    ctx.lineTo(px+r, py+r);
    const ww = (r*2)/3;
    for (let i=3; i>=0; i--) {
      ctx.arc(px - r + ww*i + ww/2, py+r, ww/2, 0, Math.PI, i%2===0);
    }
    ctx.closePath();
    ctx.fill();

    // Add subtle gradient on top
    if (!g.frightened) {
      const grd = ctx.createLinearGradient(px, py-r, px, py+r);
      grd.addColorStop(0, 'rgba(255,255,255,0.15)');
      grd.addColorStop(1, 'rgba(0,0,0,0.15)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px, py-2*(S/26), r, Math.PI, 0);
      ctx.lineTo(px+r, py+r);
      for (let i=3; i>=0; i--) {
        ctx.arc(px-r+ww*i+ww/2, py+r, ww/2, 0, Math.PI, i%2===0);
      }
      ctx.closePath();
      ctx.fill();
    }

    if (!g.frightened) {
      // Eyes
      [-4, 4].forEach(ox => {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(px+ox*(S/26), py-3*(S/26), 4*(S/26), 5*(S/26), 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#00f';
        const ex=g.dir.x*2*(S/26), ey=g.dir.y*2*(S/26);
        ctx.beginPath();
        ctx.arc(px+ox*(S/26)+ex, py-3*(S/26)+ey, 2.5*(S/26), 0, Math.PI*2);
        ctx.fill();
      });
    } else {
      // Frightened face
      ctx.shadowBlur = 0;
      ctx.fillStyle = blinking ? '#000' : '#fff';
      ctx.font = `${S*0.35}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👾', px, py);
    }

    ctx.restore();
  });
}

// ═══════════════════════════════════════════════════════════════
//  MAIN LOOP
// ═══════════════════════════════════════════════════════════════
function loop() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMaze();
  updateParticles();
  drawParticles();
  drawPlayer();
  drawGhosts();

  if (gameRunning && !paused) {
    movePlayer();
    moveGhosts();
  }

  requestAnimationFrame(loop);
}

// ═══════════════════════════════════════════════════════════════
//  PAUSE
// ═══════════════════════════════════════════════════════════════
function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  pauseOverlay.classList.toggle('active', paused);
}

// ═══════════════════════════════════════════════════════════════
//  KEYBOARD
// ═══════════════════════════════════════════════════════════════
const KEY_MAP = {
  ArrowUp:{x:0,y:-1}, w:{x:0,y:-1}, W:{x:0,y:-1},
  ArrowDown:{x:0,y:1}, s:{x:0,y:1}, S:{x:0,y:1},
  ArrowLeft:{x:-1,y:0}, a:{x:-1,y:0}, A:{x:-1,y:0},
  ArrowRight:{x:1,y:0}, d:{x:1,y:0}, D:{x:1,y:0},
};

document.addEventListener('keydown', e => {
  const d = KEY_MAP[e.key];
  if (d) { e.preventDefault(); pendingDir = d; return; }
  if (e.key==='p' || e.key==='P') togglePause();
  if (e.key==='r' || e.key==='R') { startGame(); }
  if (e.key==='Escape') { if (gameRunning) togglePause(); }
});

// ═══════════════════════════════════════════════════════════════
//  D-PAD (touch + click)
// ═══════════════════════════════════════════════════════════════
document.querySelectorAll('.dpbtn').forEach(btn => {
  const setDir = () => {
    const dir = btn.dataset.dir;
    if (dir==='up')    pendingDir={x:0,y:-1};
    if (dir==='down')  pendingDir={x:0,y:1};
    if (dir==='left')  pendingDir={x:-1,y:0};
    if (dir==='right') pendingDir={x:1,y:0};
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 100);
  };
  btn.addEventListener('click', setDir);
  btn.addEventListener('touchstart', e => { e.preventDefault(); setDir(); }, { passive:false });
});

// ═══════════════════════════════════════════════════════════════
//  SWIPE GESTURE
// ═══════════════════════════════════════════════════════════════
let swipeStart = null;
document.addEventListener('touchstart', e => {
  if (e.target.classList.contains('dpbtn') || e.target.classList.contains('btn')) return;
  swipeStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

document.addEventListener('touchend', e => {
  if (!swipeStart) return;
  const dx = e.changedTouches[0].clientX - swipeStart.x;
  const dy = e.changedTouches[0].clientY - swipeStart.y;
  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) { swipeStart=null; return; }
  if (Math.abs(dx) > Math.abs(dy)) {
    pendingDir = dx > 0 ? {x:1,y:0} : {x:-1,y:0};
  } else {
    pendingDir = dy > 0 ? {x:0,y:1} : {x:0,y:-1};
  }
  swipeStart = null;
}, { passive: true });

// ═══════════════════════════════════════════════════════════════
//  START
// ═══════════════════════════════════════════════════════════════
function startGame() {
  playMenuClick();
  showGameUI();
  startRound(true);
  gameRunning = true;
  paused = false;
  pauseOverlay.classList.remove('active');
  if (!loopStarted) { loopStarted = true; loop(); }
}

document.getElementById('playBtn').addEventListener('click', startGame);
document.getElementById('goBtn').addEventListener('click',  startGame);
document.getElementById('winBtn').addEventListener('click', startGame);

document.getElementById('goMenuBtn').addEventListener('click',  () => { playMenuClick(); showMenu(); });
document.getElementById('winMenuBtn').addEventListener('click', () => { playMenuClick(); showMenu(); });

document.getElementById('pauseOverlay').addEventListener('click', togglePause);