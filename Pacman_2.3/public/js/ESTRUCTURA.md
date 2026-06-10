/**
 * ESTRUCTURA.MD
 * ═════════════════════════════════════════════════════════════════════════
 * Guía rápida de referencia para navegar la codebase
 */

# 🎮 GUÍA RÁPIDA: DÓNDE ENCONTRAR CADA COSA

## Quiero cambiar...

| Qué cambiar | Dónde ir | Archivo |
|-------------|----------|---------|
| **Mapas de niveles** | Agregar/modificar arrays | `config/constants.js` |
| **Colores visuales** | Modificar COLOR.* | `config/colors.js` |
| **Velocidad del jugador** | Función `playerSpeed()` | `systems/physics.js` |
| **Velocidad fantasmas** | Función `ghostSpeed()` | `systems/physics.js` |
| **Duración power-up** | `getFrightDuration()` | `systems/physics.js` |
| **IA de fantasmas** | Funciones de IA | `systems/ai.js` |
| **Movimiento del jugador** | Función `movePlayer()` | `entities/player.js` |
| **Lógica de fantasmas** | Función `moveGhosts()` | `entities/ghost.js` |
| **Renderizado** | Funciones `draw*()` | `ui/renderer.js` |
| **Efectos visuales** | Partículas, flash | `ui/effects.js` |
| **Sonidos** | Funciones `play*()` | `utils/audio.js` |
| **Controles** | Teclado, touch, swipe | `input/input.js` |
| **Interfaz (HUD)** | Score, vidas, menú | `ui/hud.js`, `ui/menu.js` |

---

## Estructura de carpetas explicada

```
config/
  ├─ constants.js    ← Los mapas de 5 niveles están aquí
  └─ colors.js       ← Colores centralizados (COLOR.WALL, COLOR.DOT, etc.)

systems/
  ├─ movement.js     ← wrap(), isCentered(), snapToGrid()
  ├─ collision.js    ← getTile(), isWalkable(), canStep()
  ├─ physics.js      ← playerSpeed(), ghostSpeed(), timers
  └─ ai.js           ← Inteligencia de fantasmas (no creado aún)

entities/
  ├─ player.js       ← movePlayer(), recolectar pellets
  └─ ghost.js        ← moveGhosts(), IA (no creado aún)

ui/
  ├─ renderer.js     ← Dibujo: maze, player, ghosts
  ├─ effects.js      ← Partículas, flash
  ├─ hud.js          ← UI: score, vidas, nivel
  └─ menu.js         ← Menús (no creado aún)

input/
  └─ input.js        ← Teclado, gamepad, touch, swipe

utils/
  ├─ audio.js        ← Sonidos (Web Audio API)
  └─ helpers.js      ← Funciones auxiliares (no creado aún)

Archivos principales:
  ├─ core.js         ← Variables globales de ESTADO
  ├─ main.js         ← GAME LOOP (requestAnimationFrame)
  ├─ bootstrap.js    ← Inicialización
  └─ README.md       ← Documentación completa
```

---

## El "flujo" de una ronda

```
Usuario hace click en Play
    ↓
startGame()  (input.js)
    ↓
startRound() (core.js)
    ↓
initialize: player, ghosts, mapa, etc.
    ↓
loop()       (main.js) ← GAME LOOP COMIENZA
    ├─ movePlayer()    (entities/player.js)
    ├─ moveGhosts()    (entities/ghost.js, usa systems/ai.js)
    ├─ drawMaze()      (ui/renderer.js)
    ├─ drawPlayer()    (ui/renderer.js)
    ├─ drawGhosts()    (ui/renderer.js)
    └─ [repeat con requestAnimationFrame]
    
    Si dots === 0:
        ↓
        nextLevel() (core.js)
        ↓
        [vuelta a startRound()]
    
    Si lives === 0:
        ↓
        gameOver() (core.js)
        ↓
        showGameOverScreen()
```

---

## Preguntas frecuentes

**P: ¿Por qué hay `snap-to-grid` con tolerancia = speed * 0.5?**  
R: Si tolerancia >= velocidad, el snap consume el movimiento (bug congelación).
Usar half-speed asegura que siempre se avance.

**P: ¿Cómo agregar un 6to nivel?**  
R: 
1. `config/constants.js` → agregar mapa al array MAPS
2. Cambiar `MAX_LEVEL = 6`
3. (Opcional) Ajustar timers en `systems/physics.js`

**P: ¿Cómo cambiar el color del jugador?**  
R:
1. `config/colors.js` → editar `COLOR.PLAYER_WING`, `COLOR.PLAYER_GLOW`, etc.
2. En `ui/renderer.js` → usar `COLOR.PLAYER_WING` en lugar de hex code

**P: ¿Dónde están los controles?**  
R: `input/input.js` → mapeos de teclado, listeners de touch/swipe

**P: ¿Cómo funcionan los fantasmas?**  
R: 
1. Cada fantasma tiene tipo (0-3: Blinky, Pinky, Inky, Clyde)
2. En modo 'scatter': van a su esquina
3. En modo 'chase': usa IA personalizada (ir a target)
4. En modo 'frightened': huyen al azar
5. Código en `systems/ai.js`

**P: ¿Dónde está el estado global?**  
R: `core.js` → todas las variables (map, player, ghosts, score, level, etc.)

---

## Convenciones de código

- **PascalCase** para constantes: `TILE`, `ROWS`, `COLS`
- **camelCase** para variables: `player`, `ghostEatCombo`
- **camelCase** para funciones: `movePlayer()`, `getTile()`
- **UPPERCASE** para objetos configuración: `COLOR.*`, `GHOST_COLORS`
- Comentarios con `//` para una línea
- Comentarios con `/** */` para funciones (JSDoc)

---

## Tips de debugging

1. **Ver estado:** abre DevTools Console y escribe `player`, `ghosts`, `map`
2. **Pause game:** presiona 'P'
3. **Restart level:** presiona 'R'
4. **Ver logs:** todos los beeps de debug en `console.log()`
5. **Canvas:** DevTools → Elements → busca `<canvas id="game">`

---

## Performance tips

- `buildMazeCache()` cachea el laberinto en canvas (optimización)
- `distSq()` es más rápido que `dist()` (evita sqrt)
- `moveGhosts()` calcula IA solo cuando está centrado (no cada frame)
- Reducir cantidad de partículas si lag

---

**Última actualización:** Junio 2026  
**Versión:** 2.2 Modularizada  
