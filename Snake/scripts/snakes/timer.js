/**
 * timer.js
 * Módulo de timer del juego Snake.
 * Gestiona el tiempo de partida en modo 2 jugadores (tiempo límite opcional).
 */

/**
 * Clase GameTimer — cronómetro ascendente para el juego.
 */
export class GameTimer {
  /**
   * @param {Function} onTick - Callback cada segundo: (elapsed: number) => void
   */
  constructor(onTick) {
    this.elapsed  = 0;
    this.intervalId = null;
    this.onTick   = onTick;
    this.running  = false;
  }

  /** Inicia el cronómetro */
  start() {
    if (this.running) return;
    this.running    = true;
    this.intervalId = setInterval(() => {
      this.elapsed++;
      this.onTick(this.elapsed);
    }, 1000);
  }

  /** Pausa el cronómetro */
  pause() {
    this.running = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  /** Reanuda el cronómetro */
  resume() {
    if (!this.running) this.start();
  }

  /** Detiene y resetea el cronómetro */
  stop() {
    this.pause();
    this.elapsed = 0;
  }

  /**
   * Formatea los segundos transcurridos en MM:SS.
   * @returns {string}
   */
  getFormatted() {
    const m = Math.floor(this.elapsed / 60).toString().padStart(2, "0");
    const s = (this.elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
}