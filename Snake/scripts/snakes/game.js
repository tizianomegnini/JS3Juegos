/**
 * game.js
 * Módulo principal del juego Snake.
 * Orquesta todos los demás módulos: tablero, serpientes, comida,
 * controles, colisiones, puntaje, efectos y sonidos.
 */

import { initBoard, CELL_SIZE }                from "./board.js";
import { Snake }                                from "./snake.js";
import { Food }                                 from "./food.js";
import { ScoreManager }                         from "./score.js";
import { GameTimer }                            from "./timer.js";
import { renderFrame, drawPauseOverlay }        from "./renderer.js";
import { checkSelfCollision, snakeVsSnake,
         snakeEatsFood }                        from "./collisions.js";
import { registerKeyboardControls,
         registerDpadControls }                 from "./controls.js";
import { getAllOccupied, determineWinner }       from "./multiplayer.js";
import { spawnEatParticles, updateParticles,
         clearParticles }                       from "./effects.js";
import { initAudio, playEat, playGameOver,
         playLevelUp, isMuted, setMuted }       from "./sounds.js";
import { saveScore, fetchPlayers }              from "../common/storage.js";
import { showToast }                            from "../common/ui.js";

// ─── Estado global del juego ───────────────────────────────────────────────

/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
/** @type {Snake} */        let snake1;
/** @type {Snake|null} */   let snake2 = null;
/** @type {Food} */         let food;
/** @type {ScoreManager} */ let score1Manager;
/** @type {ScoreManager} */ let score2Manager;
/** @type {GameTimer} */    let timer;
/** @type {number|null} */  let gameLoop = null;
/** @type {Function|null} */ let removeKeyboard = null;

/** Modo actual: "1P" o "2P" */
let gameMode = "1P";

/** Estado del juego */
let isPaused  = false;
let isRunning = false;

/** Datos de jugadores para guardar puntajes */
let player1Data = { id: null, name: "Jugador 1" };
let player2Data = { id: null, name: "Jugador 2" };

// ─── Callbacks de UI (se setean desde el exterior) ────────────────────────
let onGameEnd = null;
let onScoreUpdate = null;
let onTimerUpdate = null;

// ─── Inicialización ────────────────────────────────────────────────────────

/**
 * Inicializa el motor del juego.
 * @param {HTMLCanvasElement} canvasEl
 * @param {Object} options
 * @param {string}   options.mode           - "1P" o "2P"
 * @param {Object}   options.p1             - { id, name } del jugador 1
 * @param {Object}   [options.p2]           - { id, name } del jugador 2
 * @param {Function} [options.onEnd]        - Callback al terminar
 * @param {Function} [options.onScore]      - Callback de puntaje actualizado
 * @param {Function} [options.onTimer]      - Callback del timer
 */
export function initGame(canvasEl, options = {}) {
  canvas     = canvasEl;
  ctx        = canvas.getContext("2d");
  gameMode   = options.mode || "1P";
  onGameEnd  = options.onEnd    || null;
  onScoreUpdate = options.onScore  || null;
  onTimerUpdate = options.onTimer  || null;

  player1Data = options.p1 || { id: null, name: "Jugador 1" };
  player2Data = options.p2 || { id: null, name: "Jugador 2" };

  initBoard(canvas);
  initAudio();
}

// ─── Control del juego ─────────────────────────────────────────────────────

/** Inicia una nueva partida */
export function startGame() {
  // Limpiar partida anterior si existe
  stopGame();
  clearParticles();

  // Crear serpientes
  snake1 = new Snake({
    startX:    5,
    startY:    15,
    direction: "RIGHT",
    color:     "#4dc94d",
    headColor: "#2d8a2d",
    eyeColor:  "#ffffff"
  });

  if (gameMode === "2P") {
    snake2 = new Snake({
      startX:    24,
      startY:    15,
      direction: "LEFT",
      color:     "#5dade2",
      headColor: "#2980b9",
      eyeColor:  "#ffffff"
    });
  } else {
    snake2 = null;
  }

  // Crear comida en posición libre
  food = new Food(getAllOccupied(snake1, snake2));

  // Inicializar puntajes
  score1Manager = new ScoreManager();
  score2Manager = new ScoreManager();

  // Inicializar timer
  timer = new GameTimer((elapsed) => {
    if (onTimerUpdate) onTimerUpdate(timer.getFormatted());
  });

  // Registrar controles de teclado
  if (removeKeyboard) removeKeyboard();
  removeKeyboard = registerKeyboardControls(
    ({ player, dir }) => {
      if (!isRunning || isPaused) return;
      if (player === 1) snake1.setDirection(dir);
      if (player === 2 && snake2) snake2.setDirection(dir);
    },
    togglePause
  );

  // Registrar D-pad táctil (jugador 1)
  const dpad1 = document.getElementById("dpad-p1");
  registerDpadControls(dpad1, ({ dir }) => {
    if (!isRunning || isPaused) return;
    snake1.setDirection(dir);
  }, 1);

  // Registrar D-pad táctil (jugador 2)
  const dpad2 = document.getElementById("dpad-p2");
  registerDpadControls(dpad2, ({ dir }) => {
    if (!isRunning || isPaused || !snake2) return;
    snake2.setDirection(dir);
  }, 2);

  isRunning = true;
  isPaused  = false;

  timer.start();
  scheduleNextTick();
}

/** Pausa o reanuda el juego */
export function togglePause() {
  if (!isRunning) return;
  isPaused = !isPaused;

  if (isPaused) {
    timer.pause();
    clearInterval(gameLoop);
    gameLoop = null;
    drawPauseOverlay(ctx);
  } else {
    timer.resume();
    scheduleNextTick();
  }
}

/** Detiene completamente el juego */
export function stopGame() {
  isRunning = false;
  isPaused  = false;
  clearInterval(gameLoop);
  gameLoop = null;
  if (timer) timer.stop();
  if (removeKeyboard) { removeKeyboard(); removeKeyboard = null; }
}

// ─── Bucle del juego ───────────────────────────────────────────────────────

/**
 * Programa el próximo tick del bucle de juego.
 * La velocidad depende del nivel del jugador 1.
 */
function scheduleNextTick() {
  clearInterval(gameLoop);
  const speed = score1Manager ? score1Manager.getSpeed() : 150;
  gameLoop = setInterval(gameTick, speed);
}

/**
 * Un ciclo completo del juego:
 * mover, verificar colisiones, comer, renderizar.
 */
function gameTick() {
  if (!isRunning || isPaused) return;

  // ── Mover serpientes ────────────────────────────────────────────────
  snake1.move();
  if (snake2 && snake2.alive) snake2.move();

  // ── Verificar colisiones ────────────────────────────────────────────
  const col1 = checkSelfCollision(snake1);
  const col2 = snake2 ? checkSelfCollision(snake2) : null;

  // Colisión con la otra serpiente
  const s1HitsS2 = snake2 && snake2.alive && snakeVsSnake(snake1, snake2);
  const s2HitsS1 = snake2 && snakeVsSnake(snake2, snake1);

  if (col1 || s1HitsS2) snake1.alive = false;
  if (col2 || s2HitsS1) { if (snake2) snake2.alive = false; }

  // ── Verificar game over ─────────────────────────────────────────────
  if (gameMode === "1P" && !snake1.alive) {
    endGame();
    return;
  }

  if (gameMode === "2P") {
    const s2Alive = snake2 && snake2.alive;
    if (!snake1.alive || !s2Alive) {
      endGame();
      return;
    }
  }

  // ── Comer comida ────────────────────────────────────────────────────
  if (snakeEatsFood(snake1, food)) {
    eatFood(snake1, score1Manager, 1);
  } else if (snake2 && snakeEatsFood(snake2, food)) {
    eatFood(snake2, score2Manager, 2);
  }

  // ── Renderizar ──────────────────────────────────────────────────────
  renderFrame(ctx, { snake1, snake2, food });
  updateParticles(ctx);
}

/**
 * Maneja el evento de comer comida.
 * @param {Snake}        snake
 * @param {ScoreManager} scoreManager
 * @param {number}       playerNum
 */
function eatFood(snake, scoreManager, playerNum) {
  snake.grow();
  const leveled = scoreManager.addPoints(food.type.value);
  const occupied = getAllOccupied(snake1, snake2);
  food.respawn(occupied);

  if (!isMuted()) playEat();
  if (leveled) { if (!isMuted()) playLevelUp(); }

  // Partículas en la posición donde estaba la comida
  spawnEatParticles(
    food.position.x * CELL_SIZE + CELL_SIZE / 2,
    food.position.y * CELL_SIZE + CELL_SIZE / 2,
    playerNum === 1 ? "#4dc94d" : "#5dade2"
  );

  // Actualizar HUD
  if (onScoreUpdate) {
    onScoreUpdate({
      score1: score1Manager.score,
      score2: score2Manager.score,
      level1: score1Manager.level,
      level2: score2Manager.level
    });
  }

  // Reajustar velocidad si subió de nivel
  if (leveled) scheduleNextTick();
}

/**
 * Finaliza la partida: detiene el juego, guarda puntajes y notifica la UI.
 */
async function endGame() {
  stopGame();
  if (!isMuted()) playGameOver();

  const s1 = score1Manager.score;
  const s2 = score2Manager.score;

  // Determinar ganador en 2P
  let result = null;
  if (gameMode === "2P" && snake2) {
    result = determineWinner(snake1.alive, snake2.alive, s1, s2);
  }

  // Guardar puntajes en el servidor
  try {
    await saveScore({
      playerId:   player1Data.id,
      playerName: player1Data.name,
      score:      s1,
      mode:       gameMode
    });
    if (gameMode === "2P") {
      await saveScore({
        playerId:   player2Data.id,
        playerName: player2Data.name,
        score:      s2,
        mode:       gameMode
      });
    }
  } catch (e) {
    console.warn("No se pudo guardar el puntaje:", e.message);
  }

  // Notificar a la UI
  if (onGameEnd) {
    onGameEnd({ score1: s1, score2: s2, result, mode: gameMode });
  }
}

// ─── Getters de estado ─────────────────────────────────────────────────────

/** @returns {boolean} Si el juego está corriendo */
export function getIsRunning() { return isRunning; }
/** @returns {boolean} Si el juego está en pausa */
export function getIsPaused()  { return isPaused; }

/** Activa/desactiva el sonido */
export function toggleMute() {
  setMuted(!isMuted());
  return isMuted();
}

/** @returns {boolean} Estado de silencio */
export function getMuted() { return isMuted(); }