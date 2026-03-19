import { randomRange } from '../../utils/math.js'

/**
 * Projects scene placeholder: particles form rectangular card-like clusters.
 * The "scenes" agent will refine this with proper card grid layout,
 * connecting streams, and per-project colors.
 *
 * Color palette: cyan, teal, electric blue
 */

// 6 card center positions in a 2x3 grid
const CARD_POSITIONS = [
  { x: -20, y: 12, z: 0 },
  { x: 0, y: 12, z: 0 },
  { x: 20, y: 12, z: 0 },
  { x: -20, y: -8, z: 0 },
  { x: 0, y: -8, z: 0 },
  { x: 20, y: -8, z: 0 },
]

const CARD_COLORS = [
  { r: 0, g: 0.9, b: 1 },       // cyan
  { r: 0, g: 0.75, b: 0.65 },   // teal
  { r: 0.16, g: 0.47, b: 1 },   // electric blue
  { r: 0, g: 0.8, b: 0.9 },     // light cyan
  { r: 0.1, g: 0.6, b: 0.8 },   // steel blue
  { r: 0, g: 0.85, b: 0.75 },   // aqua
]

export function getPositions(i, total) {
  const cardsEnd = Math.floor(total * 0.6)
  const starfieldEnd = Math.floor(total * 0.85)

  if (i < cardsEnd) {
    // ─── Card particles (60%): distributed among 6 cards ───
    const cardIndex = i % CARD_POSITIONS.length
    const card = CARD_POSITIONS[cardIndex]
    const color = CARD_COLORS[cardIndex]

    // Fill a rectangular area around the card center
    const halfW = 7
    const halfH = 5

    return {
      x: card.x + (Math.random() - 0.5) * halfW * 2,
      y: card.y + (Math.random() - 0.5) * halfH * 2,
      z: card.z + (Math.random() - 0.5) * 1.5,
      r: color.r + (Math.random() - 0.5) * 0.1,
      g: color.g + (Math.random() - 0.5) * 0.1,
      b: color.b + (Math.random() - 0.5) * 0.1,
      size: randomRange(0.3, 0.8),
    }
  }

  if (i < starfieldEnd) {
    // ─── Ambient starfield (25%) ───
    return {
      x: (Math.random() - 0.5) * 150,
      y: (Math.random() - 0.5) * 100,
      z: (Math.random() - 0.5) * 100,
      r: 0.05 + Math.random() * 0.1,
      g: 0.15 + Math.random() * 0.15,
      b: 0.2 + Math.random() * 0.15,
      size: randomRange(0.2, 0.4),
    }
  }

  // ─── Connecting streams (15%): lines between adjacent cards ───
  const lineIndex = i % 5
  const fromCard = CARD_POSITIONS[lineIndex]
  const toCard = CARD_POSITIONS[(lineIndex + 1) % CARD_POSITIONS.length]
  const t = Math.random()

  return {
    x: fromCard.x + (toCard.x - fromCard.x) * t + (Math.random() - 0.5) * 0.5,
    y: fromCard.y + (toCard.y - fromCard.y) * t + (Math.random() - 0.5) * 0.5,
    z: fromCard.z + (toCard.z - fromCard.z) * t + (Math.random() - 0.5) * 0.5,
    r: 0,
    g: 0.6 + Math.random() * 0.2,
    b: 0.8 + Math.random() * 0.2,
    size: randomRange(0.15, 0.35),
  }
}
