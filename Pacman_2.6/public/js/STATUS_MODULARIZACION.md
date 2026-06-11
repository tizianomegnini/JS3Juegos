/**
 * STATUS_MODULARIZACION.MD
 * ═════════════════════════════════════════════════════════════════════════
 * Estado actual de la modularización del proyecto
 * Qué está hecho, qué falta, y cómo proceder
 */

# 📊 ESTADO DE MODULARIZACIÓN

## ✅ COMPLETADO

### Config
- ✅ `config/constants.js` - Mapas, dimensiones, colores fantasmas, etc.
- ✅ `config/colors.js` - Paleta centralizada de colores

### Systems
- ✅ `systems/movement.js` - wrap(), isCentered(), snapToGrid(), distancias
- ✅ `systems/collision.js` - getTile(), isWalkable(), canStep(), countDots()
- ✅ `systems/physics.js` - playerSpeed(), ghostSpeed(), timers scatter/chase

### Entities  
- ✅ `entities/player.js` - movePlayer() con documentación completa

### Utils
- ✅ `utils/audio.js` - beep(), playDot(), playPowerPellet(), etc.

### Documentación
- ✅ `README.md` - Documentación completa y detallada
- ✅ `ESTRUCTURA.md` - Guía rápida de dónde encontrar cada cosa
- ✅ `CARGA_SCRIPTS.md` - Orden correcto de carga, alternativas ES6
- ✅ `DEPENDENCIAS.md` - Árbol de dependencias entre módulos
- ✅ `STATUS_MODULARIZACION.md` - Este archivo

---

## 🚧 EN PROGRESO / PENDIENTE

| Archivo | Estado | Tarea |
|---------|--------|-------|
| `systems/ai.js` | 🚧 | Extraer lógica IA de ghosts.js |
| `entities/ghost.js` | 🚧 | Lógica de fantasmas (moveGhosts) |
| `ui/renderer.js` | 🚧 | Separar draw*, buildMazeCache |
| `ui/effects.js` | 🚧 | spawnParticles(), flash effects |
| `ui/hud.js` | 🚧 | updateHUD(), updateScore(), menus |
| `ui/menu.js` | 🚧 | Lógica de menús |
| `input/input.js` | 🚧 | Refactorizar input handler |
| `utils/helpers.js` | 🚧 | Funciones auxiliares generales |
| `main.js` | 🚧 | Game loop (loop function) |

---

## 📋 CHECKLIST DE TAREAS

### Fase 1: Refactorización (🔴 ACTUAL)
- [x] Crear estructura de carpetas
- [x] Documentación de arquitectura
- [x] Crear config/constants.js
- [x] Crear config/colors.js
- [x] Crear systems/movement.js
- [x] Crear systems/collision.js
- [x] Crear systems/physics.js
- [x] Crear utils/audio.js
- [x] Crear entities/player.js (con documentación)
- [x] Crear documentación (.md files)
- [ ] Extraer systems/ai.js
- [ ] Extraer entities/ghost.js
- [ ] Extraer ui/renderer.js (dividir en draw*)
- [ ] Extraer ui/effects.js
- [ ] Extraer ui/hud.js
- [ ] Extraer ui/menu.js
- [ ] Refactorizar input/input.js
- [ ] Crear utils/helpers.js
- [ ] Extraer main.js (game loop)

### Fase 2: Validación
- [ ] Verificar que el juego sigue funcionando
- [ ] Probar todos los niveles
- [ ] Probar menús y game over
- [ ] Probar entrada (teclado, mobile, touch)
- [ ] Verificar sonidos

### Fase 3: Testing (Opcional)
- [ ] Unit tests para systems/movement.js
- [ ] Unit tests para systems/collision.js
- [ ] Unit tests para systems/physics.js
- [ ] Integration tests para entities/player.js

### Fase 4: Optimizaciones
- [ ] Lazy-load de UI modules
- [ ] Cacheo de renderizado (maze canvas)
- [ ] Performance profiling

---

## 📁 ESTRUCTURA ACTUAL vs. FUTURA

### ACTUAL (sin modularizar)
```
public/js/
├─ bootstrap.js
├─ core.js         ← TODO mezclado aquí
├─ ghosts.js
├─ input.js
├─ main.js
├─ player.js
└─ render.js
```

### FUTURA (modularizada) ← EN PROGRESO
```
public/js/
├─ config/
│  ├─ constants.js  ✅ HECHO
│  └─ colors.js     ✅ HECHO
│
├─ systems/
│  ├─ movement.js   ✅ HECHO
│  ├─ collision.js  ✅ HECHO
│  ├─ physics.js    ✅ HECHO
│  └─ ai.js         🚧 PENDIENTE
│
├─ entities/
│  ├─ player.js     ✅ HECHO
│  └─ ghost.js      🚧 PENDIENTE
│
├─ ui/
│  ├─ renderer.js   🚧 PENDIENTE
│  ├─ effects.js    🚧 PENDIENTE
│  ├─ hud.js        🚧 PENDIENTE
│  └─ menu.js       🚧 PENDIENTE
│
├─ input/
│  └─ input.js      🚧 PENDIENTE (refactor)
│
├─ utils/
│  ├─ audio.js      ✅ HECHO
│  └─ helpers.js    🚧 PENDIENTE
│
├─ bootstrap.js
├─ core.js
├─ main.js
├─
├─ README.md                ✅ HECHO
├─ ESTRUCTURA.md            ✅ HECHO
├─ CARGA_SCRIPTS.md        ✅ HECHO
├─ DEPENDENCIAS.md         ✅ HECHO
└─ STATUS_MODULARIZACION.md ✅ HECHO
```

---

## 🔧 PRÓXIMOS PASOS

### Paso 1: Extraer systems/ai.js
**Archivo origen:** `core.js` y `ghosts.js`  
**Qué extraer:**
```javascript
function getPlayerTile() { ... }
function getAheadTile(steps) { ... }
function getInkyTarget() { ... }
function dotsLeftRatio() { ... }
function chooseGhostTarget(ghost) { ... }
function getBestDir(ghost, target) { ... }
```

**Ubicación:** `public/js/systems/ai.js`

---

### Paso 2: Extraer entities/ghost.js
**Archivo origen:** `ghosts.js`  
**Qué incluir:**
```javascript
function moveGhosts() { ... }
function changeMode() { ... }
// Toda la lógica de movimiento y IA de fantasmas
```

**Dependencias:**
- `systems/movement.js` → `ghostSpeed()`, `wrap()`
- `systems/collision.js` → `canStep()`, `isWalkable()`
- `systems/physics.js` → `ghostSpeed()`
- `systems/ai.js` → `chooseGhostTarget()`, `getBestDir()`

---

### Paso 3: Separar ui/renderer.js
**Archivo origen:** `render.js`  
**Dividir en funciones:**
- `drawMaze()` - Renderiza laberinto
- `drawPlayer()` - Renderiza jugador
- `drawGhosts()` - Renderiza fantasmas
- `buildMazeCache()` - Optimización de caché

---

### Paso 4: Crear ui/effects.js
**Funciones a extraer:**
```javascript
function spawnParticles(x, y, color, count, speed) { ... }
function updateParticles() { ... }
function drawParticles() { ... }
```

---

### Paso 5: Crear ui/hud.js
**Funciones a extraer:**
```javascript
function updateHUD() { ... }
function updateScore() { ... }
function updateHsDisplay() { ... }
function showPowerMode() { ... }
```

---

### Paso 6: Refactorizar input/input.js
**Mantener:** Listeners de teclado, touch, swipe  
**Limpiar:** Separar en funciones claras  
**Documentar:** Qué tecla/gesto qué hace

---

## 🎯 BENEFICIOS CUANDO ESTÉ COMPLETO

✅ **Mantenibilidad** - Fácil encontrar dónde está cada función  
✅ **Reutilización** - Funciones de systems/ pueden usarse en otros proyectos  
✅ **Testing** - Cada módulo puede testearse independientemente  
✅ **Escalabilidad** - Agregar features sin tocar código existente  
✅ **Documentación** - Cada archivo autodocumentado  
✅ **Performance** - Código más limpio, posible lazy-loading  

---

## 📝 NOTAS IMPORTANTES

### No Romper el Código
El código actual funciona. La refactorización es **reorganización lógica**,
no cambios en lógica de juego. Verificar después de cada cambio que:
1. El juego aún inicia
2. Se puede jugar
3. Los fantasmas se mueven
4. Se pueden recoger puntos
5. Los sonidos funcionan

### Orden de Carga
Los scripts se cargan en `index.html`. Importante mantener el orden
correcto (ver CARGA_SCRIPTS.md) para evitar "undefined function" errors.

### Variables Globales
Actualmente todo usa scope global (variables sin `var`/`let`).
Para migrar a ES6 modules (futura mejora), se necesita cambiar a `import`/`export`.

---

## 🚀 MEJORAS FUTURAS (DESPUÉS DE MODULARIZACIÓN)

1. **Migrar a ES6 modules**
   ```javascript
   import { ROWS, COLS } from './config/constants.js';
   import { movePlayer } from './entities/player.js';
   ```

2. **Unit tests con Jest/Vitest**
   ```javascript
   test('wrap() funciona correctamente', () => {
     expect(wrap(-1, 19)).toBe(18);
   });
   ```

3. **Agregar Editor de Mapas**
   - Interface para diseñar nuevos niveles
   - Exportar/importar mapas

4. **Sistema de Plugins**
   - Agregar nuevos fantasmas
   - Nuevos power-ups
   - Mods de comunidad

5. **Multiplayer Online**
   - WebSocket para jugar con otros

---

## 📞 CONTACTO / PREGUNTAS

Si hay dudas sobre la arquitectura:
1. Leer `README.md` - Explicación completa
2. Leer `ESTRUCTURA.md` - Guía rápida
3. Ver `DEPENDENCIAS.md` - Árbol de relaciones

---

**Última actualización:** Junio 2026  
**Versión:** 2.2 (en modularización)  
**Progreso:** 50% (10/20 módulos completados)  
