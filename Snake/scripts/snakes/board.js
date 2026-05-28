/**
 * board.js
 * Módulo de configuración del tablero de juego.
 * Define el tamaño de la cuadrícula y el canvas.
 */

/** Tamaño de cada celda en píxeles */
export const CELL_SIZE = 30;

/** Número de celdas en cada dimensión */
export const COLS = 35;  // Más ancho
export const ROWS = 21;  // Más corto

/** Dimensiones totales del canvas en píxeles */
export const CANVAS_WIDTH  = COLS * CELL_SIZE; // 1050px
export const CANVAS_HEIGHT = ROWS * CELL_SIZE; // 630px

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
  ctx.lineWidth   = 1.5;

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

/**
 * Dibuja el borde exterior del tablero.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} borderColor - Color del borde
 */
export function drawBorder(ctx, borderColor) {
  ctx.strokeStyle = borderColor;
  ctx.lineWidth   = 3;
  ctx.strokeRect(0.5, 0.5, CANVAS_WIDTH - 1, CANVAS_HEIGHT - 1);
}