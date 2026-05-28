 import { initTheme }     from "/scripts/common/theme.js";
    import { initNavbar }    from "/scripts/common/navbar.js";
    import { initScrollTop } from "/scripts/common/scrollTop.js";
    import { showToast }     from "/scripts/common/ui.js";
    import { saveScore }     from "/scripts/common/storage.js";
    import {
      initGame, startGame, stopGame,
      togglePause, toggleMute, getMuted,
      getIsRunning, getIsPaused
    } from "/scripts/snakes/game.js";

    initTheme(); initNavbar(); initScrollTop();

    let selectedMode  = "1P";
    let selectedMap   = "medium";
    let selectedFood  = 1;
    let selectedWall  = "wall";
    let currentScores = null;

    function setupSelector(containerId, onSelect) {
      document.querySelectorAll(`#${containerId} .option-btn`).forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(`#${containerId} .option-btn`).forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          onSelect(btn.dataset.value);
        });
      });
    }

    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedMode = btn.dataset.mode;
      });
    });

    setupSelector("map-selector",  v => { selectedMap  = v; });
    setupSelector("food-selector", v => { selectedFood = parseInt(v); });
    setupSelector("wall-selector", v => { selectedWall = v; });

    document.getElementById("start-btn").addEventListener("click", () => {
      document.getElementById("setup-panel").style.display = "none";
      document.getElementById("game-area").classList.add("active");
      document.querySelector("nav.navbar").classList.add("navbar--hidden");

      const is2P = selectedMode === "2P";
      document.getElementById("score-box-p2").style.display  = is2P ? "" : "none";
      document.getElementById("dpad-p2").style.display        = is2P ? "" : "none";
      document.getElementById("controls-p2").style.display    = is2P ? "" : "none";

      const canvas = document.getElementById("game-canvas");
      initGame(canvas, {
        mode:      selectedMode,
        mapSize:   selectedMap,
        foodCount: selectedFood,
        wallMode:  selectedWall,
        onEnd:     handleGameEnd,
        onScore:   handleScoreUpdate,
        onTimer:   t => { document.getElementById("timer-display").textContent = t; }
      });
      startGame();
    });

    function returnToSetup() {
      document.querySelector("nav.navbar").classList.remove("navbar--hidden");
      document.getElementById("game-area").classList.remove("active");
      document.getElementById("setup-panel").style.display = "";
      ["score-p1","score-p2"].forEach(id => document.getElementById(id).textContent = "0");
      ["level-p1","level-p2"].forEach(id => document.getElementById(id).textContent = "NIV 1");
      document.getElementById("timer-display").textContent = "00:00";
      document.getElementById("pause-btn").textContent = "⏸ Pausa";
    }

    function handleScoreUpdate({ score1, score2, level1, level2 }) {
      document.getElementById("score-p1").textContent = score1;
      document.getElementById("score-p2").textContent = score2;
      document.getElementById("level-p1").textContent = "NIV " + level1;
      document.getElementById("level-p2").textContent = "NIV " + level2;
    }

    function handleGameEnd({ score1, score2, result, mode }) {
      currentScores = { score1, score2, result, mode };

      let msg = "";
      if (mode === "1P") {
        msg = `<span class="result-score">${score1}</span><span class="result-label"> puntos</span>`;
      } else if (result) {
        const winnerLabel = result.winner === 1 ? "🟢 Jugador 1"
                          : result.winner === 2 ? "🔵 Jugador 2"
                          : null;
        msg = winnerLabel
          ? `<span class="result-winner">${winnerLabel} gana!</span><br><span class="result-scores">${score1} — ${score2}</span>`
          : `<span class="result-tie">🤝 ¡Empate!</span><br><span class="result-scores">${score1} — ${score2}</span>`;
      }
      document.getElementById("end-result-msg").innerHTML = msg;

      const is2P = mode === "2P";
      document.getElementById("initials-block-p2").style.display = is2P ? "" : "none";
      ["initials-p1","initials-p2"].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ""; el.classList.remove("is-invalid","is-valid"); }
      });
      document.getElementById("initials-p1-error").textContent = "";
      const e2 = document.getElementById("initials-p2-error");
      if (e2) e2.textContent = "";

      new bootstrap.Modal(document.getElementById("initials-modal")).show();
      setTimeout(() => document.getElementById("initials-p1").focus(), 400);
    }

    document.querySelectorAll(".initials-input").forEach(el => {
      el.addEventListener("input", () => {
        el.value = el.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);
      });
      el.addEventListener("keydown", e => {
        if (e.key === "Enter") document.getElementById("save-initials-btn").click();
      });
    });

    function validateInitials(v) {
      const c = v.trim().toUpperCase();
      if (!c) return "Ingresá al menos 1 carácter.";
      if (!/^[A-Z0-9]{1,3}$/.test(c)) return "Solo letras o números, máximo 3.";
      return null;
    }

    document.getElementById("save-initials-btn").addEventListener("click", () => {
      const inp1 = document.getElementById("initials-p1");
      const err1 = document.getElementById("initials-p1-error");
      const is2P = currentScores?.mode === "2P";

      const e1 = validateInitials(inp1.value);
      err1.textContent = e1 || "";
      err1.classList.toggle("visible", !!e1);
      inp1.classList.toggle("is-invalid", !!e1);

      let e2 = null;
      if (is2P) {
        const inp2 = document.getElementById("initials-p2");
        const er2  = document.getElementById("initials-p2-error");
        e2 = validateInitials(inp2.value);
        er2.textContent = e2 || "";
        er2.classList.toggle("visible", !!e2);
        inp2.classList.toggle("is-invalid", !!e2);
      }
      if (e1 || e2) return;

      saveScore({ initials: inp1.value, score: currentScores.score1, mode: currentScores.mode });
      if (is2P) {
        saveScore({ initials: document.getElementById("initials-p2").value,
                    score: currentScores.score2, mode: currentScores.mode });
      }

      bootstrap.Modal.getInstance(document.getElementById("initials-modal")).hide();
      showToast("¡Puntaje guardado! 🏆", "success");
      window.location.href = "/ranking";
    });

    document.getElementById("skip-initials-btn").addEventListener("click", () => {
      bootstrap.Modal.getInstance(document.getElementById("initials-modal")).hide();
      returnToSetup();
    });

    document.getElementById("pause-btn").addEventListener("click", () => {
      if (!getIsRunning()) return;
      togglePause();
      document.getElementById("pause-btn").textContent = getIsPaused() ? "▶ Reanudar" : "⏸ Pausa";
    });

    document.getElementById("mute-btn").addEventListener("click", () => {
      toggleMute();
      document.getElementById("mute-btn").textContent = getMuted() ? "🔇" : "🔊";
    });

    document.getElementById("stop-btn").addEventListener("click", () => {
      if (!getIsRunning()) return;
      stopGame();
      returnToSetup();
    });