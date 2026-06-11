/**
 * DEPENDENCIAS.MD
 * ═════════════════════════════════════════════════════════════════════════
 * Mapa visual de dependencias entre módulos
 * Útil para entender qué archivo necesita qué para funcionar
 */

# 📊 DIAGRAMA DE DEPENDENCIAS

## Orden de Carga Recomendado

```
NIVEL 0 - BASE (sin dependencias)
═════════════════════════════════════
├─ config/constants.js      ← Define ROWS, COLS, MAPS, etc.
└─ config/colors.js         ← Define COLOR.* (paleta)


NIVEL 1 - SISTEMAS MATEMÁTICOS (dependen de constants)
═════════════════════════════════════
├─ systems/movement.js      ← wrap(), isCentered(), snapToGrid()
├─ systems/collision.js     ← getTile(), isWalkable(), canStep()
├─ systems/physics.js       ← playerSpeed(), ghostSpeed()
└─ utils/audio.js           ← beep(), playDot(), etc.


NIVEL 2 - SISTEMAS DE IA (dependen de collision + physics)
═════════════════════════════════════
└─ systems/ai.js            ← chooseGhostTarget(), getBestDir()


NIVEL 3 - ENTIDADES (dependen de systems)
═════════════════════════════════════
├─ entities/player.js       ← movePlayer() 
│                              usa: collision, movement, physics
│
└─ entities/ghost.js        ← moveGhosts()
                               usa: collision, movement, physics, ai


NIVEL 4 - INTERFAZ (dependen de constants + colors)
═════════════════════════════════════
├─ ui/renderer.js           ← draw*() funciones
│                              usa: colors, constants
│
├─ ui/effects.js            ← spawnParticles(), flash
│                              usa: colors
│
├─ ui/hud.js                ← updateHUD(), updateScore()
│                              usa: constants
│
└─ ui/menu.js               ← showMenu(), startGame()
                               usa: input (listeners)


NIVEL 5 - INPUT (depende de ui)
═════════════════════════════════════
└─ input/input.js           ← keyboard, touch, swipe listeners
                               usa: ui functions, pausa


NIVEL 6 - ESTADO GLOBAL (depende de CASI TODO)
═════════════════════════════════════
└─ core.js                  ← Variables globales: map, player, ghosts
                               usa: constants, systems, entities


NIVEL 7 - GAME LOOP (depende de entities + ui)
═════════════════════════════════════
└─ main.js                  ← loop(), requestAnimationFrame
                               usa: entities/player, entities/ghost, ui/renderer


NIVEL 8 - INICIALIZACIÓN (depende de TODO)
═════════════════════════════════════
└─ bootstrap.js             ← resizeCanvas(), showMenu()
                               usa: canvas, constants, funciones


ORDEN FINAL:
constants → colors → systems → utils → entities → ui → input → core → main → bootstrap
```

---

## Árbol de Dependencias Detallado

```
bootstrap.js (INICIA TODO)
  ├─ resizeCanvas()
  │   └─ SCALE, COLS, ROWS (de constants.js)
  │
  ├─ showMenu()
  │   └─ DOM elements
  │
  └─ Llama a startGame()
      └─ core.js: startRound()
          ├─ cloneMap() (de collision.js)
          ├─ countDots() (de collision.js)
          ├─ findSpawnPosition() (de collision.js)
          ├─ getTile() (de collision.js)
          └─ Inicializa player = { x, y, dir, speed }
             └─ movePlayer() necesita:
                 ├─ playerSpeed() (physics.js)
                 ├─ canStep() (collision.js)
                 ├─ isCentered() (movement.js)
                 ├─ getTile() (collision.js)
                 ├─ playDot() (audio.js)
                 ├─ playPowerPellet() (audio.js)
                 └─ spawnParticles() (effects.js)

main.js: loop()
  ├─ movePlayer() (entities/player.js)
  │   └─ [ver arriba]
  │
  ├─ moveGhosts() (entities/ghost.js)
  │   ├─ ghostSpeed() (physics.js)
  │   ├─ chooseGhostTarget() (ai.js)
  │   │   ├─ getPlayerTile()
  │   │   ├─ getAheadTile()
  │   │   └─ getInkyTarget()
  │   ├─ getBestDir() (ai.js)
  │   │   ├─ isWalkable() (collision.js)
  │   │   └─ distSq() (movement.js)
  │   └─ canStep() (collision.js)
  │
  ├─ updateModes()
  │   └─ getScatterChaseTimers() (physics.js)
  │
  ├─ drawMaze() (renderer.js)
  │   ├─ COLOR.* (colors.js)
  │   ├─ buildMazeCache()
  │   └─ getTile() (collision.js)
  │
  ├─ drawPlayer() (renderer.js)
  │   └─ COLOR.PLAYER_* (colors.js)
  │
  ├─ drawGhosts() (renderer.js)
  │   └─ COLOR.GHOST_* (colors.js)
  │
  └─ drawParticles() (effects.js)
      └─ COLOR.* (colors.js)

input.js
  ├─ Listeners de teclado
  │   └─ togglePause()
  │   └─ startGame()
  │
  ├─ D-Pad listeners
  │   └─ startGame()
  │
  └─ Swipe listeners
      └─ startGame()
```

---

## Matriz de Dependencias

| Archivo | Necesita | Usa |
|---------|----------|-----|
| **constants.js** | nada | (base) |
| **colors.js** | constants | (base) |
| **movement.js** | constants | wrap, isCentered, snapToGrid |
| **collision.js** | constants, movement | getTile, isWalkable, canStep |
| **physics.js** | constants | playerSpeed, ghostSpeed, timers |
| **audio.js** | nada | beep, play* |
| **ai.js** | movement, collision, physics | chooseGhostTarget, getBestDir |
| **player.js** | collision, movement, physics, audio | movePlayer |
| **ghost.js** | collision, movement, physics, ai | moveGhosts |
| **renderer.js** | constants, colors, collision | draw*, buildMazeCache |
| **effects.js** | colors | spawnParticles, flash |
| **hud.js** | constants | updateHUD, updateScore |
| **menu.js** | colors, input | showMenu, showGameOver |
| **input.js** | ui, audio | listeners, handlers |
| **core.js** | TODO (movement, collision, physics, entities, ui) | State global |
| **main.js** | entities, ui, core | loop |
| **bootstrap.js** | TODO | Inicialización |

---

## Problemas de Circulación (Evitar)

```
❌ BAD: Dependencia circular
input.js
  ├─ importa core.js
  │   ├─ importa input.js
  │   └─ ¡ERROR!

✅ GOOD: Estructura unidireccional
input.js
  └─ No importa core.js
  └─ Solo define listeners que modifican variables globales

input.js
  └─ input.startGame() 
      └─ core.startGame() (no hay circular, solo llamada)
```

**Estado actual:** El código NO tiene dependencias circulares porque:
- Todos los scripts están en scope global
- El HTML carga en orden correcto
- Las funciones se llaman, no se importan cíclicamente

**Si migras a ES6 modules:** Evita que module A importe module B mientras B intenta importar A.

---

## Performance: Optimizaciones por Dependencia

```
Oportunidades de lazy-loading:

✓ ui/menu.js      ← Podría cargarse solo si user va a menú
✓ audio.js        ← Se crea AudioContext en primer click (no al cargar)
✓ effects.js      ← Podría optimizarse con requestAnimationFrame

Crítica (debe cargar temprano):

✗ systems/*       ← Necesarios en el game loop
✗ entities/*      ← Necesarios en el game loop
✗ renderer.js     ← Necesario en el game loop
```

---

## Diagrama Visual (ASCII)

```
┌──────────────────────────────────────────────────────┐
│               BOOTSTRAP.JS (ENTRADA)                  │
└────────────────────┬─────────────────────────────────┘
                     │
        ┌────────────┴─────────────────┐
        │                              │
        ▼                              ▼
┌──────────────────┐         ┌──────────────────┐
│  CONFIG/         │         │  CORE.JS         │
│  (constants,     │◄────────│  (estado global) │
│   colors)        │         │                  │
└────────┬─────────┘         └────┬─────────────┘
         │                        │
         │    ┌────────────────────┼────────────────────┐
         │    │                    │                    │
         ▼    ▼                    ▼                    ▼
    ┌────────────────┐      ┌────────────────┐   ┌────────────────┐
    │  SYSTEMS/      │      │  ENTITIES/     │   │  UI/           │
    │  (movement,    │      │  (player,      │   │  (renderer,    │
    │   collision,   │◄─────│   ghost)       │   │   effects,     │
    │   physics,     │      │                │   │   hud, menu)   │
    │   ai)          │      │                │   │                │
    └────────┬───────┘      └────┬───────────┘   └────────┬───────┘
             │                    │                      │
             └────────┬───────────┴──────────────────────┘
                      │
                      ▼
            ┌──────────────────────┐
            │  MAIN.JS (GAME LOOP) │
            └──────────────────────┘
                      │
                      ▼
            ┌──────────────────────┐
            │  INPUT.JS (LISTENERS)│
            └──────────────────────┘
```

---

**Última actualización:** Junio 2026  
**Versión:** 2.2 Modularizada  
