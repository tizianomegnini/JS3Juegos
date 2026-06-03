// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  pauseOverlay.classList.toggle('active', paused);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  KEYBOARD
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  D-PAD (touch + click)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  SWIPE GESTURE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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

function syncTouchControls() {
  const showControls = canShowTouchControls() && getIsRunning();
  document.body.classList.toggle('mobile-controls', showControls);
  document.body.classList.toggle('mobile-landscape', showControls);

  const dpad = document.getElementById('dpad');
  const swipeHint = document.getElementById('swipeHint');
  if (dpad) dpad.classList.toggle('active', showControls);
  if (swipeHint) swipeHint.classList.toggle('active', showControls);
}

function validateMobileLayout() {
  if (!gameRunning) {
    syncTouchControls();
    return;
  }

  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  syncTouchControls();

  const canvas = document.getElementById('game');
  if (canvas) canvas.getBoundingClientRect();
}

function scheduleMobileLayoutValidation() {
  requestAnimationFrame(validateMobileLayout);
  [80, 250, 600].forEach(delay => {
    setTimeout(validateMobileLayout, delay);
  });
}

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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  START
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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

document.getElementById('pauseOverlay').addEventListener('click', togglePause);
window.addEventListener('resize', scheduleMobileLayoutValidation);
window.addEventListener('orientationchange', scheduleMobileLayoutValidation);
