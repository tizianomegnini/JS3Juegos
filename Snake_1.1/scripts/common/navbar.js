/**
 * navbar.js
 * Módulo para resaltar el enlace activo en la barra de navegación
 * según la página actual.
 */

/**
 * Marca como activo el nav-link que corresponde a la URL actual.
 * Debe llamarse en el DOMContentLoaded de cada página.
 */
export function initNavbar() {
  const path  = window.location.pathname;
  const links = document.querySelectorAll(".navbar-custom .nav-link");

  links.forEach(link => {
    const href = link.getAttribute("href") || "";
    // Comparar la ruta del link con la URL actual
    const isActive =
      (href === "/" && (path === "/" || path === "/index.html")) ||
      (href !== "/" && path.includes(href.replace("/", "")));

    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
  });
}