import { randomRange, randomGaussian } from '../../utils/math.js'

/**
 * Projects scene: 6 floating project "cards" in a 2x3 grid,
 * connected by particle streams, with an ambient starfield.
 *
 * Camera: (0, 5, 30) looking at (0, 0, 0)
 * Color palette: cyan (#00e5ff), teal (#00bfa5), electric blue (#2979ff)
 *
 * Particle budget (80,000 total):
 *   0–59%  (48K) — Card particles: ~8K per card, rectangular outlines
 *  60–84%  (20K) — Ambient starfield
 *  85–100% (12K) — Connecting streams between card pairs
 */

// ─── Card layout: 2 rows x 3 columns with z-tilt per card ───
const CARD_WIDTH = 15
const CARD_HEIGHT = 10
const COL_SPACING = 22   // horizontal gap between card centers
const ROW_SPACING = 18   // vertical gap between rows

const CARD_POSITIONS = [
  { x: -COL_SPACING, y: ROW_SPACING * 0.5, z: 2, tilt: 0.08 },    // top-left
  { x: 0,            y: ROW_SPACING * 0.5, z: -1, tilt: -0.05 },   // top-center
  { x: COL_SPACING,  y: ROW_SPACING * 0.5, z: 3, tilt: 0.06 },    // top-right
  { x: -COL_SPACING, y: -ROW_SPACING * 0.5, z: -2, tilt: -0.07 },  // bottom-left
  { x: 0,            y: -ROW_SPACING * 0.5, z: 1, tilt: 0.04 },    // bottom-center
  { x: COL_SPACING,  y: -ROW_SPACING * 0.5, z: -3, tilt: -0.09 },  // bottom-right
]

// Unique accent color per card (all in the cyan-teal-blue family)
const CARD_COLORS = [
  { r: 0.00, g: 0.90, b: 1.00 },  // bright cyan
  { r: 0.00, g: 0.75, b: 0.65 },  // teal
  { r: 0.16, g: 0.47, b: 1.00 },  // electric blue
  { r: 0.10, g: 0.85, b: 0.90 },  // light cyan-teal
  { r: 0.05, g: 0.60, b: 0.95 },  // sky blue
  { r: 0.00, g: 0.80, b: 0.70 },  // aqua-teal
]

// Adjacent card pairs for connecting streams (7 connections)
const CONNECTIONS = [
  [0, 1], [1, 2],       // top row horizontal
  [3, 4], [4, 5],       // bottom row horizontal
  [0, 3], [1, 4], [2, 5], // vertical connections
]

/**
 * Generate a position on a card rectangle with edge bias.
 * ~30% of particles cluster near edges for an "outline" effect;
 * the rest fill the interior for body density.
 */
function cardParticlePosition(card) {
  const hw = CARD_WIDTH / 2
  const hh = CARD_HEIGHT / 2

  let lx, ly
  const isEdge = Math.random() < 0.30

  if (isEdge) {
    // Place on or near the rectangle edge
    const edge = Math.floor(Math.random() * 4)
    const edgeThickness = 0.6 // how close to the edge
    switch (edge) {
      case 0: // top
        lx = (Math.random() - 0.5) * CARD_WIDTH
        ly = hh - Math.random() * edgeThickness
        break
      case 1: // bottom
        lx = (Math.random() - 0.5) * CARD_WIDTH
        ly = -hh + Math.random() * edgeThickness
        break
      case 2: // left
        lx = -hw + Math.random() * edgeThickness
        ly = (Math.random() - 0.5) * CARD_HEIGHT
        break
      case 3: // right
        lx = hw - Math.random() * edgeThickness
        ly = (Math.random() - 0.5) * CARD_HEIGHT
        break
    }
  } else {
    // Interior fill — slight concentration toward center (gaussian-ish)
    lx = randomGaussian(0, hw * 0.45)
    ly = randomGaussian(0, hh * 0.45)
    // Clamp to card bounds
    lx = Math.max(-hw, Math.min(hw, lx))
    ly = Math.max(-hh, Math.min(hh, ly))
  }

  // Apply z-tilt: card tilted around Y-axis by `card.tilt` radians
  const zOffset = lx * card.tilt

  return {
    x: card.x + lx,
    y: card.y + ly,
    z: card.z + zOffset + (Math.random() - 0.5) * 0.3,
  }
}

export function getPositions(i, total) {
  const cardsEnd = Math.floor(total * 0.6)
  const starfieldEnd = Math.floor(total * 0.85)

  // ─── CARD PARTICLES (0–59%): ~8K per card ───
  if (i < cardsEnd) {
    const cardIndex = i % 6
    const card = CARD_POSITIONS[cardIndex]
    const color = CARD_COLORS[cardIndex]
    const pos = cardParticlePosition(card)

    // Local distance from card center for color variation
    const dx = pos.x - card.x
    const dy = pos.y - card.y
    const distFromCenter = Math.sqrt(dx * dx + dy * dy)
    const maxDist = Math.sqrt((CARD_WIDTH / 2) ** 2 + (CARD_HEIGHT / 2) ** 2)
    const normalizedDist = distFromCenter / maxDist

    // Edge particles are brighter, interior slightly dimmer
    const edgeBrightness = 0.6 + normalizedDist * 0.4
    const variance = (Math.random() - 0.5) * 0.08

    return {
      ...pos,
      r: Math.min(1, color.r * edgeBrightness + variance),
      g: Math.min(1, color.g * edgeBrightness + variance),
      b: Math.min(1, color.b * edgeBrightness + variance),
      size: normalizedDist > 0.8
        ? randomRange(0.5, 0.9)   // edge particles slightly larger
        : randomRange(0.25, 0.65),
    }
  }

  // ─── AMBIENT STARFIELD (60–84%): dim cyan/blue ───
  if (i < starfieldEnd) {
    // Spread particles around the card area but further out
    const spread = Math.random() < 0.7
    let x, y, z

    if (spread) {
      x = (Math.random() - 0.5) * 180
      y = (Math.random() - 0.5) * 120
      z = (Math.random() - 0.5) * 80 - 15  // slightly behind cards
    } else {
      // Some particles closer to cards for depth
      const nearCard = CARD_POSITIONS[Math.floor(Math.random() * 6)]
      x = nearCard.x + (Math.random() - 0.5) * 40
      y = nearCard.y + (Math.random() - 0.5) * 30
      z = nearCard.z + (Math.random() - 0.5) * 25 - 10
    }

    const dimness = 0.15 + Math.random() * 0.15
    return {
      x, y, z,
      r: dimness * 0.3,
      g: dimness * 0.7 + Math.random() * 0.05,
      b: dimness + Math.random() * 0.08,
      size: randomRange(0.15, 0.4),
    }
  }

  // ─── CONNECTING STREAMS (85–100%): arcing particles between card pairs ───
  {
    const connIndex = i % CONNECTIONS.length
    const [fromIdx, toIdx] = CONNECTIONS[connIndex]
    const from = CARD_POSITIONS[fromIdx]
    const to = CARD_POSITIONS[toIdx]

    // Parametric position along the connection (0→1)
    const t = Math.random()

    // Linear interpolation for base position
    const bx = from.x + (to.x - from.x) * t
    const by = from.y + (to.y - from.y) * t
    const bz = from.z + (to.z - from.z) * t

    // Arc curvature: parabolic bulge perpendicular to the line
    // Peak at t=0.5, zero at endpoints
    const arcHeight = 4 * t * (1 - t) // peaks at 2.0 when t=0.5
    const midZ = (from.z + to.z) / 2

    // Direction of arc: mostly in z (toward camera) with slight y lift
    const arcZ = arcHeight * 3.0
    const arcY = arcHeight * 1.5

    // Slight spread around the stream
    const spread = 0.4 + arcHeight * 0.3

    // Blend colors of the two connected cards
    const fc = CARD_COLORS[fromIdx]
    const tc = CARD_COLORS[toIdx]
    const brightness = 0.5 + arcHeight * 0.4

    return {
      x: bx + (Math.random() - 0.5) * spread,
      y: by + arcY + (Math.random() - 0.5) * spread,
      z: bz + arcZ + (Math.random() - 0.5) * spread,
      r: (fc.r * (1 - t) + tc.r * t) * brightness,
      g: (fc.g * (1 - t) + tc.g * t) * brightness,
      b: (fc.b * (1 - t) + tc.b * t) * brightness,
      size: randomRange(0.8, 1.2) * (0.5 + arcHeight * 0.8),
    }
  }
}
