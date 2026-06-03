/**
 * snake.js
 * Entidad Serpiente. Soporta modo "wall" (muerte) y "wrap" (atravesar).
 */

import { COLS, ROWS, CELL_SIZE } from "./board.js";

export class Snake {
  constructor({ startX, startY, direction, color, headColor, eyeColor }) {
    this.body      = [{ x: startX, y: startY }];
    this.prevBody  = [{ x: startX, y: startY }];
    this.direction = direction;
    this.nextDir   = direction;
    this.color     = color;
    this.headColor = headColor;
    this.eyeColor  = eyeColor;
    this.alive     = true;
    this.grew      = false;
    /** "wall" = morir al tocar borde | "wrap" = aparecer del otro lado */
    this.wallMode  = "wall";
  }

  setDirection(dir) {
    const opposites = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (opposites[this.direction] !== dir) this.nextDir = dir;
  }

  move() {
    this.prevBody  = this.body.map(s => ({ ...s }));
    this.direction = this.nextDir;
    const head     = this.body[0];
    const newHead  = { ...head };

    if (this.direction === "UP")    newHead.y -= 1;
    if (this.direction === "DOWN")  newHead.y += 1;
    if (this.direction === "LEFT")  newHead.x -= 1;
    if (this.direction === "RIGHT") newHead.x += 1;

    // Wrap-around
    if (this.wallMode === "wrap") {
      newHead.x = ((newHead.x % COLS) + COLS) % COLS;
      newHead.y = ((newHead.y % ROWS) + ROWS) % ROWS;
    }

    this.body.unshift(newHead);
    if (!this.grew) this.body.pop();
    else this.grew = false;

    return newHead;
  }

  grow() { this.grew = true; }

  getHead() { return this.body[0]; }

  /** Solo aplica en modo "wall" */
  isOutOfBounds() {
    if (this.wallMode === "wrap") return false;
    const { x, y } = this.getHead();
    return x < 0 || x >= COLS || y < 0 || y >= ROWS;
  }

  selfCollision() {
    const head = this.getHead();
    return this.body.slice(1).some(s => s.x === head.x && s.y === head.y);
  }

  // draw() heredado del renderer, no se usa acá
}
