﻿// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function drawCrystal(cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx,       cy - r);
  ctx.lineTo(cx + r*0.6, cy - r*0.3);
  ctx.lineTo(cx + r*0.6, cy + r*0.3);
  ctx.lineTo(cx,       cy + r);
  ctx.lineTo(cx - r*0.6, cy + r*0.3);
  ctx.lineTo(cx - r*0.6, cy - r*0.3);
  ctx.closePath();
}

function drawNova(cx, cy, r, t) {
  const spin = t * 0.002;
  ctx.beginPath();
  for (let i=0; i<8; i++) {
    const ang = spin + (Math.PI/4)*i;
    const rad = i%2===0 ? r : r*0.4;
    i===0 ? ctx.moveTo(cx+Math.cos(ang)*rad, cy+Math.sin(ang)*rad)
           : ctx.lineTo(cx+Math.cos(ang)*rad, cy+Math.sin(ang)*rad);
  }
  ctx.closePath();
}

function invalidateMazeCache() {
  mazeCache = null;
  mazeCacheScale = 0;
  mazeCacheLevel = 0;
}

function buildMazeCache() {
  const S = SCALE;
  mazeCache = document.createElement('canvas');
  mazeCache.width = canvas.width;
  mazeCache.height = canvas.height;
  mazeCacheScale = SCALE;
  mazeCacheLevel = level;
  const mctx = mazeCache.getContext('2d');

  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      const v = map[r][c], px=c*S, py=r*S;

      if (v === 1) {
        mctx.fillStyle = '#0a0a3a';
        mctx.fillRect(px, py, S, S);
        mctx.strokeStyle = '#2233bb';
        mctx.lineWidth = 1.5;
        mctx.strokeRect(px+1, py+1, S-2, S-2);
        mctx.fillStyle = 'rgba(80,100,255,0.25)';
        mctx.fillRect(px, py, S*0.3, S*0.3);
        mctx.fillRect(px+S*0.7, py+S*0.7, S*0.3, S*0.3);
      } else if (v === 4) {
        mctx.fillStyle = '#0d0020';
        mctx.fillRect(px, py, S, S);
      } else {
        mctx.fillStyle = '#000408';
        mctx.fillRect(px, py, S, S);
      }
    }
  }
}

function drawMaze() {
  const S = SCALE;
  const t = Date.now();

  if (!mazeCache || mazeCacheScale !== SCALE || mazeCacheLevel !== level) buildMazeCache();
  ctx.drawImage(mazeCache, 0, 0);

  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      const v = map[r][c], px=c*S, py=r*S;
      const cx = px + S/2, cy = py + S/2;

      if (v === 1) {
        continue;
      } else if (v === 4) {
        continue;
      } else {
        if (v === 2) {
          const cr = S * 0.13;
          const shimmer = 0.85;
          ctx.save();
          ctx.shadowColor = '#00eeff';
          ctx.shadowBlur  = 4;
          ctx.fillStyle = `rgba(0,220,255,${shimmer})`;
          drawCrystal(cx, cy, cr);
          ctx.fill();
          ctx.restore();

        } else if (v === 3) {
          const pulse = 0.75 + 0.25 * Math.sin(t/130);
          const nr = S * 0.28 * pulse;

          ctx.save();
          const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, S*0.48);
          halo.addColorStop(0, `rgba(255,80,255,${0.35*pulse})`);
          halo.addColorStop(1, 'rgba(255,0,150,0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(cx, cy, S*0.48, 0, Math.PI*2);
          ctx.fill();

          ctx.shadowColor = '#ff44ff';
          ctx.shadowBlur  = 18 * pulse;
          const gNova = ctx.createRadialGradient(cx, cy, 0, cx, cy, nr);
          gNova.addColorStop(0, '#ffffff');
          gNova.addColorStop(0.3, '#ff88ff');
          gNova.addColorStop(1, '#cc00cc');
          ctx.fillStyle = gNova;
          drawNova(cx, cy, nr, t);
          ctx.fill();

          ctx.shadowBlur = 8;
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(cx, cy, nr*0.22, 0, Math.PI*2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }

  if (flashTimer > 0) {
    ctx.fillStyle = `rgba(180,0,255,${(flashTimer/8)*0.22})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  DRAW PLAYER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let thrusterPhase = 0;

function drawPlayer() {
  if (invTimer > 0 && Math.floor(invTimer/6) % 2 === 0) return;

  thrusterPhase += 0.25;
  const isMoving = player.dir.x !== 0 || player.dir.y !== 0;
  const angle = Math.atan2(player.dir.y, player.dir.x);
  const S  = SCALE;
  const px = player.x * S + S/2;
  const py = player.y * S + S/2;
  const R  = S/2 - 1;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(angle);


  if (isMoving) {
    const fl = R * (0.6 + 0.4 * Math.sin(thrusterPhase));
    const flW = R * 0.28;
    ctx.save();
    ctx.shadowColor = '#ff8800';
    ctx.shadowBlur  = 12;
    const fireGrd = ctx.createLinearGradient(-R, 0, -R - fl, 0);
    fireGrd.addColorStop(0, 'rgba(255,200,0,0.95)');
    fireGrd.addColorStop(0.4, 'rgba(255,80,0,0.8)');
    fireGrd.addColorStop(1, 'rgba(255,0,0,0)');
    ctx.fillStyle = fireGrd;
    ctx.beginPath();
    ctx.moveTo(-R*0.55,  flW);
    ctx.lineTo(-R - fl,  0);
    ctx.lineTo(-R*0.55, -flW);
    ctx.closePath();
    ctx.fill();
    const innerGrd = ctx.createLinearGradient(-R, 0, -R - fl*0.55, 0);
    innerGrd.addColorStop(0, 'rgba(255,255,200,0.9)');
    innerGrd.addColorStop(1, 'rgba(255,160,0,0)');
    ctx.fillStyle = innerGrd;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(-R*0.5,  flW*0.45);
    ctx.lineTo(-R - fl*0.55, 0);
    ctx.lineTo(-R*0.5, -flW*0.45);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("", px, py - R - 10);
    ctx.restore();
}
  
  ctx.shadowColor = '#00ccff';
  ctx.shadowBlur  = 10;

  const wingGrd = ctx.createLinearGradient(0, -R, 0, 0);
  wingGrd.addColorStop(0, '#0088cc');
  wingGrd.addColorStop(1, '#003366');
  ctx.fillStyle = wingGrd;
  ctx.beginPath();
  ctx.moveTo( R*0.1,  0);
  ctx.lineTo(-R*0.5, -R*0.85);
  ctx.lineTo(-R*0.7, -R*0.45);
  ctx.lineTo(-R*0.15, -R*0.15);
  ctx.closePath();
  ctx.fill();

  const wingGrd2 = ctx.createLinearGradient(0, 0, 0, R);
  wingGrd2.addColorStop(0, '#003366');
  wingGrd2.addColorStop(1, '#0088cc');
  ctx.fillStyle = wingGrd2;
  ctx.beginPath();
  ctx.moveTo( R*0.1,  0);
  ctx.lineTo(-R*0.5,  R*0.85);
  ctx.lineTo(-R*0.7,  R*0.45);
  ctx.lineTo(-R*0.15, R*0.15);
  ctx.closePath();
  ctx.fill();

  const bodyGrd = ctx.createLinearGradient(-R*0.6, 0, R*0.9, 0);
  bodyGrd.addColorStop(0, '#004488');
  bodyGrd.addColorStop(0.4, '#0099ee');
  bodyGrd.addColorStop(1, '#00ddff');
  ctx.fillStyle = bodyGrd;
  ctx.shadowColor = '#00eeff';
  ctx.shadowBlur  = 14;
  ctx.beginPath();
  ctx.moveTo( R,      0);
  ctx.lineTo( R*0.3, -R*0.28);
  ctx.lineTo(-R*0.6, -R*0.22);
  ctx.lineTo(-R*0.75, 0);
  ctx.lineTo(-R*0.6,  R*0.22);
  ctx.lineTo( R*0.3,  R*0.28);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 8;
  const domeGrd = ctx.createRadialGradient(R*0.25, -R*0.06, 0, R*0.2, 0, R*0.28);
  domeGrd.addColorStop(0, '#eeffff');
  domeGrd.addColorStop(0.4, '#44aaff');
  domeGrd.addColorStop(1, '#002244');
  ctx.fillStyle = domeGrd;
  ctx.beginPath();
  ctx.ellipse(R*0.2, 0, R*0.28, R*0.18, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.ellipse(R*0.25, -R*0.06, R*0.1, R*0.06, -0.4, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = '#00ffff';
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(R, 0, R*0.07, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  DRAW GHOSTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•


// ─── DRAW PLAYER 2 (nave rosa) ─────────────────────────────────────────────
function drawPlayer2() {
  if (!player2) return;
  // Parpadeo al ser invulnerable
  if (invTimer2 > 0 && Math.floor(invTimer2/6) % 2 === 0) return;

  const isMoving = player2.dir.x !== 0 || player2.dir.y !== 0;
  const angle = Math.atan2(player2.dir.y, player2.dir.x);
  const S  = SCALE;
  const px = player2.x * S + S/2;
  const py = player2.y * S + S/2;
  const R  = S/2 - 1;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(angle);

  // Propulsor
  if (isMoving) {
    const fl = R * (0.6 + 0.4 * Math.sin(thrusterPhase));
    const flW = R * 0.28;
    ctx.save();
    ctx.shadowColor = '#ff0066';
    ctx.shadowBlur  = 12;
    const fireGrd = ctx.createLinearGradient(-R, 0, -R - fl, 0);
    fireGrd.addColorStop(0, 'rgba(255,150,200,0.95)');
    fireGrd.addColorStop(0.4, 'rgba(255,0,100,0.8)');
    fireGrd.addColorStop(1, 'rgba(200,0,80,0)');
    ctx.fillStyle = fireGrd;
    ctx.beginPath();
    ctx.moveTo(-R*0.55,  flW);
    ctx.lineTo(-R - fl,  0);
    ctx.lineTo(-R*0.55, -flW);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.shadowColor = '#FF69B4';
  ctx.shadowBlur  = 10;

  // Alas (rosado)
  ctx.fillStyle = '#cc3377';
  ctx.beginPath();
  ctx.moveTo( R*0.1,  0);
  ctx.lineTo(-R*0.5, -R*0.85);
  ctx.lineTo(-R*0.7, -R*0.45);
  ctx.lineTo(-R*0.15, -R*0.15);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ff66aa';
  ctx.beginPath();
  ctx.moveTo( R*0.1,  0);
  ctx.lineTo(-R*0.5,  R*0.85);
  ctx.lineTo(-R*0.7,  R*0.45);
  ctx.lineTo(-R*0.15, R*0.15);
  ctx.closePath();
  ctx.fill();

  // Cuerpo
  const bodyGrd = ctx.createLinearGradient(-R*0.6, 0, R*0.9, 0);
  bodyGrd.addColorStop(0, '#880044');
  bodyGrd.addColorStop(0.4, '#ee3388');
  bodyGrd.addColorStop(1, '#ff99cc');
  ctx.fillStyle = bodyGrd;
  ctx.shadowColor = '#FF69B4';
  ctx.shadowBlur  = 14;
  ctx.beginPath();
  ctx.moveTo( R,      0);
  ctx.lineTo( R*0.3, -R*0.28);
  ctx.lineTo(-R*0.6, -R*0.22);
  ctx.lineTo(-R*0.75, 0);
  ctx.lineTo(-R*0.6,  R*0.22);
  ctx.lineTo( R*0.3,  R*0.28);
  ctx.closePath();
  ctx.fill();

  // Domo
  ctx.shadowBlur = 8;
  const domeGrd = ctx.createRadialGradient(R*0.25, -R*0.06, 0, R*0.2, 0, R*0.28);
  domeGrd.addColorStop(0, '#ffeeee');
  domeGrd.addColorStop(0.4, '#ff88bb');
  domeGrd.addColorStop(1, '#440022');
  ctx.fillStyle = domeGrd;
  ctx.beginPath();
  ctx.ellipse(R*0.2, 0, R*0.28, R*0.18, 0, 0, Math.PI*2);
  ctx.fill();

  // Reflejo
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.ellipse(R*0.25, -R*0.06, R*0.1, R*0.06, -0.4, 0, Math.PI*2);
  ctx.fill();

  // Punta
  ctx.fillStyle = '#ff66aa';
  ctx.shadowColor = '#ff66aa';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(R, 0, R*0.07, 0, Math.PI*2);
  ctx.fill();

  // Etiqueta P2
  ctx.restore();
  ctx.save();
  ctx.font = '5px "Press Start 2P"';
  ctx.fillStyle = '#FF69B4';
  ctx.textAlign = 'center';
  ctx.fillText('P2', px, py - R - 3);
  ctx.restore();
}

// BLINKY (id=0) â€” Medusa elÃ©ctrica roja
function drawAlienJellyfish(cx, cy, r, col, t, frightened, blinking) {
  const wobble = Math.sin(t * 0.004) * r * 0.08;
  for (let i=0; i<5; i++) {
    const tx = cx - r*0.8 + i*(r*0.4);
    const phase = t*0.005 + i*0.8;
    const ty1 = cy + r*0.55;
    const ty2 = cy + r*(1.0 + 0.35*Math.sin(phase));
    ctx.strokeStyle = frightened ? (blinking ? '#fff' : '#005599') : col;
    ctx.lineWidth = r*0.13;
    ctx.lineCap = 'round';
    ctx.shadowColor = col;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(tx, ty1);
    ctx.quadraticCurveTo(tx + r*0.15*Math.sin(phase), (ty1+ty2)/2, tx, ty2);
    ctx.stroke();
  }
  const grd = ctx.createRadialGradient(cx, cy-r*0.15, 0, cx, cy, r);
  grd.addColorStop(0, frightened ? (blinking?'#fff':'#0000dd') : lighten(col, 0.5));
  grd.addColorStop(0.6, frightened ? (blinking?'#aaa':'#0000aa') : col);
  grd.addColorStop(1, frightened ? (blinking?'#666':'#000066') : darken(col, 0.5));
  ctx.shadowColor = frightened ? '#0033ff' : col;
  ctx.shadowBlur = 12;
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.ellipse(cx, cy + wobble, r, r*0.72, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  if (!frightened) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx - r*0.2, cy - r*0.15 + wobble, r*0.28, r*0.2, -0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy + wobble*0.5, r*0.22, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(cx + r*0.06, cy + wobble*0.5, r*0.1, 0, Math.PI*2);
    ctx.fill();
  }
}

// PINKY (id=1) â€” AraÃ±a cÃ³smica rosa
function drawAlienSpider(cx, cy, r, col, t, frightened, blinking) {
  const bob = Math.sin(t*0.006) * r*0.06;
  const legWave = t*0.007;
  for (let s=-1; s<=1; s+=2) {
    for (let i=0; i<3; i++) {
      const startX = cx + s*r*0.3;
      const startY = cy + r*0.1 + bob + i*r*0.18;
      const legLen = r * (0.8 + 0.1*Math.sin(legWave + i));
      const midX = startX + s*(legLen*0.55);
      const midY = startY - r*0.25;
      const endX = startX + s*legLen;
      const endY = startY + r*0.2 + r*0.12*Math.sin(legWave+i+1.5);
      ctx.strokeStyle = frightened ? (blinking?'#fff':'#002299') : col;
      ctx.lineWidth = r * 0.09;
      ctx.lineCap = 'round';
      ctx.shadowColor = col;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.stroke();
    }
  }
  const abdGrd = ctx.createRadialGradient(cx, cy+r*0.45+bob, 0, cx, cy+r*0.45+bob, r*0.48);
  abdGrd.addColorStop(0, frightened?(blinking?'#fff':'#0000cc'):lighten(col,0.4));
  abdGrd.addColorStop(1, frightened?(blinking?'#888':'#000077'):darken(col,0.4));
  ctx.shadowColor = frightened?'#0022ff':col; ctx.shadowBlur=10;
  ctx.fillStyle = abdGrd;
  ctx.beginPath();
  ctx.ellipse(cx, cy+r*0.45+bob, r*0.48, r*0.38, 0, 0, Math.PI*2);
  ctx.fill();
  const headGrd = ctx.createRadialGradient(cx, cy-r*0.05+bob, 0, cx, cy-r*0.05+bob, r*0.35);
  headGrd.addColorStop(0, frightened?(blinking?'#fff':'#1111ee'):lighten(col,0.55));
  headGrd.addColorStop(1, frightened?(blinking?'#aaa':'#000088'):col);
  ctx.fillStyle = headGrd;
  ctx.shadowBlur=8;
  ctx.beginPath();
  ctx.ellipse(cx, cy-r*0.05+bob, r*0.35, r*0.32, 0, 0, Math.PI*2);
  ctx.fill();
  if (!frightened) {
    ctx.shadowBlur=0;
    [[- r*0.15, -r*0.12, r*0.1],[r*0.15,-r*0.12,r*0.1],[-r*0.27,-r*0.0,r*0.065],[r*0.27,-r*0.0,r*0.065]].forEach(([ox,oy,er])=>{
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+ox, cy+oy+bob, er, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#330000'; ctx.beginPath(); ctx.arc(cx+ox+r*0.02, cy+oy+bob, er*0.55, 0, Math.PI*2); ctx.fill();
    });
  }
}

// INKY (id=2) â€” Pulpo cÃ³smico cian
function drawAlienOctopus(cx, cy, r, col, t, frightened, blinking) {
  const sway = t*0.004;
  for (let i=0; i<6; i++) {
    const ang = (Math.PI*2/6)*i - Math.PI/2;
    const tx0 = cx + Math.cos(ang)*r*0.45;
    const ty0 = cy + Math.sin(ang)*r*0.45;
    const wavAng = ang + Math.PI/2;
    const tLen = r * (0.7 + 0.2*Math.sin(sway + i));
    const tx1 = tx0 + Math.cos(ang)*tLen*0.5 + Math.cos(wavAng)*tLen*0.3*Math.sin(sway+i);
    const ty1 = ty0 + Math.sin(ang)*tLen*0.5 + Math.sin(wavAng)*tLen*0.3*Math.sin(sway+i);
    const tx2 = tx0 + Math.cos(ang)*tLen + Math.cos(wavAng)*tLen*0.2*Math.sin(sway+i+1);
    const ty2 = ty0 + Math.sin(ang)*tLen + Math.sin(wavAng)*tLen*0.2*Math.sin(sway+i+1);
    ctx.strokeStyle = frightened?(blinking?'#fff':'#002288'):col;
    ctx.lineWidth = r*0.15;
    ctx.lineCap = 'round';
    ctx.shadowColor = col; ctx.shadowBlur=6;
    ctx.beginPath();
    ctx.moveTo(tx0, ty0);
    ctx.bezierCurveTo(tx1, ty1, tx2, ty2, tx2, ty2);
    ctx.stroke();
  }
  const grd = ctx.createRadialGradient(cx-r*0.2, cy-r*0.2, 0, cx, cy, r*0.7);
  grd.addColorStop(0, frightened?(blinking?'#fff':'#0033ff'):lighten(col,0.6));
  grd.addColorStop(0.5, frightened?(blinking?'#88f':'#0011cc'):col);
  grd.addColorStop(1, frightened?(blinking?'#33c':'#000088'):darken(col,0.4));
  ctx.shadowColor=frightened?'#0044ff':col; ctx.shadowBlur=14;
  ctx.fillStyle=grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r*0.68, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(cx-r*0.22, cy-r*0.22, r*0.3, r*0.2, -0.5, 0, Math.PI*2);
  ctx.fill();
  if (!frightened) {
    ctx.shadowBlur=0;
    [[-r*0.22, r*0.05],[r*0.22, r*0.05]].forEach(([ox,oy])=>{
      ctx.fillStyle='#ddf'; ctx.beginPath(); ctx.ellipse(cx+ox, cy+oy, r*0.18, r*0.22, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#001133'; ctx.beginPath(); ctx.ellipse(cx+ox+r*0.04, cy+oy, r*0.09, r*0.13, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(cx+ox+r*0.02, cy+oy-r*0.07, r*0.04, 0, Math.PI*2); ctx.fill();
    });
  }
}

// CLYDE (id=3) â€” Escarabajo robÃ³tico naranja
function drawAlienBeetle(cx, cy, r, col, t, frightened, blinking) {
  const hov = Math.sin(t*0.005)*r*0.05;
  for (let s=-1; s<=1; s+=2) {
    for (let i=0; i<3; i++) {
      const y0 = cy + hov + (-r*0.2 + i*r*0.22);
      const x0 = cx + s*r*0.55;
      const x1 = x0 + s*r*(0.4 + 0.08*Math.sin(t*0.008+i));
      const y1 = y0 + r*(0.25 + 0.06*Math.cos(t*0.008+i));
      ctx.strokeStyle = frightened?(blinking?'#fff':'#002288'):lighten(col,0.2);
      ctx.lineWidth = r*0.1;
      ctx.lineCap = 'round';
      ctx.shadowColor=col; ctx.shadowBlur=3;
      ctx.beginPath();
      ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1+s*r*0.15, y1-r*0.1);
      ctx.stroke();
    }
  }
  const shellGrd = ctx.createLinearGradient(cx, cy-r+hov, cx, cy+r+hov);
  shellGrd.addColorStop(0, frightened?(blinking?'#fff':'#0022cc'):lighten(col,0.45));
  shellGrd.addColorStop(0.5, frightened?(blinking?'#bbb':'#001188'):col);
  shellGrd.addColorStop(1, frightened?(blinking?'#777':'#000055'):darken(col,0.45));
  ctx.shadowColor=frightened?'#0044ff':col; ctx.shadowBlur=10;
  ctx.fillStyle=shellGrd;
  ctx.beginPath();
  ctx.ellipse(cx, cy+hov, r*0.58, r*0.75, 0, 0, Math.PI*2);
  ctx.fill();
  if (!frightened) {
    ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=r*0.06;
    ctx.beginPath(); ctx.moveTo(cx, cy-r*0.6+hov); ctx.lineTo(cx, cy+r*0.6+hov); ctx.stroke();
    [[-r*0.22,-r*0.15],[r*0.22,-r*0.15],[-r*0.18,r*0.15],[r*0.18,r*0.15]].forEach(([ox,oy])=>{
      ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=r*0.04;
      ctx.beginPath(); ctx.arc(cx+ox, cy+oy+hov, r*0.1, 0, Math.PI*2); ctx.stroke();
    });
  }
  const headGrd = ctx.createRadialGradient(cx, cy-r*0.62+hov, 0, cx, cy-r*0.62+hov, r*0.32);
  headGrd.addColorStop(0, frightened?(blinking?'#fff':'#1133ff'):lighten(col,0.5));
  headGrd.addColorStop(1, frightened?(blinking?'#888':'#000077'):darken(col,0.3));
  ctx.fillStyle=headGrd; ctx.shadowBlur=8;
  ctx.beginPath();
  ctx.ellipse(cx, cy-r*0.62+hov, r*0.32, r*0.28, 0, 0, Math.PI*2);
  ctx.fill();
  if (!frightened) {
    ctx.strokeStyle=col; ctx.lineWidth=r*0.07; ctx.lineCap='round'; ctx.shadowBlur=4;
    [[-r*0.15, r*0.12],[r*0.15, r*0.12]].forEach(([ox,oy])=>{
      const ax=cx+ox, ay=cy-r*0.85+hov;
      ctx.beginPath(); ctx.moveTo(ax, ay+r*0.12); ctx.lineTo(ax+ox*0.6, ay); ctx.stroke();
      ctx.fillStyle=lighten(col,0.5); ctx.shadowBlur=6;
      ctx.beginPath(); ctx.arc(ax+ox*0.6, ay, r*0.06, 0, Math.PI*2); ctx.fill();
    });
    ctx.shadowBlur=0;
    [[-r*0.13, r*0.02],[r*0.13, r*0.02]].forEach(([ox,oy])=>{
      ctx.fillStyle='#ffddaa'; ctx.beginPath(); ctx.ellipse(cx+ox, cy-r*0.62+oy+hov, r*0.1, r*0.12, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#220000'; ctx.beginPath(); ctx.arc(cx+ox+r*0.03, cy-r*0.62+oy+hov, r*0.055, 0, Math.PI*2); ctx.fill();
    });
  }
}

// Fantasma comido â€” nÃºcleo de energÃ­a volando de vuelta
function drawEatenAlien(cx, cy, r, col, dirX, dirY) {
  ctx.save();
  ctx.shadowColor = col;
  ctx.shadowBlur  = 14;
  const p = 0.7 + 0.3*Math.sin(Date.now()*0.015);
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r*0.42*p);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(0.4, col);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r*0.42*p, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = r*0.07; ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - dirX*r*0.6, cy - dirY*r*0.6);
  ctx.stroke();
  ctx.restore();
}

function lighten(hex, amt) {
  const c = parseInt(hex.slice(1),16);
  const r = Math.min(255, (c>>16) + Math.round(amt*255));
  const g = Math.min(255, ((c>>8)&0xff) + Math.round(amt*255));
  const b = Math.min(255, (c&0xff) + Math.round(amt*255));
  return `rgb(${r},${g},${b})`;
}
function darken(hex, amt) {
  const c = parseInt(hex.slice(1),16);
  const r = Math.max(0, (c>>16) - Math.round(amt*255));
  const g = Math.max(0, ((c>>8)&0xff) - Math.round(amt*255));
  const b = Math.max(0, (c&0xff) - Math.round(amt*255));
  return `rgb(${r},${g},${b})`;
}

function drawGhosts() {
  const S = SCALE;
  const t = Date.now();
  ghosts.forEach(g => {
    const px = g.x*S + S/2;
    const py = g.y*S + S/2;
    const r  = S/2 - 1;
    const blinking = frightTimer < 80 && Math.floor(frightTimer/10)%2===0;

    ctx.save();

    if (g.eaten) {
      drawEatenAlien(px, py, r, g.color, g.dir.x, g.dir.y);
    } else if (g.id === 0) {
      drawAlienJellyfish(px, py, r, g.color, t, g.frightened, blinking);
    } else if (g.id === 1) {
      drawAlienSpider(px, py, r, g.color, t, g.frightened, blinking);
    } else if (g.id === 2) {
      drawAlienOctopus(px, py, r, g.color, t, g.frightened, blinking);
    } else {
      drawAlienBeetle(px, py, r, g.color, t, g.frightened, blinking);
    }

    ctx.restore();
  });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MAIN LOOP
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// getIsRunning: usado por input.js para saber si el juego está activo
function getIsRunning() { return gameRunning; }

function loop() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMaze();
  updateParticles();
  drawParticles();

  // Dibujar P1 si sigue vivo
  if (player) drawPlayer();
  // Dibujar P2 solo en modo 2P
  if (gameMode === 2 && player2) drawPlayer2();

  drawGhosts();

  if (gameRunning && !paused) {
    if (player) movePlayer();
    if (gameMode === 2 && player2) movePlayer2();
    moveGhosts();
  }

  requestAnimationFrame(loop);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PAUSE
