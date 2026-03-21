import { randomRange } from '../../utils/math.js'
import { sampleTextPositions } from '../../utils/textSampler.js'

/**
 * Projects scene: each project title floats as a particle-text formation.
 * The active node's title fills 75% of particles; 25% is ambient starfield.
 *
 * Camera: (0, 5, 80) looking at (0, 5, 0)
 * Text placed at z=0, y centered at 5
 *
 * Particle budget (80,000 total):
 *   0–75%  (60K) — Project title text particles
 *  75–100% (20K) — Ambient starfield
 */

const PROJECT_TITLES = [
  'SKYRYSE',
  'FCC SIMULATOR',
  'YOLKED AI',
  'AMAZON SCOT',
  'BUILD-A-FAIR',
  'THIS PORTFOLIO',
]

// Accent colors per project (matching projects.js)
const PROJECT_COLORS = [
  { r: 0.00, g: 0.898, b: 1.000 },  // #00e5ff cyan
  { r: 0.161, g: 0.475, b: 1.000 }, // #2979ff blue
  { r: 0.00, g: 0.898, b: 1.000 },  // #00e5ff cyan
  { r: 0.00, g: 0.749, b: 0.647 },  // #00bfa5 teal
  { r: 0.486, g: 0.302, b: 1.000 }, // #7c4dff purple
  { r: 0.878, g: 0.251, b: 0.984 }, // #e040fb magenta
]

// Cache: nodeIndex -> Array<{x,y}>
const titleSamples = new Array(6).fill(null)

function ensureSample(nodeIndex) {
  if (titleSamples[nodeIndex]) return titleSamples[nodeIndex]
  // Use fontSize 100 for all titles; longer titles compress but fill same world width
  titleSamples[nodeIndex] = sampleTextPositions(PROJECT_TITLES[nodeIndex], 100, 10000)
  return titleSamples[nodeIndex]
}

/**
 * Returns a getPositions closure for a specific project node.
 * @param {number} nodeIndex - 0 to 5
 * @returns {(i: number, total: number) => {x,y,z,r,g,b,size}}
 */
export function getProjectNodePositions(nodeIndex) {
  const idx = Math.max(0, Math.min(5, nodeIndex))
  return function(i, total) {
    const textEnd = Math.floor(total * 0.75)
    const color = PROJECT_COLORS[idx]

    // ─── TITLE TEXT (0–74%) ───
    if (i < textEnd) {
      const positions = ensureSample(idx)

      if (!positions || positions.length === 0) {
        // Fallback scatter
        return {
          x: (Math.random() - 0.5) * 60,
          y: 5 + (Math.random() - 0.5) * 8,
          z: (Math.random() - 0.5) * 2,
          r: color.r, g: color.g, b: color.b,
          size: 1.0,
        }
      }

      const textIdx = i % positions.length
      const pos = positions[textIdx]

      // Color with slight brightness variation for texture
      const variation = (Math.random() - 0.5) * 0.15
      const br = Math.min(1, Math.max(0, color.r + variation))
      const bg = Math.min(1, Math.max(0, color.g + variation))
      const bb = Math.min(1, Math.max(0, color.b + variation))

      return {
        x: pos.x,
        y: pos.y + 5,                          // center text at y=5
        z: (Math.random() - 0.5) * 1.0,        // slight depth jitter
        r: br, g: bg, b: bb,
        size: randomRange(1.0, 1.4),
      }
    }

    // ─── AMBIENT STARFIELD (75–100%): project color tinted ───
    {
      const x = (Math.random() - 0.5) * 200
      const y = (Math.random() - 0.5) * 150
      const z = (Math.random() - 0.5) * 100 - 40  // behind text

      // Dim color tinted toward project accent
      const dimness = 0.08 + Math.random() * 0.12
      return {
        x, y, z,
        r: color.r * dimness + Math.random() * 0.03,
        g: color.g * dimness + Math.random() * 0.03,
        b: color.b * dimness + Math.random() * 0.05,
        size: randomRange(0.12, 0.4),
      }
    }
  }
}

// Default getPositions = node 0 (for initial section registration)
export function getPositions(i, total) {
  return getProjectNodePositions(0)(i, total)
}
