/**
 * renderer.js
 * Módulo de renderizado del juego Snake.
 * Dibuja el tablero, las serpientes, la comida y los overlays.
 */

import { CELL_SIZE, COLS, ROWS, clearBoard, drawGrid } from "./board.js";

/** Colores del tablero según el tema activo */
function getBoardColors() {
  const dark = document.documentElement.dataset.theme === "dark";
  return {
    bg:   dark ? "#0d1f0d" : "#e8f5e8",
    grid: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"
  };
}

/**
 * Renderiza un frame completo del juego.
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ snake1: Snake, snake2: Snake|null, food: Food }} state
 */
export function renderFrame(ctx, { snake1, snake2, food }) {
  const { bg, grid } = getBoardColors();

  clearBoard(ctx, bg);
  drawGrid(ctx, grid);
  drawFood(ctx, food);
  drawSnake(ctx, snake1);
  if (snake2 && snake2.alive) drawSnake(ctx, snake2);
}

// ─── Comida ────────────────────────────────────────────────────────────────

/**
 * Dibuja la comida en el canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Food} food
 */
function drawFood(ctx, food) {
  const { x, y } = food.position;
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;

  // Fondo circular suave
  ctx.fillStyle = "rgba(255, 220, 80, 0.18)";
  ctx.beginPath();
  ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
  ctx.fill();

  // Emoji de la comida
  ctx.font = `${CELL_SIZE - 4}px serif`;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(food.type.emoji, px + CELL_SIZE / 2, py + CELL_SIZE / 2 + 1);

  // Reset
  ctx.textAlign    = "start";
  ctx.textBaseline = "alphabetic";
}

// ─── Serpiente ─────────────────────────────────────────────────────────────

/**
 * Dibuja una serpiente completa (cuerpo + cabeza + ojos).
 * @param {CanvasRenderingContext2D} ctx
 * @param {Snake} snake
 */
function drawSnake(ctx, snake) {
  if (!snake || !snake.body.length) return;

  // Dibujar segmentos del cuerpo (todos excepto la cabeza)
  for (let i = snake.body.length - 1; i >= 1; i--) {
    drawBodySegment(ctx, snake.body[i], snake.color, i, snake.body.length);
  }

  // Dibujar cabeza
  drawHead(ctx, snake);
}

/**
 * Dibuja un segmento del cuerpo con ligero efecto de degradado.
 */
function drawBodySegment(ctx, cell, color, index, total) {
  const px     = cell.x * CELL_SIZE + 1;
  const py     = cell.y * CELL_SIZE + 1;
  const size   = CELL_SIZE - 2;
  const radius = 4;

  // Ligeramente más oscuro hacia la cola
  const alpha = 0.6 + 0.4 * (1 - index / total);
  ctx.globalAlpha = alpha;
  ctx.fillStyle   = color;

  roundRect(ctx, px, py, size, size, radius);
  ctx.fill();

  ctx.globalAlpha = 1;
}

/**
 * Dibuja la cabeza con estilo de gato.
 */
function drawHead(ctx, snake) {
  const head = snake.body[0];
  const px   = head.x * CELL_SIZE + 1;
  const py   = head.y * CELL_SIZE + 1;
  const size = CELL_SIZE - 2;

  // Cabeza
  ctx.fillStyle = snake.headColor;
  roundRect(ctx, px, py + 3, size, size - 4, 8);
  ctx.fill();

  // Orejas
  ctx.beginPath();
  ctx.moveTo(px + 4, py + 4);
  ctx.lineTo(px + 10, py + 4);
  ctx.lineTo(px + 6, py + 10);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(px + size - 4, py + 4);
  ctx.lineTo(px + size - 10, py + 4);
  ctx.lineTo(px + size - 6, py + 10);
  ctx.closePath();
  ctx.fill();

  // Nariz y bigotes
  const noseX = px + size / 2;
  const noseY = py + size / 2 + 2;
  ctx.fillStyle = "#ff9da4";
  ctx.beginPath();
  ctx.moveTo(noseX, noseY);
  ctx.lineTo(noseX - 2.5, noseY + 4);
  ctx.lineTo(noseX + 2.5, noseY + 4);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = snake.eyeColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(noseX - 3, noseY + 5);
  ctx.lineTo(noseX - 8, noseY + 3);
  ctx.moveTo(noseX - 3, noseY + 6);
  ctx.lineTo(noseX - 8, noseY + 7);
  ctx.moveTo(noseX + 3, noseY + 5);
  ctx.lineTo(noseX + 8, noseY + 3);
  ctx.moveTo(noseX + 3, noseY + 6);
  ctx.lineTo(noseX + 8, noseY + 7);
  ctx.stroke();
  ctx.lineWidth = 1;

  // Ojos
  drawEyes(ctx, head, snake.direction, snake.eyeColor);
}

/**
 * Dibuja los ojos con un trazo más felino.
 */
function drawEyes(ctx, head, direction, eyeColor) {
  const cx = head.x * CELL_SIZE + CELL_SIZE / 2;
  const cy = head.y * CELL_SIZE + CELL_SIZE / 2;
  const r  = 2.5;
  const offset = 4;

  let eye1, eye2;

  switch (direction) {
    case "RIGHT":
      eye1 = { x: cx + 3, y: cy - offset };
      eye2 = { x: cx + 3, y: cy + offset };
      break;
    case "LEFT":
      eye1 = { x: cx - 3, y: cy - offset };
      eye2 = { x: cx - 3, y: cy + offset };
      break;
    case "UP":
      eye1 = { x: cx - offset, y: cy - 3 };
      eye2 = { x: cx + offset, y: cy - 3 };
      break;
    case "DOWN":
    default:
      eye1 = { x: cx - offset, y: cy + 3 };
      eye2 = { x: cx + offset, y: cy + 3 };
      break;
  }

  ctx.fillStyle = eyeColor;
  [eye1, eye2].forEach(eye => {
    ctx.beginPath();
    ctx.ellipse(eye.x, eye.y, r, r + 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(eye.x + 0.5, eye.y + 0.5, r * 0.4, r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = eyeColor;
  });
}

// ─── Overlay de pausa ──────────────────────────────────────────────────────

/**
 * Dibuja el overlay semitransparente de pausa sobre el canvas.
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawPauseOverlay(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle    = "#ffffff";
  ctx.font         = "bold 20px 'Press Start 2P', monospace";
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⏸ PAUSA", w / 2, h / 2);

  ctx.font      = "12px 'Press Start 2P', monospace";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("Presioná P para continuar", w / 2, h / 2 + 40);

  ctx.textAlign    = "start";
  ctx.textBaseline = "alphabetic";
}

// ─── Helper: rect con bordes redondeados ───────────────────────────────────

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
