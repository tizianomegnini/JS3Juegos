/**
 * score.js
 * Módulo de gestión de puntajes en tiempo de juego.
 * Controla el puntaje, el nivel y la velocidad.
 */

/** Puntos necesarios para subir de nivel */
const POINTS_PER_LEVEL = 10;

/** Velocidad base en ms por tick (menor = más rápido) */
const BASE_SPEED = 150;

/** Reducción de velocidad por nivel (ms) */
const SPEED_REDUCTION = 10;

/** Velocidad mínima */
const MIN_SPEED = 60;

/**
 * Clase ScoreManager — gestiona puntos, nivel y velocidad de un jugador.
 */
export class ScoreManager {
  constructor() {
    this.reset();
  }

  /** Reinicia todos los valores */
  reset() {
    this.score = 0;
    this.level = 1;
  }

  /**
   * Agrega puntos al puntaje y calcula si subió de nivel.
   * @param {number} points - Puntos a agregar
   * @returns {boolean} true si subió de nivel
   */
  addPoints(points) {
    this.score   += points;
    const newLevel = Math.floor(this.score / POINTS_PER_LEVEL) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      return true; // Subió de nivel
    }
    return false;
  }

  /**
   * Calcula la velocidad actual en base al nivel.
   * @returns {number} Intervalo en ms
   */
  getSpeed() {
    return Math.max(MIN_SPEED, BASE_SPEED - (this.level - 1) * SPEED_REDUCTION);
  }
}