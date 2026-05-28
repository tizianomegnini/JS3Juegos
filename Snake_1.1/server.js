/**
 * server.js
 * Servidor Express. Sirve estáticos y expone API REST para scores.
 * Los scores se guardan en data/scores.txt (NDJSON, una línea por entry).
 */

import express  from "express";
import path     from "path";
import fs       from "fs";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const app        = express();
const PORT       = process.env.PORT || 3000;
const SCORES_FILE = path.join(__dirname, "data", "scores.txt");

app.use(express.json());

app.use((req, res, next) => {
  if (/\.(html|css|js)$/i.test(req.path)) {
    res.set("Cache-Control", "no-cache, must-revalidate");
  }
  next();
});

app.use(express.static(path.join(__dirname)));

// ─── Páginas ──────────────────────────────────────────────────────────────
app.get("/",        (_, res) => res.sendFile(path.join(__dirname, "pages", "index.html")));
app.get("/game",    (_, res) => res.sendFile(path.join(__dirname, "pages", "game.html")));
app.get("/ranking", (_, res) => res.sendFile(path.join(__dirname, "pages", "ranking.html")));

// ─── Leer scores ──────────────────────────────────────────────────────────
function readScores() {
  try {
    const raw = fs.readFileSync(SCORES_FILE, "utf8");
    return raw.split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => JSON.parse(l));
  } catch {
    return [];
  }
}

// ─── Escribir scores ──────────────────────────────────────────────────────
function writeScores(entries) {
  fs.mkdirSync(path.dirname(SCORES_FILE), { recursive: true });
  fs.writeFileSync(SCORES_FILE, entries.map(e => JSON.stringify(e)).join("\n") + "\n", "utf8");
}

// ─── GET /api/scores ──────────────────────────────────────────────────────
app.get("/api/scores", (_, res) => {
  res.json(readScores());
});

// ─── POST /api/scores ─────────────────────────────────────────────────────
function normalizeSettings(body) {
  const source = body.settings && typeof body.settings === "object" ? body.settings : body;
  return {
    mapSize:   source.mapSize || "medium",
    foodCount: Number(source.foodCount) || 1,
    wallMode:  source.wallMode || "wall"
  };
}

app.post("/api/scores", (req, res) => {
  const { initials, score, mode, date } = req.body;
  if (!initials || score == null) return res.status(400).json({ error: "Faltan campos." });

  const settings = normalizeSettings(req.body);
  const entry = {
    initials: String(initials).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3).padEnd(1, "?"),
    score:    Number(score),
    mode:     mode || "1P",
    settings,
    mapSize:   settings.mapSize,
    foodCount: settings.foodCount,
    wallMode:  settings.wallMode,
    date:     date || new Date().toISOString()
  };

  fs.mkdirSync(path.dirname(SCORES_FILE), { recursive: true });
  fs.appendFileSync(SCORES_FILE, JSON.stringify(entry) + "\n", "utf8");
  res.status(201).json(entry);
});

// ─── DELETE /api/scores ───────────────────────────────────────────────────
app.delete("/api/scores", (_, res) => {
  writeScores([]);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`🐍 Snake corriendo en http://localhost:${PORT}`));
