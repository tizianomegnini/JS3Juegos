/**
 * PLAYER.JS
 * ═════════════════════════════════════════════════════════════════════════
 * Lógica del jugador: movimiento, colisión de pellets, power-ups e inmunidad.
 * 
 * Responsabilidades:
 * - movePlayer: actualizar posición, aplicar movimientos pendientes, snap-to-grid
 * - Recolectar dots (2): +10 puntos
 * - Recolectar power-ups (3): +50 puntos, activar modo frightened
 * - Detección de nivel completado (dots === 0)
 */

/**
 * Estructura del jugador (objeto global):
 * {
 *   x, y: posición en tiles (fraccionaria)
 *   dir: { x, y } dirección actual
 *   speed: velocidad calculada por playerSpeed()
 * }
 * Creado en startRound() de core.js
 */

/**
 * Mueve al jugador un frame
 * Orden: velocidad → cambio dirección → movimiento → snap-to-grid → colecciones
 * 
 * Snap-to-grid crítico:
 * - Tolerancia = player.speed * 0.5 (para no negar movimiento)
 * - Si tolerancia >= speed, el snap consume el movimiento
 * - Solución: usar half-speed como tolerancia
 */
function movePlayer() {
  // 1. Actualizar velocidad según nivel
  player.speed = playerSpeed();
  
  // 2. Decrementar timers (invulnerabilidad)
  if (invTimer > 0) invTimer--;
  if (flashTimer > 0) flashTimer--;

  // 3. Si hay dirección pendiente Y jugador está centrado Y puede moverse: aplicar
  if (pendingDir && isCentered(player) && canStep(player, pendingDir)) {
    player.dir = pendingDir;
    pendingDir = null;
  }
  
  // 4. Si está centrado pero NO puede continuar en dirección actual: frenar
  if (isCentered(player) && !canStep(player, player.dir)) {
    player.dir = { x: 0, y: 0 };
  }

  // 5. MOVIMIENTO: actualizar posición
  player.x = wrap(player.x + player.dir.x * player.speed, COLS);
  player.y = wrap(player.y + player.dir.y * player.speed, ROWS);
  
  // 6. SNAP-TO-GRID: alinear cuando está "casi centrado"
  // ⚠️ CRÍTICO: tolerancia = speed * 0.5 evita que snap niegue movimiento
  if (isCentered(player, player.speed * 0.5)) {
    snapToGrid(player);
  }

  // 7. Obtener tile actual
  const { tx, ty, value } = getTile(player.x, player.y);

  // 8. RECOGER PELLET (tipo 2)
  if (value === 2) {
    map[ty][tx] = 0; // Remover del mapa
    score += 10;
    dots--;
    playDot();
    spawnParticles(player.x, player.y, '#00eeff', 3, 0.8);
    updateHUD();
  }

  // 9. RECOGER POWER-UP (tipo 3)
  if (value === 3) {
    map[ty][tx] = 0;
    score += 50;
    dots--;
    playPowerPellet();
    
    // Activar modo frightened
    const dur = getFrightDuration();
    frightTimer = dur;
    frightMax = dur;
    ghostEatCombo = 0;
    flashTimer = 8;
    
    // Invertir dirección de fantasmas
    ghosts.forEach(g => {
      if (!g.inHouse && !g.eaten) {
        g.frightened = true;
        g.dir = { x: -g.dir.x, y: -g.dir.y };
      }
    });
    
    spawnParticles(player.x, player.y, '#4444ff', 16, 2);
    showPowerMode();
    updateHUD();
  }

  // 10. Verificar nivel completado
  if (dots <= 0) nextLevel();
}
