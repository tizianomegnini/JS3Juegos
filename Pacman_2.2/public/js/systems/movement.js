/**
 * MOVEMENT.JS
 * ═════════════════════════════════════════════════════════════════════════
 * Funciones de movimiento: wrapping (reciclaje en bordes), detección de
 * centrado y snap-to-grid (alineación a tiles).
 * 
 * Responsabilidades:
 * - Wraparound: mantener entidades dentro del mapa
 * - Detección de centrado: confirmar que están en centro de tile
 * - Snap-to-grid: alinear posición exactamente al tile
 */

/**
 * Envuelve una coordenada alrededor del borde del mapa
 * @param {number} value - Valor a envolver
 * @param {number} max - Dimensión máxima
 * @returns {number} Valor envuelto [0, max)
 */
function wrap(value, max) {
  return ((value % max) + max) % max;
}

/**
 * Verifica si una entidad está centrada en su tile (dentro de tolerancia)
 * Importante: usar tolerancia menor a la velocidad para evitar negar movimiento
 * @param {object} entity - Entidad con propiedades x, y
 * @param {number} tolerance - Distancia máxima del centro (default 0.13)
 * @returns {boolean} true si está centrada
 */
function isCentered(entity, tolerance = 0.13) {
  const distX = Math.abs(entity.x - Math.round(entity.x));
  const distY = Math.abs(entity.y - Math.round(entity.y));
  return distX < tolerance && distY < tolerance;
}

/**
 * Alinea una entidad exactamente al centro del tile más cercano
 * @param {object} entity - Entidad con x, y (será modificada)
 */
function snapToGrid(entity) {
  entity.x = Math.round(entity.x);
  entity.y = Math.round(entity.y);
}

/**
 * Calcula distancia cuadrada entre dos puntos (evita Math.sqrt)
 * Útil para comparaciones de IA sin cálculo costoso
 * @param {number} x1, y1, x2, y2 - Coordenadas
 * @returns {number} Distancia cuadrada
 */
function distSq(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

/**
 * Calcula distancia real entre dos puntos
 * @param {number} x1, y1, x2, y2 - Coordenadas
 * @returns {number} Distancia euclidiana
 */
function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}
