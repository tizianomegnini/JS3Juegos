/**
 * collisions.js
 * Módulo de detección de colisiones para el juego Snake.
 * Separa la lógica de colisiones del bucle principal.
 */

/**
 * Verifica si una serpiente colisionó con otra serpiente (cuerpo completo).
 * @param {import("./snake.js").Snake} snakeA - Serpiente que se mueve
 * @param {import("./snake.js").Snake} snakeB - Otra serpiente
 * @returns {boolean}
 */
export function snakeVsSnake(snakeA, snakeB) {
  const head = snakeA.getHead();
  return snakeB.body.some(seg => seg.x === head.x && seg.y === head.y);
}

/**
 * Verifica si la cabeza de la serpiente está en la posición de la comida.
 * @param {import("./snake.js").Snake} snake
 * @param {import("./food.js").Food} food
 * @returns {boolean}
 */
export function snakeEatsFood(snake, food) {
  const head = snake.getHead();
  return head.x === food.position.x && head.y === food.position.y;
}

/**
 * Verifica colisión de una serpiente consigo misma o con los bordes.
 * @param {import("./snake.js").Snake} snake
 * @returns {"wall"|"self"|null}
 */
export function checkSelfCollision(snake) {
  if (snake.isOutOfBounds())   return "wall";
  if (snake.selfCollision())   return "self";
  return null;
}