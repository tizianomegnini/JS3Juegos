/**
 * ui.js
 * Módulo de utilidades de interfaz de usuario.
 * Maneja toasts (notificaciones no-invasivas), confirmaciones y helpers de DOM.
 */

// ─── Toast (notificaciones) ────────────────────────────────────────────────

/**
 * Crea el contenedor de toasts si no existe.
 * @returns {HTMLElement}
 */
function getToastContainer() {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id        = "toast-container";
    container.className = "toast-container-custom";
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Muestra una notificación toast no invasiva.
 * @param {string} message - Texto a mostrar
 * @param {"success"|"error"|"info"} type - Tipo de toast
 * @param {number} [duration=3500] - Duración en ms
 */
export function showToast(message, type = "info", duration = 3500) {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.className  = `toast-custom ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Auto-remover
  setTimeout(() => {
    toast.style.opacity   = "0";
    toast.style.transform = "translateX(40px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── Formato de fechas ─────────────────────────────────────────────────────

/**
 * Formatea una fecha ISO a DD/MM/AA.
 * @param {string} isoString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export function formatDate(isoString) {
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

// ─── Loading state ─────────────────────────────────────────────────────────

/**
 * Activa o desactiva el estado de carga de un botón.
 * @param {HTMLElement} btn
 * @param {boolean} loading
 * @param {string} [originalText] - Texto a restaurar al terminar
 */
export function setButtonLoading(btn, loading, originalText = "") {
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent          = "Cargando...";
    btn.disabled             = true;
  } else {
    btn.textContent = originalText || btn.dataset.originalText || "Aceptar";
    btn.disabled    = false;
  }
}

// ─── Confirmación modal ────────────────────────────────────────────────────

/**
 * Muestra un diálogo de confirmación usando el elemento Bootstrap modal de la página.
 * Requiere que exista #confirm-modal en el DOM.
 * @param {string} message - Pregunta a mostrar
 * @returns {Promise<boolean>} Resuelve true si confirma, false si cancela
 */
export function confirmAction(message) {
  return new Promise((resolve) => {
    const modal    = document.getElementById("confirm-modal");
    const msgEl    = document.getElementById("confirm-message");
    const yesBtn   = document.getElementById("confirm-yes");
    const noBtn    = document.getElementById("confirm-no");

    if (!modal) {
      // Fallback si no hay modal en la página
      resolve(window.confirm(message));
      return;
    }

    if (msgEl) msgEl.textContent = message;

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    const onYes = () => { cleanup(); resolve(true); };
    const onNo  = () => { cleanup(); resolve(false); };

    function cleanup() {
      yesBtn.removeEventListener("click", onYes);
      noBtn.removeEventListener("click", onNo);
      bsModal.hide();
    }

    yesBtn.addEventListener("click", onYes, { once: true });
    noBtn.addEventListener("click", onNo,  { once: true });
  });
}

// ─── Inicializar avatar de letra ───────────────────────────────────────────

/**
 * Genera las iniciales para el avatar de un jugador.
 * @param {string} name
 * @returns {string} Iniciales (máx. 2 chars)
 */
export function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("");
}   