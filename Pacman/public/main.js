// ─── Constants ────────────────────────────────────────────────────────────────
const TILE  = 28;
const COLS  = 19;
const ROWS  = 21;

// Map values: 0=empty, 1=wall, 2=dot, 3=power pellet, 4=ghost house
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

const GHOST_COLORS   = ['#FF0000','#FFB8FF','#00FFFF','#FFB852'];
const GHOST_SCATTER  = [{x:COLS-2,y:0},{x:1,y:0},{x:COLS-2,y:ROWS-1},{x:1,y:ROWS-1}];
const GHOST_DELAYS   = [0, 60, 120, 180]; // frames before leaving house

// ─── DOM ─────────────────────────────────────────────────────────────────────
const menuScreen    = document.getElementById('menu');
const gameContainer = document.getElementById('gameContainer');
const gameOverScreen= document.getElementById('gameOver');
const winScreen     = document.getElementById('winScreen');
const playBtn       = document.getElementById('playBtn');
const scoreUI       = document.getElementById('score');
const livesUI       = document.getElementById('lives');
const levelUI       = document.getElementById('level');
const finalScoreUI  = document.getElementById('finalScore');
const winScoreUI    = document.getElementById('winScore');

const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
canvas.width  = COLS * TILE;
canvas.height = ROWS * TILE;

// ─── State ────────────────────────────────────────────────────────────────────
let map, player, ghosts, score, lives, level, dots, gameRunning;
let pendingDir = null;
let frightTimer = 0;
let ghostEatCombo = 0;
let mouthAngle = 0.05;
let mouthDir   = 1;
let loopStarted = false;

// ─── Init ─────────────────────────────────────────────────────────────────────
function cloneMap() {
  return BASE_MAP.map(row => row.slice());
}

function countDots(m) {
  let c = 0;
  for (const row of m) for (const v of row) if (v === 2 || v === 3) c++;
  return c;
}

function initGame() {
  map   = cloneMap();
  dots  = countDots(map);
  score = 0;
  lives = 3;
  level = 1;
  gameRunning  = true;
  frightTimer  = 0;
  ghostEatCombo = 0;
  pendingDir   = null;

  player = {
    x: 9.5, y: 16,
    dir: { x: 0, y: 0 },
    speed: 0.1,
  };

  spawnGhosts();
  updateHUD();
}

function spawnGhosts() {
  ghosts = GHOST_COLORS.map((color, i) => ({
    x: 9, y: 9.5,
    dir: i % 2 === 0 ? { x: 1, y: 0 } : { x: -1, y: 0 },
    color,
    mode: 'scatter',
    modeTimer: 0,
    frightened: false,
    inHouse: i > 0,
    houseTimer: GHOST_DELAYS[i],
    home: GHOST_SCATTER[i],
    speed: 0.07 - i * 0.005,
  }));
}

// ─── HUD ─────────────────────────────────────────────────────────────────────
function updateHUD() {
  scoreUI.textContent = score;
  levelUI.textContent = level;
  let h = '';
  for (let i = 0; i < lives; i++) h += '❤';
  livesUI.textContent = h || '✗';
}

// ─── Movement helpers ─────────────────────────────────────────────────────────
function wrap(v, max) {
  return ((v % max) + max) % max;
}

function tileValue(x, y) {
  const tx = Math.round(wrap(x, COLS));
  const ty = Math.round(wrap(y, ROWS));
  return map[ty]?.[tx] ?? 1;
}

function isWalkable(x, y, forGhost) {
  const tx = Math.round(wrap(x, COLS));
  const ty = Math.round(wrap(y, ROWS));
  const v  = map[ty]?.[tx] ?? 1;
  if (forGhost) return v !== 1;
  return v !== 1 && v !== 4;
}

function canStep(x, y, dir, forGhost) {
  return isWalkable(x + dir.x, y + dir.y, forGhost);
}

// ─── Player update ────────────────────────────────────────────────────────────
function movePlayer() {
  // Try queued direction first
  if (pendingDir && canStep(player.x, player.y, pendingDir, false)) {
    player.dir = pendingDir;
    pendingDir = null;
  }

  if (!canStep(player.x, player.y, player.dir, false)) {
    player.dir = { x: 0, y: 0 };
  }

  player.x = wrap(player.x + player.dir.x * player.speed, COLS);
  player.y = wrap(player.y + player.dir.y * player.speed, ROWS);

  // Eat tiles
  const tx = Math.round(wrap(player.x, COLS));
  const ty = Math.round(wrap(player.y, ROWS));
  const v  = map[ty]?.[tx];

  if (v === 2) {
    map[ty][tx] = 0;
    score += 10;
    dots--;
    updateHUD();
  }
  if (v === 3) {
    map[ty][tx] = 0;
    score += 50;
    dots--;
    frightTimer   = 350;
    ghostEatCombo = 0;
    ghosts.forEach(g => {
      g.frightened = true;
      g.dir = { x: -g.dir.x, y: -g.dir.y };
    });
    updateHUD();
  }

  if (dots <= 0) triggerWin();
}

// ─── Ghost update ─────────────────────────────────────────────────────────────
function moveGhosts() {
  // Count down fright
  if (frightTimer > 0) {
    frightTimer--;
    if (frightTimer === 0) {
      ghosts.forEach(g => { g.frightened = false; });
      ghostEatCombo = 0;
    }
  }

  ghosts.forEach((g, i) => {
    // House countdown
    if (g.inHouse) {
      g.houseTimer--;
      if (g.houseTimer <= 0) {
        g.inHouse = false;
        g.x = 9;
        g.y = 7;
        g.dir = { x: 0, y: -1 };
      }
      return;
    }

    const spd = g.frightened ? g.speed * 0.55 : g.speed;
    g.x = wrap(g.x + g.dir.x * spd, COLS);
    g.y = wrap(g.y + g.dir.y * spd, ROWS);

    const tx = Math.round(wrap(g.x, COLS));
    const ty = Math.round(wrap(g.y, ROWS));
    const onGrid = Math.abs(g.x - tx) < spd + 0.05 && Math.abs(g.y - ty) < spd + 0.05;

    if (onGrid) {
      g.x = tx; g.y = ty;

      // Build valid directions (no reversing)
      const ALL = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
      const dirs = ALL.filter(d => {
        if (d.x === -g.dir.x && d.y === -g.dir.y) return false;
        return isWalkable(tx + d.x, ty + d.y, true);
      });

      if (dirs.length === 0) {
        g.dir = { x: -g.dir.x, y: -g.dir.y };
      } else if (g.frightened) {
        g.dir = dirs[Math.floor(Math.random() * dirs.length)];
      } else {
        // Mode switching
        g.modeTimer++;
        if (g.modeTimer > 220) {
          g.mode = g.mode === 'scatter' ? 'chase' : 'scatter';
          g.modeTimer = 0;
        }
        const target = g.mode === 'chase'
          ? { x: Math.round(player.x), y: Math.round(player.y) }
          : g.home;
        let best = dirs[0], bd = Infinity;
        for (const d of dirs) {
          const dist = (tx + d.x - target.x) ** 2 + (ty + d.y - target.y) ** 2;
          if (dist < bd) { bd = dist; best = d; }
        }
        g.dir = best;
      }
    }

    // Collision with player
    const dx = wrap(g.x - player.x + COLS/2, COLS) - COLS/2;
    const dy = wrap(g.y - player.y + ROWS/2, ROWS) - ROWS/2;
    if (Math.sqrt(dx*dx + dy*dy) < 0.75) {
      if (g.frightened) {
        ghostEatCombo++;
        score += 200 * ghostEatCombo;
        updateHUD();
        g.x = 9; g.y = 9.5;
        g.frightened = false;
        g.inHouse = true;
        g.houseTimer = 80;
      } else {
        loseLife();
      }
    }
  });
}

// ─── Life / game over ─────────────────────────────────────────────────────────
function loseLife() {
  lives--;
  updateHUD();
  if (lives <= 0) {
    triggerGameOver();
    return;
  }
  player.x   = 9.5;
  player.y   = 16;
  player.dir = { x: 0, y: 0 };
  pendingDir = null;
  spawnGhosts();
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

// ─── Drawing ──────────────────────────────────────────────────────────────────
function drawMaze() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v  = map[r][c];
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
          // glow
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
  // Animate mouth
  mouthAngle += 0.15 * mouthDir;
  if (mouthAngle > 0.35) mouthDir = -1;
  if (mouthAngle < 0.02) mouthDir = 1;

  const mouth = (player.dir.x === 0 && player.dir.y === 0) ? 0.05 : mouthAngle;
  const angle = Math.atan2(player.dir.y, player.dir.x);

  const px = player.x * TILE + TILE / 2;
  const py = player.y * TILE + TILE / 2;
  const r  = TILE / 2 - 2;

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
    const r  = TILE / 2 - 2;

    // Frightened color (flashes when about to end)
    let col = g.color;
    if (g.frightened) {
      col = (frightTimer < 80 && Math.floor(frightTimer / 12) % 2 === 0)
        ? '#ffffff' : '#0000cc';
    }

    ctx.fillStyle = col;

    // Body: dome + wavy bottom
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

    // Eyes (skip if frightened)
    if (!g.frightened) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(px - 4, py - 3, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(px + 4, py - 3, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
      const ex = g.dir.x * 2;
      const ey = g.dir.y * 2;
      ctx.fillStyle = '#00f';
      ctx.beginPath(); ctx.arc(px - 4 + ex, py - 3 + ey, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(px + 4 + ex, py - 3 + ey, 2.5, 0, Math.PI * 2); ctx.fill();
    }
  });
}

// ─── Game loop ────────────────────────────────────────────────────────────────
function loop() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMaze();
  drawPlayer();
  drawGhosts();

  if (gameRunning) {
    movePlayer();
    moveGhosts();
  }

  requestAnimationFrame(loop);
}

// ─── Input ────────────────────────────────────────────────────────────────────
const KEY_MAP = {
  ArrowUp: {x:0,y:-1}, w: {x:0,y:-1},
  ArrowDown: {x:0,y:1}, s: {x:0,y:1},
  ArrowLeft: {x:-1,y:0}, a: {x:-1,y:0},
  ArrowRight: {x:1,y:0}, d: {x:1,y:0},
};

document.addEventListener('keydown', e => {
  const d = KEY_MAP[e.key];
  if (d) { e.preventDefault(); pendingDir = d; }
});

document.querySelectorAll('.dpbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = btn.dataset.dir;
    if (dir === 'up')    pendingDir = {x:0,y:-1};
    if (dir === 'down')  pendingDir = {x:0,y:1};
    if (dir === 'left')  pendingDir = {x:-1,y:0};
    if (dir === 'right') pendingDir = {x:1,y:0};
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
playBtn.addEventListener('click', () => {
  menuScreen.style.display = 'none';
  gameContainer.style.display = 'flex';
  initGame();
  if (!loopStarted) { loopStarted = true; loop(); }
});
