import { randomRange, randomGaussian } from '../../utils/math.js'
import { sampleTextPositions } from '../../utils/textSampler.js'

/**
 * About scene: "ARSHON" and "SAADATI" in particle text on the LEFT,
 * a helix constellation on the RIGHT as ambient decoration.
 *
 * Camera: (25, 12, -30) looking at (0, 5, -30)
 *
 * Particle budget (80,000 total):
 *   0–15%  (12K) — "ARSHON" text  at center-left, y=8
 *  15–25%   (8K) — "SAADATI" text at center-left, y=-2
 *  25–50%  (20K) — Helix constellation, x=+37 (right side)
 *  50–75%  (20K) — Warm background stars
 *  75–100% (20K) — Orbital rings around helix nodes
 */

const CX = 37   // helix center x (right side, matches camera angle)
const CY = 5
const CZ = -30

// Text is centered at scene origin (x=0, matching lookAt)
const TEXT_CX = 0
const TEXT_CY = 5  // camera lookAt y
const TEXT_CZ = -30

let arshonPositions = null
let saadatiPositions = null

function ensureTextSampled() {
  if (!arshonPositions) {
    arshonPositions = sampleTextPositions('ARSHON', 130, 12000, 50)
  }
  if (!saadatiPositions) {
    saadatiPositions = sampleTextPositions('SAADATI', 110, 8000, 55)
  }
}

// Helix nodes (ascending spiral, right side)
const NODE_COUNT = 9
const HELIX_RADIUS = 17

const SKILL_NODES = []
{
  // Center node
  SKILL_NODES.push({
    x: CX, y: CY, z: CZ,
    radius: 5,
    color: { r: 1.0, g: 0.84, b: 0.31 },
    orbitTiltX: 0.3, orbitTiltZ: 0.2,
  })

  const colors = [
    { r: 1.0, g: 0.67, b: 0.0 },
    { r: 1.0, g: 0.84, b: 0.31 },
    { r: 0.95, g: 0.75, b: 0.2 },
    { r: 1.0, g: 0.70, b: 0.15 },
    { r: 0.95, g: 0.90, b: 0.55 },
    { r: 1.0, g: 0.80, b: 0.25 },
    { r: 0.90, g: 0.65, b: 0.10 },
    { r: 1.0, g: 0.97, b: 0.88 },
  ]

  for (let n = 0; n < 8; n++) {
    const t = (n / 7) * Math.PI * 2
    const hx = HELIX_RADIUS * Math.cos(t)
    const hy = -20 + t * 6
    const hz = HELIX_RADIUS * Math.sin(t)

    SKILL_NODES.push({
      x: CX + hx,
      y: CY + hy,
      z: CZ + hz,
      radius: 2.5 + Math.random() * 1.2,
      color: colors[n],
      orbitTiltX: (Math.random() - 0.5) * 0.8,
      orbitTiltZ: (Math.random() - 0.5) * 0.6,
    })
  }
}

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
  [1, 2], [3, 4], [5, 6], [7, 8],
]

export function getPositions(i, total) {
  const arshonEnd   = Math.floor(total * 0.15)
  const saadatiEnd  = Math.floor(total * 0.25)
  const helixEnd    = Math.floor(total * 0.50)
  const bgEnd       = Math.floor(total * 0.75)

  // ─── "ARSHON" TEXT (0–14%): centered at scene, y=8 ───
  if (i < arshonEnd) {
    ensureTextSampled()
    const positions = arshonPositions

    if (!positions || positions.length === 0) {
      return {
        x: TEXT_CX + (Math.random() - 0.5) * 40,
        y: TEXT_CY + 3,
        z: TEXT_CZ,
        r: 1.0, g: 0.84, b: 0.31, size: 1.0,
      }
    }

    const textIdx = i % positions.length
    const pos = positions[textIdx]
    const bv = 0.55 + Math.random() * 0.10   // 0.55-0.65 below bloom threshold

    return {
      x: TEXT_CX + pos.x,
      y: TEXT_CY + 3 + pos.y,  // y=8 offset from lookAt y=5
      z: TEXT_CZ + (Math.random() - 0.5) * 0.8,
      r: Math.min(0.65, 0.60 + Math.random() * 0.05),   // gold r: 0.60-0.65
      g: Math.min(0.55, 0.48 + Math.random() * 0.07),   // gold g: 0.48-0.55
      b: Math.min(0.22, 0.15 + Math.random() * 0.07),   // gold b: 0.15-0.22
      size: randomRange(1.0, 1.5),
    }
  }

  // ─── "SAADATI" TEXT (15–24%): below ARSHON, y=-2 ───
  if (i < saadatiEnd) {
    ensureTextSampled()
    const positions = saadatiPositions

    if (!positions || positions.length === 0) {
      return {
        x: TEXT_CX + (Math.random() - 0.5) * 40,
        y: TEXT_CY - 7,
        z: TEXT_CZ,
        r: 1.0, g: 0.72, b: 0.15, size: 0.9,
      }
    }

    const textIdx = i % positions.length
    const pos = positions[textIdx]

    return {
      x: TEXT_CX + pos.x,
      y: TEXT_CY - 7 + pos.y,  // y=-2 offset
      z: TEXT_CZ + (Math.random() - 0.5) * 0.8,
      r: Math.min(0.60, 0.53 + Math.random() * 0.07),   // amber r: 0.53-0.60
      g: Math.min(0.45, 0.38 + Math.random() * 0.07),   // amber g: 0.38-0.45
      b: Math.min(0.05, Math.random() * 0.05),           // amber b: ~0.0
      size: randomRange(0.9, 1.3),
    }
  }

  // ─── HELIX CONSTELLATION (25–49%): right side ───
  if (i < helixEnd) {
    // Mix of node clusters and connection lines
    const helixTotal = helixEnd - saadatiEnd
    const localI = i - saadatiEnd

    const nodesShare = Math.floor(helixTotal * 0.6)

    if (localI < nodesShare) {
      const nodeIndex = localI % NODE_COUNT
      const node = SKILL_NODES[nodeIndex]

      const r = node.radius * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const ox = r * Math.sin(phi) * Math.cos(theta)
      const oy = r * Math.sin(phi) * Math.sin(theta)
      const oz = r * Math.cos(phi)

      const distRatio = r / node.radius
      const brightness = Math.min(0.65, (1.0 - distRatio * 0.3) * 0.65)
      const nc = node.color

      return {
        x: node.x + ox,
        y: node.y + oy,
        z: node.z + oz,
        r: Math.min(0.65, nc.r * brightness + Math.random() * 0.03),
        g: Math.min(0.65, nc.g * brightness + Math.random() * 0.02),
        b: Math.min(0.65, nc.b * brightness + Math.random() * 0.03),
        size: randomRange(0.3, 0.9),
      }
    } else {
      // Connection lines
      const connIndex = (localI - nodesShare) % CONNECTIONS.length
      const [fromIdx, toIdx] = CONNECTIONS[connIndex]
      const from = SKILL_NODES[fromIdx]
      const to = SKILL_NODES[toIdx]

      const t = Math.random()
      const bx = from.x + (to.x - from.x) * t
      const by = from.y + (to.y - from.y) * t
      const bz = from.z + (to.z - from.z) * t

      const fc = from.color
      const tc = to.color
      const lineBrightness = 0.35 + Math.random() * 0.2

      return {
        x: bx + (Math.random() - 0.5) * 0.4,
        y: by + (Math.random() - 0.5) * 0.4,
        z: bz + (Math.random() - 0.5) * 0.4,
        r: (fc.r * (1 - t) + tc.r * t) * lineBrightness,
        g: (fc.g * (1 - t) + tc.g * t) * lineBrightness,
        b: (fc.b * (1 - t) + tc.b * t) * lineBrightness,
        size: randomRange(0.1, 0.3),
      }
    }
  }

  // ─── WARM BACKGROUND STARS (50–74%) ───
  if (i < bgEnd) {
    const layer = Math.random()
    let x, y, z

    if (layer < 0.5) {
      const radius = 50 + Math.random() * 100
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      x = CX + radius * Math.sin(phi) * Math.cos(theta)
      y = CY + radius * Math.sin(phi) * Math.sin(theta)
      z = CZ + radius * Math.cos(phi)
    } else if (layer < 0.8) {
      const angle = Math.random() * Math.PI * 2
      const dist = 35 + Math.random() * 60
      x = CX + Math.cos(angle) * dist
      y = CY + Math.sin(angle) * dist
      z = CZ + randomGaussian(0, 5)
    } else {
      x = CX + (Math.random() - 0.5) * 120
      y = CY + randomGaussian(0, 8)
      z = CZ + (Math.random() - 0.5) * 40
    }

    const warmth = Math.random()
    const brightness = 0.18 + Math.random() * 0.18

    return {
      x, y, z,
      r: brightness + warmth * 0.25,
      g: brightness + warmth * 0.12,
      b: brightness * 0.5 + Math.random() * 0.04,
      size: randomRange(0.10, 0.35),
    }
  }

  // ─── ORBITAL RINGS (75–100%) ───
  {
    const nodeIndex = i % NODE_COUNT
    const node = SKILL_NODES[nodeIndex]

    const orbitRadius = node.radius * 2.0 + randomRange(0.5, 2.5)
    const angle = Math.random() * Math.PI * 2

    let ox = Math.cos(angle) * orbitRadius
    let oy = Math.sin(angle) * orbitRadius
    let oz = (Math.random() - 0.5) * 0.5

    const tiltX = node.orbitTiltX
    const tiltZ = node.orbitTiltZ

    const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX)
    const oy1 = oy * cosX - oz * sinX
    const oz1 = oy * sinX + oz * cosX

    const cosZ = Math.cos(tiltZ), sinZ = Math.sin(tiltZ)
    const ox1 = ox * cosZ - oy1 * sinZ
    const oy2 = ox * sinZ + oy1 * cosZ

    const nc = node.color
    const brightness = 0.35 + Math.random() * 0.25

    return {
      x: node.x + ox1,
      y: node.y + oy2,
      z: node.z + oz1,
      r: Math.min(1, nc.r * brightness + 0.1),
      g: Math.min(1, nc.g * brightness + 0.05),
      b: Math.min(1, nc.b * brightness + 0.08),
      size: randomRange(0.08, 0.25),
    }
  }
}
