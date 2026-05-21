/**
 * food.js
 * Módulo para la comida del juego Snake.
 * Gestiona la posición y el renderizado de la comida.
 */

import { COLS, ROWS, CELL_SIZE } from "./board.js";

/** Tipos de comida con su valor y emoji */
const FOOD_TYPES = [
  { emoji: "🍎", value: 1,  chance: 0.65 },
  { emoji: "🍊", value: 2,  chance: 0.20 },
  { emoji: "🍇", value: 3,  chance: 0.10 },
  { emoji: "⭐", value: 5,  chance: 0.05 }
];

/**
 * Clase Food — representa una pieza de comida en el tablero.
 */
export class Food {
  /**
   * @param {Array<{ x: number, y: number }>} occupiedCells - Celdas ya ocupadas (por serpientes)
   */
  constructor(occupiedCells = []) {
    this.position = this._spawn(occupiedCells);
    this.type     = this._pickType();
  }

  /**
   * Regenera la comida en una posición libre.
   * @param {Array<{ x: number, y: number }>} occupiedCells
   */
  respawn(occupiedCells) {
    this.position = this._spawn(occupiedCells);
    this.type     = this._pickType();
  }

  /**
   * Selecciona un tipo de comida basado en probabilidades.
   * @returns {Object}
   * @private
   */
  _pickType() {
    const rand = Math.random();
    let   acc  = 0;
    for (const t of FOOD_TYPES) {
      acc += t.chance;
      if (rand < acc) return t;
    }
    return FOOD_TYPES[0];
  }

  /**
   * Elige una posición aleatoria que no esté ocupada.
   * @param {Array<{ x: number, y: number }>} occupied
   * @returns {{ x: number, y: number }}
   * @private
   */
  _spawn(occupied) {
    let pos;
    let attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      };
      attempts++;
    } while (
      occupied.some(o => o.x === pos.x && o.y === pos.y) && attempts < 200
    );
    return pos;
  }

  /**
   * Dibuja la comida en el canvas.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    const px = this.position.x * CELL_SIZE;
    const py = this.position.y * CELL_SIZE;
    const cs = CELL_SIZE;

    ctx.font      = `${cs - 2}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.type.emoji, px + cs / 2, py + cs / 2);
  }
}