# 🐍 Snake Game

## Cómo ejecutar

El juego **requiere un servidor HTTP** porque usa ES Modules (import/export).
No funciona abriendo los HTML directamente desde el explorador de archivos.

### Opción 1 — Node.js (recomendado)

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Iniciar el servidor
npm start

# 3. Abrir en el navegador
# http://localhost:3000
```

### Opción 2 — VS Code Live Server

Instalar la extensión **Live Server** en VS Code y hacer click en "Go Live".

### Opción 3 — Python (si no tenés Node)

```bash
python3 -m http.server 3000
# Luego abrir http://localhost:3000/pages/index.html
```

---

## Estructura

```
snake-final/
├── pages/         → index.html, game.html, ranking.html
├── scripts/
│   ├── common/    → theme, storage (localStorage), ui, etc.
│   └── snakes/    → lógica del juego
├── styles/        → CSS claro/oscuro por página
└── server.js      → servidor Express
```

## Puntajes

Los puntajes se guardan en **localStorage** del navegador (sin servidor de base de datos).
Al terminar cada partida se piden 3 iniciales (ej: AAA) y el puntaje queda en el Ranking.
