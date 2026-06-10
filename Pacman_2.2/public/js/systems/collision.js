/**
 * COLLISION.JS
 * ═════════════════════════════════════════════════════════════════════════
 * Detección de colisiones: verificar si posición es caminable, obtener
 * información de tiles, validar movimientos.
 * 
 * Responsabilidades:
 * - getTile: retorna tipo de tile en coordenadas
 * - isWalkable: verifica si una posición es transitable
 * - canStep: valida si una entidad puede moverse en una dirección
 * - countDots: cuenta pellets en el mapa
 * - cloneMap: crea copia del mapa del nivel actual
 */

/**
 * Obtiene información del tile en posición (x, y)
 * Wraparound en bordes, retorna valor de tile
 * @param {number} x, y - Posición en el mapa
 * @returns {object} { tx, ty, value } - Posición tile y valor (0-4)
 */
function getTile(x, y) {
  const tx = wrap(Math.floor(x + 0.5), COLS);
  const ty = wrap(Math.floor(y + 0.5), ROWS);
  return {
    tx,
    ty,
    value: map[ty]?.[tx] ?? 1 // Default a pared si no existe
  };
}

/**
 * Verifica si una posición es caminable (no es pared)
 * @param {number} x, y - Posición a verificar
 * @param {boolean} forGhost - Si es true, también bloquea casa fantasmas (tile 4)
 * @returns {boolean} true si es caminable
 */
function isWalkable(x, y, forGhost = false) {
  const { value } = getTile(x, y);
  if (forGhost) {
    // Los fantasmas fuera de la casa no pueden entrar
    return value !== 1 && value !== 4;
  }
  // El jugador no puede entrar a paredes ni casa fantasmas
  return value !== 1 && value !== 4;
}

/**
 * Valida si una entidad puede moverse en una dirección específica
 * @param {object} entity - Entidad con x, y, dirección
 * @param {object} direction - { x, y } dirección de movimiento
 * @param {boolean} forGhost - Si es fantasma (cambia reglas)
 * @returns {boolean} true si puede moverse en esa dirección
 */
function canStep(entity, direction, forGhost = false) {
  return isWalkable(entity.x + direction.x, entity.y + direction.y, forGhost);
}

/**
 * Cuenta el número de pellets (dots) en el mapa actual
 * Tiles tipo 2 (dot) y 3 (powerup) cuentan como pellets
 * @param {array} mapData - Mapa 2D a contar (default: mapa global)
 * @returns {number} Cantidad de pellets
 */
function countDots(mapData = map) {
  let count = 0;
  for (const row of mapData) {
    for (const value of row) {
      if (value === 2 || value === 3) count++;
    }
  }
  return count;
}

/**
 * Crea una copia profunda del mapa del nivel actual
 * Necesario para manipular el mapa sin alterar el original
 * @returns {array} Nuevo mapa clonado
 */
function cloneMap() {
  return MAPS[Math.min(level - 1, MAX_LEVEL - 1)].map(row => row.slice());
}

/**
 * Encuentra una posición válida para spawn del jugador
 * Intenta primero posiciones preferenciales, luego busca en todo el mapa
 * @returns {object} { x, y } Primera posición caminable encontrada
 */
function findSpawnPosition() {
  // Posiciones preferenciales (área de spawn)
  const candidates = [
    { x: 9, y: 16 },
    { x: 9, y: 15 },
    { x: 9, y: 14 },
    { x: 8, y: 16 },
    { x: 10, y: 16 },
    { x: 8, y: 15 },
    { x: 10, y: 15 },
  ];

  for (const pos of candidates) {
    const tile = getTile(pos.x, pos.y);
    if (tile.value !== 1 && tile.value !== 4) return pos;
  }

  // Si no hay opción preferencial, buscar en todo el mapa
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const tile = getTile(x, y);
      if (tile.value !== 1 && tile.value !== 4) return { x, y };
    }
  }

  // Fallback: posición por defecto
  return { x: 9, y: 16 };
}
