// ═══════════════════════════════════════════════════════════════════════════
// PLAYER.JS – Movimiento de P1 y P2
// ═══════════════════════════════════════════════════════════════════════════

// ─── MOVER JUGADOR GENÉRICO ───────────────────────────────────────────────
/**
 * Mueve un jugador (P1 o P2) un frame.
 * @param {object} p       - Objeto jugador con x, y, dir, speed
 * @param {object} pending - Dirección pendiente del input
 * @param {string} which   - 'p1' o 'p2' para saber qué timers usar
 * @returns {object|null}  - Nueva dirección pendiente (null si se consumió)
 */
function movePlayerGeneric(p, pending, which) {
  p.speed = playerSpeed();

  // Timers de invulnerabilidad
  if (which === 'p1') {
    if (invTimer  > 0) invTimer--;
    if (flashTimer > 0) flashTimer--;
  } else {
    if (invTimer2 > 0) invTimer2--;
  }

  // Aplicar dirección pendiente si está centrado y puede moverse
  if (pending && isCentered(p) && canStep(p, pending)) {
    p.dir = pending;
    pending = null;
  }

  // Si está centrado pero no puede continuar: frenar
  if (isCentered(p) && !canStep(p, p.dir)) {
    p.dir = { x: 0, y: 0 };
  }

  // Mover
  p.x = wrap(p.x + p.dir.x * p.speed, COLS);
  p.y = wrap(p.y + p.dir.y * p.speed, ROWS);

  // Snap-to-grid (inline, equivalente a snapToGrid)
  if (isCentered(p, p.speed * 0.5)) {
    p.x = Math.round(p.x);
    p.y = Math.round(p.y);
  }

  // Obtener tile actual
  const { tx, ty, value } = getTile(p.x, p.y);

  // Recoger pellet (tile 2)
  if (value === 2) {
    map[ty][tx] = 0;
    if (which === 'p1') { score += 10; }
    else                { score2 += 10; }
    dots--;
    playDot();
    spawnParticles(p.x, p.y, which === 'p1' ? '#00eeff' : '#FF69B4', 3, 0.8);
    updateHUD();
  }

  // Recoger power-up (tile 3)
  if (value === 3) {
    map[ty][tx] = 0;
    if (which === 'p1') { score += 50; }
    else                { score2 += 50; }
    dots--;
    playPowerPellet();
    const dur = Math.max(60, 360 - (level - 1) * 70);
    frightTimer = dur;
    frightMax   = dur;
    ghostEatCombo = 0;
    flashTimer = 8;
    ghosts.forEach(g => {
      if (!g.inHouse && !g.eaten) {
        g.frightened = true;
        g.dir = { x: -g.dir.x, y: -g.dir.y };
      }
    });
    spawnParticles(p.x, p.y, '#4444ff', 16, 2);
    showPowerMode();
    updateHUD();
  }

  // Verificar nivel completado (ambos jugadores comparten el mapa)
  if (dots <= 0) nextLevel();

  return pending;
}

// ─── WRAPPER P1 ───────────────────────────────────────────────────────────
function movePlayer() {
  pendingDir = movePlayerGeneric(player, pendingDir, 'p1');
}

// ─── WRAPPER P2 ───────────────────────────────────────────────────────────
function movePlayer2() {
  if (!player2) return;
  pendingDir2 = movePlayerGeneric(player2, pendingDir2, 'p2');
}