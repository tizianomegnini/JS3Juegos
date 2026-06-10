/**
 * AUDIO.JS
 * ═════════════════════════════════════════════════════════════════════════
 * Motor de audio: sintetización de sonidos usando Web Audio API.
 * Genera beeps, melodías y efectos sin archivos externos.
 * 
 * Responsabilidades:
 * - beep: genera un tone simple (base de todos los efectos)
 * - Sonidos específicos: dot, power-pellet, eat ghost, death, level up, etc.
 */

let audioCtx = null;

/**
 * Obtiene o crea el contexto de audio
 * Se lazy-loads en el primer uso (requiere interacción del usuario)
 * @returns {AudioContext} Contexto de audio del navegador
 */
function getAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Genera un tono simple usando oscilador
 * @param {number} freq - Frecuencia en Hz (ej: 440 = La4)
 * @param {number} dur - Duración en segundos
 * @param {string} type - Tipo onda: 'sine', 'square', 'sawtooth', 'triangle'
 * @param {number} vol - Volumen 0-1 (default 0.12)
 * @param {number} delay - Retraso en segundos antes de sonar (default 0)
 */
function beep(freq, dur, type = 'square', vol = 0.12, delay = 0) {
  try {
    const ac = getAudio();
    const o = ac.createOscillator();
    const g = ac.createGain();
    
    o.connect(g);
    g.connect(ac.destination);
    
    o.type = type;
    o.frequency.value = freq;
    
    const t = ac.currentTime + delay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    
    o.start(t);
    o.stop(t + dur + 0.01);
  } catch (e) {
    // Silenciosamente falla si audio no disponible
  }
}

/**
 * Sonido: comer dot (pellet normal)
 * Beep corto y agudo alternando entre dos frecuencias
 */
function playDot() {
  beep(440, 0.04, 'square', 0.06);
}

/**
 * Sonido: comer power-pellet (pelota potenciadora)
 * Secuencia ascendente de 4 notas (melodía)
 */
function playPowerPellet() {
  [200, 280, 360, 440].forEach((freq, i) => {
    beep(freq, 0.1, 'sawtooth', 0.15, i * 0.08);
  });
}

/**
 * Sonido: comerse un fantasma
 * 3 beeps descendentes en modo perplejo
 */
function playEatGhost() {
  beep(800, 0.07, 'square', 0.2);
  beep(600, 0.07, 'square', 0.2, 0.07);
  beep(1000, 0.07, 'square', 0.2, 0.14);
}

/**
 * Sonido: perder una vida (death)
 * Escala descendente rápida, efecto de "caída"
 */
function playDeath() {
  [500, 440, 380, 320, 260, 200, 150, 100].forEach((freq, i) => {
    beep(freq, 0.1, 'sawtooth', 0.2, i * 0.08);
  });
}

/**
 * Sonido: pasar nivel (level up)
 * Escala ascendente victoriosa
 */
function playLevelUp() {
  [523, 659, 784, 1047].forEach((freq, i) => {
    beep(freq, 0.15, 'square', 0.15, i * 0.1);
  });
}

/**
 * Sonido: click de menú
 * Beep corto y clara
 */
function playMenuClick() {
  beep(660, 0.08, 'square', 0.1);
}
