/**
 * storage.js
 * Módulo de acceso a la API REST del servidor.
 * Abstrae todos los fetch hacia /api/players y /api/scores.
 */

const BASE = "";

// ─── Jugadores ─────────────────────────────────────────────────────────────

/**
 * Obtiene todos los jugadores registrados.
 * @returns {Promise<Array>}
 */
export async function fetchPlayers() {
  const res = await fetch(`${BASE}/api/players`);
  if (!res.ok) throw new Error("Error al cargar jugadores");
  return res.json();
}

/**
 * Crea un nuevo jugador.
 * @param {string} name
 * @returns {Promise<Object>}
 */
export async function createPlayer(name) {
  const res = await fetch(`${BASE}/api/players`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ name })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al crear jugador");
  return data;
}

/**
 * Actualiza el nombre de un jugador existente.
 * @param {string} id
 * @param {string} name
 * @returns {Promise<Object>}
 */
export async function updatePlayer(id, name) {
  const res = await fetch(`${BASE}/api/players/${id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ name })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar jugador");
  return data;
}

/**
 * Elimina un jugador y todos sus puntajes.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deletePlayer(id) {
  const res = await fetch(`${BASE}/api/players/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al eliminar jugador");
  return data;
}

// ─── Puntajes ──────────────────────────────────────────────────────────────

/**
 * Obtiene todos los puntajes enriquecidos con el nombre del jugador.
 * @returns {Promise<Array>}
 */
export async function fetchScores() {
  const res = await fetch(`${BASE}/api/scores`);
  if (!res.ok) throw new Error("Error al cargar puntajes");
  return res.json();
}

/**
 * Guarda un puntaje nuevo al finalizar una partida.
 * @param {Object} scoreData - { playerId?, playerName, score, mode }
 * @returns {Promise<Object>}
 */
export async function saveScore(scoreData) {
  const res = await fetch(`${BASE}/api/scores`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(scoreData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al guardar puntaje");
  return data;
}

/**
 * Elimina un puntaje por su ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deleteScore(id) {
  const res = await fetch(`${BASE}/api/scores/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al eliminar puntaje");
  return data;
}