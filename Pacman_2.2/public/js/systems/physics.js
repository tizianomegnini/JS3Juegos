/**
 * PHYSICS.JS
 * ═════════════════════════════════════════════════════════════════════════
 * Configuración de física del juego: velocidades, timers, modos (scatter/chase/frightened).
 * Valores parametrizados por nivel para dificultad progresiva.
 * 
 * Responsabilidades:
 * - playerSpeed: velocidad según nivel
 * - ghostSpeed: velocidad de fantasmas según nivel y modo
 * - frightTimer: duración de modo asustado
 * - scatterChase: timers para cambio scatter/chase
 */

/**
 * Calcula la velocidad del jugador según el nivel
 * Aumenta progresivamente con cada nivel (máx 5)
 * @returns {number} Velocidad (tiles por frame)
 */
function playerSpeed() {
  return Math.min(0.155, 0.105 + (level - 1) * 0.012);
}

/**
 * Calcula la velocidad de los fantasmas según modo y nivel
 * Los fantasmas son ligeramente más lentos que el jugador en modo normal
 * En modo asustado, son más lentos aún
 * @param {object} ghost - Fantasma (contiene propiedades de estado)
 * @returns {number} Velocidad (tiles por frame)
 */
function ghostSpeed(ghost) {
  const baseSpeed = playerSpeed() * 0.95; // Ligeramente más lento
  
  if (ghost.frightened) {
    return baseSpeed * 0.75; // 75% de velocidad en modo asustado
  }
  
  return baseSpeed;
}

/**
 * Obtiene la duración máxima del modo power-up (asustado)
 * Decrece con el nivel: en nivel 5 dura mucho menos
 * @returns {number} Duración en frames
 */
function getFrightDuration() {
  return Math.max(60, 360 - (level - 1) * 70);
}

/**
 * Configuración de timers scatter/chase por nivel
 * Define cuántos frames se mantiene en scatter/chase
 * Scatter: fantasmas huyen a sus esquinas
 * Chase: fantasmas persiguen al jugador con IA personalizada
 */
const SCATTER_CHASE_TIMERS = {
  1: { scatter: 420, chase: 1200 }, // Nivel 1: mucho tiempo scatter
  2: { scatter: 360, chase: 1080 },
  3: { scatter: 300, chase: 1080 },
  4: { scatter: 240, chase: 900 },
  5: { scatter: 180, chase: 900 }  // Nivel 5: predomina chase
};

/**
 * Obtiene los timers scatter/chase para el nivel actual
 * @returns {object} { scatter, chase } en frames
 */
function getScatterChaseTimers() {
  return SCATTER_CHASE_TIMERS[Math.min(level, 5)];
}

/**
 * Modo actual del juego (determina comportamiento fantasmas)
 * Estados posibles:
 * - 'scatter': fantasmas huyen a sus esquinas
 * - 'chase': fantasmas persiguen al jugador
 * - 'frightened': fantasmas en pánico (jugador comió power-up)
 * - 'eaten': fantasma fue comido, regresa a casa
 */
// Variables globales (se inicializan en core.js):
// let modeIndex = 0;       // Índice en ciclo scatter/chase
// let modeTimer = 0;       // Frames restantes en modo actual
// let currentMode = 'scatter';
