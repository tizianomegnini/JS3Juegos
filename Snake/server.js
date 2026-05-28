/**
 * server.js
 * Servidor Express para Snake.
 */

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const SCORE_FILE = path.join(__dirname, "data", "scores.txt");

// ─── Middlewares ───────────────────────────────────────────────────────────

app.use(express.json());

app.use(express.static(path.join(__dirname)));

// ─── Páginas ───────────────────────────────────────────────────────────────

app.get("/", (_, res) =>
  res.sendFile(path.join(__dirname, "pages", "index.html"))
);

app.get("/game", (_, res) =>
  res.sendFile(path.join(__dirname, "pages", "game.html"))
);

app.get("/ranking", (_, res) =>
  res.sendFile(path.join(__dirname, "pages", "ranking.html"))
);

// ─── API Scores ────────────────────────────────────────────────────────────

/**
 * Obtener todos los scores
 */
app.get("/api/scores", (_, res) => {
  fs.readFile(SCORE_FILE, "utf8", (err, data) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        error: "Error leyendo scores"
      });
    }

    try {
      const scores = data
        .split("\n")
        .filter(Boolean)
        .map(line => JSON.parse(line));

      res.json(scores);
    } catch (e) {
      console.error(e);

      res.status(500).json({
        error: "Archivo corrupto"
      });
    }
  });
});

/**
 * Guardar nuevo score
 */
app.post("/api/scores", (req, res) => {
  const entry = req.body;

  if (!entry.initials || entry.score == null) {
    return res.status(400).json({
      error: "Datos inválidos"
    });
  }

  const line = JSON.stringify(entry) + "\n";

  fs.appendFile(SCORE_FILE, line, err => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        error: "Error guardando score"
      });
    }

    res.json({
      success: true
    });
  });
});

/**
 * Limpiar ranking
 */
app.delete("/api/scores", (_, res) => {
  fs.writeFile(SCORE_FILE, "", err => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        error: "Error limpiando scores"
      });
    }

    res.json({
      success: true
    });
  });
});

// ─── 404 ───────────────────────────────────────────────────────────────────

app.use((_, res) => {
  res.status(404).send("Página no encontrada.");
});

// ─── Start ─────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🐍 Snake corriendo en http://localhost:${PORT}`);
});