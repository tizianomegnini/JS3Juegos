//  GHOST AI â€” Personalidades tipo Pac-Man
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function getPlayerTile() {
  return { x: Math.round(player.x), y: Math.round(player.y) };
}

// N tiles adelante del jugador en su direcciÃ³n actual
function getAheadTile(steps = 4) {
  return {
    x: wrap(Math.round(player.x + player.dir.x * steps), COLS),
    y: wrap(Math.round(player.y + player.dir.y * steps), ROWS)
  };
}

// Target de Inky: vector desde Blinky hasta 2 tiles adelante del jugador, doblado
function getInkyTarget() {
  const blinky = ghosts[0];
  const pivot  = getAheadTile(2);
  return {
    x: wrap(Math.round(pivot.x * 2 - blinky.x), COLS),
    y: wrap(Math.round(pivot.y * 2 - blinky.y), ROWS)
  };
}

// Ratio de dots restantes sobre el total inicial del nivel
function dotsLeftRatio() {
  const total = ghosts[0]._totalDots || 1;
  return dots / total;
}

// Calcula el target de chase para cada fantasma
function chooseGhostTarget(g) {
  const pt = getPlayerTile();

  if (g.id === 0) {
    // â”€â”€ BLINKY â€” perseguidor directo â”€â”€
    // Modo Elroy: cuando quedan pocos dots ignora scatter y va directo al jugador
    // aunque estÃ© en fase scatter. El umbral baja con el nivel (mÃ¡s agresivo).
    return pt;
  }

  if (g.id === 1) {
    // â”€â”€ PINKY â€” emboscadora â”€â”€
    // Apunta 4 tiles adelante del jugador para cortarle el paso.
    // Si el jugador estÃ¡ quieto, apunta a su tile exacto.
    const hasDir = player.dir.x !== 0 || player.dir.y !== 0;
    return hasDir ? getAheadTile(4) : pt;
  }

  if (g.id === 2) {
    // â”€â”€ INKY â€” flanqueadora caÃ³tica â”€â”€
    // Toma el punto 2 tiles adelante del jugador y lo refleja
    // respecto a la posiciÃ³n de Blinky, doblando el vector.
    // Cuando Blinky estÃ¡ lejos, Inky aparece por el lado opuesto.
    return getInkyTarget();
  }

  // â”€â”€ CLYDE (id=3) â€” el errÃ¡tico â”€â”€
  // Chase si estÃ¡ lejos del jugador (mÃ¡s de `threshold` tiles).
  // Huye a su esquina si se acerca demasiado.
  // El umbral decrece con el nivel: se vuelve mÃ¡s agresivo a medida que avanzÃ¡s.
  const threshold = Math.max(4, 8 - (level - 1));
  const dist = Math.hypot(g.x - player.x, g.y - player.y);
  return dist > threshold ? pt : g.scatter;
}

// Elige la mejor direcciÃ³n para alcanzar `target` sin dar media vuelta
function getBestDir(g, target) {
  const valid = DIRS.filter(d => {
    if (d.x === -g.dir.x && d.y === -g.dir.y) return false; // prohibir U-turn
    return isWalkable(g.x + d.x, g.y + d.y, true);
  });
  if (!valid.length) return { x: -g.dir.x, y: -g.dir.y }; // forzar U-turn si no hay salida

  let best = valid[0], bestScore = Infinity;
  for (const d of valid) {
    const nx = wrap(Math.round(g.x + d.x), COLS);
    const ny = wrap(Math.round(g.y + d.y), ROWS);
    const sc = distSq(nx, ny, target.x, target.y);
    if (sc < bestScore) { bestScore = sc; best = d; }
  }
  return best;
}

// DirecciÃ³n de huida: maximiza distancia al jugador en lugar de minimizarla
function getFleeDirAway(g) {
  const valid = DIRS.filter(d => {
    if (d.x === -g.dir.x && d.y === -g.dir.y) return false;
    return isWalkable(g.x + d.x, g.y + d.y, true);
  });
  if (!valid.length) return { x: -g.dir.x, y: -g.dir.y };

  let best = valid[0], bestScore = -Infinity;
  for (const d of valid) {
    const nx = wrap(Math.round(g.x + d.x), COLS);
    const ny = wrap(Math.round(g.y + d.y), ROWS);
    const sc = distSq(nx, ny, player.x, player.y); // maximizar
    if (sc > bestScore) { bestScore = sc; best = d; }
  }
  return best;
}

// DirecciÃ³n aleatoria vÃ¡lida sin U-turn
function getRandomDir(g) {
  const valid = DIRS.filter(d => {
    if (d.x === -g.dir.x && d.y === -g.dir.y) return false;
    return isWalkable(g.x + d.x, g.y + d.y, true);
  });
  if (!valid.length) return { x: -g.dir.x, y: -g.dir.y };
  return valid[Math.floor(Math.random() * valid.length)];
}

// Comportamiento frightened diferente para cada bicho
function getFrightenedDir(g) {
  // return getRandomDir(g);
  switch (g.id) {
    case 0:
      // Blinky: huye activamente maximizando distancia al jugador.
      // El mÃ¡s peligroso incluso asustado â€” recuerda el layout.
      return getFleeDirAway(g);

    case 1:
      // Pinky: corre a su esquina de scatter (predecible pero veloz).
      // Sabiendo dÃ³nde estÃ¡ su esquina podÃ©s anticiparlo.
      return getBestDir(g, g.scatter);

    case 2:
      // Inky: totalmente aleatorio. Es el mÃ¡s errÃ¡tico y puede
      // meterse solo en tu camino sin querer.
      return getRandomDir(g);

    case 3:
      // Clyde: tambiÃ©n corre a su esquina, igual que Pinky,
      // pero su umbral hace que ya estÃ© lejos cuando comÃ©s la nova.
      return getBestDir(g, g.scatter);

    default:
      return getRandomDir(g);
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

//  MOVE GHOSTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function moveGhosts() {
  if (frightTimer <= 0) switchModeIfNeeded();

  if (frightTimer > 0) {
    frightTimer--;
    if (frightTimer === 0) {
      ghosts.forEach(g => { g.frightened = false; });
      ghostEatCombo = 0;
    }
  }
  updateFrightBar();

  ghosts.forEach(g => {
    // â”€â”€ Dentro de la casa: contar timer y salir â”€â”€
    if (g.inHouse) {
      g.houseTimer--;
      if (g.houseTimer <= 0) {
        g.inHouse    = false;
        g.eaten      = false;
        g.frightened = false;
        g.x   = g.home.x;
        g.y   = g.home.y;
        g.dir = { x: 0, y: -1 };
      }
      return;
    }

    // â”€â”€ Velocidad segÃºn estado â”€â”€
    // Blinky Elroy activo: pequeÃ±o bonus de velocidad
    const sp = ghostSpeed(g.baseSpeed, g.frightened, g.eaten);

    // â”€â”€ Elegir direcciÃ³n solo en intersecciones â”€â”€
    if (isCentered(g)) {

      if (g.eaten) {
        // Vuelve a casa lo mÃ¡s rÃ¡pido posible
        g.dir = getBestDir(g, g.home);

      } else if (g.frightened) {
        // Cada bicho tiene su propio comportamiento de huida
        g.dir = getFrightenedDir(g);

      } else {
        // Modo normal: scatter o chase segÃºn el ciclo
        // Blinky Elroy ignora scatter cuando estÃ¡ activado
        const target = currentMode === 'chase' ? chooseGhostTarget(g) : g.scatter;
        g.dir = getBestDir(g, target);
      }
    }

    // â”€â”€ Aplicar movimiento â”€â”€
    g.x = wrap(g.x + g.dir.x * sp, COLS);
    g.y = wrap(g.y + g.dir.y * sp, ROWS);
    // Snap-to-grid SOLO si estamos dentro de 10% de la velocidad del grid
    const snapThreshold = sp * 0.1;
    if (Math.abs(g.x - Math.round(g.x)) < snapThreshold) g.x = Math.round(g.x);
    if (Math.abs(g.y - Math.round(g.y)) < snapThreshold) g.y = Math.round(g.y);

    // â”€â”€ LlegÃ³ a casa tras ser comido â”€â”€
    if (g.eaten && Math.round(g.x) === g.home.x && Math.round(g.y) === g.home.y) {
      g.eaten      = false;
      g.inHouse    = true;
      g.houseTimer = 80;
      g.dir        = { x: 0, y: -1 };
      return;
    }

    // â”€â”€ ColisiÃ³n con el jugador â”€â”€
    // Colision P1
    if (invTimer <= 0) {
      const hit1 = Math.hypot(g.x - player.x, g.y - player.y) < 0.72;
      if (hit1) {
        if (g.frightened) {
          ghostEatCombo++;
          const pts = 200 * Math.pow(2, ghostEatCombo - 1);
          score += pts;
          playEatGhost(); showCombo(ghostEatCombo);
          spawnParticles(g.x, g.y, g.color, 15, 2.5);
          spawnFloatScore(pts, g.x, g.y); updateHUD();
          g.frightened = false; g.eaten = true;
          g.dir = {x:0,y:0}; g.x = Math.round(g.x); g.y = Math.round(g.y);
        } else if (!g.eaten) { loseLife('p1'); }
        return;
      }
    }
    // Colision P2
    if (gameMode === 2 && player2 && p2alive && invTimer2 <= 0) {
      const hit2 = Math.hypot(g.x - player2.x, g.y - player2.y) < 0.72;
      if (hit2) {
        if (g.frightened) {
          ghostEatCombo++;
          const pts = 200 * Math.pow(2, ghostEatCombo - 1);
          score2 += pts;
          playEatGhost(); showCombo(ghostEatCombo);
          spawnParticles(g.x, g.y, g.color, 15, 2.5);
          spawnFloatScore(pts, g.x, g.y); updateHUD();
          g.frightened = false; g.eaten = true;
          g.dir = {x:0,y:0}; g.x = Math.round(g.x); g.y = Math.round(g.y);
        } else if (!g.eaten) { loseLife('p2'); }
      }
    }
  });
}

// LOSE LIFE
function loseLife(who) {
  who = who || 'p1';
  // Guard: evitar múltiples muertes en el mismo frame
  if (!gameRunning) return;

  playDeath();
  if (who === 'p2' && gameMode === 2) {
    spawnParticles(player2.x, player2.y, '#FF69B4', 20, 3);
    lives2--; updateHUD();
    if (lives2 <= 0) {
      player2 = null; p2alive = false; updateHUD();
      if (lives <= 0) { gameRunning = false; setTimeout(showGameOver, 700); }
    } else {
      gameRunning = false;
      setTimeout(() => {
        spawnPlayer2(); spawnGhosts(); ghosts[0]._totalDots = dots;
        frightTimer = 0; frightMax = 0; ghostEatCombo = 0; pendingDir2 = null;
        gameRunning = true;
      }, 700);
    }
  } else {
    spawnParticles(player.x, player.y, '#00eeff', 20, 3);
    lives--; updateHUD();
    gameRunning = false;
    setTimeout(() => {
      if (lives <= 0 && (gameMode === 1 || !p2alive)) {
        showGameOver();
      } else if (lives <= 0 && gameMode === 2 && p2alive) {
        player = null;
        spawnGhosts(); ghosts[0]._totalDots = dots;
        frightTimer = 0; frightMax = 0; ghostEatCombo = 0; pendingDir = null;
        gameRunning = true;
      } else {
        resetAfterDeath(); gameRunning = true;
      }
    }, 700);
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  LOSE LIFE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// loseLife moved above (2P version)

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  DRAW MAZE