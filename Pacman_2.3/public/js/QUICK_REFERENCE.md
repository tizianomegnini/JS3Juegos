/**
 * QUICK_REFERENCE.MD
 * ═════════════════════════════════════════════════════════════════════════
 * Chuleta rápida para desarrolladores
 * Preguntas frecuentes y respuestas cortas
 */

# ⚡ QUICK REFERENCE - CHULETA PARA PROGRAMADORES

## 🎮 CONCEPTOS CLAVE (1 línea cada)

| Concepto | Qué es | Dónde |
|----------|--------|-------|
| **Tile** | Unidad básica del mapa (1x1) | constants.js: TILE=26px |
| **Map** | Array 2D con valores 0-4 | core.js: global `map` |
| **Wrap** | Reciclaje en bordes (pacman teletransporte) | movement.js: `wrap(x, max)` |
| **Centered** | Si jugador está en centro de tile | movement.js: `isCentered(e, tol)` |
| **Snap-to-grid** | Alinear exactamente al tile | movement.js: `snapToGrid(e)` |
| **Scatter** | Fantasmas van a esquinas | physics.js: modos |
| **Chase** | Fantasmas persiguen al jugador | physics.js: IA |
| **Frightened** | Modo asustado (power-up) | physics.js: `getFrightDuration()` |

---

## 🔍 "QUIERO ENCONTRAR..."

```javascript
// Mapas de niveles
config/constants.js → MAPS array (5 arrays de 22×19)

// Velocidad del jugador
systems/physics.js → playerSpeed() 

// Detección de colisiones
systems/collision.js → getTile(), canStep(), isWalkable()

// IA de fantasmas
systems/ai.js (próximo a crear) → chooseGhostTarget()

// Movimiento jugador
entities/player.js → movePlayer()

// Movimiento fantasmas
entities/ghost.js (próximo a crear) → moveGhosts()

// Renderizado
ui/renderer.js (próximo a refactorizar) → draw*()

// Sonidos
utils/audio.js → playDot(), playDeath(), etc.

// Interfaz
ui/hud.js (próximo a crear) → updateHUD(), updateScore()

// Entrada usuario
input/input.js → keyboard/touch listeners
```

---

## 🛠️ TAREAS COMUNES

### "Cambiar velocidad del jugador"
```javascript
// Archivo: systems/physics.js
function playerSpeed() {
  return Math.min(0.155, 0.105 + (level - 1) * 0.012); // ← Editar aquí
}
```

### "Cambiar color del jugador"
```javascript
// Archivo: config/colors.js
const COLOR = {
  PLAYER_WING: '#0088cc',        // ← Editar estos
  PLAYER_WING_LIGHT: '#003366',
  PLAYER_GLOW: '#00ccff',
  // ... más colores
};
```

### "Agregar un nuevo nivel (nivel 6)"
```javascript
// Archivo: config/constants.js
const MAPS = [
  // Level 1... 5 ya existen
  [
    // Aquí va el nuevo mapa 22×19
    [1,1,1,1,...],
    [...],
  ]
];
const MAX_LEVEL = 6; // ← Cambiar de 5 a 6
```

### "Cambiar duración del power-up"
```javascript
// Archivo: systems/physics.js
function getFrightDuration() {
  return Math.max(60, 360 - (level - 1) * 70); // ← Números mágicos
}
// 360 frames = ~6 segundos (60fps)
// Cada nivel resta 70 frames
```

### "Cambiar IA de Blinky (fantasma rojo)"
```javascript
// Archivo: systems/ai.js (cuando se cree)
function chooseGhostTarget(ghost) {
  if (ghost.id === 0) { // Blinky
    // Retorna target como jugador
    return getPlayerTile();
  }
  // ... otros fantasmas
}
```

### "Cambiar sonido al comer pellet"
```javascript
// Archivo: utils/audio.js
function playDot() {
  beep(440, 0.04, 'square', 0.06); // freq, duration, type, volume
  // ↓ Por ejemplo, hacer más agudo:
  // beep(880, 0.04, 'square', 0.06); // Doble frecuencia
}
```

### "Agregar efecto visual nuevo"
```javascript
// Archivo: ui/effects.js (cuando se cree)
function spawnParticles(x, y, color, count, speed) {
  particles = particles.concat(
    Array(count).fill(0).map(() => ({
      x, y, color, speed,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      life: 60
    }))
  );
}
```

---

## 📊 VALORES IMPORTANTES

```javascript
// Dimensiones del mapa
ROWS = 22 (alto)
COLS = 19 (ancho)
TILE = 26 píxeles

// Valores de tile
0 = espacio vacío
1 = pared
2 = punto (dot)
3 = power-up
4 = casa fantasmas

// Velocidades (tiles por frame a 60fps)
playerSpeed()     = 0.105 - 0.155 (aumenta con nivel)
ghostSpeed()      = playerSpeed() * 0.95 (95%)
frightened speed  = ghostSpeed() * 0.75 (75%)

// Timers (en frames)
power-up duration = 60 - 360 (decrece con nivel)
scatter timer     = 180 - 420
chase timer       = 900 - 1200

// Posiciones
Spawn jugador     = (9, 16)
Spawn fantasmas   = (8-11, 9-10) casa
Scatter Blinky    = (COLS-2, 0)
Scatter Pinky     = (1, 0)
Scatter Inky      = (COLS-2, ROWS-1)
Scatter Clyde     = (1, ROWS-1)
```

---

## 🧪 TESTING (Cómo probar cambios)

```javascript
// Abrir DevTools Console (F12 → Console)

// Ver estado actual
player       // Posición y dirección del jugador
ghosts       // Array de 4 fantasmas
map          // Mapa actual
score        // Puntuación
level        // Nivel actual

// Ejecutar funciones manualmente
wrap(25, 19)        // → 6 (wrap-around)
isCentered(player)  // → true/false
getTile(9, 16)      // → {tx: 9, ty: 16, value: ...}
playerSpeed()       // → 0.105...

// Cambiar estado
score += 100        // Agregar puntos
level = 5           // Ir al nivel 5
player.x = 5        // Teletransportar jugador
ghosts[0].frightened = true  // Asustar fantasmas

// Probar sonidos
playDot()
playPowerPellet()
playDeath()
```

---

## 🐛 DEBUG: ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| **ReferenceError: X is not defined** | Archivo no cargado o mal orden | Ver CARGA_SCRIPTS.md |
| **Jugador congelado en nivel 3** | snap-to-grid tolerance >= speed | Ver player.js: usar speed * 0.5 |
| **Fantasmas no se mueven** | Falta moveGhosts() o IA | Crear systems/ai.js |
| **No hay sonido** | AudioContext no iniciado | AudioContext se crea en click |
| **Canvas en blanco** | resizeCanvas() no llamado | Ver bootstrap.js |
| **Input no funciona** | Listeners no agregados | Ver input/input.js |

---

## 📚 ARCHIVOS MÁS USADOS

```
Si vas a trabajar en...         Edita principalmente...
─────────────────────────────────────────────────────
Movimiento jugador         →    entities/player.js
IA fantasmas               →    systems/ai.js (pending)
Velocidad/física           →    systems/physics.js
Diseño de niveles          →    config/constants.js
Colores y temas            →    config/colors.js
Renderizado                →    ui/renderer.js (pending)
Entrada (teclado/touch)    →    input/input.js
Sonidos                    →    utils/audio.js
Interfaz (HUD/menus)       →    ui/hud.js, ui/menu.js
Estado global              →    core.js
Game loop                  →    main.js
```

---

## 🔐 REGLAS DE ORO

1. ✅ **Siempre documentar cambios** con comentarios
2. ✅ **Probar después de cambiar** - No rompas el juego
3. ✅ **Mantener módulos separados** - No mezclar responsabilidades
4. ✅ **Usar constantes** - No hardcodear números mágicos
5. ✅ **Evitar dependencias circulares** - A → B → C OK, A → B → A ❌
6. ✅ **Pasar parámetros** en lugar de acceder scope global si es posible
7. ✅ **Debuggear con console.log()** - Usa DevTools Console

---

## 🚀 WORKFLOW TÍPICO

```
1. Hacer cambio en archivo
   └─ config/constants.js, utils/audio.js, etc.

2. Guardar cambios
   └─ Ctrl+S

3. Abrir juego en navegador
   └─ http://localhost:3022

4. Probar el cambio
   └─ Click en Play, juega un poco

5. Abrir DevTools (F12)
   └─ Busca errores en Console

6. Si hay error:
   └─ Lee mensaje, busca línea, arregla

7. Si no hay error y funciona:
   └─ ✅ Listo, cambio completado

8. Si no funciona pero no hay error:
   └─ Usa console.log() o debugger
```

---

## 🎯 ESTRUCTURA DE DATOS IMPORTANTES

```javascript
// Objeto Jugador
player = {
  x: 9,           // Posición X en tiles
  y: 16,          // Posición Y en tiles
  dir: {x:0, y:0}, // Dirección actual
  speed: 0.12     // Velocidad en tiles/frame
}

// Objeto Fantasma
ghost = {
  id: 0,                    // 0-3 (Blinky, Pinky, Inky, Clyde)
  x: 9, y: 10,             // Posición
  dir: {x:1, y:0},         // Dirección
  scatter: {x:17, y:0},    // Posición cuando en scatter
  frightened: false,        // ¿Asustado?
  inHouse: false,          // ¿En casa?
  eaten: false             // ¿Fue comido?
}

// Mapa (array 2D)
map = [
  [1,1,1,...],  // Fila 0
  [1,2,2,...],  // Fila 1
  [...],
]
// Acceso: map[y][x] = value (0-4)
```

---

## 📖 REFERENCIAS RÁPIDAS

| Necesito... | Función | Retorna |
|-------------|---------|---------|
| Saber si puedo mover | `canStep(entity, dir)` | boolean |
| Saber qué hay en tile | `getTile(x, y)` | {tx, ty, value} |
| Distancia entre puntos | `dist(x1,y1,x2,y2)` | number |
| Distancia² (más rápido) | `distSq(x1,y1,x2,y2)` | number |
| Envolver coordenada | `wrap(value, max)` | number |
| Contar pellets | `countDots(map)` | number |
| Verificar si centrado | `isCentered(entity)` | boolean |
| Alinear al tile | `snapToGrid(entity)` | (modifica entity) |
| Velocidad jugador | `playerSpeed()` | number |
| Velocidad fantasma | `ghostSpeed(ghost)` | number |
| Jugar sonido | `playDot()`, etc | (sin retorno) |
| Duración power-up | `getFrightDuration()` | number |

---

**Última actualización:** Junio 2026  
**Versión:** 2.2 Modularizada  
