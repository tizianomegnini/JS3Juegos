/**
 * board.js
 * Configuración del tablero. Soporta 3 tamaños: small, medium, large.
 * El canvas siempre es más ancho que alto (ratio ~5:3). Celdas 1:1.
 */

export const CELL_SIZE = 30;

/** Definición de tamaños disponibles */
export const MAP_SIZES = {
  small:  { cols: 24, rows: 14 },   // 720×420
  medium: { cols: 32, rows: 19 },   // 960×570
  large:  { cols: 42, rows: 25 }    // 1260×750
};

// Tamaño activo — se puede cambiar antes de initBoard()
let _size = MAP_SIZES.large;

export let COLS          = _size.cols;
export let ROWS          = _size.rows;
export let CANVAS_WIDTH  = COLS * CELL_SIZE;
export let CANVAS_HEIGHT = ROWS * CELL_SIZE;

/**
 * Establece el tamaño del mapa.
 * @param {"small"|"medium"|"large"} name
 */
export function setMapSize(name) {
  _size        = MAP_SIZES[name] || MAP_SIZES.large;
  COLS         = _size.cols;
  ROWS         = _size.rows;
  CANVAS_WIDTH  = COLS * CELL_SIZE;
  CANVAS_HEIGHT = ROWS * CELL_SIZE;
}

export function initBoard(canvas) {
  canvas.width  = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
}

export function clearBoard(ctx, bgColor) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function drawGrid(ctx, gridColor) {
  ctx.strokeStyle = gridColor;
  ctx.lineWidth   = 1.5;
  for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke();
  }
  for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke();
  }
}

export function drawBorder(ctx, borderColor) {
  ctx.strokeStyle = borderColor;
  ctx.lineWidth   = 3;
  ctx.strokeRect(0.5, 0.5, CANVAS_WIDTH - 1, CANVAS_HEIGHT - 1);
}
