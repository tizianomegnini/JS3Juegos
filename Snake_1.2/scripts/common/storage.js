/**
 * storage.js
 * Scores guardados en el servidor via API REST.
 * El servidor los persiste en data/scores.txt (NDJSON).
 */

/**
 * Guarda un score.
 * @param {{ initials:string, score:number, mode:string, settings?:object }} entry
 */
export async function saveScore({ initials, score, mode, settings }) {
  const clean = initials.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3).padEnd(1, "?");
  const cleanSettings = {
    mapSize:   settings?.mapSize || "medium",
    foodCount: Number(settings?.foodCount) || 1,
    wallMode:  settings?.wallMode || "wall"
  };
  const entry = {
    initials: clean,
    score,
    mode,
    settings: cleanSettings,
    mapSize: cleanSettings.mapSize,
    foodCount: cleanSettings.foodCount,
    wallMode: cleanSettings.wallMode,
    date: new Date().toISOString()
  };
  try {
    await fetch("/api/scores", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(entry)
    });
  } catch (err) {
    console.error("Error guardando score:", err);
  }
  return entry;
}

/**
 * Devuelve el top N de scores, opcionalmente filtrado por modo.
 * @param {number} limit
 * @param {string|null} mode
 */
export async function getTopScores(limit = 10, mode = null) {
  try {
    const res = await fetch("/api/scores");
    if (!res.ok) return [];
    let scores = await res.json();
    if (mode) scores = scores.filter(s => s.mode === mode);
    return scores.sort((a, b) => b.score - a.score).slice(0, limit);
  } catch {
    return [];
  }
}

/** Borra todos los scores del servidor. */
export async function clearScores() {
  try {
    await fetch("/api/scores", { method: "DELETE" });
  } catch (err) {
    console.error("Error limpiando scores:", err);
  }
}
