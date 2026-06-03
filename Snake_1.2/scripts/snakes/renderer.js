/**
   * renderer.js
   * Módulo de renderizado — gatos con paleta dinámica por jugador.
   */

  import { CELL_SIZE, drawBorder } from "./board.js";

  let _tick = 0;

  function getBoardColors() {
    const dark = document.documentElement.dataset.theme === "dark";
    return {
      grassA: dark ? "#0f2211" : "#7cc96a",
      grassB: dark ? "#0a1c0d" : "#6eba5c",
      blade:  dark ? "#1a4020" : "#4a9a3a",
      border: dark ? "rgba(94, 207, 122, 0.55)" : "rgba(40, 110, 40, 0.5)"
    };
  }

  const CAT_BASE = {
    nose:    "#e88a94",
    pupil:   "#111111",
    whisker: "#888888",
    mouth:   "#3a2a2a",
  };

  function buildPalette(snake) {
    return {
      ...CAT_BASE,
      bodyLight: snake.color,
      bodyDark:  darken(snake.color, 0.35),
      head:      snake.headColor,
      headShadow: darken(snake.headColor, 0.22),
      muzzle:    lighten(snake.headColor, 0.36),
      ears:      snake.headColor,
      earInner:  lighten(snake.eyeColor, 0.45),
      eye:       snake.eyeColor,
      paw:       lighten(snake.color, 0.1),
      pawDark:   darken(snake.color, 0.2),
    };
  }

  export function renderFrame(ctx, { snake1, snake2, food }, progress = 1) {
    _tick++;
    const colors = getBoardColors();
    drawGrassBoard(ctx, colors);
    drawBorder(ctx, colors.border);
    drawFood(ctx, food);
    drawSnake(ctx, snake1, _tick, progress);
    if (snake2 && snake2.alive) drawSnake(ctx, snake2, _tick, progress);
  }

  // ── Tablero estilo pasto ───────────────────────────────────────────────────
  let _grassSeeds = null;
  let _grassKey   = "";

  function buildGrassSeeds(cols, rows) {
    const seeds = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const h = ((col * 2654435761) ^ (row * 2246822519)) >>> 0;
        const blades = [];
        const count = 1 + (h % 3);
        for (let i = 0; i < count; i++) {
          const hh = (h ^ (i * 1234567891)) >>> 0;
          blades.push({
            ox:   (hh % 18) + 3,
            oy:   ((hh >> 8) % 8) + 16,
            bh:   ((hh >> 16) % 7) + 5,
            lean: ((hh >> 24) % 3) - 1,
          });
        }
        seeds.push({ col, row, blades });
      }
    }
    return seeds;
  }

  function drawGrassBoard(ctx, colors) {
    const W    = ctx.canvas.width;
    const H    = ctx.canvas.height;
    const cs   = CELL_SIZE;
    const cols = Math.ceil(W / cs);
    const rows = Math.ceil(H / cs);
    const key  = cols + "x" + rows;

    if (!_grassSeeds || _grassKey !== key) {
      _grassSeeds = buildGrassSeeds(cols, rows);
      _grassKey   = key;
    }

    // Celdas alternas
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.fillStyle = (col + row) % 2 === 0 ? colors.grassA : colors.grassB;
        ctx.fillRect(col * cs, row * cs, cs, cs);
      }
    }

    // Briznas de hierba pixel art (1px, deterministas)
    ctx.fillStyle = colors.blade;
    for (const { col, row, blades } of _grassSeeds) {
      const bx = col * cs;
      const by = row * cs;
      for (const { ox, oy, bh, lean } of blades) {
        for (let i = 0; i < bh; i++) {
          const px = bx + ox + (lean > 0 ? Math.floor(i / 3) : lean < 0 ? -Math.floor(i / 3) : 0);
          const py = by + oy - i;
          ctx.fillRect(px, py, 1, 1);
        }
      }
    }
  }

  function interpolateCell(prev, current, progress) {
    return {
      x: prev.x + (current.x - prev.x) * progress,
      y: prev.y + (current.y - prev.y) * progress
    };
  }

  const FOOD_GIF_SRC = "./assets/pez.gif";
  let foodLayer = null;

  function drawFood(ctx, food) {
    // Soporta tanto Food (multi-item) como FoodItem individual
    const items = food.items || [food];
    for (const item of items) {
      const { x, y } = item.position;
      const px = x * CELL_SIZE;
      const py = y * CELL_SIZE;
      const cx = px + CELL_SIZE / 2;
      const cy = py + CELL_SIZE / 2;

      ctx.fillStyle = "rgba(255, 220, 80, 0.18)";
      ctx.beginPath();
      ctx.arc(cx, cy, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
    }
    syncFoodGifLayer(ctx.canvas, items);
  }

  function syncFoodGifLayer(canvas, items) {
    const wrapper = canvas.parentElement;
    if (!wrapper) return;

    if (!foodLayer || foodLayer.parentElement !== wrapper) {
      foodLayer = document.createElement("div");
      foodLayer.className = "food-gif-layer";
      wrapper.appendChild(foodLayer);
    }

    while (foodLayer.children.length < items.length) {
      const img = document.createElement("img");
      img.className = "food-gif";
      img.src = FOOD_GIF_SRC;
      img.alt = "";
      img.draggable = false;
      foodLayer.appendChild(img);
    }

    while (foodLayer.children.length > items.length) {
      foodLayer.lastElementChild.remove();
    }

    const style = getComputedStyle(canvas);
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderTop = parseFloat(style.borderTopWidth) || 0;
    const scaleX = canvas.clientWidth / canvas.width;
    const scaleY = canvas.clientHeight / canvas.height;

    items.forEach((item, index) => {
      const img = foodLayer.children[index];
      const size = CELL_SIZE * Math.min(scaleX, scaleY);
      const left = canvas.offsetLeft + borderLeft + item.position.x * CELL_SIZE * scaleX;
      const top = canvas.offsetTop + borderTop + item.position.y * CELL_SIZE * scaleY;

      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.transform = `translate(${left}px, ${top}px)`;
    });

    foodLayer.style.display = "block";
  }

  function drawSnake(ctx, snake, tick, progress) {
    if (!snake || !snake.body.length) return;
    const palette = buildPalette(snake);
    for (let i = snake.body.length - 1; i >= 1; i--) {
      const current = snake.body[i];
      const previous = (snake.prevBody && snake.prevBody[i]) ? snake.prevBody[i] : current;
      const isTail = i === snake.body.length - 1;
      const tailDir = isTail ? getTailDirection(snake.body[i - 1], current) : null;
      drawBodySegment(ctx, current, previous, i, snake.body.length, palette, progress, isTail, tailDir, snake.direction, tick);
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

  function drawBodySegment(ctx, cell, prevCell, index, total, palette, progress, isTail, tailDir, moveDir, tick) {
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

    if (isTail && tailDir) {
      drawCatTail(ctx, px, py, size, tailDir, palette, tick);
    }

    if (total <= 4 || index % 2 === 1) {
      drawWalkingPaws(ctx, px, py, size, moveDir, index, tick, palette);
    }

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    roundRect(ctx, px, py, size, size, 8);
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = palette.bodyDark;
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

  function drawWalkingPaws(ctx, px, py, size, dir, index, tick, palette) {
    const cx = px + size / 2;
    const cy = py + size / 2;
    const phase = Math.sin(tick * 0.42 + index * 0.85);
    const step = phase * 3.2;
    const side = size * 0.46;
    const rx = size * 0.18;
    const ry = size * 0.105;

    ctx.save();
    ctx.globalAlpha = 0.96;
    if (dir === "LEFT" || dir === "RIGHT") {
      const sign = dir === "RIGHT" ? 1 : -1;
      drawFoot(ctx, cx + step * sign, cy - side, rx, ry, 0.08 * sign, palette);
      drawFoot(ctx, cx - step * sign, cy + side, rx, ry, -0.08 * sign, palette);
    } else {
      const sign = dir === "DOWN" ? 1 : -1;
      drawFoot(ctx, cx - side, cy + step * sign, ry, rx, 0.08 * sign, palette);
      drawFoot(ctx, cx + side, cy - step * sign, ry, rx, -0.08 * sign, palette);
    }
    ctx.restore();
  }

  function drawFoot(ctx, x, y, rx, ry, angle, palette) {
    ctx.fillStyle = palette.pawDark;
    ctx.beginPath();
    ctx.ellipse(x, y + 1, rx * 1.08, ry * 1.08, angle, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.paw;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCatTail(ctx, px, py, size, dir, palette, tick) {
    const centerX = px + size / 2;
    const centerY = py + size / 2;
    const wag = Math.sin(tick * 0.22) * 3.5;
    ctx.save();
    ctx.strokeStyle = palette.bodyDark;
    ctx.lineWidth = Math.max(5, size * 0.22);
    ctx.lineCap = "round";

    ctx.beginPath();
    if (dir === "RIGHT") {
      ctx.moveTo(px + size - 2, centerY);
      ctx.quadraticCurveTo(px + size + 8, centerY - 8 + wag, px + size + 15, centerY - 1 + wag);
    } else if (dir === "LEFT") {
      ctx.moveTo(px + 2, centerY);
      ctx.quadraticCurveTo(px - 8, centerY - 8 + wag, px - 15, centerY - 1 + wag);
    } else if (dir === "UP") {
      ctx.moveTo(centerX, py + 2);
      ctx.quadraticCurveTo(centerX - 8 + wag, py - 8, centerX - 1 + wag, py - 15);
    } else if (dir === "DOWN") {
      ctx.moveTo(centerX, py + size - 2);
      ctx.quadraticCurveTo(centerX - 8 + wag, py + size + 8, centerX - 1 + wag, py + size + 15);
    }
    ctx.stroke();

    ctx.strokeStyle = palette.bodyLight;
    ctx.lineWidth = Math.max(3, size * 0.14);
    ctx.stroke();

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
    ctx.translate(0, Math.sin(tick * 0.35) * 0.8);

    drawLocalFrontPaws(ctx, hw, tick, palette);
    drawEar(ctx, -hw * 0.48, -hw * 0.58, hw * 0.23, hw * 0.34, palette);
    drawEar(ctx,  hw * 0.48, -hw * 0.58, hw * 0.23, hw * 0.34, palette);

    ctx.fillStyle = palette.head;
    ctx.beginPath();
    ctx.ellipse(0, 0, hw * 0.74, hw * 0.68, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.headShadow;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    const grad = ctx.createLinearGradient(0, -hw * 0.5, 0, hw * 0.5);
    grad.addColorStop(0, "rgba(255,255,255,0.16)");
    grad.addColorStop(1, "rgba(0,0,0,0.10)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, hw * 0.74, hw * 0.68, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = palette.headShadow;
    ctx.lineWidth   = 0.9;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 4,     -hw * 0.62);
      ctx.quadraticCurveTo(i * 4 - 1.2, -hw * 0.12, i * 3.2, hw * 0.14);
      ctx.stroke();
    }
    ctx.restore();

    drawCatEyes(ctx, hw, palette);

    drawMuzzle(ctx, hw, palette);

    ctx.fillStyle = palette.nose;
    ctx.beginPath();
    ctx.moveTo(0,  hw * 0.08);
    ctx.lineTo(-hw * 0.13, hw * 0.18);
    ctx.lineTo( hw * 0.13, hw * 0.18);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = palette.mouth;
    ctx.lineWidth = 1.1;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, hw * 0.18);
    ctx.lineTo(0, hw * 0.27);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, hw * 0.27);
    ctx.quadraticCurveTo(-hw * 0.08, hw * 0.33, -hw * 0.18, hw * 0.29);
    ctx.moveTo(0, hw * 0.27);
    ctx.quadraticCurveTo( hw * 0.08, hw * 0.33,  hw * 0.18, hw * 0.29);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = palette.whisker;
    ctx.lineWidth   = 1;
    ctx.globalAlpha = 0.82;
    drawWhisker(ctx, -hw * 0.13, hw * 0.18, -hw * 0.88,  hw * 0.02, -hw * 0.48, hw * 0.05);
    drawWhisker(ctx, -hw * 0.14, hw * 0.24, -hw * 0.92,  hw * 0.24, -hw * 0.5,  hw * 0.2);
    drawWhisker(ctx, -hw * 0.12, hw * 0.3,  -hw * 0.78,  hw * 0.43, -hw * 0.42, hw * 0.36);
    drawWhisker(ctx,  hw * 0.13, hw * 0.18,  hw * 0.88,  hw * 0.02,  hw * 0.48, hw * 0.05);
    drawWhisker(ctx,  hw * 0.14, hw * 0.24,  hw * 0.92,  hw * 0.24,  hw * 0.5,  hw * 0.2);
    drawWhisker(ctx,  hw * 0.12, hw * 0.3,   hw * 0.78,  hw * 0.43,  hw * 0.42, hw * 0.36);
    ctx.restore();

    ctx.restore();
  }

  function drawEar(ctx, x, y, w, h, palette) {
    ctx.strokeStyle = palette.headShadow;
    ctx.lineWidth = 1;
    ctx.fillStyle = palette.ears;
    ctx.beginPath();
    ctx.moveTo(x - w, y + h);
    ctx.lineTo(x,     y - h * 0.55);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = palette.earInner;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.55, y + h * 0.7);
    ctx.lineTo(x,             y + h * 0.05);
    ctx.lineTo(x + w * 0.55,  y + h * 0.7);
    ctx.closePath();
    ctx.fill();
  }

  function drawCatEyes(ctx, hw, palette) {
    const ex = hw * 0.3;
    const ey = -hw * 0.16;
    [[-ex, ey], [ex, ey]].forEach(([ox, oy]) => {
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.beginPath();
      ctx.ellipse(ox, oy, hw * 0.19, hw * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = palette.headShadow;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.fillStyle = palette.eye;
      ctx.beginPath();
      ctx.ellipse(ox, oy, hw * 0.14, hw * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = palette.pupil;
      ctx.beginPath();
      ctx.ellipse(ox, oy, hw * 0.04, hw * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.ellipse(ox - hw * 0.05, oy - hw * 0.08, hw * 0.04, hw * 0.07, 0.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawMuzzle(ctx, hw, palette) {
    ctx.fillStyle = palette.muzzle;
    ctx.globalAlpha = 0.86;
    ctx.beginPath();
    ctx.ellipse(-hw * 0.13, hw * 0.22, hw * 0.18, hw * 0.14, -0.18, 0, Math.PI * 2);
    ctx.ellipse( hw * 0.13, hw * 0.22, hw * 0.18, hw * 0.14,  0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawWhisker(ctx, x0, y0, x1, y1, cx, cy) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cx, cy, x1, y1);
    ctx.stroke();
  }

  function drawLocalFrontPaws(ctx, hw, tick, palette) {
    const phase = Math.sin(tick * 0.42);
    ctx.save();
    ctx.fillStyle = palette.pawDark;
    ctx.beginPath();
    ctx.ellipse(-hw * 0.35, hw * 0.58 + phase * 1.2, hw * 0.17, hw * 0.1, -0.2, 0, Math.PI * 2);
    ctx.ellipse( hw * 0.35, hw * 0.58 - phase * 1.2, hw * 0.17, hw * 0.1,  0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.paw;
    ctx.beginPath();
    ctx.ellipse(-hw * 0.35, hw * 0.55 + phase * 1.2, hw * 0.15, hw * 0.085, -0.2, 0, Math.PI * 2);
    ctx.ellipse( hw * 0.35, hw * 0.55 - phase * 1.2, hw * 0.15, hw * 0.085,  0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  export function drawPauseOverlay(ctx) {
    if (foodLayer) {
      foodLayer.style.display = "none";
    }

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