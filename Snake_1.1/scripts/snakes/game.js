/**
 * game.js
 * Motor principal del Snake.
 */

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

import * as Board from "./board.js";
import { Snake } from "./snake.js";
import { Food } from "./food.js";
import { ScoreManager } from "./score.js";
import { GameTimer } from "./timer.js";

import {
  renderFrame,
  drawPauseOverlay
} from "./renderer.js";

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

// ─────────────────────────────────────────
// Estado
// ─────────────────────────────────────────

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
let wallMode = "wall";
let foodCount = 1;

let isPaused = false;
let isRunning = false;

let onGameEnd;
let onScoreUpdate;
let onTimerUpdate;

// Loop
let animationFrameId = null;
let lastFrameTime = 0;
let accumulator = 0;
let tickSpeed = 150;

// ─────────────────────────────────────────
// Init
// ─────────────────────────────────────────

export function initGame(canvasEl, options = {}) {

  canvas = canvasEl;
  ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  gameMode = options.mode || "1P";
  wallMode = options.wallMode || "wall";
  foodCount = options.foodCount || 1;

  const mapSize = options.mapSize || "large";

  Board.setMapSize(mapSize);

  onGameEnd = options.onEnd || null;
  onScoreUpdate = options.onScore || null;
  onTimerUpdate = options.onTimer || null;

  Board.initBoard(canvas);

  initAudio();

  canvas.style.transform = "translateZ(0)";
  canvas.style.willChange = "transform";

  canvas.style.aspectRatio =
    `${canvas.width} / ${canvas.height}`;
}

// ─────────────────────────────────────────
// Start
// ─────────────────────────────────────────

export function startGame() {

  stopGame();

  clearParticles();

  accumulator = 0;

  const midY = Math.floor(Board.ROWS / 2);

  snake1 = new Snake({
    startX: Math.floor(Board.COLS * 0.15),
    startY: midY,
    direction: "RIGHT",
    color: "#c8c8c8",
    headColor: "#a8a8a8",
    eyeColor: "#4a9a4a"
  });

  snake1.wallMode = wallMode;

  if (gameMode === "2P") {

    snake2 = new Snake({
      startX: Math.floor(Board.COLS * 0.85),
      startY: midY,
      direction: "LEFT",
      color: "#d4813a",
      headColor: "#b8652a",
      eyeColor: "#d4c020"
    });

    snake2.wallMode = wallMode;

  } else {

    snake2 = null;

    const dpad2 = document.getElementById("dpad-p2");

    if (dpad2) {
      dpad2.style.display = "none";
    }
  }

  food = new Food(
    getAllOccupied(snake1, snake2),
    foodCount
  );

  score1Manager = new ScoreManager();
  score2Manager = new ScoreManager();

  tickSpeed = score1Manager.getSpeed();

  timer = new GameTimer(() => {

    if (onTimerUpdate) {
      onTimerUpdate(timer.getFormatted());
    }

  });

  if (removeKeyboard) {
    removeKeyboard();
  }

  removeKeyboard = registerKeyboardControls(

    ({ player, dir }) => {

      if (!isRunning || isPaused) return;

      if (player === 1) {
        snake1.setDirection(dir);
      }

      if (player === 2 && snake2) {
        snake2.setDirection(dir);
      }
    },

    togglePause
  );

  const dpad1 = document.getElementById("dpad-p1");

  registerDpadControls(

    dpad1,

    ({ dir }) => {

      if (!isRunning || isPaused) return;

      snake1.setDirection(dir);
    },

    1
  );

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

  if (isMobile()) {

    const wrapper = document.documentElement;

    if (wrapper.requestFullscreen) {
      wrapper.requestFullscreen().catch(() => {});
    }

    if (screen.orientation?.lock) {
      screen.orientation.lock("landscape").catch(() => {});
    }
  }

  isRunning = true;
  isPaused = false;

  timer.start();

  lastFrameTime = performance.now();

  animationFrameId =
    requestAnimationFrame(gameLoop);
}

// ─────────────────────────────────────────
// Loop
// ─────────────────────────────────────────

function gameLoop(timestamp) {

  if (!isRunning) return;

  const delta =
    timestamp - lastFrameTime;

  lastFrameTime = timestamp;

  if (!isPaused) {
    accumulator += delta;
  }

  while (
    !isPaused &&
    accumulator >= tickSpeed
  ) {

    gameTick();

    accumulator -= tickSpeed;
  }

  const progress = isPaused
    ? 0
    : tickSpeed
      ? Math.min(
          1,
          accumulator / tickSpeed
        )
      : 0;

  renderFrame(
    ctx,
    { snake1, snake2, food },
    progress
  );

  if (isPaused) {
    drawPauseOverlay(ctx);
  }

  updateParticles(ctx);

  animationFrameId =
    requestAnimationFrame(gameLoop);
}

// ─────────────────────────────────────────
// Tick
// ─────────────────────────────────────────

function gameTick() {

  if (!isRunning || isPaused) return;

  snake1.move();

  if (snake2 && snake2.alive) {
    snake2.move();
  }

  const col1 =
    checkSelfCollision(snake1);

  const col2 =
    snake2
      ? checkSelfCollision(snake2)
      : null;

  const s1HitsS2 =
    snake2 &&
    snake2.alive &&
    snakeVsSnake(snake1, snake2);

  const s2HitsS1 =
    snake2 &&
    snakeVsSnake(snake2, snake1);

  if (col1 || s1HitsS2) {
    snake1.alive = false;
  }

  if ((col2 || s2HitsS1) && snake2) {
    snake2.alive = false;
  }

  if (
    gameMode === "1P" &&
    !snake1.alive
  ) {
    endGame();
    return;
  }

  if (
    gameMode === "2P" &&
    (
      !snake1.alive ||
      !(snake2?.alive)
    )
  ) {
    endGame();
    return;
  }

  // ───── Comida ─────

  const eaten1 =
    snakeEatsFood(snake1, food);

  if (eaten1) {
    eatFood(
      snake1,
      score1Manager,
      1,
      eaten1
    );
  }

  if (snake2 && snake2.alive) {

    const eaten2 =
      snakeEatsFood(snake2, food);

    if (eaten2) {

      eatFood(
        snake2,
        score2Manager,
        2,
        eaten2
      );
    }
  }
}

// ─────────────────────────────────────────
// Comer comida
// ─────────────────────────────────────────

function eatFood(
  snake,
  scoreManager,
  playerNum,
  eatenItem
) {

  const foodValue =
    eatenItem.type.value;

  const foodOldPos = {
    ...eatenItem.position
  };

  snake.grow();

  const leveled =
    scoreManager.addPoints(foodValue);

  const occupied =
    getAllOccupied(snake1, snake2);

  food.respawnItem(
    eatenItem,
    occupied
  );

  if (!isMuted()) {
    playEat();
  }

  if (leveled && !isMuted()) {
    playLevelUp();
  }

  const color =
    playerNum === 1
      ? snake1.color
      : snake2.color;

  spawnEatParticles(
    foodOldPos.x * Board.CELL_SIZE +
      Board.CELL_SIZE / 2,

    foodOldPos.y * Board.CELL_SIZE +
      Board.CELL_SIZE / 2,

    color
  );

  if (onScoreUpdate) {

    onScoreUpdate({

      score1: score1Manager.score,
      score2: score2Manager.score,

      level1: score1Manager.level,
      level2: score2Manager.level
    });
  }

  if (leveled) {
    tickSpeed =
      score1Manager.getSpeed();
  }
}

// ─────────────────────────────────────────
// Pause
// ─────────────────────────────────────────

export function togglePause() {

  if (!isRunning) return;

  isPaused = !isPaused;

  if (isPaused) {

    accumulator = 0;

    timer.pause();

  } else {

    timer.resume();

    lastFrameTime =
      performance.now();
  }
}

// ─────────────────────────────────────────
// Stop
// ─────────────────────────────────────────

export function stopGame() {

  isRunning = false;
  isPaused = false;

  accumulator = 0;

  if (animationFrameId) {

    cancelAnimationFrame(
      animationFrameId
    );

    animationFrameId = null;
  }

  if (timer) {
    timer.stop();
  }

  if (removeKeyboard) {

    removeKeyboard();

    removeKeyboard = null;
  }
}

// ─────────────────────────────────────────
// End
// ─────────────────────────────────────────

async function endGame() {

  stopGame();

  if (!isMuted()) {
    playGameOver();
  }

  const s1 =
    score1Manager.score;

  const s2 =
    score2Manager.score;

  const result =
    gameMode === "2P"
      ? determineWinner(
          snake1.alive,
          snake2?.alive ?? false,
          s1,
          s2
        )
      : null;

  if (onGameEnd) {

    onGameEnd({

      score1: s1,
      score2: s2,

      result,
      mode: gameMode
    });
  }
}

// ─────────────────────────────────────────
// Getters
// ─────────────────────────────────────────

export function getIsRunning() {
  return isRunning;
}

export function getIsPaused() {
  return isPaused;
}

export function toggleMute() {

  setMuted(!isMuted());

  return isMuted();
}

export function getMuted() {
  return isMuted();
}