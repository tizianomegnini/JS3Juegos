const SCRIPTS = [
  'js/core.js',
  'js/player.js',
  'js/ghosts.js',
  'js/render.js',
  'js/input.js',
  'js/bootstrap.js',
];

function loadSequentially(files, done) {
  const next = (i) => {
    if (i >= files.length) {
      if (done) done();
      return;
    }
    const s = document.createElement("script");
    s.src = files[i];
    s.onload = () => next(i + 1);
    s.onerror = () => { throw new Error(`No se pudo cargar ${files[i]}`); };
    document.head.appendChild(s);
  };
  next(0);
}
const music = document.getElementById("bgMusic");
music.volume = 0.1;

const musicToggle = document.getElementById("musicToggle");

musicToggle.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        musicToggle.textContent = "🔊";
    } else {
        music.pause();
        musicToggle.textContent = "🔇";
    }
});

document.getElementById("playBtn").addEventListener("click", () => {
  music.play();
});
loadSequentially(SCRIPTS);

const menuBtn = document.getElementById("menuBtn");
const menuModal = document.getElementById("menuModal");
const confirmMenu = document.getElementById("confirmMenu");
const cancelMenu = document.getElementById("cancelMenu");

menuBtn.addEventListener("click", () => {
    menuModal.style.display = "flex";
});

cancelMenu.addEventListener("click", () => {
    menuModal.style.display = "none";
});

confirmMenu.addEventListener("click", () => {
    location.reload();
});