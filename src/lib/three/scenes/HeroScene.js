import { randomRange, randomGaussian } from '../../utils/math.js'
import { sampleTextPositions } from '../../utils/textSampler.js'

/**
 * Hero scene: cosmic nebula backdrop with the name "ARSHON SAADATI"
 * and "SOFTWARE ENGINEER" spelled out in particles.
 *
 * Camera: (0, 0, 100) looking at (0, 0, 0)
 *
 * Particle budget (80,000 total):
 *   0–40%  (32K) — Scattered stars
 *  40–60%  (16K) — Nebula cloud
 *  60–80%  (16K) — Name text "ARSHON SAADATI" at z=15
 *  80–90%   (8K) — "SOFTWARE ENGINEER" subtitle at y=-9, z=13
 *  90–100%  (8K) — Ambient floaters
 */

let arshonPositions = null
let saadatiPositions = null
let subtitlePositions = null

function ensureTextSampled() {
  if (!arshonPositions) {
    arshonPositions = sampleTextPositions('ARSHON', 160, 5000, 55)
  }
  if (!saadatiPositions) {
    saadatiPositions = sampleTextPositions('SAADATI', 160, 5000, 55)
  }
  if (!subtitlePositions) {
    subtitlePositions = sampleTextPositions('SOFTWARE ENGINEER', 55, 8000, 70)
  }
}

const NEBULA_CLUSTERS = [
  { x: 0,   y: 0,  z: -8,  sigma: 9, weight: 0.35 },
  { x: -10, y: 5,  z: -10, sigma: 6, weight: 0.2 },
  { x: 8,   y: -4, z: -6,  sigma: 7, weight: 0.2 },
  { x: 3,   y: 8,  z: -12, sigma: 5, weight: 0.15 },
  { x: -5,  y: -7, z: -15, sigma: 4, weight: 0.1 },
]

const cumulativeWeights = []
{
  let sum = 0
  for (const c of NEBULA_CLUSTERS) {
    sum += c.weight
    cumulativeWeights.push(sum)
  }
}

function pickCluster() {
  const r = Math.random()
  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (r <= cumulativeWeights[i]) return NEBULA_CLUSTERS[i]
  }
  return NEBULA_CLUSTERS[NEBULA_CLUSTERS.length - 1]
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return { r: ((n >> 16) & 0xff) / 255, g: ((n >> 8) & 0xff) / 255, b: (n & 0xff) / 255 }
}

const DEEP_BLUE = hexToRgb('#1a1a6e')
const PURPLE = hexToRgb('#6a0dad')

export function getPositions(i, total) {
  const starsEnd    = Math.floor(total * 0.40)
  const nebulaEnd   = Math.floor(total * 0.60)
  const textEnd     = Math.floor(total * 0.80)
  const subtitleEnd = Math.floor(total * 0.90)

  // ─── SCATTERED STARS (0–39%) ───
  if (i < starsEnd) {
    const radius = 80 + Math.pow(Math.random(), 0.7) * 120
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(1 - 2 * (i + 0.5) / starsEnd)

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    const brightness = 0.40 + Math.random() * 0.20  // 0.40-0.60 range (stars stay below bloom threshold)
    const blueTint = Math.random() * 0.15
    const isHighlight = Math.random() < 0.05
    const boost = isHighlight ? 0.3 : 0

    return {
      x, y, z,
      r: brightness - blueTint + boost * 0.1,
      g: brightness - blueTint * 0.4 + boost * 0.1,
      b: Math.min(1, brightness + blueTint * 0.3 + boost * 0.2),
      size: isHighlight ? randomRange(0.6, 0.9) : randomRange(0.2, 0.7),
    }
  }

  // ─── NEBULA CLOUD (40–59%) ───
  if (i < nebulaEnd) {
    const cluster = pickCluster()
    const sigma = cluster.sigma

    const ox = randomGaussian(0, sigma)
    const oy = randomGaussian(0, sigma * 0.8)
    const oz = randomGaussian(0, sigma * 0.6)

    const dist = Math.sqrt(ox * ox + oy * oy + oz * oz)
    const falloff = Math.exp(-dist * dist / (sigma * sigma * 2))

    const purpleMix = Math.random() * 0.7 + 0.15
    const r = DEEP_BLUE.r * (1 - purpleMix) + PURPLE.r * purpleMix
    const g = DEEP_BLUE.g * (1 - purpleMix) + PURPLE.g * purpleMix
    const b = DEEP_BLUE.b * (1 - purpleMix) + PURPLE.b * purpleMix

    // Core particles (high falloff) bloom intentionally; outer particles stay below threshold
    const isCore = falloff > 0.7
    const coreBrightness = isCore
      ? 0.72 + falloff * 0.13 + Math.random() * 0.05   // 0.72–0.85: blooms slightly
      : 0.3 + falloff * 0.3                             // outer: stays dim

    return {
      x: cluster.x + ox,
      y: cluster.y + oy,
      z: cluster.z + oz,
      r: Math.min(isCore ? 0.85 : 0.60, r * coreBrightness + Math.random() * 0.05),
      g: Math.min(isCore ? 0.85 : 0.60, g * coreBrightness + Math.random() * 0.03),
      b: Math.min(isCore ? 0.85 : 0.60, b * coreBrightness + Math.random() * 0.08),
      size: randomRange(0.3, 0.7) * (0.5 + falloff * 0.6),
    }
  }

  // ─── "ARSHON" text (60–69%) ───
  if (i < Math.floor(total * 0.70)) {
    ensureTextSampled()

    if (!arshonPositions || arshonPositions.length === 0) {
      return { x: (Math.random() - 0.5) * 60, y: 6, z: 15, r: 1, g: 1, b: 1, size: 0.9 }
    }

    const groupIndex = i - Math.floor(total * 0.6)
    const pos = arshonPositions[groupIndex % arshonPositions.length]
    return {
      x: pos.x,
      y: 6 + pos.y,
      z: 15 + (Math.random() - 0.5) * 4,
      r: 0.85, g: 0.90, b: 1.0,
      size: randomRange(0.7, 1.1),
    }
  }

  // ─── "SAADATI" text (70–79%) ───
  if (i < textEnd) {
    ensureTextSampled()

    if (!saadatiPositions || saadatiPositions.length === 0) {
      return { x: (Math.random() - 0.5) * 60, y: -4, z: 15, r: 1, g: 1, b: 1, size: 0.9 }
    }

    const groupIndex = i - Math.floor(total * 0.7)
    const pos = saadatiPositions[groupIndex % saadatiPositions.length]
    return {
      x: pos.x,
      y: -4 + pos.y,
      z: 15 + (Math.random() - 0.5) * 4,
      r: 0.85, g: 0.88, b: 1.0,
      size: randomRange(0.7, 1.1),
    }
  }

  // ─── SOFTWARE ENGINEER SUBTITLE (80–89%) ───
  if (i < subtitleEnd) {
    ensureTextSampled()

    if (!subtitlePositions || subtitlePositions.length === 0) {
      return {
        x: (Math.random() - 0.5) * 60,
        y: -9,
        z: 13,
        r: 0.7, g: 0.78, b: 1.0, size: 0.6,
      }
    }

    const groupIndex = i - Math.floor(total * 0.8)
    const textIdx = groupIndex % subtitlePositions.length
    const pos = subtitlePositions[textIdx]

    // Pale blue-white, 0.55-0.7 range
    const variance = Math.random() * 0.15
    return {
      x: pos.x,
      y: pos.y - 9,    // offset down from name text
      z: 13 + (Math.random() - 0.5) * 0.8,
      r: 0.50 + variance * 0.25,
      g: 0.58 + variance * 0.2,
      b: Math.min(0.7, 0.65 + variance * 0.1),
      size: randomRange(0.5, 0.8),
    }
  }

  // ─── AMBIENT FLOATERS (90–100%): faint purple/blue ───
  {
    const strategy = Math.random()
    let x, y, z
    if (strategy < 0.6) {
      x = (Math.random() - 0.5) * 300
      y = (Math.random() - 0.5) * 300
      z = (Math.random() - 0.5) * 300
    } else if (strategy < 0.85) {
      const angle = Math.random() * Math.PI * 2
      const dist = 25 + Math.random() * 40
      const height = (Math.random() - 0.5) * 50
      x = Math.cos(angle) * dist
      y = height
      z = Math.sin(angle) * dist
    } else {
      x = (Math.random() - 0.5) * 200
      y = randomGaussian(0, 3)
      z = (Math.random() - 0.5) * 200
    }

    const purpleShift = Math.random() * 0.3
    return {
      x, y, z,
      r: 0.12 + purpleShift * 0.3 + Math.random() * 0.05,
      g: 0.06 + Math.random() * 0.08,
      b: 0.18 + purpleShift * 0.25 + Math.random() * 0.1,
      size: randomRange(0.15, 0.45),
    }
  }
}
