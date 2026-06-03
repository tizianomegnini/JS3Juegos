(function() {
  const theme = localStorage.getItem("snake-theme") || "light";
  const globalCss = document.getElementById("global-css");
  const pageCss = document.getElementById("page-css");

  if (theme === "dark") {
    if (globalCss) globalCss.href = (globalCss.getAttribute("href") || "").replace("-light.css", "-dark.css");
    if (pageCss) pageCss.href = (pageCss.getAttribute("href") || "").replace("-light.css", "-dark.css");
  }

  document.documentElement.dataset.theme = theme;
})();
