/**
 * sounds.js
 * Módulo de efectos de sonido para el juego Snake.
 * Usa la Web Audio API para generar sonidos sintéticos
 * (no requiere archivos de audio externos).
 */

/** Contexto de audio compartido */
let audioCtx = null;

/** Estado de silencio */
let muted = false;

/**
 * Inicializa el contexto de audio.
 * Debe llamarse en respuesta a un gesto del usuario (click, etc.).
 */
export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

/**
 * Activa o desactiva el sonido.
 * @param {boolean} value
 */
export function setMuted(value) {
  muted = value;
}

/** @returns {boolean} Estado de silencio */
export function isMuted() {
  return muted;
}

/**
 * Reproduce un beep sintético.
 * @param {number} frequency - Hz
 * @param {number} duration  - Segundos
 * @param {number} volume    - 0 a 1
 * @param {"sine"|"square"|"sawtooth"} type
 * @private
 */
function playBeep(frequency, duration, volume = 0.3, type = "square") {
  if (muted || !audioCtx) return;

  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type            = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

/** Sonido al comer comida */
export function playEat() {
  playBeep(880, 0.08, 0.3, "square");
}

/** Sonido al subir de nivel */
export function playLevelUp() {
  playBeep(523, 0.1, 0.3, "sine");
  setTimeout(() => playBeep(659, 0.1, 0.3, "sine"), 100);
  setTimeout(() => playBeep(784, 0.2, 0.3, "sine"), 200);
}

/** Sonido de game over */
export function playGameOver() {
  playBeep(300, 0.15, 0.4, "sawtooth");
  setTimeout(() => playBeep(200, 0.3, 0.4, "sawtooth"), 150);
}

/** Sonido de movimiento (sutil) */
export function playMove() {
  playBeep(220, 0.03, 0.05, "square");
}   