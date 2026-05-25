/**
 * storage.js
 * Módulo de acceso a localStorage.
 * Guarda entradas con { initials: "AAA", score: 999, mode: "1P", date: "ISO" }.
 */

const STORAGE_KEY = "snake-scores";
const MAX_ENTRIES = 100;

/**
 * Lee todas las entradas guardadas.
 * @returns {Array<{initials:string, score:number, mode:string, date:string}>}
 */
export function getScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Guarda una nueva entrada de puntaje.
 * @param {Object} entry
 * @param {string} entry.initials  - Exactamente 3 letras mayúsculas
 * @param {number} entry.score
 * @param {string} [entry.mode]    - "1P" | "2P"
 * @returns {{ initials:string, score:number, mode:string, date:string }}
 */
export function saveScore({ initials, score, mode = "1P" }) {
  const clean = initials.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3).padEnd(3, "A");
  const entry = { initials: clean, score, mode, date: new Date().toISOString() };

  const all = getScores();
  all.push(entry);
  // Mantener solo los últimos MAX_ENTRIES, ordenados por puntaje desc
  all.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, MAX_ENTRIES)));

  return entry;
}

/**
 * Devuelve el top N de puntajes, opcionalmente filtrado por modo.
 * @param {number} [limit=20]
 * @param {string|null} [mode]
 * @returns {Array}
 */
export function getTopScores(limit = 20, mode = null) {
  let scores = getScores();
  if (mode) scores = scores.filter(s => s.mode === mode);
  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Borra todas las entradas del ranking.
 */
export function clearScores() {
  localStorage.removeItem(STORAGE_KEY);
}
