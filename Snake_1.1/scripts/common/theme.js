/**
 * theme.js
 * Módulo para gestión del tema claro/oscuro.
 * Se encarga de intercambiar los CSS y guardar la preferencia del usuario.
 */

/** Clave usada en localStorage para persistir el tema */
const THEME_KEY = "snake-theme";

/**
 * Devuelve el tema guardado o "light" por defecto.
 * @returns {"dark"|"light"}
 */
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

/**
 * Aplica un tema a la página actualizando los <link> de CSS y el ícono del botón.
 * Detecta automáticamente qué página es y carga el CSS correcto.
 * @param {"dark"|"light"} theme
 */
export function applyTheme(theme) {
  const pageName  = detectPage();
  const globalEl  = document.getElementById("global-css");
  const pageEl    = document.getElementById("page-css");
  const toggleBtn = document.getElementById("theme-toggle");

  if (globalEl) globalEl.href = `/styles/global-${theme}.css`;
  if (pageEl && pageName)  pageEl.href  = `/styles/${pageName}-${theme}.css`;

  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.dataset.theme = theme;

  if (toggleBtn) {
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    toggleBtn.setAttribute("aria-label", theme === "dark" ? "Activar modo claro" : "Activar modo oscuro");
  }
}

/**
 * Alterna entre los dos temas y retorna el nuevo tema aplicado.
 * @returns {"dark"|"light"}
 */
export function toggleTheme() {
  const current = getSavedTheme();
  const next    = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

/**
 * Detecta el nombre de la página actual para cargar el CSS correspondiente.
 * @returns {string} Nombre de la página ("index", "game", "ranking")
 */
function detectPage() {
  const path = window.location.pathname;
  if (path.includes("game"))    return "game";
  if (path.includes("ranking")) return "ranking";
  return "index";
}

/**
 * Inicializa el tema al cargar la página y enlaza el botón de toggle.
 * Debe llamarse en el DOMContentLoaded de cada página.
 */
export function initTheme() {
  applyTheme(getSavedTheme());

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => toggleTheme());
  }
}