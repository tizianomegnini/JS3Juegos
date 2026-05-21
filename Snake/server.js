/**
 * server.js
 * Servidor principal Express para el proyecto Snake.
 * Sirve archivos estáticos y expone una API REST para jugadores y puntajes.
 * Utiliza ES Modules (import/export).
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync, existsSync } from "fs";

// ─── Configuración de rutas ────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

// Ruta del archivo de datos (simula una base de datos en JSON)
const DATA_FILE = path.join(__dirname, "data.json");

// ─── Inicializar archivo de datos si no existe ────────────────────────────
const initData = () => {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify({ players: [], scores: [] }, null, 2));
  }
};

// ─── Helpers de lectura/escritura ─────────────────────────────────────────
const readData  = () => JSON.parse(readFileSync(DATA_FILE, "utf-8"));
const writeData = (data) => writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── Rutas de páginas ──────────────────────────────────────────────────────
app.get("/",          (_, res) => res.sendFile(path.join(__dirname, "pages", "index.html")));
app.get("/game",      (_, res) => res.sendFile(path.join(__dirname, "pages", "game.html")));
app.get("/ranking",   (_, res) => res.sendFile(path.join(__dirname, "pages", "ranking.html")));

// ─── API: Jugadores ────────────────────────────────────────────────────────

/** GET /api/players — Devuelve todos los jugadores */
app.get("/api/players", (_, res) => {
  const { players } = readData();
  res.json(players);
});

/** POST /api/players — Crea un nuevo jugador */
app.post("/api/players", (req, res) => {
  const { name } = req.body;

  // Validación server-side
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Nombre inválido. Mínimo 2 caracteres." });
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ' ]+$/.test(name.trim())) {
    return res.status(400).json({ error: "El nombre solo puede contener letras y apóstrofes." });
  }

  const data   = readData();
  const exists = data.players.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
  if (exists) {
    return res.status(409).json({ error: "Ya existe un jugador con ese nombre." });
  }

  const newPlayer = {
    id:        Date.now().toString(),
    name:      name.trim(),
    createdAt: new Date().toISOString()
  };

  data.players.push(newPlayer);
  writeData(data);
  res.status(201).json(newPlayer);
});

/** PUT /api/players/:id — Actualiza el nombre de un jugador */
app.put("/api/players/:id", (req, res) => {
  const { id }   = req.params;
  const { name } = req.body;

  if (!name || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ' ]+$/.test(name.trim())) {
    return res.status(400).json({ error: "Nombre inválido." });
  }

  const data  = readData();
  const index = data.players.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Jugador no encontrado." });

  data.players[index].name = name.trim();
  writeData(data);
  res.json(data.players[index]);
});

/** DELETE /api/players/:id — Elimina un jugador y sus puntajes */
app.delete("/api/players/:id", (req, res) => {
  const { id } = req.params;
  const data   = readData();
  const index  = data.players.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Jugador no encontrado." });

  data.players.splice(index, 1);
  data.scores = data.scores.filter(s => s.playerId !== id);
  writeData(data);
  res.json({ message: "Jugador eliminado." });
});

// ─── API: Puntajes ─────────────────────────────────────────────────────────

/** GET /api/scores — Devuelve todos los puntajes ordenados de mayor a menor */
app.get("/api/scores", (_, res) => {
  const { scores, players } = readData();
  const enriched = scores
    .map(s => ({
      ...s,
      playerName: players.find(p => p.id === s.playerId)?.name ?? "Desconocido"
    }))
    .sort((a, b) => b.score - a.score);
  res.json(enriched);
});

/** POST /api/scores — Guarda un nuevo puntaje */
app.post("/api/scores", (req, res) => {
  const { playerId, playerName, score, mode } = req.body;

  if (!score || typeof score !== "number" || score < 0) {
    return res.status(400).json({ error: "Puntaje inválido." });
  }

  const data = readData();

  const newScore = {
    id:         Date.now().toString(),
    playerId:   playerId || null,
    playerName: playerName || "Anónimo",
    score,
    mode:       mode || "1P",
    createdAt:  new Date().toISOString()
  };

  data.scores.push(newScore);
  writeData(data);
  res.status(201).json(newScore);
});

/** DELETE /api/scores/:id — Elimina un puntaje específico */
app.delete("/api/scores/:id", (req, res) => {
  const { id } = req.params;
  const data   = readData();
  const index  = data.scores.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Puntaje no encontrado." });

  data.scores.splice(index, 1);
  writeData(data);
  res.json({ message: "Puntaje eliminado." });
});

// ─── Inicio del servidor ───────────────────────────────────────────────────
initData();
app.listen(PORT, () => {
  console.log(`🐍 Snake Server corriendo en http://localhost:${PORT}`);
});