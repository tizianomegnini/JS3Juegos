/**
 * renderer.js
 * Módulo de renderizado — gatos con paleta dinámica por jugador.
 */

import { CELL_SIZE, clearBoard, drawGrid, drawBorder } from "./board.js";

let _tick = 0;

function getBoardColors() {
  const dark = document.documentElement.dataset.theme === "dark";
  return {
    bg:     dark ? "#0d1f0d" : "#e8f5e8",
    grid:   dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
    border: dark ? "rgba(77, 201, 77, 0.6)" : "rgba(0, 100, 0, 0.5)"
  };
}

const CAT_BASE = {
  nose:    "#e88a94",
  pupil:   "#111111",
  whisker: "#888888",
};

function buildPalette(snake) {
  return {
    ...CAT_BASE,
    bodyLight: snake.color,
    bodyDark:  darken(snake.color, 0.35),
    head:      snake.headColor,
    ears:      snake.headColor,
    earInner:  lighten(snake.eyeColor, 0.45),
    eye:       snake.eyeColor,
    paw:       lighten(snake.color, 0.1),
    pawDark:   darken(snake.color, 0.2),
  };
}

export function renderFrame(ctx, { snake1, snake2, food }, progress = 1) {
  _tick++;
  const { bg, grid, border } = getBoardColors();
  clearBoard(ctx, bg);
  drawGrid(ctx, grid);
  drawBorder(ctx, border);
  drawFood(ctx, food);
  drawSnake(ctx, snake1, _tick, progress);
  if (snake2 && snake2.alive) drawSnake(ctx, snake2, _tick, progress);
}

function interpolateCell(prev, current, progress) {
  return {
    x: prev.x + (current.x - prev.x) * progress,
    y: prev.y + (current.y - prev.y) * progress
  };
}

const FOOD_IMAGE = new Image();
FOOD_IMAGE.src = "./assets/food.png";

function drawFood(ctx, food) {
  const { x, y } = food.position;
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;
  ctx.fillStyle = "rgba(255, 220, 80, 0.18)";
  ctx.beginPath();
  ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.drawImage(FOOD_IMAGE, px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
}

function drawSnake(ctx, snake, tick, progress) {
  if (!snake || !snake.body.length) return;
  const palette = buildPalette(snake);
  for (let i = snake.body.length - 1; i >= 1; i--) {
    const current = snake.body[i];
    const previous = (snake.prevBody && snake.prevBody[i]) ? snake.prevBody[i] : current;
    const isTail = i === snake.body.length - 1;
    const tailDir = isTail ? getTailDirection(snake.body[i - 1], current) : null;
    drawBodySegment(ctx, current, previous, i, snake.body.length, palette, progress, isTail, tailDir);
  }
  drawCatHead(ctx, snake, tick, progress, palette);
}

function getTailDirection(nextSeg, tailSeg) {
  if (!nextSeg || !tailSeg) return null;
  if (tailSeg.x > nextSeg.x) return "RIGHT";
  if (tailSeg.x < nextSeg.x) return "LEFT";
  if (tailSeg.y > nextSeg.y) return "DOWN";
  if (tailSeg.y < nextSeg.y) return "UP";
  return null;
}

function drawBodySegment(ctx, cell, prevCell, index, total, palette, progress, isTail, tailDir) {
  const position = interpolateCell(prevCell, cell, progress);
  const px   = position.x * CELL_SIZE + 1;
  const py   = position.y * CELL_SIZE + 1;
  const size = CELL_SIZE - 2;
  const t     = index / total;
  const light = hexToRgb(palette.bodyLight);
  const dark  = hexToRgb(palette.bodyDark);
  const r = Math.round(light.r + (dark.r - light.r) * t);
  const g = Math.round(light.g + (dark.g - light.g) * t);
  const b = Math.round(light.b + (dark.b - light.b) * t);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  roundRect(ctx, px, py, size, size, 4);
  ctx.fill();

  if (isTail && tailDir) {
    drawCatTail(ctx, px, py, size, tailDir, palette);
  }

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#555";
  ctx.lineWidth   = 1;
  for (let s = 0; s < 3; s++) {
    const ox = 3 + s * 5;
    ctx.beginPath();
    ctx.moveTo(px + ox,     py + 2);
    ctx.lineTo(px + ox - 3, py + size - 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCatTail(ctx, px, py, size, dir, palette) {
  const centerX = px + size / 2;
  const centerY = py + size / 2;
  ctx.save();
  ctx.fillStyle = palette.bodyLight;
  ctx.strokeStyle = palette.bodyDark;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  if (dir === "RIGHT") {
    ctx.moveTo(px + size - 2, centerY);
    ctx.lineTo(px + size + 8, centerY - 6);
    ctx.lineTo(px + size + 8, centerY + 6);
  } else if (dir === "LEFT") {
    ctx.moveTo(px + 2, centerY);
    ctx.lineTo(px - 8, centerY - 6);
    ctx.lineTo(px - 8, centerY + 6);
  } else if (dir === "UP") {
    ctx.moveTo(centerX, py + 2);
    ctx.lineTo(centerX - 6, py - 8);
    ctx.lineTo(centerX + 6, py - 8);
  } else if (dir === "DOWN") {
    ctx.moveTo(centerX, py + size - 2);
    ctx.lineTo(centerX - 6, py + size + 8);
    ctx.lineTo(centerX + 6, py + size + 8);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = palette.bodyDark;
  ctx.beginPath();
  if (dir === "RIGHT") {
    ctx.moveTo(px + size + 7, centerY - 2);
    ctx.lineTo(px + size + 10, centerY);
    ctx.lineTo(px + size + 7, centerY + 2);
  } else if (dir === "LEFT") {
    ctx.moveTo(px - 7, centerY - 2);
    ctx.lineTo(px - 10, centerY);
    ctx.lineTo(px - 7, centerY + 2);
  } else if (dir === "UP") {
    ctx.moveTo(centerX - 2, py - 7);
    ctx.lineTo(centerX, py - 10);
    ctx.lineTo(centerX + 2, py - 7);
  } else if (dir === "DOWN") {
    ctx.moveTo(centerX - 2, py + size + 7);
    ctx.lineTo(centerX, py + size + 10);
    ctx.lineTo(centerX + 2, py + size + 7);
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawCatHead(ctx, snake, tick, progress, palette) {
  const currentHead = snake.body[0];
  const prevHead = (snake.prevBody && snake.prevBody[0]) ? snake.prevBody[0] : currentHead;
  const head = interpolateCell(prevHead, currentHead, progress);
  const dir  = snake.direction;
  const cx   = head.x * CELL_SIZE + CELL_SIZE / 2;
  const cy   = head.y * CELL_SIZE + CELL_SIZE / 2;
  const hw   = CELL_SIZE * 0.75;

  ctx.save();
  ctx.translate(cx, cy);
  rotateForDir(ctx, dir);

  drawEar(ctx, -hw * 0.55, -hw * 0.7, 4, 6, palette);
  drawEar(ctx,  hw * 0.55, -hw * 0.7, 4, 6, palette);

  ctx.fillStyle = palette.head;
  ctx.beginPath();
  ctx.arc(0, 0, hw * 0.72, 0, Math.PI * 2);
  ctx.fill();

  const grad = ctx.createLinearGradient(0, -hw * 0.5, 0, hw * 0.5);
  grad.addColorStop(0, "rgba(255,255,255,0.12)");
  grad.addColorStop(1, "rgba(0,0,0,0.12)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, hw * 0.72, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#444";
  ctx.lineWidth   = 0.8;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 3,     -hw * 0.65);
    ctx.lineTo(i * 3 - 1,  hw * 0.3);
    ctx.stroke();
  }
  ctx.restore();

  drawCatEyes(ctx, hw, palette);

  ctx.fillStyle = palette.nose;
  ctx.beginPath();
  ctx.moveTo(0,  hw * 0.15);
  ctx.lineTo(-3, hw * 0.28);
  ctx.lineTo( 3, hw * 0.28);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.strokeStyle = palette.whisker;
  ctx.lineWidth   = 0.8;
  ctx.globalAlpha = 0.7;
  drawWhisker(ctx, -3, hw * 0.22, -hw * 0.9,  hw * 0.1);
  drawWhisker(ctx, -3, hw * 0.26, -hw * 0.9,  hw * 0.3);
  drawWhisker(ctx,  3, hw * 0.22,  hw * 0.9,  hw * 0.1);
  drawWhisker(ctx,  3, hw * 0.26,  hw * 0.9,  hw * 0.3);
  ctx.restore();

  ctx.restore();

  drawPaws(ctx, head, dir, tick, palette);
}

function drawEar(ctx, x, y, w, h, palette) {
  ctx.fillStyle = palette.ears;
  ctx.beginPath();
  ctx.moveTo(x - w, y + h);
  ctx.lineTo(x,     y - h * 0.3);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = palette.earInner;
  ctx.beginPath();
  ctx.moveTo(x - w * 0.55, y + h * 0.7);
  ctx.lineTo(x,             y + h * 0.05);
  ctx.lineTo(x + w * 0.55,  y + h * 0.7);
  ctx.closePath();
  ctx.fill();
}

function drawCatEyes(ctx, hw, palette) {
  const ex = hw * 0.32;
  const ey = -hw * 0.12;
  [[-ex, ey], [ex, ey]].forEach(([ox, oy]) => {
    ctx.fillStyle = palette.eye;
    ctx.beginPath();
    ctx.ellipse(ox, oy, hw * 0.18, hw * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.pupil;
    ctx.beginPath();
    ctx.ellipse(ox, oy, hw * 0.07, hw * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.ellipse(ox - hw * 0.05, oy - hw * 0.08, hw * 0.04, hw * 0.07, 0.4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawWhisker(ctx, x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

const PAW_MIN  = 2.2;
const PAW_MAX  = 4.2;
const PAW_FREQ = 0.28;

function drawPaws(ctx, head, dir, tick, palette) {
  const cx   = head.x * CELL_SIZE + CELL_SIZE / 2;
  const cy   = head.y * CELL_SIZE + CELL_SIZE / 2;
  const dist = CELL_SIZE * 0.62;
  let lx, ly, rx, ry;
  switch (dir) {
    case "RIGHT": lx = cx;        ly = cy - dist; rx = cx;        ry = cy + dist; break;
    case "LEFT":  lx = cx;        ly = cy + dist; rx = cx;        ry = cy - dist; break;
    case "UP":    lx = cx - dist; ly = cy;        rx = cx + dist; ry = cy;        break;
    case "DOWN":
    default:      lx = cx + dist; ly = cy;        rx = cx - dist; ry = cy;        break;
  }
  const phase  = Math.sin(tick * PAW_FREQ);
  const rLeft  = PAW_MIN + (PAW_MAX - PAW_MIN) * Math.max(0,  phase);
  const rRight = PAW_MIN + (PAW_MAX - PAW_MIN) * Math.max(0, -phase);
  drawSinglePaw(ctx, lx, ly, rLeft,  palette);
  drawSinglePaw(ctx, rx, ry, rRight, palette);
}

function drawSinglePaw(ctx, x, y, r, palette) {
  ctx.fillStyle = palette.paw;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.pawDark;
  ctx.lineWidth   = 0.7;
  ctx.stroke();
  ctx.fillStyle = palette.pawDark;
  for (let i = -1; i <= 1; i++) {
    const dr = r * 0.38;
    const da = i * 0.55;
    ctx.beginPath();
    ctx.arc(x + dr * Math.sin(da), y - dr * Math.cos(da), r * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawPauseOverlay(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle    = "#ffffff";
  ctx.font         = "bold 20px 'Press Start 2P', monospace";
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⏸ PAUSA", w / 2, h / 2);
  ctx.font      = "12px 'Press Start 2P', monospace";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("Presioná P para continuar", w / 2, h / 2 + 40);
  ctx.textAlign    = "start";
  ctx.textBaseline = "alphabetic";
}

function rotateForDir(ctx, dir) {
  switch (dir) {
    case "RIGHT": ctx.rotate(Math.PI / 2);  break;
    case "LEFT":  ctx.rotate(-Math.PI / 2); break;
    case "DOWN":  ctx.rotate(Math.PI);      break;
    case "UP":    break;
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hexToRgb(hex) {
  if (hex.startsWith("rgb")) {
    const [r, g, b] = hex.match(/\d+/g).map(Number);
    return { r, g, b };
  }
  const m = hex.replace("#", "").match(/.{2}/g).map(h => parseInt(h, 16));
  return { r: m[0], g: m[1], b: m[2] };
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function lighten(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}