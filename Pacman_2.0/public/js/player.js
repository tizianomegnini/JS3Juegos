//  MOVE PLAYER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function movePlayer() {
  player.speed = playerSpeed();
  if (invTimer > 0) invTimer--;
  if (flashTimer > 0) flashTimer--;

  if (pendingDir && isCentered(player) && canStep(player, pendingDir, false)) {
    player.dir = pendingDir; pendingDir = null;
  }
  if (isCentered(player) && !canStep(player, player.dir, false)) {
    player.dir = {x:0, y:0};
  }

  player.x = wrap(player.x + player.dir.x * player.speed, COLS);
  player.y = wrap(player.y + player.dir.y * player.speed, ROWS);
  if (Math.abs(player.x - Math.round(player.x)) < player.speed) player.x = Math.round(player.x);
  if (Math.abs(player.y - Math.round(player.y)) < player.speed) player.y = Math.round(player.y);

  const { tx, ty, value } = getTile(player.x, player.y);

  if (value === 2) {
    map[ty][tx] = 0; score += 10; dots--;
    dotSound = !dotSound;
    beep(dotSound ? 440 : 480, 0.04, 'square', 0.06);
    spawnParticles(player.x, player.y, '#00eeff', 3, 0.8);
    updateHUD();
  }

  if (value === 3) {
    map[ty][tx] = 0; score += 50; dots--;
    playPowerPellet();
    const dur = Math.max(60, 360 - (level-1)*70);
    frightTimer = dur; frightMax = dur;
    ghostEatCombo = 0;
    flashTimer = 8;
    ghosts.forEach(g => {
      if (!g.inHouse && !g.eaten) {
        g.frightened = true;
        g.dir = {x: -g.dir.x, y: -g.dir.y};
      }
    });
    spawnParticles(player.x, player.y, '#4444ff', 16, 2);
    updateHUD();
  }

  if (dots <= 0) nextLevel();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
