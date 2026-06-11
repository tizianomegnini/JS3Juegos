// ═══════════════════════════════════════════════════════════════════════════
// INPUT.JS – Manejo de input para 1P y 2P
// P1: WASD / Flechas / D-Pad táctil izquierdo
// P2: IJKL / D-Pad táctil derecho (solo modo 2P)
// ═══════════════════════════════════════════════════════════════════════════

// ─── PAUSA ───────────────────────────────────────────────────────────────
function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  pauseOverlay.classList.toggle('active', paused);
}

// ─── MAPAS DE TECLAS ─────────────────────────────────────────────────────
// P1: WASD + Flechas
// P1: WASD
const KEY_MAP_P1 = {
  w:{x:0,y:-1},
  s:{x:0,y:1},
  a:{x:-1,y:0},
  d:{x:1,y:0},
};

// P2: Flechas + IJKL
const KEY_MAP_P2 = {
  ArrowUp:{x:0,y:-1},
  ArrowDown:{x:0,y:1},
  ArrowLeft:{x:-1,y:0},
  ArrowRight:{x:1,y:0},
};

// ─── KEYBOARD ────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target instanceof HTMLInputElement) return;

  // P1
  const d1 = KEY_MAP_P1[e.key];
  if (d1) { e.preventDefault(); pendingDir = d1; return; }

  // P2 (solo si modo 2P activo)
  if (gameMode === 2 && player2) {
    const d2 = KEY_MAP_P2[e.key];
    if (d2) { e.preventDefault(); pendingDir2 = d2; return; }
  }

  // Controles globales
  if (e.key==='p' || e.key==='P') togglePause();
  if (e.key==='r' || e.key==='R') { startGame(); }
  if (e.key==='Escape') { if (gameRunning) togglePause(); }
});

// ─── D-PAD P1 (click + touch) ────────────────────────────────────────────
document.querySelectorAll('.dpbtn[data-player="1"]').forEach(btn => {
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

// ─── D-PAD P2 (click + touch) ────────────────────────────────────────────
document.querySelectorAll('.dpbtn[data-player="2"]').forEach(btn => {
  const setDir = () => {
    const dir = btn.dataset.dir;
    if (dir==='up')    pendingDir2={x:0,y:-1};
    if (dir==='down')  pendingDir2={x:0,y:1};
    if (dir==='left')  pendingDir2={x:-1,y:0};
    if (dir==='right') pendingDir2={x:1,y:0};
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 100);
  };
  btn.addEventListener('click', setDir);
  btn.addEventListener('touchstart', e => { e.preventDefault(); setDir(); }, { passive:false });
});

// ─── SWIPE GESTURE (P1) ───────────────────────────────────────────────────
let swipeStart = null;

function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

function isLandscape() {
  return window.matchMedia('(orientation: landscape)').matches;
}

function canShowTouchControls() {
  return isTouchDevice() && isLandscape();
}

function lockLandscapeIfPossible() {
  if (!isTouchDevice()) return;
  const orientation = screen.orientation;
  if (orientation && typeof orientation.lock === 'function') {
    orientation.lock('landscape').catch(() => {});
  }
}

// ─── Sincronizar D-Pads según modo y estado ───────────────────────────────
function syncTouchControls() {
  const is2P   = gameMode === 2;
  const mobile = canShowTouchControls();
  const running = getIsRunning();
  const showDpads = mobile && running;

  const dpad  = document.getElementById('dpad');
  const dpad2 = document.getElementById('dpad2');
  const swipeHint = document.getElementById('swipeHint');

  // Clase body para CSS targeting
  document.body.classList.toggle('mode-2p', is2P);
  document.body.classList.toggle('mode-1p', !is2P);
  document.body.classList.toggle('mobile-controls', showDpads);
  document.body.classList.toggle('mobile-landscape', showDpads);

  if (dpad)  dpad.classList.toggle('active', showDpads);
  if (dpad2) {
    dpad2.style.display = (is2P && showDpads) ? 'grid' : 'none';
    dpad2.classList.toggle('active', is2P && showDpads);
  }
  if (swipeHint) swipeHint.classList.toggle('active', showDpads && !is2P);

  // Rotate hint: mostrar si es móvil táctil en portrait durante juego
  const showRotate = isTouchDevice() && !isLandscape() && running;
  document.body.classList.toggle('game-portrait', showRotate);
}

function validateMobileLayout() {
  if (!gameRunning) { syncTouchControls(); return; }
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  syncTouchControls();
  const canvas = document.getElementById('game');
  if (canvas) canvas.getBoundingClientRect();
}

function scheduleMobileLayoutValidation() {
  requestAnimationFrame(validateMobileLayout);
  [80, 250, 600].forEach(delay => { setTimeout(validateMobileLayout, delay); });
}

// Swipe solo para P1
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

// ─── FUNCIÓN PARA MOSTRAR/OCULTAR INSTRUCCIONES ───────────────────────────
function toggleInstructions() {
  const panel = document.getElementById('instructions');
  const btn   = document.getElementById('howToBtn');
  const open  = panel.style.display === 'none' || panel.style.display === '';
  panel.style.display = open ? 'block' : 'none';
  btn.textContent = open ? '✖ CERRAR' : '❓ CÓMO JUGAR';
}

// ─── SELECTOR DE MODO ─────────────────────────────────────────────────────
function selectMode(n) {
  gameMode = n;
  document.getElementById('mode1Btn').classList.toggle('active', n === 1);
  document.getElementById('mode2Btn').classList.toggle('active', n === 2);
  document.body.classList.toggle('mode-2p', n === 2);
  document.body.classList.toggle('mode-1p', n === 1);

  // Mostrar/ocultar elementos 2P en HUD y game over
  const p2els = document.querySelectorAll('.p2-only, .p2-hud');
  p2els.forEach(el => el.style.display = (n === 2) ? 'flex' : 'none');
  const p2HudItems = document.querySelectorAll('[id="p2HudItem"], [id="p2LivesHud"]');
  p2HudItems.forEach(el => el.style.display = (n === 2) ? '' : 'none');
}

// ─── START GAME ───────────────────────────────────────────────────────────
function startGame() {
  playMenuClick();
  showGameUI();
  startRound(true);
  gameRunning = true;
  paused = false;
  pauseOverlay.classList.remove('active');
  lockLandscapeIfPossible();
  scheduleMobileLayoutValidation();
  if (!loopStarted) { loopStarted = true; loop(); }
}

document.getElementById('playBtn').addEventListener('click', startGame);
document.getElementById('goBtn').addEventListener('click',  startGame);
document.getElementById('winBtn').addEventListener('click', startGame);

document.getElementById('goMenuBtn').addEventListener('click',  () => { playMenuClick(); showMenu(); });
document.getElementById('winMenuBtn').addEventListener('click', () => { playMenuClick(); showMenu(); });

if (scoreForm) {
  scoreForm.addEventListener('submit', e => { e.preventDefault(); submitScore(); });
}

document.getElementById('pauseOverlay').addEventListener('click', togglePause);
window.addEventListener('resize', scheduleMobileLayoutValidation);
window.addEventListener('orientationchange', scheduleMobileLayoutValidation);
