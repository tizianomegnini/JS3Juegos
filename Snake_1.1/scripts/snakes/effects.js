/**
 * effects.js
 * Módulo de efectos visuales para el juego Snake.
 * Maneja partículas y animaciones sobre el canvas.
 */

/** Lista de partículas activas */
let particles = [];

/**
 * Crea partículas de celebración al comer comida.
 * @param {number} x - Coordenada X en píxeles
 * @param {number} y - Coordenada Y en píxeles
 * @param {string} color - Color de las partículas
 */
export function spawnEatParticles(x, y, color = "#7dc93c") {
  for (let i = 0; i < 6; i++) {
    particles.push({
      x,
      y,
      vx:      (Math.random() - 0.5) * 4,
      vy:      (Math.random() - 0.5) * 4,
      life:    1,
      decay:   0.05 + Math.random() * 0.05,
      radius:  2 + Math.random() * 3,
      color
    });
  }
}

/**
 * Actualiza y dibuja todas las partículas activas.
 * Debe llamarse en cada frame del bucle de juego.
 * @param {CanvasRenderingContext2D} ctx
 */
export function updateParticles(ctx) {
  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.x    += p.vx;
    p.y    += p.vy;
    p.life -= p.decay;
    p.vy   += 0.15; // gravedad

    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle   = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

/** Limpia todas las partículas (al resetear el juego) */
export function clearParticles() {
  particles = [];
}