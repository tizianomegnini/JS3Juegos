const initRankingStars = function(){
  const c = document.getElementById('stars');
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    const sz = Math.random() * 2 + 0.5;
    const dur = Math.random() * 3 + 1.5;
    const op = Math.random() * 0.6 + 0.1;
    s.className = 'star';
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${dur}s;--o:${op};animation-delay:${Math.random()*dur}s`;
    c.appendChild(s);
  }
}();

const rowsEl = document.getElementById('rankingRows');
const refreshBtn = document.getElementById('refreshRankingBtn');

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function renderScores(scores) {
  if (!scores.length) {
    rowsEl.innerHTML = '<div class="ranking-empty">TODAVIA NO HAY PUNTAJES</div>';
    return;
  }

  rowsEl.replaceChildren();
  scores.slice(0, 10).forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'ranking-row';
    [
      index + 1,
      item.name,
      Number(item.score).toLocaleString('es-AR'),
      item.level || 1,
      formatDate(item.date),
    ].forEach(value => {
      const cell = document.createElement('span');
      cell.textContent = value;
      row.appendChild(cell);
    });
    rowsEl.appendChild(row);
  });
}

function loadLocalScores() {
  try {
    const scores = JSON.parse(localStorage.getItem('pm_scores') || '[]');
    return Array.isArray(scores) ? scores : [];
  } catch (err) {
    return [];
  }
}

function sortScores(scores) {
  const seen = new Set();
  return scores
    .filter(item => Number.isFinite(Number(item.score)) && Number(item.score) >= 0)
    .filter(item => {
      const key = `${String(item.name || '').trim().toUpperCase()}|${Number(item.score)}|${Number(item.level || 1)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Number(b.score) - Number(a.score) || new Date(a.date) - new Date(b.date))
    .slice(0, 10);
}

async function loadScores() {
  rowsEl.innerHTML = '<div class="ranking-empty">CARGANDO...</div>';
  const localScores = loadLocalScores();
  try {
    const res = await fetch('/api/scores');
    if (!res.ok) throw new Error('No se pudo leer el ranking');
    renderScores(sortScores([...localScores, ...(await res.json())]));
  } catch (err) {
    renderScores(sortScores(localScores));
  }
}

refreshBtn.addEventListener('click', loadScores);
loadScores();
