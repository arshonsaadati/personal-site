import { randomRange } from '../../utils/math.js'

/**
 * Projects scene: 6 floating card formations with connecting streams.
 *
 * Camera: (0, 5, 40) looking at (0, 0, 0)
 * Color palette: cyan (#00e5ff), teal (#00bfa5), electric blue (#2979ff)
 *
 * Distribution:
 *   0-59%  (48K) — Card particles: ~8K per card, flat rectangular grids (15x10)
 *   60-84% (20K) — Ambient starfield around cards
 *   85-100%(12K) — Connecting particle streams between adjacent cards
 */

// 6 card centers in 2x3 grid, ~25 units apart, with slight z-tilt
const CARD_POSITIONS = [
  { x: -25, y: 12, z: -2 },
  { x: 0,   y: 12, z: 1 },
  { x: 25,  y: 12, z: -1 },
  { x: -25, y: -12, z: 1 },
  { x: 0,   y: -12, z: -2 },
  { x: 25,  y: -12, z: 0 },
]

// Unique accent color per card
const CARD_COLORS = [
  { r: 0, g: 0.9, b: 1.0 },       // cyan #00e5ff
  { r: 0, g: 0.75, b: 0.65 },     // teal #00bfa5
  { r: 0.16, g: 0.47, b: 1.0 },   // electric blue #2979ff
  { r: 0, g: 0.8, b: 0.9 },       // light cyan
  { r: 0.1, g: 0.6, b: 0.85 },    // steel blue
  { r: 0, g: 0.85, b: 0.7 },      // aqua
]

// Connections between adjacent cards (indices)
const CONNECTIONS = [
  [0, 1], [1, 2],       // top row
  [3, 4], [4, 5],       // bottom row
  [0, 3], [1, 4], [2, 5], // verticals
]

export function getPositions(i, total) {
  const cardsEnd = Math.floor(total * 0.6)
  const starfieldEnd = Math.floor(total * 0.85)

  if (i < cardsEnd) {
    // ─── Card particles (60%): ~8K per card in rectangular grid ───
    const cardIndex = i % CARD_POSITIONS.length
    const card = CARD_POSITIONS[cardIndex]
    const color = CARD_COLORS[cardIndex]

    // Flat rectangular grid: 15 wide x 10 tall
    const halfW = 7.5
    const halfH = 5

    // Grid-based placement with slight randomization for density
    const gx = (Math.random() - 0.5) * halfW * 2
    const gy = (Math.random() - 0.5) * halfH * 2

    // Concentrate more particles near edges (card outline effect)
    const edgeBias = Math.random()
    let fx = gx, fy = gy
    if (edgeBias < 0.3) {
      // Edge particles: snap to border
      const side = Math.floor(Math.random() * 4)
      if (side === 0) fy = -halfH + (Math.random() - 0.5) * 0.8
      else if (side === 1) fy = halfH + (Math.random() - 0.5) * 0.8
      else if (side === 2) fx = -halfW + (Math.random() - 0.5) * 0.8
      else fx = halfW + (Math.random() - 0.5) * 0.8
    }

    return {
      x: card.x + fx,
      y: card.y + fy,
      z: card.z + (Math.random() - 0.5) * 0.8,
      r: color.r + (Math.random() - 0.5) * 0.08,
      g: color.g + (Math.random() - 0.5) * 0.08,
      b: color.b + (Math.random() - 0.5) * 0.08,
      size: randomRange(0.3, 0.8),
    }
  }

  if (i < starfieldEnd) {
    // ─── Ambient starfield (25%): wide spread, dim ───
    return {
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 100,
      z: (Math.random() - 0.5) * 80,
      r: 0.03 + Math.random() * 0.08,
      g: 0.1 + Math.random() * 0.15,
      b: 0.15 + Math.random() * 0.15,
      size: randomRange(0.15, 0.4),
    }
  }

  // ─── Connecting streams (15%): particles flowing between adjacent cards ───
  const connIndex = i % CONNECTIONS.length
  const [fromIdx, toIdx] = CONNECTIONS[connIndex]
  const from = CARD_POSITIONS[fromIdx]
  const to = CARD_POSITIONS[toIdx]

  const t = Math.random()
  // Slight arc: particles bow outward from the straight line
  const arcHeight = Math.sin(t * Math.PI) * 2.5

  return {
    x: from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 0.6,
    y: from.y + (to.y - from.y) * t + arcHeight + (Math.random() - 0.5) * 0.4,
    z: from.z + (to.z - from.z) * t + (Math.random() - 0.5) * 0.6,
    r: 0,
    g: 0.55 + Math.random() * 0.25,
    b: 0.75 + Math.random() * 0.25,
    size: randomRange(0.15, 0.35),
  }
}
