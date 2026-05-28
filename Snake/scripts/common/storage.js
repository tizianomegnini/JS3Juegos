/**
 * storage.js
 * Manejo de scores vía servidor.
 */

/**
 * Obtiene todos los scores.
 * @returns {Promise<Array>}
 */
export async function getScores() {
  try {
    const res = await fetch("/api/scores");

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Error obteniendo scores:", err);
    return [];
  }
}

/**
 * Guarda un score nuevo.
 * @param {Object} entry
 * @param {string} entry.initials
 * @param {number} entry.score
 * @param {string} [entry.mode]
 * @returns {Promise<Object>}
 */
export async function saveScore({
  initials,
  score,
  mode = "1P"
}) {
  const clean = initials
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3)
    .padEnd(3, "A");

  const entry = {
    initials: clean,
    score,
    mode,
    date: new Date().toISOString()
  };

  try {
    await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    });

    return entry;
  } catch (err) {
    console.error("Error guardando score:", err);
    return null;
  }
}

/**
 * Devuelve el top N de scores.
 * @param {number} [limit=20]
 * @param {string|null} [mode=null]
 * @returns {Promise<Array>}
 */
export async function getTopScores(
  limit = 20,
  mode = null
) {
  let scores = await getScores();

  if (mode) {
    scores = scores.filter(s => s.mode === mode);
  }

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Borra todos los scores.
 * @returns {Promise<void>}
 */
export async function clearScores() {
  try {
    await fetch("/api/scores", {
      method: "DELETE"
    });
  } catch (err) {
    console.error("Error limpiando scores:", err);
  }
}