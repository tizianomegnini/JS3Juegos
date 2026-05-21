/**
 * board.js
 * Módulo de configuración del tablero de juego.
 * Define el tamaño de la cuadrícula y el canvas.
 */

/** Tamaño de cada celda en píxeles */
export const CELL_SIZE = 20;

/** Número de celdas en cada dimensión */
export const COLS = 30;
export const ROWS = 30;

/** Dimensiones totales del canvas en píxeles */
export const CANVAS_WIDTH  = COLS * CELL_SIZE; // 600px
export const CANVAS_HEIGHT = ROWS * CELL_SIZE; // 600px

/**
 * Inicializa el canvas con las dimensiones correctas.
 * @param {HTMLCanvasElement} canvas
 */
export function initBoard(canvas) {
  canvas.width  = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
}

/**
 * Limpia el canvas completamente.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} bgColor - Color de fondo del tablero
 */
export function clearBoard(ctx, bgColor) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * Dibuja la cuadrícula del tablero.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} gridColor - Color de las líneas de la cuadrícula
 */
export function drawGrid(ctx, gridColor) {
  ctx.strokeStyle = gridColor;
  ctx.lineWidth   = 0.3;

  for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }

  for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
}