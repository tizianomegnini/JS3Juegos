/**
 * INDEX_SCRIPTS.HTML (REFERENCIA)
 * ═════════════════════════════════════════════════════════════════════════
 * Orden correcto de carga de scripts en index.html
 * 
 * IMPORTANTE: Los scripts deben cargarse en este orden porque hay
 * dependencias entre módulos. Por ejemplo, player.js necesita que
 * movement.js, collision.js y physics.js estén cargados primero.
 */

<!-- 
ORDEN CORRECTO DE CARGA:
========================

1. CONFIG (debe ir primero - define constantes que otros módulos usan)
   ├─ config/constants.js    - ROWS, COLS, MAPS, GHOST_COLORS, etc.
   └─ config/colors.js       - COLOR.* objeto con todos los colores

2. SYSTEMS (funciones de lógica de juego)
   ├─ systems/movement.js    - wrap(), isCentered(), snapToGrid()
   ├─ systems/collision.js   - getTile(), isWalkable(), canStep()
   ├─ systems/physics.js     - playerSpeed(), ghostSpeed()
   └─ systems/ai.js          - chooseGhostTarget(), getBestDir()

3. UTILS (funciones auxiliares reutilizables)
   ├─ utils/audio.js         - beep(), playDot(), playDeath(), etc.
   └─ utils/helpers.js       - funciones de apoyo generales

4. ENTITIES (lógica de objetos jugables)
   ├─ entities/player.js     - movePlayer()
   └─ entities/ghost.js      - moveGhosts()

5. UI (Renderizado y interfaz)
   ├─ ui/renderer.js         - drawMaze(), drawPlayer(), drawGhosts()
   ├─ ui/effects.js          - spawnParticles(), flash
   ├─ ui/hud.js              - updateHUD(), updateScore()
   └─ ui/menu.js             - showMenu(), showGameOver()

6. INPUT (manejo de entrada)
   └─ input/input.js         - keyboard, touch, swipe listeners

7. CORE (Estado global - depende de casi todo)
   └─ core.js                - variables globales, inicialización

8. MAIN (Game loop - depende de movimiento y renderizado)
   └─ main.js                - loop(), requestAnimationFrame

9. BOOTSTRAP (Inicialización - último, ejecuta cuando todo está listo)
   └─ bootstrap.js           - resizeCanvas(), showMenu()
-->

<!-- EJEMPLO DE CÓMO DEBERÍA VERSE EL HTML -->

<head>
  <!-- ... otros meta tags ... -->
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- ... elementos HTML ... -->
  <canvas id="game"></canvas>
  <div id="hud"><!-- score, lives, level --></div>
  <div id="menuScreen"><!-- menú inicial --></div>
  <!-- ... más elementos ... -->

  <!-- SCRIPTS EN ORDEN CORRECTO -->
  
  <!-- 1. CONFIG -->
  <script src="js/config/constants.js"></script>
  <script src="js/config/colors.js"></script>
  
  <!-- 2. SYSTEMS -->
  <script src="js/systems/movement.js"></script>
  <script src="js/systems/collision.js"></script>
  <script src="js/systems/physics.js"></script>
  <script src="js/systems/ai.js"></script>
  
  <!-- 3. UTILS -->
  <script src="js/utils/audio.js"></script>
  <script src="js/utils/helpers.js"></script>
  
  <!-- 4. ENTITIES -->
  <script src="js/entities/player.js"></script>
  <script src="js/entities/ghost.js"></script>
  
  <!-- 5. UI -->
  <script src="js/ui/renderer.js"></script>
  <script src="js/ui/effects.js"></script>
  <script src="js/ui/hud.js"></script>
  <script src="js/ui/menu.js"></script>
  
  <!-- 6. INPUT -->
  <script src="js/input/input.js"></script>
  
  <!-- 7. CORE -->
  <script src="js/core.js"></script>
  
  <!-- 8. MAIN -->
  <script src="js/main.js"></script>
  
  <!-- 9. BOOTSTRAP (ÚLTIMO) -->
  <script src="js/bootstrap.js"></script>
</body>

/**
 * WHY THIS ORDER?
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONFIG FIRST
 *   └─ constants.js define ROWS, COLS, MAPS, DIRS
 *      Todo lo demás necesita estos valores
 * 
 * SYSTEMS SECOND
 *   ├─ movement.js define wrap(), isCentered(), snapToGrid()
 *   ├─ collision.js necesita wrap(), getTile()
 *   ├─ physics.js define playerSpeed(), ghostSpeed()
 *   └─ ai.js necesita physics.js para cálculos
 * 
 * UTILS THIRD
 *   ├─ audio.js es independiente
 *   └─ helpers.js es independiente
 * 
 * ENTITIES FOURTH
 *   ├─ player.js necesita movement, collision, physics
 *   └─ ghost.js necesita movement, collision, physics, ai
 * 
 * UI FIFTH
 *   ├─ renderer.js dibuja basado en estado
 *   ├─ effects.js crea partículas visuales
 *   ├─ hud.js actualiza UI
 *   └─ menu.js maneja menús
 * 
 * INPUT SIXTH
 *   └─ input.js añade listeners de eventos
 * 
 * CORE SEVENTH
 *   └─ core.js inicializa variables globales
 *      Necesita que TODO lo anterior esté cargado
 * 
 * MAIN EIGHTH
 *   └─ main.js define loop()
 *      Necesita entities y renderer
 * 
 * BOOTSTRAP LAST
 *   └─ bootstrap.js ejecuta código de inicialización
 *      Espera que DOM, canvas, y funciones estén listos
 */

/**
 * ALTERNATIVA: USAR ES6 MODULES (RECOMENDADO)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * <script type="module" src="js/bootstrap.js"></script>
 * 
 * Luego en bootstrap.js:
 * 
 * import { ROWS, COLS, MAPS } from './config/constants.js';
 * import { COLOR } from './config/colors.js';
 * import { wrap, isCentered } from './systems/movement.js';
 * import { movePlayer } from './entities/player.js';
 * import { loop } from './main.js';
 * 
 * // Código de inicialización...
 * 
 * VENTAJAS:
 * - Evita contaminar scope global
 * - Dependencies explícitas
 * - Tree-shaking de código no usado
 * - Mejor performance en navegadores modernos
 * 
 * Actualmente en Pacman_2.2 server.js ya usa ES6 modules:
 *   import http from 'http';
 *   import fs from 'fs';
 *   etc.
 * 
 * El frontend podría migrar también (recomendado como mejora futura)
 */
