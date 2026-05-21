/**
 * multiplayer.js
 * Módulo de gestión del estado para el modo 2 jugadores.
 * Coordina las dos serpientes, detecta ganador y maneja empates.
 */

/**
 * Determina el ganador de una partida 2P.
 * @param {boolean} alive1 - Si el jugador 1 sigue vivo
 * @param {boolean} alive2 - Si el jugador 2 sigue vivo
 * @param {number}  score1 - Puntaje del jugador 1
 * @param {number}  score2 - Puntaje del jugador 2
 * @returns {{ winner: 1|2|"tie", message: string }}
 */
export function determineWinner(alive1, alive2, score1, score2) {
  if (!alive1 && !alive2) {
    if (score1 > score2) return { winner: 1, message: "¡Jugador 1 gana por puntaje!" };
    if (score2 > score1) return { winner: 2, message: "¡Jugador 2 gana por puntaje!" };
    return { winner: "tie", message: "¡Empate! Ambos colisionaron al mismo tiempo." };
  }
  if (!alive1) return { winner: 2, message: "¡Jugador 2 gana! El J1 colisionó." };
  if (!alive2) return { winner: 1, message: "¡Jugador 1 gana! El J2 colisionó." };
  return { winner: "tie", message: "Juego en progreso." };
}

/**
 * Obtiene todos los segmentos del cuerpo de ambas serpientes
 * para calcular posiciones libres (para la comida).
 * @param {import("./snake.js").Snake} snake1
 * @param {import("./snake.js").Snake|null} snake2
 * @returns {Array<{x: number, y: number}>}
 */
export function getAllOccupied(snake1, snake2) {
  const cells = [...snake1.body];
  if (snake2) cells.push(...snake2.body);
  return cells;
}