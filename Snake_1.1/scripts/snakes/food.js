/**
 * food.js
 * Gestiona una o varias frutas simultáneas en el tablero.
 */

import { COLS, ROWS, CELL_SIZE } from "./board.js";

const FOOD_TYPES = [
  { emoji: "🍎", value: 1, chance: 0.55 },
  { emoji: "🍊", value: 1, chance: 0.20 },
  { emoji: "", value: 1, chance: 0.15 },
  { emoji: "🎺", value: 1, chance: 0.10 }
];

const FOOD_IMAGE = new Image();
FOOD_IMAGE.src = "./assets/pez.gif";

/** Una sola pieza de comida */
class FoodItem {
  constructor(occupied) {
    this.position = this._spawn(occupied);
    this.type     = this._pickType();
  }

  respawn(occupied) {
    this.position = this._spawn(occupied);
    this.type     = this._pickType();
  }

  _pickType() {
    const r = Math.random();
    let acc = 0;
    for (const t of FOOD_TYPES) { acc += t.chance; if (r < acc) return t; }
    return FOOD_TYPES[0];
  }

  _spawn(occupied) {
    let pos, attempts = 0;
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      attempts++;
    } while (occupied.some(o => o.x === pos.x && o.y === pos.y) && attempts < 400);

    if (attempts >= 400) {
      for (let x = 0; x < COLS; x++)
        for (let y = 0; y < ROWS; y++)
          if (!occupied.some(o => o.x === x && o.y === y)) return { x, y };
    }
    return pos;
  }

  draw(ctx) {
    const px = this.position.x * CELL_SIZE;
    const py = this.position.y * CELL_SIZE;
    ctx.fillStyle = "rgba(255, 220, 80, 0.18)";
    ctx.beginPath();
    ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(FOOD_IMAGE, px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
  }
}

/**
 * Contenedor de múltiples frutas.
 * count = cantidad de frutas simultáneas.
 */
export class Food {
  /**
   * @param {Array<{x,y}>} occupied
   * @param {number} count  - Cantidad de frutas (1, 3 o 5)
   */
  constructor(occupied, count = 1) {
    this.count = count;
    this.items = [];
    this._init(occupied);
  }

  _init(occupied) {
    this.items = [];
    const used = [...occupied];
    for (let i = 0; i < this.count; i++) {
      const item = new FoodItem(used);
      this.items.push(item);
      used.push(item.position); // evitar que dos frutas caigan en el mismo lugar
    }
  }

  /**
   * Verifica si la posición dada corresponde a alguna fruta.
   * @param {{x,y}} pos
   * @returns {FoodItem|null}
   */
  getEaten(pos) {
    return this.items.find(f => f.position.x === pos.x && f.position.y === pos.y) || null;
  }

  /**
   * Regenera una fruta específica.
   * @param {FoodItem} item
   * @param {Array<{x,y}>} occupied
   */
  respawnItem(item, occupied) {
    // evitar que caiga sobre otras frutas
    const allFood = this.items.filter(f => f !== item).map(f => f.position);
    item.respawn([...occupied, ...allFood]);
  }

  /** Dibuja todas las frutas */
  draw(ctx) {
    for (const item of this.items) item.draw(ctx);
  }

  /** Expone la posición de la primer fruta (retrocompat con renderer) */
  get position() { return this.items[0]?.position || { x: 0, y: 0 }; }
}
