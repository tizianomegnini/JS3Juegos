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
let flashTimer=0;
let dotSound=0;

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
  comboMsg.textContent = `👾 ×${n}  +${pts}`;
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
    _elroy: false,       // Blinky Elroy mode flag
    _totalDots: 0,       // se asigna al iniciar ronda
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
    spawnParticles(player.x, player.y, '#00eeff', 3, 0.8);
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
//  GHOST AI — Personalidades tipo Pac-Man
// ═══════════════════════════════════════════════════════════════

function getPlayerTile() {
  return { x: Math.round(player.x), y: Math.round(player.y) };
}

// N tiles adelante del jugador en su dirección actual
function getAheadTile(steps = 4) {
  return {
    x: wrap(Math.round(player.x + player.dir.x * steps), COLS),
    y: wrap(Math.round(player.y + player.dir.y * steps), ROWS)
  };
}

// Target de Inky: vector desde Blinky hasta 2 tiles adelante del jugador, doblado
function getInkyTarget() {
  const blinky = ghosts[0];
  const pivot  = getAheadTile(2);
  return {
    x: wrap(Math.round(pivot.x * 2 - blinky.x), COLS),
    y: wrap(Math.round(pivot.y * 2 - blinky.y), ROWS)
  };
}

// Ratio de dots restantes sobre el total inicial del nivel
function dotsLeftRatio() {
  const total = ghosts[0]._totalDots || 1;
  return dots / total;
}

// Calcula el target de chase para cada fantasma
function chooseGhostTarget(g) {
  const pt = getPlayerTile();

  if (g.id === 0) {
    // ── BLINKY — perseguidor directo ──
    // Modo Elroy: cuando quedan pocos dots ignora scatter y va directo al jugador
    // aunque esté en fase scatter. El umbral baja con el nivel (más agresivo).
    const elroyThreshold = Math.max(0.12, 0.30 - (level - 1) * 0.04);
    g._elroy = dotsLeftRatio() < elroyThreshold;
    return pt;
  }

  if (g.id === 1) {
    // ── PINKY — emboscadora ──
    // Apunta 4 tiles adelante del jugador para cortarle el paso.
    // Si el jugador está quieto, apunta a su tile exacto.
    const hasDir = player.dir.x !== 0 || player.dir.y !== 0;
    return hasDir ? getAheadTile(4) : pt;
  }

  if (g.id === 2) {
    // ── INKY — flanqueadora caótica ──
    // Toma el punto 2 tiles adelante del jugador y lo refleja
    // respecto a la posición de Blinky, doblando el vector.
    // Cuando Blinky está lejos, Inky aparece por el lado opuesto.
    return getInkyTarget();
  }

  // ── CLYDE (id=3) — el errático ──
  // Chase si está lejos del jugador (más de `threshold` tiles).
  // Huye a su esquina si se acerca demasiado.
  // El umbral decrece con el nivel: se vuelve más agresivo a medida que avanzás.
  const threshold = Math.max(4, 8 - (level - 1));
  const dist = Math.hypot(g.x - player.x, g.y - player.y);
  return dist > threshold ? pt : g.scatter;
}

// Elige la mejor dirección para alcanzar `target` sin dar media vuelta
function getBestDir(g, target) {
  const valid = DIRS.filter(d => {
    if (d.x === -g.dir.x && d.y === -g.dir.y) return false; // prohibir U-turn
    return isWalkable(g.x + d.x, g.y + d.y, true);
  });
  if (!valid.length) return { x: -g.dir.x, y: -g.dir.y }; // forzar U-turn si no hay salida

  let best = valid[0], bestScore = Infinity;
  for (const d of valid) {
    const nx = wrap(Math.round(g.x + d.x), COLS);
    const ny = wrap(Math.round(g.y + d.y), ROWS);
    const sc = distSq(nx, ny, target.x, target.y);
    if (sc < bestScore) { bestScore = sc; best = d; }
  }
  return best;
}

// Dirección de huida: maximiza distancia al jugador en lugar de minimizarla
function getFleeDirAway(g) {
  const valid = DIRS.filter(d => {
    if (d.x === -g.dir.x && d.y === -g.dir.y) return false;
    return isWalkable(g.x + d.x, g.y + d.y, true);
  });
  if (!valid.length) return { x: -g.dir.x, y: -g.dir.y };

  let best = valid[0], bestScore = -Infinity;
  for (const d of valid) {
    const nx = wrap(Math.round(g.x + d.x), COLS);
    const ny = wrap(Math.round(g.y + d.y), ROWS);
    const sc = distSq(nx, ny, player.x, player.y); // maximizar
    if (sc > bestScore) { bestScore = sc; best = d; }
  }
  return best;
}

// Dirección aleatoria válida sin U-turn
function getRandomDir(g) {
  const valid = DIRS.filter(d => {
    if (d.x === -g.dir.x && d.y === -g.dir.y) return false;
    return isWalkable(g.x + d.x, g.y + d.y, true);
  });
  if (!valid.length) return { x: -g.dir.x, y: -g.dir.y };
  return valid[Math.floor(Math.random() * valid.length)];
}

// Comportamiento frightened diferente para cada bicho
function getFrightenedDir(g) {
  switch (g.id) {
    case 0:
      // Blinky: huye activamente maximizando distancia al jugador.
      // El más peligroso incluso asustado — recuerda el layout.
      return getFleeDirAway(g);

    case 1:
      // Pinky: corre a su esquina de scatter (predecible pero veloz).
      // Sabiendo dónde está su esquina podés anticiparlo.
      return getBestDir(g, g.scatter);

    case 2:
      // Inky: totalmente aleatorio. Es el más errático y puede
      // meterse solo en tu camino sin querer.
      return getRandomDir(g);

    case 3:
      // Clyde: también corre a su esquina, igual que Pinky,
      // pero su umbral hace que ya esté lejos cuando comés la nova.
      return getBestDir(g, g.scatter);

    default:
      return getRandomDir(g);
  }
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
    // ── Dentro de la casa: contar timer y salir ──
    if (g.inHouse) {
      g.houseTimer--;
      if (g.houseTimer <= 0) {
        g.inHouse    = false;
        g.eaten      = false;
        g.frightened = false;
        g.x   = g.home.x;
        g.y   = g.home.y;
        g.dir = { x: 0, y: -1 };
      }
      return;
    }

    // ── Velocidad según estado ──
    // Blinky Elroy activo: pequeño bonus de velocidad
    const elroyBonus = (g.id === 0 && g._elroy) ? 0.008 : 0;
    const sp = ghostSpeed(g.baseSpeed + elroyBonus, g.frightened, g.eaten);

    // ── Elegir dirección solo en intersecciones ──
    if (isCentered(g)) {

      if (g.eaten) {
        // Vuelve a casa lo más rápido posible
        g.dir = getBestDir(g, g.home);

      } else if (g.frightened) {
        // Cada bicho tiene su propio comportamiento de huida
        g.dir = getFrightenedDir(g);

      } else {
        // Modo normal: scatter o chase según el ciclo
        // Blinky Elroy ignora scatter cuando está activado
        const isElroy = g.id === 0 && g._elroy;
        const useChase = currentMode === 'chase' || isElroy;
        const target = useChase ? chooseGhostTarget(g) : g.scatter;
        g.dir = getBestDir(g, target);
      }
    }

    // ── Aplicar movimiento ──
    g.x = wrap(g.x + g.dir.x * sp, COLS);
    g.y = wrap(g.y + g.dir.y * sp, ROWS);
    if (Math.abs(g.x - Math.round(g.x)) < sp) g.x = Math.round(g.x);
    if (Math.abs(g.y - Math.round(g.y)) < sp) g.y = Math.round(g.y);

    // ── Llegó a casa tras ser comido ──
    if (g.eaten && Math.round(g.x) === g.home.x && Math.round(g.y) === g.home.y) {
      g.eaten      = false;
      g.inHouse    = true;
      g.houseTimer = 80;
      g.dir        = { x: 0, y: -1 };
      return;
    }

    // ── Colisión con el jugador ──
    if (invTimer > 0) return;

    const hit = Math.hypot(g.x - player.x, g.y - player.y) < 0.72;
    if (!hit) return;

    if (g.frightened) {
      ghostEatCombo++;
      const pts = 200 * Math.pow(2, ghostEatCombo - 1);
      score += pts;
      playEatGhost();
      showCombo(ghostEatCombo);
      spawnParticles(g.x, g.y, g.color, 15, 2.5);
      spawnFloatScore(pts, g.x, g.y);
      updateHUD();
      g.frightened = false;
      g.eaten      = true;
      g.dir        = { x: 0, y: 0 };
      g.x          = Math.round(g.x);
      g.y          = Math.round(g.y);
    } else if (!g.eaten) {
      loseLife();
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//  LOSE LIFE
// ═══════════════════════════════════════════════════════════════
function loseLife() {
  playDeath();
  spawnParticles(player.x, player.y, '#00eeff', 20, 3);
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
function drawCrystal(cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx,       cy - r);
  ctx.lineTo(cx + r*0.6, cy - r*0.3);
  ctx.lineTo(cx + r*0.6, cy + r*0.3);
  ctx.lineTo(cx,       cy + r);
  ctx.lineTo(cx - r*0.6, cy + r*0.3);
  ctx.lineTo(cx - r*0.6, cy - r*0.3);
  ctx.closePath();
}

function drawNova(cx, cy, r, t) {
  const spin = t * 0.002;
  ctx.beginPath();
  for (let i=0; i<8; i++) {
    const ang = spin + (Math.PI/4)*i;
    const rad = i%2===0 ? r : r*0.4;
    i===0 ? ctx.moveTo(cx+Math.cos(ang)*rad, cy+Math.sin(ang)*rad)
           : ctx.lineTo(cx+Math.cos(ang)*rad, cy+Math.sin(ang)*rad);
  }
  ctx.closePath();
}

function drawMaze() {
  const S = SCALE;
  const t = Date.now();

  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      const v = map[r][c], px=c*S, py=r*S;
      const cx = px + S/2, cy = py + S/2;

      if (v === 1) {
        ctx.fillStyle = '#0a0a3a';
        ctx.fillRect(px, py, S, S);
        ctx.strokeStyle = '#2233bb';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px+1, py+1, S-2, S-2);
        ctx.fillStyle = 'rgba(80,100,255,0.25)';
        ctx.fillRect(px, py, S*0.3, S*0.3);
        ctx.fillRect(px+S*0.7, py+S*0.7, S*0.3, S*0.3);

      } else if (v === 4) {
        ctx.fillStyle = '#0d0020';
        ctx.fillRect(px, py, S, S);

      } else {
        ctx.fillStyle = '#000408';
        ctx.fillRect(px, py, S, S);

        if (v === 2) {
          const cr = S * 0.13;
          const shimmer = 0.7 + 0.3 * Math.sin(t/400 + c*0.7 + r*0.5);
          ctx.save();
          ctx.shadowColor = '#00eeff';
          ctx.shadowBlur  = 5 * shimmer;
          const gCr = ctx.createLinearGradient(cx-cr, cy-cr, cx+cr, cy+cr);
          gCr.addColorStop(0, `rgba(180,255,255,${shimmer})`);
          gCr.addColorStop(0.5, `rgba(0,200,255,${shimmer})`);
          gCr.addColorStop(1, `rgba(0,80,180,${shimmer})`);
          ctx.fillStyle = gCr;
          drawCrystal(cx, cy, cr);
          ctx.fill();
          ctx.restore();

        } else if (v === 3) {
          const pulse = 0.75 + 0.25 * Math.sin(t/130);
          const nr = S * 0.28 * pulse;

          ctx.save();
          const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, S*0.48);
          halo.addColorStop(0, `rgba(255,80,255,${0.35*pulse})`);
          halo.addColorStop(1, 'rgba(255,0,150,0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(cx, cy, S*0.48, 0, Math.PI*2);
          ctx.fill();

          ctx.shadowColor = '#ff44ff';
          ctx.shadowBlur  = 18 * pulse;
          const gNova = ctx.createRadialGradient(cx, cy, 0, cx, cy, nr);
          gNova.addColorStop(0, '#ffffff');
          gNova.addColorStop(0.3, '#ff88ff');
          gNova.addColorStop(1, '#cc00cc');
          ctx.fillStyle = gNova;
          drawNova(cx, cy, nr, t);
          ctx.fill();

          ctx.shadowBlur = 8;
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(cx, cy, nr*0.22, 0, Math.PI*2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }

  if (flashTimer > 0) {
    ctx.fillStyle = `rgba(180,0,255,${(flashTimer/8)*0.22})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// ═══════════════════════════════════════════════════════════════
//  DRAW PLAYER
// ═══════════════════════════════════════════════════════════════
let thrusterPhase = 0;

function drawPlayer() {
  if (invTimer > 0 && Math.floor(invTimer/6) % 2 === 0) return;

  thrusterPhase += 0.25;
  const isMoving = player.dir.x !== 0 || player.dir.y !== 0;
  const angle = Math.atan2(player.dir.y, player.dir.x);
  const S  = SCALE;
  const px = player.x * S + S/2;
  const py = player.y * S + S/2;
  const R  = S/2 - 1;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(angle);

  if (isMoving) {
    const fl = R * (0.6 + 0.4 * Math.sin(thrusterPhase));
    const flW = R * 0.28;
    ctx.save();
    ctx.shadowColor = '#ff8800';
    ctx.shadowBlur  = 12;
    const fireGrd = ctx.createLinearGradient(-R, 0, -R - fl, 0);
    fireGrd.addColorStop(0, 'rgba(255,200,0,0.95)');
    fireGrd.addColorStop(0.4, 'rgba(255,80,0,0.8)');
    fireGrd.addColorStop(1, 'rgba(255,0,0,0)');
    ctx.fillStyle = fireGrd;
    ctx.beginPath();
    ctx.moveTo(-R*0.55,  flW);
    ctx.lineTo(-R - fl,  0);
    ctx.lineTo(-R*0.55, -flW);
    ctx.closePath();
    ctx.fill();
    const innerGrd = ctx.createLinearGradient(-R, 0, -R - fl*0.55, 0);
    innerGrd.addColorStop(0, 'rgba(255,255,200,0.9)');
    innerGrd.addColorStop(1, 'rgba(255,160,0,0)');
    ctx.fillStyle = innerGrd;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(-R*0.5,  flW*0.45);
    ctx.lineTo(-R - fl*0.55, 0);
    ctx.lineTo(-R*0.5, -flW*0.45);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.shadowColor = '#00ccff';
  ctx.shadowBlur  = 10;

  const wingGrd = ctx.createLinearGradient(0, -R, 0, 0);
  wingGrd.addColorStop(0, '#0088cc');
  wingGrd.addColorStop(1, '#003366');
  ctx.fillStyle = wingGrd;
  ctx.beginPath();
  ctx.moveTo( R*0.1,  0);
  ctx.lineTo(-R*0.5, -R*0.85);
  ctx.lineTo(-R*0.7, -R*0.45);
  ctx.lineTo(-R*0.15, -R*0.15);
  ctx.closePath();
  ctx.fill();

  const wingGrd2 = ctx.createLinearGradient(0, 0, 0, R);
  wingGrd2.addColorStop(0, '#003366');
  wingGrd2.addColorStop(1, '#0088cc');
  ctx.fillStyle = wingGrd2;
  ctx.beginPath();
  ctx.moveTo( R*0.1,  0);
  ctx.lineTo(-R*0.5,  R*0.85);
  ctx.lineTo(-R*0.7,  R*0.45);
  ctx.lineTo(-R*0.15, R*0.15);
  ctx.closePath();
  ctx.fill();

  const bodyGrd = ctx.createLinearGradient(-R*0.6, 0, R*0.9, 0);
  bodyGrd.addColorStop(0, '#004488');
  bodyGrd.addColorStop(0.4, '#0099ee');
  bodyGrd.addColorStop(1, '#00ddff');
  ctx.fillStyle = bodyGrd;
  ctx.shadowColor = '#00eeff';
  ctx.shadowBlur  = 14;
  ctx.beginPath();
  ctx.moveTo( R,      0);
  ctx.lineTo( R*0.3, -R*0.28);
  ctx.lineTo(-R*0.6, -R*0.22);
  ctx.lineTo(-R*0.75, 0);
  ctx.lineTo(-R*0.6,  R*0.22);
  ctx.lineTo( R*0.3,  R*0.28);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 8;
  const domeGrd = ctx.createRadialGradient(R*0.25, -R*0.06, 0, R*0.2, 0, R*0.28);
  domeGrd.addColorStop(0, '#eeffff');
  domeGrd.addColorStop(0.4, '#44aaff');
  domeGrd.addColorStop(1, '#002244');
  ctx.fillStyle = domeGrd;
  ctx.beginPath();
  ctx.ellipse(R*0.2, 0, R*0.28, R*0.18, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.ellipse(R*0.25, -R*0.06, R*0.1, R*0.06, -0.4, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = '#00ffff';
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(R, 0, R*0.07, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
//  DRAW GHOSTS
// ═══════════════════════════════════════════════════════════════

// BLINKY (id=0) — Medusa eléctrica roja
function drawAlienJellyfish(cx, cy, r, col, t, frightened, blinking) {
  const wobble = Math.sin(t * 0.004) * r * 0.08;
  for (let i=0; i<5; i++) {
    const tx = cx - r*0.8 + i*(r*0.4);
    const phase = t*0.005 + i*0.8;
    const ty1 = cy + r*0.55;
    const ty2 = cy + r*(1.0 + 0.35*Math.sin(phase));
    ctx.strokeStyle = frightened ? (blinking ? '#fff' : '#005599') : col;
    ctx.lineWidth = r*0.13;
    ctx.lineCap = 'round';
    ctx.shadowColor = col;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(tx, ty1);
    ctx.quadraticCurveTo(tx + r*0.15*Math.sin(phase), (ty1+ty2)/2, tx, ty2);
    ctx.stroke();
  }
  const grd = ctx.createRadialGradient(cx, cy-r*0.15, 0, cx, cy, r);
  grd.addColorStop(0, frightened ? (blinking?'#fff':'#0000dd') : lighten(col, 0.5));
  grd.addColorStop(0.6, frightened ? (blinking?'#aaa':'#0000aa') : col);
  grd.addColorStop(1, frightened ? (blinking?'#666':'#000066') : darken(col, 0.5));
  ctx.shadowColor = frightened ? '#0033ff' : col;
  ctx.shadowBlur = 12;
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.ellipse(cx, cy + wobble, r, r*0.72, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  if (!frightened) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx - r*0.2, cy - r*0.15 + wobble, r*0.28, r*0.2, -0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy + wobble*0.5, r*0.22, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(cx + r*0.06, cy + wobble*0.5, r*0.1, 0, Math.PI*2);
    ctx.fill();
  }
}

// PINKY (id=1) — Araña cósmica rosa
function drawAlienSpider(cx, cy, r, col, t, frightened, blinking) {
  const bob = Math.sin(t*0.006) * r*0.06;
  const legWave = t*0.007;
  for (let s=-1; s<=1; s+=2) {
    for (let i=0; i<3; i++) {
      const startX = cx + s*r*0.3;
      const startY = cy + r*0.1 + bob + i*r*0.18;
      const legLen = r * (0.8 + 0.1*Math.sin(legWave + i));
      const midX = startX + s*(legLen*0.55);
      const midY = startY - r*0.25;
      const endX = startX + s*legLen;
      const endY = startY + r*0.2 + r*0.12*Math.sin(legWave+i+1.5);
      ctx.strokeStyle = frightened ? (blinking?'#fff':'#002299') : col;
      ctx.lineWidth = r * 0.09;
      ctx.lineCap = 'round';
      ctx.shadowColor = col;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.stroke();
    }
  }
  const abdGrd = ctx.createRadialGradient(cx, cy+r*0.45+bob, 0, cx, cy+r*0.45+bob, r*0.48);
  abdGrd.addColorStop(0, frightened?(blinking?'#fff':'#0000cc'):lighten(col,0.4));
  abdGrd.addColorStop(1, frightened?(blinking?'#888':'#000077'):darken(col,0.4));
  ctx.shadowColor = frightened?'#0022ff':col; ctx.shadowBlur=10;
  ctx.fillStyle = abdGrd;
  ctx.beginPath();
  ctx.ellipse(cx, cy+r*0.45+bob, r*0.48, r*0.38, 0, 0, Math.PI*2);
  ctx.fill();
  const headGrd = ctx.createRadialGradient(cx, cy-r*0.05+bob, 0, cx, cy-r*0.05+bob, r*0.35);
  headGrd.addColorStop(0, frightened?(blinking?'#fff':'#1111ee'):lighten(col,0.55));
  headGrd.addColorStop(1, frightened?(blinking?'#aaa':'#000088'):col);
  ctx.fillStyle = headGrd;
  ctx.shadowBlur=8;
  ctx.beginPath();
  ctx.ellipse(cx, cy-r*0.05+bob, r*0.35, r*0.32, 0, 0, Math.PI*2);
  ctx.fill();
  if (!frightened) {
    ctx.shadowBlur=0;
    [[- r*0.15, -r*0.12, r*0.1],[r*0.15,-r*0.12,r*0.1],[-r*0.27,-r*0.0,r*0.065],[r*0.27,-r*0.0,r*0.065]].forEach(([ox,oy,er])=>{
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+ox, cy+oy+bob, er, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#330000'; ctx.beginPath(); ctx.arc(cx+ox+r*0.02, cy+oy+bob, er*0.55, 0, Math.PI*2); ctx.fill();
    });
  }
}

// INKY (id=2) — Pulpo cósmico cian
function drawAlienOctopus(cx, cy, r, col, t, frightened, blinking) {
  const sway = t*0.004;
  for (let i=0; i<6; i++) {
    const ang = (Math.PI*2/6)*i - Math.PI/2;
    const tx0 = cx + Math.cos(ang)*r*0.45;
    const ty0 = cy + Math.sin(ang)*r*0.45;
    const wavAng = ang + Math.PI/2;
    const tLen = r * (0.7 + 0.2*Math.sin(sway + i));
    const tx1 = tx0 + Math.cos(ang)*tLen*0.5 + Math.cos(wavAng)*tLen*0.3*Math.sin(sway+i);
    const ty1 = ty0 + Math.sin(ang)*tLen*0.5 + Math.sin(wavAng)*tLen*0.3*Math.sin(sway+i);
    const tx2 = tx0 + Math.cos(ang)*tLen + Math.cos(wavAng)*tLen*0.2*Math.sin(sway+i+1);
    const ty2 = ty0 + Math.sin(ang)*tLen + Math.sin(wavAng)*tLen*0.2*Math.sin(sway+i+1);
    ctx.strokeStyle = frightened?(blinking?'#fff':'#002288'):col;
    ctx.lineWidth = r*0.15;
    ctx.lineCap = 'round';
    ctx.shadowColor = col; ctx.shadowBlur=6;
    ctx.beginPath();
    ctx.moveTo(tx0, ty0);
    ctx.bezierCurveTo(tx1, ty1, tx2, ty2, tx2, ty2);
    ctx.stroke();
  }
  const grd = ctx.createRadialGradient(cx-r*0.2, cy-r*0.2, 0, cx, cy, r*0.7);
  grd.addColorStop(0, frightened?(blinking?'#fff':'#0033ff'):lighten(col,0.6));
  grd.addColorStop(0.5, frightened?(blinking?'#88f':'#0011cc'):col);
  grd.addColorStop(1, frightened?(blinking?'#33c':'#000088'):darken(col,0.4));
  ctx.shadowColor=frightened?'#0044ff':col; ctx.shadowBlur=14;
  ctx.fillStyle=grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r*0.68, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(cx-r*0.22, cy-r*0.22, r*0.3, r*0.2, -0.5, 0, Math.PI*2);
  ctx.fill();
  if (!frightened) {
    ctx.shadowBlur=0;
    [[-r*0.22, r*0.05],[r*0.22, r*0.05]].forEach(([ox,oy])=>{
      ctx.fillStyle='#ddf'; ctx.beginPath(); ctx.ellipse(cx+ox, cy+oy, r*0.18, r*0.22, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#001133'; ctx.beginPath(); ctx.ellipse(cx+ox+r*0.04, cy+oy, r*0.09, r*0.13, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(cx+ox+r*0.02, cy+oy-r*0.07, r*0.04, 0, Math.PI*2); ctx.fill();
    });
  }
}

// CLYDE (id=3) — Escarabajo robótico naranja
function drawAlienBeetle(cx, cy, r, col, t, frightened, blinking) {
  const hov = Math.sin(t*0.005)*r*0.05;
  for (let s=-1; s<=1; s+=2) {
    for (let i=0; i<3; i++) {
      const y0 = cy + hov + (-r*0.2 + i*r*0.22);
      const x0 = cx + s*r*0.55;
      const x1 = x0 + s*r*(0.4 + 0.08*Math.sin(t*0.008+i));
      const y1 = y0 + r*(0.25 + 0.06*Math.cos(t*0.008+i));
      ctx.strokeStyle = frightened?(blinking?'#fff':'#002288'):lighten(col,0.2);
      ctx.lineWidth = r*0.1;
      ctx.lineCap = 'round';
      ctx.shadowColor=col; ctx.shadowBlur=3;
      ctx.beginPath();
      ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1+s*r*0.15, y1-r*0.1);
      ctx.stroke();
    }
  }
  const shellGrd = ctx.createLinearGradient(cx, cy-r+hov, cx, cy+r+hov);
  shellGrd.addColorStop(0, frightened?(blinking?'#fff':'#0022cc'):lighten(col,0.45));
  shellGrd.addColorStop(0.5, frightened?(blinking?'#bbb':'#001188'):col);
  shellGrd.addColorStop(1, frightened?(blinking?'#777':'#000055'):darken(col,0.45));
  ctx.shadowColor=frightened?'#0044ff':col; ctx.shadowBlur=10;
  ctx.fillStyle=shellGrd;
  ctx.beginPath();
  ctx.ellipse(cx, cy+hov, r*0.58, r*0.75, 0, 0, Math.PI*2);
  ctx.fill();
  if (!frightened) {
    ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=r*0.06;
    ctx.beginPath(); ctx.moveTo(cx, cy-r*0.6+hov); ctx.lineTo(cx, cy+r*0.6+hov); ctx.stroke();
    [[-r*0.22,-r*0.15],[r*0.22,-r*0.15],[-r*0.18,r*0.15],[r*0.18,r*0.15]].forEach(([ox,oy])=>{
      ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=r*0.04;
      ctx.beginPath(); ctx.arc(cx+ox, cy+oy+hov, r*0.1, 0, Math.PI*2); ctx.stroke();
    });
  }
  const headGrd = ctx.createRadialGradient(cx, cy-r*0.62+hov, 0, cx, cy-r*0.62+hov, r*0.32);
  headGrd.addColorStop(0, frightened?(blinking?'#fff':'#1133ff'):lighten(col,0.5));
  headGrd.addColorStop(1, frightened?(blinking?'#888':'#000077'):darken(col,0.3));
  ctx.fillStyle=headGrd; ctx.shadowBlur=8;
  ctx.beginPath();
  ctx.ellipse(cx, cy-r*0.62+hov, r*0.32, r*0.28, 0, 0, Math.PI*2);
  ctx.fill();
  if (!frightened) {
    ctx.strokeStyle=col; ctx.lineWidth=r*0.07; ctx.lineCap='round'; ctx.shadowBlur=4;
    [[-r*0.15, r*0.12],[r*0.15, r*0.12]].forEach(([ox,oy])=>{
      const ax=cx+ox, ay=cy-r*0.85+hov;
      ctx.beginPath(); ctx.moveTo(ax, ay+r*0.12); ctx.lineTo(ax+ox*0.6, ay); ctx.stroke();
      ctx.fillStyle=lighten(col,0.5); ctx.shadowBlur=6;
      ctx.beginPath(); ctx.arc(ax+ox*0.6, ay, r*0.06, 0, Math.PI*2); ctx.fill();
    });
    ctx.shadowBlur=0;
    [[-r*0.13, r*0.02],[r*0.13, r*0.02]].forEach(([ox,oy])=>{
      ctx.fillStyle='#ffddaa'; ctx.beginPath(); ctx.ellipse(cx+ox, cy-r*0.62+oy+hov, r*0.1, r*0.12, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#220000'; ctx.beginPath(); ctx.arc(cx+ox+r*0.03, cy-r*0.62+oy+hov, r*0.055, 0, Math.PI*2); ctx.fill();
    });
  }
}

// Fantasma comido — núcleo de energía volando de vuelta
function drawEatenAlien(cx, cy, r, col, dirX, dirY) {
  ctx.save();
  ctx.shadowColor = col;
  ctx.shadowBlur  = 14;
  const p = 0.7 + 0.3*Math.sin(Date.now()*0.015);
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r*0.42*p);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(0.4, col);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r*0.42*p, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = r*0.07; ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - dirX*r*0.6, cy - dirY*r*0.6);
  ctx.stroke();
  ctx.restore();
}

function lighten(hex, amt) {
  const c = parseInt(hex.slice(1),16);
  const r = Math.min(255, (c>>16) + Math.round(amt*255));
  const g = Math.min(255, ((c>>8)&0xff) + Math.round(amt*255));
  const b = Math.min(255, (c&0xff) + Math.round(amt*255));
  return `rgb(${r},${g},${b})`;
}
function darken(hex, amt) {
  const c = parseInt(hex.slice(1),16);
  const r = Math.max(0, (c>>16) - Math.round(amt*255));
  const g = Math.max(0, ((c>>8)&0xff) - Math.round(amt*255));
  const b = Math.max(0, (c&0xff) - Math.round(amt*255));
  return `rgb(${r},${g},${b})`;
}

function drawGhosts() {
  const S = SCALE;
  const t = Date.now();
  ghosts.forEach(g => {
    if (g.inHouse) return;
    const px = g.x*S + S/2;
    const py = g.y*S + S/2;
    const r  = S/2 - 1;
    const blinking = frightTimer < 80 && Math.floor(frightTimer/10)%2===0;

    ctx.save();

    if (g.eaten) {
      drawEatenAlien(px, py, r, g.color, g.dir.x, g.dir.y);
    } else if (g.id === 0) {
      drawAlienJellyfish(px, py, r, g.color, t, g.frightened, blinking);
    } else if (g.id === 1) {
      drawAlienSpider(px, py, r, g.color, t, g.frightened, blinking);
    } else if (g.id === 2) {
      drawAlienOctopus(px, py, r, g.color, t, g.frightened, blinking);
    } else {
      drawAlienBeetle(px, py, r, g.color, t, g.frightened, blinking);
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