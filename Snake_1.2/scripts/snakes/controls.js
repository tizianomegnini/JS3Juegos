/**
 * controls.js
 * Módulo de controles de teclado y táctiles para las serpientes.
 * Soporta 1 o 2 jugadores con controles separados.
 */

/**
 * Mapeo de teclas para cada jugador.
 * Jugador 1: WASD | Flechas
 * Jugador 2: IJKL
 */
const KEY_MAP = {
  // Jugador 1 — Flechas
  "ArrowUp":    { player: 1, dir: "UP"    },
  "ArrowDown":  { player: 1, dir: "DOWN"  },
  "ArrowLeft":  { player: 1, dir: "LEFT"  },
  "ArrowRight": { player: 1, dir: "RIGHT" },
  // Jugador 1 — WASD
  "w": { player: 1, dir: "UP"    },
  "s": { player: 1, dir: "DOWN"  },
  "a": { player: 1, dir: "LEFT"  },
  "d": { player: 1, dir: "RIGHT" },
  "W": { player: 1, dir: "UP"    },
  "S": { player: 1, dir: "DOWN"  },
  "A": { player: 1, dir: "LEFT"  },
  "D": { player: 1, dir: "RIGHT" },
  // Jugador 2 — IJKL
  "i": { player: 2, dir: "UP"    },
  "k": { player: 2, dir: "DOWN"  },
  "j": { player: 2, dir: "LEFT"  },
  "l": { player: 2, dir: "RIGHT" },
  "I": { player: 2, dir: "UP"    },
  "K": { player: 2, dir: "DOWN"  },
  "J": { player: 2, dir: "LEFT"  },
  "L": { player: 2, dir: "RIGHT" }
};

/**
 * Registra los controles de teclado.
 * @param {Function} onInput - Callback: ({ player, dir }) => void
 * @param {Function} [onPause] - Callback al presionar Escape o P
 * @returns {Function} Función para desregistrar los eventos
 */
export function registerKeyboardControls(onInput, onPause) {
  const handler = (e) => {
    // Prevenir scroll con flechas
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }

    if ((e.key === "Escape" || e.key === "p" || e.key === "P") && onPause) {
      onPause();
      return;
    }

    const action = KEY_MAP[e.key];
    if (action) onInput(action);
  };

  window.addEventListener("keydown", handler);

  // Retorna función para limpiar
  return () => window.removeEventListener("keydown", handler);
}

/**
 * Registra controles táctiles para el D-pad.
 * @param {HTMLElement} container - Elemento que contiene los botones .dpad-btn
 * @param {Function} onInput - Callback: ({ player, dir }) => void
 * @param {number} [playerNum=1] - Número de jugador (1 o 2)
 */
export function registerDpadControls(container, onInput, playerNum = 1) {
  if (!container) return;

  container.querySelectorAll(".dpad-btn").forEach(btn => {
    const dir = btn.dataset.dir;
    if (!dir) return;

    if (window.PointerEvent) {
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        onInput({ player: playerNum, dir });
      });
    } else {
      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        onInput({ player: playerNum, dir });
      }, { passive: false });

      btn.addEventListener("mousedown", () => {
        onInput({ player: playerNum, dir });
      });
    }
  });
}
