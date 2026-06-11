/**
 * INDEX_DOCUMENTACION.MD
 * ═════════════════════════════════════════════════════════════════════════
 * Índice y guía de navegación de toda la documentación del proyecto
 */

# 📚 ÍNDICE COMPLETO DE DOCUMENTACIÓN

Bienvenido a la documentación modularizada de Pacman 2.2.  
Esta es tu guía para entender, mantener y extender el proyecto.

---

## 📖 DOCUMENTOS DISPONIBLES

### 🎯 **EMPIEZA AQUÍ** (para nuevos contribuidores)

1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** ⭐ **COMIENZA AQUÍ**
   - Chuleta rápida (1-2 minutos)
   - "Quiero cambiar X" → ir a archivo Y
   - Códigos de ejemplo
   - Valores importantes
   - **Ideal para:** Primera exploración rápida

2. **[ESTRUCTURA.md](ESTRUCTURA.md)**
   - Guía de dónde está cada cosa (5 minutos)
   - Tabla: "cambio → archivo"
   - Diagrama de flujo de una ronda
   - Preguntas frecuentes
   - **Ideal para:** Encontrar funciones específicas

---

### 🏗️ ARQUITECTURA & DISEÑO

3. **[README.md](README.md)** 📖 **LECTURA COMPLETA RECOMENDADA**
   - Documentación detallada (20-30 minutos)
   - Descripción completa de cada módulo
   - Flujo de inicialización
   - Ciclo de juego (game loop)
   - Ventajas de la estructura
   - Ejemplos prácticos
   - **Ideal para:** Entender profundamente la arquitectura

4. **[DEPENDENCIAS.md](DEPENDENCIAS.md)**
   - Árbol de dependencias entre módulos (10-15 minutos)
   - Orden correcto de carga
   - Matriz de dependencias
   - Diagrama ASCII visual
   - Problemas de circularidad
   - **Ideal para:** Entender relaciones entre archivos

5. **[CARGA_SCRIPTS.md](CARGA_SCRIPTS.md)**
   - Orden correcto de carga en HTML (10 minutos)
   - Alternativas con ES6 modules
   - Explicación del por qué de cada nivel
   - Futuras mejoras con import/export
   - **Ideal para:** Configurar orden de scripts

---

### 📊 ESTADO & ROADMAP

6. **[STATUS_MODULARIZACION.md](STATUS_MODULARIZACION.md)**
   - Qué está hecho, qué falta (5-10 minutos)
   - Checklist de tareas
   - Próximos pasos detallados
   - Beneficios cuando esté completo
   - Mejoras futuras
   - **Ideal para:** Ver qué hay que hacer

---

## 🗂️ ESTRUCTURA DE CARPETAS

```
public/js/
│
├─ config/                    ← CONFIGURACIÓN
│  ├─ constants.js           ✅ (mapas, dimensiones)
│  └─ colors.js              ✅ (paleta centralizada)
│
├─ systems/                   ← LÓGICA DE JUEGO
│  ├─ movement.js            ✅ (wrap, centrado, snap)
│  ├─ collision.js           ✅ (tiles, caminabilidad)
│  ├─ physics.js             ✅ (velocidades, timers)
│  └─ ai.js                  🚧 (próximo)
│
├─ entities/                  ← OBJETOS JUGABLES
│  ├─ player.js              ✅ (movePlayer)
│  └─ ghost.js               🚧 (próximo)
│
├─ ui/                        ← RENDERIZADO & INTERFAZ
│  ├─ renderer.js            🚧 (dibujo)
│  ├─ effects.js             🚧 (partículas, flash)
│  ├─ hud.js                 🚧 (puntuación, HUD)
│  └─ menu.js                🚧 (menús)
│
├─ input/                     ← ENTRADA DEL USUARIO
│  └─ input.js               🚧 (teclado, touch)
│
├─ utils/                     ← UTILIDADES
│  ├─ audio.js               ✅ (sonidos)
│  └─ helpers.js             🚧 (funciones auxiliares)
│
├─ Archivos principales       ← NÚCLEO DEL JUEGO
│  ├─ bootstrap.js           (inicialización)
│  ├─ core.js                (estado global)
│  └─ main.js                (game loop)
│
└─ 📄 Documentación          ← TÚ ESTÁS AQUÍ
   ├─ README.md              (completa)
   ├─ ESTRUCTURA.md          (rápida)
   ├─ DEPENDENCIAS.md        (relaciones)
   ├─ CARGA_SCRIPTS.md       (orden de carga)
   ├─ STATUS_MODULARIZACION.md (progreso)
   ├─ QUICK_REFERENCE.md     (chuleta)
   └─ INDEX_DOCUMENTACION.md (este archivo)
```

---

## 🎯 MAPEO: "QUIERO SABER SOBRE X"

| Tema | Documento | Sección | Tiempo |
|------|-----------|---------|--------|
| Dónde empezar | QUICK_REFERENCE | Top | 2 min |
| Encontrar una función | ESTRUCTURA | Tabla "Qué cambiar" | 1 min |
| Entender el juego | README | "Ciclo de juego" | 5 min |
| Orden de scripts | CARGA_SCRIPTS | "Orden correcto" | 5 min |
| Cómo están conectados | DEPENDENCIAS | "Árbol" | 5 min |
| Qué falta hacer | STATUS_MODULARIZACION | "Checklist" | 5 min |
| Debugging rápido | QUICK_REFERENCE | "Testing" | 3 min |
| Agregar nuevo nivel | QUICK_REFERENCE | "Tareas comunes" | 2 min |
| Cambiar velocidad | ESTRUCTURA | Tabla | 1 min |
| Entender arquitectura | README | Completo | 30 min |

---

## 🚀 GUÍAS POR CASO DE USO

### Soy nuevo en el proyecto
```
1. Leer QUICK_REFERENCE.md (2 min)
   └─ "Quiero encontrar..." tabla

2. Leer ESTRUCTURA.md (5 min)
   └─ Ver dónde está cada cosa

3. Ver un archivo README.md (5 min)
   └─ Entender overview general

4. Explorar carpeta config/ (5 min)
   └─ Ver constants.js y colors.js
```

### Quiero cambiar algo específico
```
1. Abrir QUICK_REFERENCE.md
   └─ Buscar en tabla "Tareas comunes"

2. Abrir archivo indicado
   └─ Copiar ejemplo de la documentación

3. Hacer cambio
   └─ Guardar y probar en navegador

4. Si hay error:
   └─ Ver QUICK_REFERENCE "Errores comunes"
```

### Quiero entender por qué está así
```
1. Leer README.md sección "Arquitectura" (10 min)
   └─ Entiende estructura modular

2. Leer DEPENDENCIAS.md (10 min)
   └─ Entiende relaciones

3. Leer CARGA_SCRIPTS.md (5 min)
   └─ Entiende orden de carga

4. Explorar código comentado en módulos
   └─ Ver cómo implementan conceptos
```

### Quiero agregar una feature nueva
```
1. Leer STATUS_MODULARIZACION.md (5 min)
   └─ Ver qué módulos existen/faltan

2. Determinar en qué módulo va
   └─ config? systems? entities? ui?

3. Leer documentación del módulo
   └─ Entender estructura

4. Agregar código siguiendo patrón
   └─ Documentar con comentarios

5. Probar cambio
   └─ Verificar no rompe nada
```

### Soy optimista y quiero refactorizar todo a ES6
```
1. Leer CARGA_SCRIPTS.md sección "Alternativa: ES6 modules"
   └─ Entender qué es lo correcto

2. Ver STATUS_MODULARIZACION.md "Mejoras futuras"
   └─ Entiende complejidad

3. Estudiar ejemplo con config/constants.js
   └─ Ver cómo exportar/importar

4. Migrar modulo por modulo
   └─ Test después de cada módulo

5. Actualizar documentación
   └─ Reflejar cambios en README
```

---

## ✅ CHECKLIST: "¿HE LEÍDO TODO?"

Marca qué has leído:

- [ ] QUICK_REFERENCE.md - Rápida referencia
- [ ] ESTRUCTURA.md - Guía de ubicación
- [ ] README.md - Documentación completa
- [ ] DEPENDENCIAS.md - Relaciones entre módulos
- [ ] CARGA_SCRIPTS.md - Orden de carga
- [ ] STATUS_MODULARIZACION.md - Estado del proyecto
- [ ] He explorado los archivos en `config/`
- [ ] He explorado los archivos en `systems/`
- [ ] He explorado los archivos en `entities/`

**Si marcaste todo:** ¡Felicidades! Ahora eres un experto en la arquitectura.

---

## 🔗 REFERENCIAS CRUZADAS RÁPIDAS

```
README.md
  → Sección "Ciclo de juego"
     ↓
  DEPENDENCIAS.md
    → Árbol de dependencias de loop()
       ↓
    ESTRUCTURA.md
      → Tabla de "qué archivo qué función"
         ↓
      QUICK_REFERENCE.md
        → Sección "Testing" (cómo probar)
```

---

## 🎓 CONCEPTOS EXPLICADOS EN CADA DOC

| Concepto | QUICK_REF | ESTRUCTURA | README | DEPENDEN | CARGA |
|----------|-----------|-----------|--------|----------|-------|
| Modularización | ✓ | ✓ | ✓✓✓ | ✓ | ✓ |
| Dónde encontrar X | ✓✓✓ | ✓✓✓ | ✓ | - | - |
| Orden de carga | ✓ | - | - | - | ✓✓✓ |
| Dependencias | ✓ | ✓ | ✓ | ✓✓✓ | ✓ |
| Game loop | - | ✓ | ✓✓✓ | ✓ | - |
| Cómo debuggear | ✓✓ | - | - | - | - |
| Ejemplos código | ✓✓✓ | ✓ | ✓ | - | ✓ |
| Futura mejoras | - | - | ✓ | - | ✓ |

---

## 📝 CÓMO MANTENER LA DOCUMENTACIÓN

Cuando hagas cambios:

1. **Edita el archivo de código**
   ```javascript
   // En systems/movement.js
   function isCentered(entity, tolerance = 0.13) { ... }
   ```

2. **Actualiza JSDoc si aplica**
   ```javascript
   /**
    * Verifica si entidad está centrada
    * @param {object} entity - Entidad
    * @param {number} tolerance - Distancia máxima (default 0.13)
    * @returns {boolean}
    */
   ```

3. **Actualiza documentación relevante**
   - Si cambias estructura: actualiza README.md
   - Si cambias dependencias: actualiza DEPENDENCIAS.md
   - Si cambias orden carga: actualiza CARGA_SCRIPTS.md
   - Si cambias estado proyecto: actualiza STATUS_MODULARIZACION.md

---

## 🆘 AYUDA RÁPIDA

**"No entiendo X"**
→ Buscar en QUICK_REFERENCE.md tabla "Conceptos clave"

**"¿Dónde está la función Y?"**
→ Buscar en ESTRUCTURA.md tabla "Qué cambiar"

**"¿Por qué está así?"**
→ Leer README.md sección "Ciclo de juego"

**"¿Cómo hago Z?"**
→ Buscar en QUICK_REFERENCE.md "Tareas comunes"

**"Mi cambio rompió algo"**
→ Ver QUICK_REFERENCE.md "Errores comunes"

**"¿Qué tengo que hacer después?"**
→ Ver STATUS_MODULARIZACION.md "Próximos pasos"

---

## 📞 CONTACTO

- 📖 Documentación: Este archivo (INDEX_DOCUMENTACION.md)
- 🎯 Rápido: QUICK_REFERENCE.md
- 📚 Completo: README.md
- 🐛 Debugging: QUICK_REFERENCE.md sección "Testing"

---

## 📊 ESTADÍSTICAS

| Elemento | Cantidad | Estado |
|----------|----------|--------|
| Módulos creados | 10 | ✅ |
| Módulos pendientes | 10 | 🚧 |
| Archivos documentación | 7 | ✅ |
| Ejemplos de código | 20+ | ✅ |
| Diagramas | 5+ | ✅ |
| Líneas documentación | 2000+ | ✅ |

---

## 🎉 RESUMEN

| Documento | Para qué | Tiempo | Importancia |
|-----------|----------|--------|-------------|
| QUICK_REFERENCE | Referencia rápida | 2-5 min | ⭐⭐⭐⭐⭐ |
| ESTRUCTURA | Encontrar cosas | 5-10 min | ⭐⭐⭐⭐ |
| README | Entender todo | 20-30 min | ⭐⭐⭐⭐ |
| DEPENDENCIAS | Ver relaciones | 10-15 min | ⭐⭐⭐ |
| CARGA_SCRIPTS | Orden de scripts | 5-10 min | ⭐⭐⭐⭐ |
| STATUS_MODULARIZACION | Qué falta | 5-10 min | ⭐⭐⭐ |
| INDEX_DOCUMENTACION | Esta guía | 5 min | ⭐⭐ |

---

**Última actualización:** Junio 2026  
**Versión:** 2.2 Modularizada  
**Estado:** Documentación Completa ✅  

¡Bienvenido al proyecto Pacman 2.2! 🎮
