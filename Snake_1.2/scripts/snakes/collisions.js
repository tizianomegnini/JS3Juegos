/**
 * collisions.js
 * Detección de colisiones.
 */

export function snakeVsSnake(snakeA, snakeB) {
  const head = snakeA.getHead();
  return snakeB.body.some(s => s.x === head.x && s.y === head.y);
}

/**
 * Verifica si la serpiente comió algún pez.
 * @param {import("./snake.js").Snake} snake
 * @param {import("./food.js").Food} food
 * @returns {import("./food.js").FoodItem|null}  el pez comido, o null
 */
export function snakeEatsFood(snake, food) {
  return food.getEaten(snake.getHead());
}

export function checkSelfCollision(snake) {
  if (snake.isOutOfBounds()) return "wall";
  if (snake.selfCollision()) return "self";
  return null;
}
