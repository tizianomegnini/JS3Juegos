/**
 * server.js
 * Servidor Express para el proyecto Snake.
 * Sirve archivos estáticos. Los puntajes se guardan en localStorage del cliente.
 */

import express from "express";
import path    from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Archivos estáticos ────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname)));

// ─── Rutas de páginas ──────────────────────────────────────────────────────
app.get("/",        (_, res) => res.sendFile(path.join(__dirname, "pages", "index.html")));
app.get("/game",    (_, res) => res.sendFile(path.join(__dirname, "pages", "game.html")));
app.get("/ranking", (_, res) => res.sendFile(path.join(__dirname, "pages", "ranking.html")));

// ─── 404 ───────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).send("Página no encontrada."));

app.listen(PORT, () => console.log(`🐍 Snake corriendo en http://localhost:${PORT}`));
