/**
 * snake.js
 * Módulo que define la entidad Serpiente.
 * Maneja el estado, movimiento y crecimiento de cada serpiente.
 */

import { COLS, ROWS, CELL_SIZE } from "./board.js";

/**
 * Clase Snake — representa una serpiente con su posición, dirección y color.
 */
export class Snake {
  /**
   * @param {Object} config
   * @param {number}   config.startX    - Columna inicial
   * @param {number}   config.startY    - Fila inicial
   * @param {string}   config.direction - Dirección inicial: "RIGHT"|"LEFT"|"UP"|"DOWN"
   * @param {string}   config.color     - Color del cuerpo
   * @param {string}   config.headColor - Color de la cabeza
   * @param {string}   config.eyeColor  - Color de los ojos
   */
  constructor({ startX, startY, direction, color, headColor, eyeColor }) {
    this.body      = [{ x: startX, y: startY }];
    this.prevBody  = [{ x: startX, y: startY }];
    this.direction = direction;
    this.nextDir   = direction;
    this.color     = color;
    this.headColor = headColor;
    this.eyeColor  = eyeColor;
    this.alive     = true;
    this.grew      = false; // Flag: evitar que se elimine la cola al crecer
  }

  /**
   * Solicita un cambio de dirección.
   * Ignora la dirección opuesta para evitar suicidio inmediato.
   * @param {string} dir - Nueva dirección
   */
  setDirection(dir) {
    const opposites = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (opposites[this.direction] !== dir) {
      this.nextDir = dir;
    }
  }

  /**
   * Avanza la serpiente una celda en la dirección actual.
   * @returns {{ x: number, y: number }} - Nueva posición de la cabeza
   */
  move() {
    this.prevBody = this.body.map(seg => ({ ...seg }));
    this.direction = this.nextDir;
    const head = this.body[0];

    const newHead = { ...head };
    if (this.direction === "UP")    newHead.y -= 1;
    if (this.direction === "DOWN")  newHead.y += 1;
    if (this.direction === "LEFT")  newHead.x -= 1;
    if (this.direction === "RIGHT") newHead.x += 1;

    this.body.unshift(newHead);

    // Si no creció, eliminar la cola
    if (!this.grew) {
      this.body.pop();
    } else {
      this.grew = false;
    }

    return newHead;
  }

  /** Hace que la serpiente crezca en el próximo movimiento */
  grow() {
    this.grew = true;
  }

  /**
   * Retorna la cabeza de la serpiente.
   * @returns {{ x: number, y: number }}
   */
  getHead() {
    return this.body[0];
  }

  /**
   * Verifica si la cabeza colisionó con el borde del tablero.
   * @returns {boolean}
   */
  isOutOfBounds() {
    const { x, y } = this.getHead();
    return x < 0 || x >= COLS || y < 0 || y >= ROWS;
  }

  /**
   * Verifica si la cabeza colisionó consigo misma.
   * @returns {boolean}
   */
  selfCollision() {
    const head = this.getHead();
    return this.body.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
  }

  /**
   * Dibuja la serpiente en el canvas.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    this.body.forEach((seg, index) => {
      const px = seg.x * CELL_SIZE;
      const py = seg.y * CELL_SIZE;
      const cs = CELL_SIZE;

      if (index === 0) {
        // Cabeza estilo gato
        ctx.fillStyle = this.headColor;
        ctx.beginPath();
        ctx.roundRect(px + 1, py + 4, cs - 2, cs - 5, 6);
        ctx.fill();

        // Orejas
        const earSize = 5;
        ctx.beginPath();
        ctx.moveTo(px + 4, py + 4);
        ctx.lineTo(px + 4 + earSize, py + 4);
        ctx.lineTo(px + 4, py + 4 + earSize);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px + cs - 4, py + 4);
        ctx.lineTo(px + cs - 4 - earSize, py + 4);
        ctx.lineTo(px + cs - 4, py + 4 + earSize);
        ctx.closePath();
        ctx.fill();

        // Ojos y detalles de gato
        this._drawEyes(ctx, seg, cs);
        this._drawCatFace(ctx, seg, cs);
      } else {
        // Cuerpo con degradado de opacidad
        const opacity = Math.max(0.4, 1 - (index / this.body.length) * 0.5);
        ctx.globalAlpha = opacity;
        ctx.fillStyle   = this.color;
        ctx.beginPath();
        ctx.roundRect(px + 2, py + 2, cs - 4, cs - 4, 3);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }

  /**
   * Dibuja los ojos de la serpiente según su dirección.
   * @param {CanvasRenderingContext2D} ctx
   * @param {{ x: number, y: number }} head
   * @param {number} cs - Tamaño de celda
   * @private
   */
  _drawEyes(ctx, head, cs) {
    ctx.fillStyle = this.eyeColor;
    const px = head.x * cs;
    const py = head.y * cs;
    const r  = 2.5;

    let e1, e2;
    switch (this.direction) {
      case "RIGHT": e1 = [px+cs-6, py+4];    e2 = [px+cs-6, py+cs-7]; break;
      case "LEFT":  e1 = [px+5,    py+4];    e2 = [px+5,    py+cs-7]; break;
      case "UP":    e1 = [px+4,    py+5];    e2 = [px+cs-7, py+5];    break;
      case "DOWN":  e1 = [px+4,    py+cs-6]; e2 = [px+cs-7, py+cs-6]; break;
      default:      e1 = [px+cs-6, py+4];    e2 = [px+cs-6, py+cs-7];
    }

    ctx.beginPath(); ctx.arc(...e1, r, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(...e2, r, 0, Math.PI * 2); ctx.fill();
  }

  /**
   * Dibuja la nariz y los bigotes del gato.
   * @param {CanvasRenderingContext2D} ctx
   * @param {{ x: number, y: number }} head
   * @param {number} cs - Tamaño de celda
   * @private
   */
  _drawCatFace(ctx, head, cs) {
    const px = head.x * cs;
    const py = head.y * cs;
    const noseX = px + cs / 2;
    const noseY = py + cs / 2 + 1;

    // Nariz
    ctx.fillStyle = "#ff9da4";
    ctx.beginPath();
    ctx.moveTo(noseX, noseY);
    ctx.lineTo(noseX - 2.5, noseY + 3);
    ctx.lineTo(noseX + 2.5, noseY + 3);
    ctx.closePath();
    ctx.fill();

    // Bigotes
    ctx.strokeStyle = this.eyeColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(noseX - 3, noseY + 4);
    ctx.lineTo(noseX - 8, noseY + 3);
    ctx.moveTo(noseX - 3, noseY + 5);
    ctx.lineTo(noseX - 8, noseY + 6);
    ctx.moveTo(noseX + 3, noseY + 4);
    ctx.lineTo(noseX + 8, noseY + 3);
    ctx.moveTo(noseX + 3, noseY + 5);
    ctx.lineTo(noseX + 8, noseY + 6);
    ctx.stroke();

    ctx.lineWidth = 1;
  }
}