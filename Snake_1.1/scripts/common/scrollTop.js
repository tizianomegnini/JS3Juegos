/**
 * scrollTop.js
 * Módulo para el botón de "volver al tope" de la página.
 * Se muestra automáticamente cuando el usuario hace scroll hacia abajo.
 */

/**
 * Inicializa el botón de scroll al top.
 * Debe llamarse en el DOMContentLoaded de cada página.
 */
export function initScrollTop() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  // Mostrar u ocultar según la posición del scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  // Acción al hacer click: scroll suave al tope
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}