import { randomRange, randomGaussian, randomPointOnSphere } from '../../utils/math.js'
import { sampleTextPositions } from '../../utils/textSampler.js'

/**
 * Hero scene: cosmic nebula backdrop with the name "ARSHON SAADATI"
 * spelled out in particles, surrounded by scattered stars and ambient floaters.
 *
 * Camera: (0, 0, 100) looking at (0, 0, 0)
 * Color palette: deep blues (#1a1a6e), purples (#6a0dad), white stars, cyan highlights
 *
 * Particle budget (80,000 total):
 *   0–39%  (32K) — Scattered stars: spherical shell R=80..200
 *  40–59%  (16K) — Nebula cloud: multi-cluster gaussian near origin
 *  60–79%  (16K) — Name text "ARSHON SAADATI"
 *  80–100% (16K) — Ambient floaters: wide spread, faint
 */

// Pre-sample text positions (cached internally by textSampler)
let textPositions = null

function ensureTextSampled() {
  if (!textPositions) {
    textPositions = sampleTextPositions('ARSHON SAADATI', 140, 16000)
  }
  return textPositions
}

// Nebula cluster centers — multiple overlapping clouds for organic shape
const NEBULA_CLUSTERS = [
  { x: 0, y: 0, z: -8, sigma: 9, weight: 0.35 },
  { x: -10, y: 5, z: -10, sigma: 6, weight: 0.2 },
  { x: 8, y: -4, z: -6, sigma: 7, weight: 0.2 },
  { x: 3, y: 8, z: -12, sigma: 5, weight: 0.15 },
  { x: -5, y: -7, z: -15, sigma: 4, weight: 0.1 },
]

// Pre-compute cumulative weights for cluster selection
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

// Color helpers
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return { r: ((n >> 16) & 0xff) / 255, g: ((n >> 8) & 0xff) / 255, b: (n & 0xff) / 255 }
}

const DEEP_BLUE = hexToRgb('#1a1a6e')
const PURPLE = hexToRgb('#6a0dad')
const CYAN = hexToRgb('#00e5ff')

export function getPositions(i, total) {
  const starsEnd = Math.floor(total * 0.4)
  const nebulaEnd = Math.floor(total * 0.6)
  const textEnd = Math.floor(total * 0.8)

  // ─── SCATTERED STARS (0–39%): spherical shell, white/pale blue ───
  if (i < starsEnd) {
    // Spherical shell with bias toward outer edge for depth
    const radius = 80 + Math.pow(Math.random(), 0.7) * 120
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(1 - 2 * (i + 0.5) / starsEnd) // sunflower uniform distribution

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    // Mostly white/pale blue with occasional slightly warmer tones
    const brightness = 0.65 + Math.random() * 0.35
    const blueTint = Math.random() * 0.15
    // A few "highlight" stars are brighter and slightly larger
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

  // ─── NEBULA CLOUD (40–59%): multi-cluster gaussian, deep purple/blue ───
  if (i < nebulaEnd) {
    const cluster = pickCluster()
    const sigma = cluster.sigma

    // Gaussian offset from cluster center
    const ox = randomGaussian(0, sigma)
    const oy = randomGaussian(0, sigma * 0.8)
    const oz = randomGaussian(0, sigma * 0.6)

    // Distance from cluster center affects color — core brighter, edges darker
    const dist = Math.sqrt(ox * ox + oy * oy + oz * oz)
    const falloff = Math.exp(-dist * dist / (sigma * sigma * 2))

    // Blend between deep blue and purple based on random + cluster position
    const purpleMix = Math.random() * 0.7 + 0.15
    const r = DEEP_BLUE.r * (1 - purpleMix) + PURPLE.r * purpleMix
    const g = DEEP_BLUE.g * (1 - purpleMix) + PURPLE.g * purpleMix
    const b = DEEP_BLUE.b * (1 - purpleMix) + PURPLE.b * purpleMix

    // Core particles get a brightness boost
    const coreBrightness = 0.3 + falloff * 0.4

    return {
      x: cluster.x + ox,
      y: cluster.y + oy,
      z: cluster.z + oz,
      r: Math.min(0.7, r * coreBrightness + Math.random() * 0.05),
      g: Math.min(0.7, g * coreBrightness + Math.random() * 0.03),
      b: Math.min(0.7, b * coreBrightness + Math.random() * 0.08),
      size: randomRange(0.3, 0.7) * (0.5 + falloff * 0.6),
    }
  }

  // ─── NAME TEXT "ARSHON SAADATI" (60–79%): bright white/cyan ───
  if (i < textEnd) {
    const positions = ensureTextSampled()

    if (positions.length === 0) {
      // Fallback if text rendering failed
      return {
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 2,
        r: 1, g: 1, b: 1, size: 0.8,
      }
    }

    // Map particle index within this group to a text position
    const groupIndex = i - Math.floor(total * 0.6)
    const textIdx = groupIndex % positions.length
    const pos = positions[textIdx]

    // Z-jitter for depth
    const zJitter = (Math.random() - 0.5) * 1.0

    // Color: bright white with cyan tint, some variance
    const cyanAmount = Math.random() * 0.35
    const brightness = 0.85 + Math.random() * 0.15

    return {
      x: pos.x,
      y: pos.y,
      z: 15 + zJitter,
      r: Math.min(1, brightness - cyanAmount * 0.1),
      g: Math.min(1, brightness + cyanAmount * 0.05),
      b: Math.min(1, brightness + cyanAmount * 0.3),
      size: randomRange(1.2, 1.8),
    }
  }

  // ─── AMBIENT FLOATERS (80–100%): wide spread, faint purple/blue ───
  {
    // Use multiple distribution strategies for natural-looking ambient particles
    const strategy = Math.random()

    let x, y, z
    if (strategy < 0.6) {
      // Wide uniform spread
      x = (Math.random() - 0.5) * 300
      y = (Math.random() - 0.5) * 300
      z = (Math.random() - 0.5) * 300
    } else if (strategy < 0.85) {
      // Clustered near nebula periphery
      const angle = Math.random() * Math.PI * 2
      const dist = 25 + Math.random() * 40
      const height = (Math.random() - 0.5) * 50
      x = Math.cos(angle) * dist
      y = height
      z = Math.sin(angle) * dist
    } else {
      // Thin plane (galaxy-like disk)
      x = (Math.random() - 0.5) * 200
      y = randomGaussian(0, 3)
      z = (Math.random() - 0.5) * 200
    }

    // Faint purple/blue tones
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
