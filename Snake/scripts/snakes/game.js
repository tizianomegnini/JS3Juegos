/**
 * game.js
 * Motor principal del Snake.
 * Versión optimizada con requestAnimationFrame
 * para movimiento más fluido.
 */

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

import { initBoard, CELL_SIZE } from "./board.js";
import { Snake } from "./snake.js";
import { Food } from "./food.js";
import { ScoreManager } from "./score.js";
import { GameTimer } from "./timer.js";
import { renderFrame, drawPauseOverlay } from "./renderer.js";

import {
  checkSelfCollision,
  snakeVsSnake,
  snakeEatsFood
} from "./collisions.js";

import {
  registerKeyboardControls,
  registerDpadControls
} from "./controls.js";

import {
  getAllOccupied,
  determineWinner
} from "./multiplayer.js";

import {
  spawnEatParticles,
  updateParticles,
  clearParticles
} from "./effects.js";

import {
  initAudio,
  playEat,
  playGameOver,
  playLevelUp,
  isMuted,
  setMuted
} from "./sounds.js";

// ─────────────────────────────────────────────
// Estado global
// ─────────────────────────────────────────────

let canvas;
let ctx;

let snake1;
let snake2 = null;

let food;

let score1Manager;
let score2Manager;

let timer;

let removeKeyboard = null;

let gameMode = "1P";

let isPaused  = false;
let isRunning = false;

let player1Data = { id: null, name: "Jugador 1" };
let player2Data = { id: null, name: "Jugador 2" };

let onGameEnd     = null;
let onScoreUpdate = null;
let onTimerUpdate = null;

// ─────────────────────────────────────────────
// LOOP FLUIDO
// ─────────────────────────────────────────────

let animationFrameId = null;
let lastFrameTime    = 0;
let accumulator      = 0;
let tickSpeed        = 150;

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────

export function initGame(canvasEl, options = {}) {

  canvas = canvasEl;
  ctx    = canvas.getContext("2d");

  gameMode = options.mode || "1P";

  onGameEnd     = options.onEnd    || null;
  onScoreUpdate = options.onScore  || null;
  onTimerUpdate = options.onTimer  || null;

  player1Data = options.p1 || { id: null, name: "Jugador 1" };
  player2Data = options.p2 || { id: null, name: "Jugador 2" };

  initBoard(canvas);
  initAudio();

  canvas.style.transform  = "translateZ(0)";
  canvas.style.willChange = "transform";
}

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────

export function startGame() {

  stopGame();
  clearParticles();

  // ───── Snake 1 — gato gris, ojos verdes ─────

  snake1 = new Snake({
    startX:    5,
    startY:    15,
    direction: "RIGHT",
    color:     "#c8c8c8",
    headColor: "#a8a8a8",
    eyeColor:  "#4a9a4a"
  });

  // ───── Snake 2 — gato naranja, ojos dorados ─────

  if (gameMode === "2P") {

    snake2 = new Snake({
      startX:    24,
      startY:    15,
      direction: "LEFT",
      color:     "#d4813a",
      headColor: "#b8652a",
      eyeColor:  "#d4c020"
    });

  } else {

    snake2 = null;

    const dpad2 = document.getElementById("dpad-p2");
    if (dpad2) dpad2.style.display = "none";
  }

  // ───── Food ─────

  food = new Food(getAllOccupied(snake1, snake2));

  // ───── Scores ─────

  score1Manager = new ScoreManager();
  score2Manager = new ScoreManager();
  tickSpeed     = score1Manager.getSpeed();

  // ───── Timer ─────

  timer = new GameTimer(() => {
    if (onTimerUpdate) onTimerUpdate(timer.getFormatted());
  });

  // ───── Keyboard ─────

  if (removeKeyboard) removeKeyboard();

  removeKeyboard = registerKeyboardControls(
    ({ player, dir }) => {
      if (!isRunning || isPaused) return;
      if (player === 1)           snake1.setDirection(dir);
      if (player === 2 && snake2) snake2.setDirection(dir);
    },
    togglePause
  );

  // ───── Dpad P1 ─────

  const dpad1 = document.getElementById("dpad-p1");
  registerDpadControls(
    dpad1,
    ({ dir }) => {
      if (!isRunning || isPaused) return;
      snake1.setDirection(dir);
    },
    1
  );

  // ───── Dpad P2 ─────

  const dpad2 = document.getElementById("dpad-p2");
  if (snake2 && dpad2) {
    dpad2.style.display = "flex";
    registerDpadControls(
      dpad2,
      ({ dir }) => {
        if (!isRunning || isPaused || !snake2) return;
        snake2.setDirection(dir);
      },
      2
    );
  }

  // ───── Mobile fullscreen ─────

  if (isMobile()) {
    const wrapper = document.documentElement;
    if (wrapper.requestFullscreen) wrapper.requestFullscreen().catch(() => {});
    if (screen.orientation?.lock)  screen.orientation.lock("landscape").catch(() => {});
  }

  isRunning = true;
  isPaused  = false;

  timer.start();

  lastFrameTime    = performance.now();
  animationFrameId = requestAnimationFrame(gameLoop);
}

// ─────────────────────────────────────────────
// Loop
// ─────────────────────────────────────────────

function gameLoop(timestamp) {

  if (!isRunning) return;

  const delta   = timestamp - lastFrameTime;
  lastFrameTime = timestamp;
  accumulator  += delta;

  while (accumulator >= tickSpeed) {
    gameTick();
    accumulator -= tickSpeed;
  }

  const progress = tickSpeed ? Math.min(1, accumulator / tickSpeed) : 0;
  renderFrame(ctx, { snake1, snake2, food }, progress);
  updateParticles(ctx);

  animationFrameId = requestAnimationFrame(gameLoop);
}

// ─────────────────────────────────────────────
// Tick lógico
// ─────────────────────────────────────────────

function gameTick() {

  if (!isRunning || isPaused) return;

  snake1.move();
  if (snake2 && snake2.alive) snake2.move();

  const col1     = checkSelfCollision(snake1);
  const col2     = snake2 ? checkSelfCollision(snake2) : null;
  const s1HitsS2 = snake2 && snake2.alive && snakeVsSnake(snake1, snake2);
  const s2HitsS1 = snake2 && snakeVsSnake(snake2, snake1);

  if (col1 || s1HitsS2)             snake1.alive = false;
  if ((col2 || s2HitsS1) && snake2) snake2.alive = false;

  if (gameMode === "1P" && !snake1.alive) { endGame(); return; }

  if (gameMode === "2P") {
    const s2Alive = snake2 && snake2.alive;
    if (!snake1.alive || !s2Alive) { endGame(); return; }
  }

  if (snakeEatsFood(snake1, food)) {
    eatFood(snake1, score1Manager, 1);
  } else if (snake2 && snakeEatsFood(snake2, food)) {
    eatFood(snake2, score2Manager, 2);
  }
}

// ─────────────────────────────────────────────
// Comer comida
// ─────────────────────────────────────────────

function eatFood(snake, scoreManager, playerNum) {

  const foodValue  = food.type.value;
  const foodOldPos = { x: food.position.x, y: food.position.y };

  snake.grow();

  const leveled  = scoreManager.addPoints(foodValue);
  const occupied = getAllOccupied(snake1, snake2);

  food.respawn(occupied);

  if (!isMuted()) playEat();
  if (leveled && !isMuted()) playLevelUp();

  const particleColor = playerNum === 1 ? snake1.color : snake2.color;
  spawnEatParticles(
    (foodOldPos.x * CELL_SIZE) + CELL_SIZE / 2,
    (foodOldPos.y * CELL_SIZE) + CELL_SIZE / 2,
    particleColor
  );

  if (onScoreUpdate) {
    onScoreUpdate({
      score1: score1Manager.score,
      score2: score2Manager.score,
      level1: score1Manager.level,
      level2: score2Manager.level
    });
  }

  if (leveled) tickSpeed = score1Manager.getSpeed();
}

// ─────────────────────────────────────────────
// Pause
// ─────────────────────────────────────────────

export function togglePause() {

  if (!isRunning) return;

  isPaused = !isPaused;

  if (isPaused) {
    timer.pause();
    drawPauseOverlay(ctx);
  } else {
    timer.resume();
    lastFrameTime = performance.now();
  }
}

// ─────────────────────────────────────────────
// Stop
// ─────────────────────────────────────────────

export function stopGame() {

  isRunning = false;
  isPaused  = false;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (timer) timer.stop();

  if (removeKeyboard) {
    removeKeyboard();
    removeKeyboard = null;
  }
}

// ─────────────────────────────────────────────
// End
// ─────────────────────────────────────────────

async function endGame() {

  stopGame();

  if (!isMuted()) playGameOver();

  const s1 = score1Manager.score;
  const s2 = score2Manager.score;

  let result = null;
  if (gameMode === "2P" && snake2) {
    result = determineWinner(snake1.alive, snake2.alive, s1, s2);
  }

  if (onGameEnd) {
    onGameEnd({ score1: s1, score2: s2, result, mode: gameMode });
  }
}

// ─────────────────────────────────────────────
// Getters
// ─────────────────────────────────────────────

export function getIsRunning() { return isRunning; }
export function getIsPaused()  { return isPaused;  }

export function toggleMute() {
  setMuted(!isMuted());
  return isMuted();
}

export function getMuted() { return isMuted(); }