/**
 * multiplayer.js
 * Lógica 2P.
 * - Si solo uno muere → gana el sobreviviente.
 * - Si los dos mueren al mismo tick → desempata por puntaje.
 * - Si misma situación y mismo puntaje → empate.
 */

export function determineWinner(alive1, alive2, score1, score2) {
  // Un solo sobreviviente
  if (alive1 && !alive2) return { winner: 1, message: "¡Jugador 1 gana!" };
  if (alive2 && !alive1) return { winner: 2, message: "¡Jugador 2 gana!" };

  // Ambos cayeron al mismo tiempo → desempatar por puntaje
  if (score1 > score2) return { winner: 1, message: "¡Jugador 1 gana por puntaje!" };
  if (score2 > score1) return { winner: 2, message: "¡Jugador 2 gana por puntaje!" };
  return { winner: "tie", message: "¡Empate!" };
}

export function getAllOccupied(snake1, snake2) {
  const cells = [...snake1.body];
  if (snake2) cells.push(...snake2.body);
  return cells;
}
