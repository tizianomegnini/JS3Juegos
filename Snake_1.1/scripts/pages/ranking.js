import { initTheme }     from "/scripts/common/theme.js";
import { initNavbar }    from "/scripts/common/navbar.js";
import { initScrollTop } from "/scripts/common/scrollTop.js";
import { showToast, confirmAction, formatDate } from "/scripts/common/ui.js";
import { clearScores } from "/scripts/common/storage.js";

initTheme(); initNavbar(); initScrollTop();

const MEDALS = ["🥇","🥈","🥉"];
let allScores = [];

const filters = {
  mode: "",
  foodCount: "",
  wallMode: "",
  mapSize: ""
};

const FILTER_LABELS = {
  mode:      { "1P": "1 jugador", "2P": "2 jugadores" },
  foodCount: { "1": "1 fruta", "3": "3 frutas", "5": "5 frutas" },
  wallMode:  { wall: "pared mortal", wrap: "sin paredes" },
  mapSize:   { small: "mapa chico", medium: "mapa medio", large: "mapa grande" }
};

async function loadScores() {
  try {
    const res = await fetch("/api/scores");
    if (!res.ok) return [];
    const scores = await res.json();
    return scores.sort((a, b) => Number(b.score) - Number(a.score));
  } catch {
    return [];
  }
}

function getSettings(entry = {}) {
  return entry.settings || {
    mapSize: entry.mapSize,
    foodCount: entry.foodCount,
    wallMode: entry.wallMode
  };
}

function matchesFilters(entry) {
  const settings = getSettings(entry);
  if (filters.mode && entry.mode !== filters.mode) return false;
  if (filters.foodCount && String(settings?.foodCount || "") !== filters.foodCount) return false;
  if (filters.wallMode && settings?.wallMode !== filters.wallMode) return false;
  if (filters.mapSize && settings?.mapSize !== filters.mapSize) return false;
  return true;
}

function updateFilterSummary(count) {
  const active = Object.entries(filters)
    .filter(([, value]) => value)
    .map(([key, value]) => FILTER_LABELS[key][value]);

  const base = active.length ? `Top 10: ${active.join(" · ")}` : "Top 10 general";
  document.getElementById("ranking-filter-summary").textContent = `${base} (${count})`;
}

function modeLabel(mode) {
  return mode === "2P"
    ? `<span class="ranking-mode ranking-mode-2p">2P</span>`
    : `<span class="ranking-mode ranking-mode-1p">1P</span>`;
}

function settingsLabel(entry = {}) {
  const settings = getSettings(entry);
  const mapNames = {
    small:  "Mapa chico",
    medium: "Mapa medio",
    large:  "Mapa grande"
  };
  const wallNames = {
    wall: "Pared mortal",
    wrap: "Sin paredes"
  };

  if (!settings || (!settings.mapSize && !settings.foodCount && !settings.wallMode)) {
    return `<span class="settings-muted">Sin config guardada</span>`;
  }

  const foodCount = Number(settings.foodCount) || 1;
  const parts = [
    mapNames[settings.mapSize] || "Mapa ?",
    `${foodCount} ${foodCount === 1 ? "fruta" : "frutas"}`,
    wallNames[settings.wallMode] || "Pared ?"
  ];

  return `<div class="settings-tags">${parts.map(p => `<span>${p}</span>`).join("")}</div>`;
}

async function renderRanking() {
  allScores = await loadScores();
  const scores = allScores
    .filter(matchesFilters)
    .slice(0, 10);
  const tbody  = document.getElementById("ranking-body");
  updateFilterSummary(allScores.filter(matchesFilters).length);

  if (!scores.length) {
    const hasFilters = Object.values(filters).some(Boolean);
    const emptyText = hasFilters
      ? "No hay puntajes con esos filtros."
      : "No hay puntajes todavía. ¡Jugá una partida!";
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🏆</div>
          ${emptyText}
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = scores.map((e, i) => {
    const rank = i < 3
      ? `<span class="rank-medal">${MEDALS[i]}</span>`
      : `<span class="rank-number">${i + 1}</span>`;
    const date = e.date ? formatDate(e.date) : "—";
    return `
      <tr>
        <td data-label="#">${rank}</td>
        <td data-label="Iniciales" style="font-family:var(--font-pixel); letter-spacing:0.3em;">${e.initials}</td>
        <td data-label="Puntaje"><span class="score-highlight">${e.score}</span></td>
        <td data-label="Modo">${modeLabel(e.mode)}</td>
        <td data-label="Config">${settingsLabel(e)}</td>
        <td data-label="Fecha" style="color:var(--text-muted); font-size:0.85rem;">${date}</td>
      </tr>`;
  }).join("");
}

document.querySelectorAll(".filter-select").forEach(select => {
  select.addEventListener("change", () => {
    filters[select.dataset.filter] = select.value;
    renderRanking();
  });
});

document.getElementById("reset-filters").addEventListener("click", () => {
  Object.keys(filters).forEach(key => { filters[key] = ""; });
  document.querySelectorAll(".filter-select").forEach(select => { select.value = ""; });
  renderRanking();
});

document.getElementById("clear-btn").addEventListener("click", async () => {
  const ok = await confirmAction("¿Borrar todo el ranking de este dispositivo?");
  if (!ok) return;
  clearScores();
  showToast("Ranking borrado.", "info");
  renderRanking();
});

renderRanking();