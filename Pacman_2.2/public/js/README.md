# PACMAN 2.2 - ESTRUCTURA MODULAR

Documentación completa de la arquitectura y cómo están organizados los archivos del proyecto.

---

## 📁 ESTRUCTURA DE CARPETAS

```
public/js/
├── config/              # Configuración e constantes
│   ├── constants.js     # Mapas, dimensiones, colores de fantasmas, etc.
│   └── colors.js        # Paleta centralizada de colores
│
├── entities/            # Entidades jugables (objetos con lógica)
│   ├── player.js        # Lógica del jugador
│   └── ghost.js         # Lógica de fantasmas (IA, movimiento)
│
├── systems/             # Sistemas de lógica de juego
│   ├── movement.js      # Wraparound, centrado, snap-to-grid
│   ├── collision.js     # Detección de tiles, caminabilidad
│   ├── physics.js       # Velocidades, timers, modos (scatter/chase)
│   └── ai.js            # Inteligencia artificial de fantasmas
│
├── ui/                  # Renderizado y interfaz
│   ├── renderer.js      # Dibujo del laberinto, jugador, fantasmas
│   ├── effects.js       # Partículas, flash, animaciones visuales
│   ├── hud.js           # Actualizar puntuación, vidas, nivel
│   └── menu.js          # Menús (inicio, game over, victoria)
│
├── input/               # Manejo de entrada del usuario
│   └── input.js         # Teclado, gamepad, touch, swipe
│
├── utils/               # Funciones auxiliares reutilizables
│   ├── audio.js         # Síntesis de sonidos (Web Audio API)
│   └── helpers.js       # Funciones generales (localStorage, etc.)
│
├── core.js              # Estado global del juego (variables principales)
├── main.js              # Loop principal (game loop)
└── bootstrap.js         # Inicialización después de cargar scripts
```

---

## 🎮 FLUJO DE INICIALIZACIÓN

1. **HTML carga scripts** → Se cargan en orden alfabético o manualmente en `index.html`
2. **bootstrap.js ejecuta** → Espera que DOM esté listo
3. **resizeCanvas()** → Configura canvas responsive
4. **showMenu()** → Muestra pantalla inicial
5. **User hace click en Play**
6. **startGame()** → Inicia el juego
7. **loop()** → Game loop continuo (requestAnimationFrame)

---

## 📋 DESCRIPCIÓN DE MÓDULOS

### **CONFIG/**

#### `constants.js`
- Mapas de 5 niveles (arrays 2D de 22×19)
- Valores de tile: 0=vacío, 1=pared, 2=dot, 3=power-up, 4=casa
- Dimensiones: ROWS=22, COLS=19, MAX_LEVEL=5
- Configuración de fantasmas: colores, nombres, posiciones scatter
- Direcciones cardinales (DIRS array)

#### `colors.js`
- Paleta centralizada de colores (COLOR.*)
- Colores para: maze, dots, player, ghosts, UI, efectos
- Ventaja: cambiar tema sin buscar hex codes en múltiples archivos

---

### **SYSTEMS/**

#### `movement.js`
- `wrap(value, max)` → Envuelve coordenadas en bordes (wrap-around)
- `isCentered(entity, tol)` → Detecta si está centrada en tile
- `snapToGrid(entity)` → Alinea exactamente al tile
- `distSq()` / `dist()` → Cálculos de distancia

**Crítico:** La tolerancia en `isCentered` debe ser menor que la velocidad para no negar movimiento.

#### `collision.js`
- `getTile(x, y)` → Obtiene valor de tile (0-4)
- `isWalkable(x, y)` → Verifica si posición es caminable
- `canStep(entity, dir)` → Valida movimiento en dirección
- `countDots(map)` → Cuenta pellets en mapa
- `cloneMap()` → Copia profunda del mapa
- `findSpawnPosition()` → Encuentra posición válida de spawn

#### `physics.js`
- `playerSpeed()` → Velocidad según nivel (aumenta progresivamente)
- `ghostSpeed(ghost)` → Velocidad de fantasmas (más lenta, less en frightened)
- `getFrightDuration()` → Duración del power-up (decrece con nivel)
- Timers scatter/chase por nivel (cuándo cambian modos)

#### `ai.js` (aún no creado, referencia)
- `chooseGhostTarget(ghost)` → IA de cada fantasma
  - Blinky: persigue directo al jugador
  - Pinky: emboscadora (apunta adelante)
  - Inky: flanqueadora (refleja posición de Blinky)
  - Clyde: errático (cerca = huye, lejos = persigue)
- `getBestDir(ghost, target)` → Mejor dirección hacia target

---

### **ENTITIES/**

#### `player.js`
- `movePlayer()` → Lógica principal de movimiento
  1. Actualizar velocidad
  2. Aplicar dirección pendiente si está centrado
  3. Frenar si no puede continuar
  4. Mover
  5. Snap-to-grid (tolerancia = speed * 0.5 **importante**)
  6. Recoger dots (+10 puntos)
  7. Recoger power-ups (+50 puntos, activar frightened)
  8. Comprobar victoria (dots === 0)

#### `ghost.js` (estructura referencia)
```javascript
{
  id: 0-3,           // Blinky, Pinky, Inky, Clyde
  x, y,              // Posición
  dir: {x, y},       // Dirección
  scatter: {x, y},   // Posición de fuga
  frightened: bool,  // En modo asustado
  inHouse: bool,     // En casa
  eaten: bool        // Fue comido
}
```

---

### **UI/**

#### `renderer.js` (aún no modularizado completamente)
- `buildMazeCache()` → Cachea laberinto en canvas (optimización)
- `drawMaze()` → Dibuja laberinto + dots + power-ups
- `drawPlayer()` → Renderiza jugador como nave con fuego
- `drawGhosts()` → Renderiza 4 fantasmas
- `drawParticles()` → Efectos visuales

#### `effects.js` (conceptual)
- `spawnParticles()` → Crea explosión de partículas
- Manejo de flash de pantalla
- Animaciones visuales (pulso, shimmer, etc.)

#### `hud.js` (conceptual)
- `updateHUD()` → Actualiza score, vidas, nivel
- `updateHsDisplay()` → Muestra récord
- `showMenu()`, `showGameUI()`, etc.

#### `menu.js` (conceptual)
- Lógica de menús
- Listeners de botones
- Transiciones entre pantallas

---

### **INPUT/**

#### `input.js`
- Keyboard mapping (Arrow Keys, WASD)
- D-Pad (botones táctiles para móvil)
- Swipe gestures (mobile)
- Listeners de pausa (P), reinicio (R)
- Control de orientación (landscape lock en móvil)

---

### **UTILS/**

#### `audio.js`
- `getAudio()` → Obtiene/crea AudioContext
- `beep()` → Sintetiza tono simple (base)
- Sonidos específicos:
  - `playDot()` → Comer pellet
  - `playPowerPellet()` → Melodía power-up
  - `playEatGhost()` → Comer fantasma
  - `playDeath()` → Escala descendente
  - `playLevelUp()` → Escala ascendente

#### `helpers.js` (conceptual)
- Funciones de localStorage
- Formateo de fechas
- Validaciones

---

### **CORE FILES**

#### `core.js`
**Variables globales de estado** (el "árbitro" del juego):
```javascript
// Juego
let map = [];
let player = null;
let ghosts = [];
let level = 1;
let score = 0;
let lives = 3;
let dots = 0;

// Control
let gameRunning = false;
let paused = false;
let pendingDir = null;

// Modos
let frightTimer = 0;
let ghostEatCombo = 0;
let modeIndex = 0;
let currentMode = 'scatter';

// Efectos
let particles = [];
let invTimer = 0;
let flashTimer = 0;
```

Funciones principales (aún aquí, pueden modularizarse):
- `startRound(isNewGame)` → Iniciar ronda
- `nextLevel()` → Pasar al siguiente nivel
- `colisión jugador-fantasma` → Manejo de muertes

#### `main.js`
**Game Loop** (requestAnimationFrame):
```javascript
function loop() {
  if (!gameRunning || paused) {
    requestAnimationFrame(loop);
    return;
  }
  
  // Actualizar
  movePlayer();
  moveGhosts();
  updateModes();
  
  // Dibujar
  drawMaze();
  drawPlayer();
  drawGhosts();
  drawParticles();
  
  requestAnimationFrame(loop);
}
```

#### `bootstrap.js`
- Espera DOM listo
- Resiza canvas
- Inicializa audio
- Muestra menú

---

## 🔄 CICLO DE JUEGO (GAME LOOP)

```
┌─ loop() (60fps con requestAnimationFrame)
│
├─ ACTUALIZAR LÓGICA
│  ├─ movePlayer()          (input → dirección → snap)
│  ├─ moveGhosts()          (IA → movimiento)
│  ├─ updateFrightMode()    (decrementar timers)
│  └─ updateScatterChase()  (cambiar modos)
│
├─ DETECTAR COLISIONES
│  ├─ Jugador coman dots/power-ups (en movePlayer)
│  ├─ Fantasma come jugador
│  └─ Jugador come fantasma (en frightened)
│
├─ RENDERIZAR
│  ├─ drawMaze()            (tiles, dots, laberinto)
│  ├─ drawPlayer()          (nave azul)
│  ├─ drawGhosts()          (4 fantasmas de colores)
│  └─ drawParticles()       (efectos visuales)
│
└─ VERIFICAR VICTORIA/DERROTA
   ├─ dots === 0 → nextLevel()
   └─ lives === 0 → gameOver()
```

---

## 🎯 VENTAJAS DE ESTA ESTRUCTURA

✅ **Modularidad** - Cada archivo tiene responsabilidad única
✅ **Mantenimiento** - Fácil encontrar y modificar features
✅ **Reutilización** - Funciones sin dependencias pueden usarse en otros proyectos
✅ **Documentación** - Cada módulo bien comentado
✅ **Escalabilidad** - Fácil agregar nuevos fantasmas, niveles, efectos
✅ **Testing** - Funciones puras pueden ser testeadas independientemente

---

## 📝 EJEMPLO: AGREGAR UN NUEVO NIVEL

1. Ir a `config/constants.js`
2. Agregar nuevo mapa al array `MAPS` (6to nivel)
3. Cambiar `MAX_LEVEL = 6`
4. Ajustar timers en `systems/physics.js` si es necesario
5. ¡Listo! El juego lo detecta automáticamente

---

## 📝 EJEMPLO: CAMBIAR COLOR DE PLAYER

1. Abrir `config/colors.js`
2. Modificar `COLOR.PLAYER_WING`, `COLOR.PLAYER_GLOW`, etc.
3. Importar o referencia automática (depende de implementación)
4. ¡Listo! Cambio global sin buscar en 5 archivos

---

## ⚠️ NOTAS CRÍTICAS

### Snap-to-Grid Bug (YA ARREGLADO)
- ❌ **Malo:** `isCentered(player, player.speed)` → tolerancia = velocidad
- ✅ **Correcto:** `isCentered(player, player.speed * 0.5)` → tolerancia = velocidad/2
- **Por qué:** Si tolerancia ≥ velocidad, el snap consume el movimiento (congelación)

### Orden de carga de scripts
Importante que se carguen en este orden lógico:
1. Config (constants, colors)
2. Systems (collision, movement, physics, ai)
3. Utils (audio, helpers)
4. Entities (player, ghost)
5. UI (renderer, effects, hud, menu)
6. Input
7. Core (estado global)
8. Main (game loop)
9. Bootstrap (inicialización)

---

## 🚀 PRÓXIMAS MEJORAS SUGERIDAS

- [ ] Refactorizar `input.js` a módulo puro
- [ ] Separar `core.js` en múltiples archivos
- [ ] Implementar `ghost.js` como clase
- [ ] Crear sistema de sonido más modular
- [ ] Tests unitarios para funciones math
- [ ] Usar ES6 modules (import/export)
- [ ] Agregar editor de mapas
- [ ] Leaderboard online

---

**Mantenido por:** Tu nombre  
**Última actualización:** Junio 2026  
**Versión:** 2.2  
