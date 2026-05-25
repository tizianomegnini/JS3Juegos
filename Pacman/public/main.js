// ─── Map / Constants ──────────────────────────────────────────────────────────
const TILE = 28;

const BASE_MAP = [
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
];

const ROWS = BASE_MAP.length;
const COLS = BASE_MAP[0].length;
const MAX_LEVEL = 3;

const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];
const GHOST_SCATTER = [
  { x: COLS - 2, y: 0 },
  { x: 1, y: 0 },
  { x: COLS - 2, y: ROWS - 1 },
  { x: 1, y: ROWS - 1 },
];
const GHOST_DELAYS = [0, 60, 120, 180];

// ─── DOM ──────────────────────────────────────────────────────────────────────
const menuScreen     = document.getElementById('menu');
const gameContainer  = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOver');
const winScreen      = document.getElementById('winScreen');
const playBtn        = document.getElementById('playBtn');
const scoreUI        = document.getElementById('score');
const livesUI        = document.getElementById('lives');
const levelUI        = document.getElementById('level');
const finalScoreUI   = document.getElementById('finalScore');
const winScoreUI     = document.getElementById('winScore');

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

// ─── State ────────────────────────────────────────────────────────────────────
let map = [];
let player = null;
let ghosts = [];
let score = 0;
let lives = 3;
let level = 1;
let dots = 0;
let gameRunning = false;
let paused = false;
let loopStarted = false;

let pendingDir = null;
let frightTimer = 0;
let ghostEatCombo = 0;

let modeIndex = 0;
let modeTimer = 0;
let currentMode = 'scatter';

let mouthAngle = 0.05;
let mouthDir = 1;

const DIRS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cloneMap() {
  return BASE_MAP.map(row => row.slice());
}

function countDots(m) {
  let c = 0;
  for (const row of m) {
    for (const v of row) {
      if (v === 2 || v === 3) c++;
    }
  }
  return c;
}

function wrap(v, max) {
  return ((v % max) + max) % max;
}

function tileIndex(v, max) {
  return wrap(Math.round(v), max);
}

function getTile(x, y) {
  const tx = tileIndex(x, COLS);
  const ty = tileIndex(y, ROWS);
  return { tx, ty, value: map[ty]?.[tx] ?? 1 };
}

function isWalkable(x, y, forGhost = false) {
  const { value } = getTile(x, y);
  return forGhost ? value !== 1 : value !== 1 && value !== 4;
}

function canStep(entity, dir, forGhost = false) {
  return isWalkable(entity.x + dir.x, entity.y + dir.y, forGhost);
}

function isCentered(entity, tolerance = 0.12) {
  return (
    Math.abs(entity.x - Math.round(entity.x)) < tolerance &&
    Math.abs(entity.y - Math.round(entity.y)) < tolerance
  );
}

function distSq(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function updateHUD() {
  scoreUI.textContent = score;
  levelUI.textContent = level;
  livesUI.textContent = lives > 0 ? '❤'.repeat(lives) : '✗';
}

function resetModeCycle() {
  modeIndex = 0;
  modeTimer = 0;
  currentMode = 'scatter';
}

function getCurrentPhaseFrames() {
  if (currentMode === 'scatter') {
    return Math.max(180, 420 - (level - 1) * 40);
  }
  return Math.max(900, 1200 - (level - 1) * 60);
}

function switchModeIfNeeded() {
  modeTimer++;
  if (modeTimer >= getCurrentPhaseFrames()) {
    modeTimer = 0;
    currentMode = currentMode === 'scatter' ? 'chase' : 'scatter';
    modeIndex++;
  }
}

function playerSpeed() {
  return Math.min(0.14, 0.105 + (level - 1) * 0.005);
}

function ghostSpeed(base, frightened = false, eaten = false) {
  let s = base + (level - 1) * 0.004;
  if (frightened) s *= 0.58;
  if (eaten) s *= 1.45;
  return s;
}

// ─── Init / Spawn ─────────────────────────────────────────────────────────────
function spawnGhosts() {
  ghosts = GHOST_COLORS.map((color, i) => ({
    id: i,
    x: 9,
    y: 9,
    dir: i % 2 === 0 ? { x: 1, y: 0 } : { x: -1, y: 0 },
    color,
    frightened: false,
    eaten: false,
    inHouse: i > 0,
    houseTimer: GHOST_DELAYS[i],
    home: { x: 9, y: 9 },
    scatter: GHOST_SCATTER[i],
    baseSpeed: 0.074 - i * 0.004,
  }));
}

function spawnPlayer() {
  player = {
    x: 9,
    y: 16,
    dir: { x: 0, y: 0 },
    speed: playerSpeed(),
  };
}

function startRound(resetScore = false) {
  map = cloneMap();
  dots = countDots(map);

  if (resetScore) score = 0;
  lives = 3;
  level = 1;
  gameRunning = true;
  paused = false;

  frightTimer = 0;
  ghostEatCombo = 0;
  pendingDir = null;

  spawnPlayer();
  spawnGhosts();
  resetModeCycle();
  updateHUD();
}

function startLevel(keepScore = true) {
  map = cloneMap();
  dots = countDots(map);

  if (!keepScore) score = 0;
  frightTimer = 0;
  ghostEatCombo = 0;
  pendingDir = null;

  spawnPlayer();
  spawnGhosts();
  resetModeCycle();
  updateHUD();
}

function nextLevel() {
  level++;
  if (level > MAX_LEVEL) {
    triggerWin();
    return;
  }
  startLevel(true);
}

function resetAfterDeath() {
  spawnPlayer();
  spawnGhosts();
  frightTimer = 0;
  ghostEatCombo = 0;
  pendingDir = null;
  resetModeCycle();
}

// ─── Ghost AI ────────────────────────────────────────────────────────────────
function getPlayerTile() {
  return { x: Math.round(player.x), y: Math.round(player.y) };
}

function getAheadTile(steps = 4) {
  const px = Math.round(player.x + player.dir.x * steps);
  const py = Math.round(player.y + player.dir.y * steps);
  return {
    x: wrap(px, COLS),
    y: wrap(py, ROWS),
  };
}

function getInkyTarget() {
  const blinky = ghosts[0];
  const ahead = getAheadTile(2);
  const vx = ahead.x * 2 - blinky.x;
  const vy = ahead.y * 2 - blinky.y;
  return {
    x: wrap(Math.round(vx), COLS),
    y: wrap(Math.round(vy), ROWS),
  };
}

function chooseGhostTarget(g) {
  const playerTile = getPlayerTile();

  if (g.id === 0) {
    return playerTile; // Blinky
  }

  if (g.id === 1) {
    return getAheadTile(4); // Pinky
  }

  if (g.id === 2) {
    return getInkyTarget(); // Inky
  }

  const d2 = distSq(g.x, g.y, player.x, player.y);
  if (d2 < 64) return g.scatter; // Clyde gets nervous
  return playerTile;
}

function getBestDir(g, target) {
  const valid = DIRS.filter(d => {
    if (d.x === -g.dir.x && d.y === -g.dir.y) return false;
    return isWalkable(g.x + d.x, g.y + d.y, true);
  });

  if (valid.length === 0) {
    return { x: -g.dir.x, y: -g.dir.y };
  }

  let best = valid[0];
  let bestScore = Infinity;

  for (const d of valid) {
    const nx = wrap(Math.round(g.x + d.x), COLS);
    const ny = wrap(Math.round(g.y + d.y), ROWS);
    const score = distSq(nx, ny, target.x, target.y);

    if (score < bestScore) {
      bestScore = score;
      best = d;
    }
  }

  return best;
}

// ─── Player ──────────────────────────────────────────────────────────────────
function movePlayer() {
  player.speed = playerSpeed();

  if (pendingDir && isCentered(player) && canStep(player, pendingDir, false)) {
    player.dir = pendingDir;
    pendingDir = null;
  }

  if (isCentered(player) && !canStep(player, player.dir, false)) {
    player.dir = { x: 0, y: 0 };
  }

  player.x = wrap(player.x + player.dir.x * player.speed, COLS);
  player.y = wrap(player.y + player.dir.y * player.speed, ROWS);

  if (Math.abs(player.x - Math.round(player.x)) < player.speed) player.x = Math.round(player.x);
  if (Math.abs(player.y - Math.round(player.y)) < player.speed) player.y = Math.round(player.y);

  const { tx, ty, value } = getTile(player.x, player.y);

  if (value === 2) {
    map[ty][tx] = 0;
    score += 10;
    dots--;
    updateHUD();
  }

  if (value === 3) {
    map[ty][tx] = 0;
    score += 50;
    dots--;
    frightTimer = Math.max(240, 350 - (level - 1) * 10);
    ghostEatCombo = 0;

    ghosts.forEach(g => {
      if (!g.inHouse && !g.eaten) {
        g.frightened = true;
        g.dir = { x: -g.dir.x, y: -g.dir.y };
      }
    });

    updateHUD();
  }

  if (dots <= 0) nextLevel();
}

// ─── Ghosts ───────────────────────────────────────────────────────────────────
function moveGhosts() {
  switchModeIfNeeded();

  if (frightTimer > 0) {
    frightTimer--;
    if (frightTimer === 0) {
      ghosts.forEach(g => {
        g.frightened = false;
      });
      ghostEatCombo = 0;
    }
  }

  ghosts.forEach(g => {
    if (g.inHouse) {
      g.houseTimer--;
      if (g.houseTimer <= 0) {
        g.inHouse = false;
        g.eaten = false;
        g.frightened = false;
        g.x = g.home.x;
        g.y = g.home.y;
        g.dir = { x: 0, y: -1 };
      }
      return;
    }

    const speed = ghostSpeed(g.baseSpeed, g.frightened, g.eaten);

    if (isCentered(g)) {
      let target;

      if (g.eaten) {
        target = g.home;
      } else if (g.frightened) {
        const choices = DIRS.filter(d => {
          if (d.x === -g.dir.x && d.y === -g.dir.y) return false;
          return isWalkable(g.x + d.x, g.y + d.y, true);
        });
        if (choices.length > 0) {
          g.dir = choices[Math.floor(Math.random() * choices.length)];
        } else {
          g.dir = { x: -g.dir.x, y: -g.dir.y };
        }
      } else {
        target = currentMode === 'scatter' ? g.scatter : chooseGhostTarget(g);
        g.dir = getBestDir(g, target);
      }
    }

    g.x = wrap(g.x + g.dir.x * speed, COLS);
    g.y = wrap(g.y + g.dir.y * speed, ROWS);

    if (Math.abs(g.x - Math.round(g.x)) < speed) g.x = Math.round(g.x);
    if (Math.abs(g.y - Math.round(g.y)) < speed) g.y = Math.round(g.y);

    if (g.eaten && Math.round(g.x) === g.home.x && Math.round(g.y) === g.home.y) {
      g.eaten = false;
      g.inHouse = true;
      g.houseTimer = 80;
      g.dir = { x: 0, y: -1 };
      return;
    }

    const hit = Math.hypot(g.x - player.x, g.y - player.y) < 0.72;
    if (hit) {
      if (g.frightened) {
        ghostEatCombo++;
        score += 200 * Math.pow(2, ghostEatCombo - 1);
        updateHUD();

        g.frightened = false;
        g.eaten = true;
        g.dir = { x: 0, y: 0 };
        g.x = Math.round(g.x);
        g.y = Math.round(g.y);
      } else if (!g.eaten) {
        loseLife();
      }
    }
  });
}

// ─── Life / Win / Game Over ───────────────────────────────────────────────────
function loseLife() {
  lives--;
  updateHUD();

  if (lives <= 0) {
    triggerGameOver();
    return;
  }

  resetAfterDeath();
}

function triggerGameOver() {
  gameRunning = false;
  gameContainer.style.display = 'none';
  finalScoreUI.textContent = score;
  gameOverScreen.style.display = 'flex';
}

function triggerWin() {
  gameRunning = false;
  gameContainer.style.display = 'none';
  winScoreUI.textContent = score;
  winScreen.style.display = 'flex';
}

function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
}

// ─── Drawing ──────────────────────────────────────────────────────────────────
function drawMaze() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = map[r][c];
      const px = c * TILE;
      const py = r * TILE;

      if (v === 1) {
        ctx.fillStyle = '#1a1aff';
        ctx.fillRect(px, py, TILE, TILE);
        ctx.strokeStyle = '#3a3aff';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
      } else if (v === 4) {
        ctx.fillStyle = '#110022';
        ctx.fillRect(px, py, TILE, TILE);
      } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(px, py, TILE, TILE);

        if (v === 2) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(px + TILE / 2, py + TILE / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (v === 3) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(px + TILE / 2, py + TILE / 2, 5.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(255,215,0,0.25)';
          ctx.beginPath();
          ctx.arc(px + TILE / 2, py + TILE / 2, 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

function drawPlayer() {
  mouthAngle += 0.15 * mouthDir;
  if (mouthAngle > 0.35) mouthDir = -1;
  if (mouthAngle < 0.02) mouthDir = 1;

  const mouth = (player.dir.x === 0 && player.dir.y === 0) ? 0.05 : mouthAngle;
  const angle = Math.atan2(player.dir.y, player.dir.x);

  const px = player.x * TILE + TILE / 2;
  const py = player.y * TILE + TILE / 2;
  const r = TILE / 2 - 2;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(angle);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, mouth * Math.PI, (2 - mouth) * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawGhosts() {
  ghosts.forEach(g => {
    if (g.inHouse) return;

    const px = g.x * TILE + TILE / 2;
    const py = g.y * TILE + TILE / 2;
    const r = TILE / 2 - 2;

    if (g.eaten) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(px - 4, py - 3, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(px + 4, py - 3, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      const ex = g.dir.x * 2;
      const ey = g.dir.y * 2;
      ctx.fillStyle = '#00f';
      ctx.beginPath();
      ctx.arc(px - 4 + ex, py - 3 + ey, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + 4 + ex, py - 3 + ey, 2.5, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    let col = g.color;
    if (g.frightened) {
      col = (frightTimer < 80 && Math.floor(frightTimer / 10) % 2 === 0)
        ? '#ffffff'
        : '#0000cc';
    }

    ctx.fillStyle = col;

    ctx.beginPath();
    ctx.arc(px, py - 2, r, Math.PI, 0);
    ctx.lineTo(px + r, py + r);

    const waves = 3;
    const ww = (r * 2) / waves;
    for (let i = waves; i >= 0; i--) {
      ctx.arc(px - r + ww * i + ww / 2, py + r, ww / 2, 0, Math.PI, i % 2 === 0);
    }

    ctx.closePath();
    ctx.fill();

    if (!g.frightened) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(px - 4, py - 3, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(px + 4, py - 3, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      const ex = g.dir.x * 2;
      const ey = g.dir.y * 2;
      ctx.fillStyle = '#00f';
      ctx.beginPath();
      ctx.arc(px - 4 + ex, py - 3 + ey, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + 4 + ex, py - 3 + ey, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawPauseOverlay() {
  if (!paused || !gameRunning) return;

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSA', canvas.width / 2, canvas.height / 2);
  ctx.restore();
}

// ─── Loop ─────────────────────────────────────────────────────────────────────
function loop() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMaze();
  drawPlayer();
  drawGhosts();
  drawPauseOverlay();

  if (gameRunning && !paused) {
    movePlayer();
    moveGhosts();
  }

  requestAnimationFrame(loop);
}

// ─── Input ────────────────────────────────────────────────────────────────────
const KEY_MAP = {
  ArrowUp:    { x: 0, y: -1 },
  w:          { x: 0, y: -1 },
  W:          { x: 0, y: -1 },
  ArrowDown:  { x: 0, y: 1 },
  s:          { x: 0, y: 1 },
  S:          { x: 0, y: 1 },
  ArrowLeft:  { x: -1, y: 0 },
  a:          { x: -1, y: 0 },
  A:          { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  d:          { x: 1, y: 0 },
  D:          { x: 1, y: 0 },
};

document.addEventListener('keydown', e => {
  const d = KEY_MAP[e.key];
  if (d) {
    e.preventDefault();
    pendingDir = d;
    return;
  }

  if (e.key === 'p' || e.key === 'P') togglePause();
  if (e.key === 'r' || e.key === 'R') {
    menuScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    winScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    startRound(true);
    gameRunning = true;
    paused = false;
  }
});

document.querySelectorAll('.dpbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = btn.dataset.dir;
    if (dir === 'up') pendingDir = { x: 0, y: -1 };
    if (dir === 'down') pendingDir = { x: 0, y: 1 };
    if (dir === 'left') pendingDir = { x: -1, y: 0 };
    if (dir === 'right') pendingDir = { x: 1, y: 0 };
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
playBtn.addEventListener('click', () => {
  menuScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
  winScreen.style.display = 'none';
  gameContainer.style.display = 'flex';

  startRound(true);

  if (!loopStarted) {
    loopStarted = true;
    loop();
  }
});