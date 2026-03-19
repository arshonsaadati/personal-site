import { randomRange, randomGaussian } from '../../utils/math.js'

/**
 * About/Skills scene: a constellation of skill nodes with connections,
 * orbital rings, and warm-tinted background stars.
 *
 * Camera: (25, 12, -30) looking at (0, 5, -30)
 * All positions centered at (0, 5, -30) to match camera lookAt.
 *
 * Color palette: gold (#ffd54f), amber (#ffab00), soft white (#fff8e1)
 *
 * Particle budget (80,000 total):
 *   0–29%  (24K) — Dense spherical clusters at 9 skill nodes
 *  30–49%  (16K) — Connection line particles between 12 node pairs
 *  50–79%  (24K) — Warm-tinted constellation background stars
 *  80–100% (16K) — Orbital ring particles with per-node tilt
 */

// Scene center (matches camera lookAt)
const CX = 0
const CY = 5
const CZ = -30

// ─── 9 skill nodes in circular constellation layout (radius ~30) ───
const CONSTELLATION_RADIUS = 28
const NODE_COUNT = 9

// Generate node positions in a circle with some organic variance
const SKILL_NODES = []
{
  // Center node
  SKILL_NODES.push({
    x: CX, y: CY, z: CZ,
    label: 'Core',
    radius: 5,
    color: { r: 1.0, g: 0.84, b: 0.31 }, // bright gold
    orbitTiltX: 0.3,
    orbitTiltZ: 0.2,
  })

  // 8 surrounding nodes at evenly spaced angles with jitter
  const labels = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'AI/ML', 'Design', 'Systems', 'Data']
  const colors = [
    { r: 1.0, g: 0.67, b: 0.0 },   // amber
    { r: 1.0, g: 0.84, b: 0.31 },   // gold
    { r: 0.95, g: 0.75, b: 0.2 },   // warm gold
    { r: 1.0, g: 0.70, b: 0.15 },   // deep amber
    { r: 0.95, g: 0.90, b: 0.55 },   // pale gold
    { r: 1.0, g: 0.80, b: 0.25 },   // medium gold
    { r: 0.90, g: 0.65, b: 0.10 },   // dark amber
    { r: 1.0, g: 0.97, b: 0.88 },   // soft white
  ]

  for (let n = 0; n < 8; n++) {
    const baseAngle = (n / 8) * Math.PI * 2
    // Organic variance: slight random offset in angle and radius
    const angle = baseAngle + (Math.random() - 0.5) * 0.25
    const r = CONSTELLATION_RADIUS + (Math.random() - 0.5) * 8
    // Slight z offset for 3D depth
    const zOff = (Math.random() - 0.5) * 12

    SKILL_NODES.push({
      x: CX + Math.cos(angle) * r,
      y: CY + Math.sin(angle) * r,
      z: CZ + zOff,
      label: labels[n],
      radius: 2.5 + Math.random() * 1.5,
      color: colors[n],
      // Per-node orbit tilt for variety
      orbitTiltX: (Math.random() - 0.5) * 1.2,
      orbitTiltZ: (Math.random() - 0.5) * 0.8,
    })
  }
}

// ─── 12 connections between nodes ───
const CONNECTIONS = [
  // Center to all outer nodes (8 connections)
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
  // Some inter-node connections for texture
  [1, 2], [3, 4], [5, 6], [7, 8],
]

export function getPositions(i, total) {
  const nodesEnd = Math.floor(total * 0.3)
  const linesEnd = Math.floor(total * 0.5)
  const bgEnd = Math.floor(total * 0.8)

  // ─── DENSE SPHERICAL CLUSTERS AT NODES (0–29%) ───
  if (i < nodesEnd) {
    const nodeIndex = i % NODE_COUNT
    const node = SKILL_NODES[nodeIndex]

    // Cube-root distribution for even spherical density (not center-heavy)
    const r = node.radius * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    const ox = r * Math.sin(phi) * Math.cos(theta)
    const oy = r * Math.sin(phi) * Math.sin(theta)
    const oz = r * Math.cos(phi)

    // Distance-based color: core brighter, edges slightly dimmer
    const distRatio = r / node.radius
    const brightness = 1.0 - distRatio * 0.3
    const nc = node.color

    // Center node is larger and more prominent
    const isCenter = nodeIndex === 0
    const sizeMin = isCenter ? 0.5 : 0.3
    const sizeMax = isCenter ? 1.4 : 0.9

    return {
      x: node.x + ox,
      y: node.y + oy,
      z: node.z + oz,
      r: Math.min(1, nc.r * brightness + Math.random() * 0.05),
      g: Math.min(1, nc.g * brightness + Math.random() * 0.04),
      b: Math.min(1, nc.b * brightness + Math.random() * 0.06),
      size: randomRange(sizeMin, sizeMax),
    }
  }

  // ─── CONNECTION LINE PARTICLES (30–49%) ───
  if (i < linesEnd) {
    const connIndex = i % CONNECTIONS.length
    const [fromIdx, toIdx] = CONNECTIONS[connIndex]
    const from = SKILL_NODES[fromIdx]
    const to = SKILL_NODES[toIdx]

    // Parametric t with slight bias toward endpoints (denser near nodes)
    let t = Math.random()
    // Push some particles toward the ends for node "glow into line" effect
    if (Math.random() < 0.3) {
      t = Math.random() < 0.5 ? Math.random() * 0.15 : 1 - Math.random() * 0.15
    }

    const bx = from.x + (to.x - from.x) * t
    const by = from.y + (to.y - from.y) * t
    const bz = from.z + (to.z - from.z) * t

    // Slight perpendicular scatter so lines have width
    const spread = 0.35

    // Color: blend between the two node colors along t
    const fc = from.color
    const tc = to.color
    const mixR = fc.r * (1 - t) + tc.r * t
    const mixG = fc.g * (1 - t) + tc.g * t
    const mixB = fc.b * (1 - t) + tc.b * t

    // Dimmer than nodes but still warm
    const lineBrightness = 0.5 + Math.random() * 0.25

    return {
      x: bx + (Math.random() - 0.5) * spread,
      y: by + (Math.random() - 0.5) * spread,
      z: bz + (Math.random() - 0.5) * spread,
      r: mixR * lineBrightness,
      g: mixG * lineBrightness,
      b: mixB * lineBrightness,
      size: randomRange(0.12, 0.35),
    }
  }

  // ─── CONSTELLATION BACKGROUND STARS (50–79%): warm-tinted ───
  if (i < bgEnd) {
    // Multiple distribution layers for natural depth
    const layer = Math.random()

    let x, y, z

    if (layer < 0.5) {
      // Wide sphere around the constellation
      const radius = 50 + Math.random() * 100
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      x = CX + radius * Math.sin(phi) * Math.cos(theta)
      y = CY + radius * Math.sin(phi) * Math.sin(theta)
      z = CZ + radius * Math.cos(phi)
    } else if (layer < 0.8) {
      // Flat disk in the constellation plane
      const angle = Math.random() * Math.PI * 2
      const dist = 35 + Math.random() * 60
      x = CX + Math.cos(angle) * dist
      y = CY + Math.sin(angle) * dist
      z = CZ + randomGaussian(0, 5)
    } else {
      // Dense "dust lane" — a band through the center
      x = CX + (Math.random() - 0.5) * 120
      y = CY + randomGaussian(0, 8)
      z = CZ + (Math.random() - 0.5) * 40
    }

    // Warm tinting: pale gold / amber / soft white
    const warmth = Math.random()
    const brightness = 0.25 + Math.random() * 0.25

    return {
      x, y, z,
      r: brightness + warmth * 0.3,
      g: brightness + warmth * 0.15,
      b: brightness * 0.6 + Math.random() * 0.05,
      size: randomRange(0.12, 0.4),
    }
  }

  // ─── ORBITAL RING PARTICLES (80–100%): tilted rings around each node ───
  {
    const nodeIndex = i % NODE_COUNT
    const node = SKILL_NODES[nodeIndex]

    // Ring radius slightly outside the node cluster
    const orbitRadius = node.radius * 2.0 + randomRange(0.5, 2.5)
    const angle = Math.random() * Math.PI * 2

    // Base ring in XY plane
    let ox = Math.cos(angle) * orbitRadius
    let oy = Math.sin(angle) * orbitRadius
    let oz = (Math.random() - 0.5) * 0.5 // very thin ring

    // Apply per-node tilt rotation (around X axis, then Z axis)
    const tiltX = node.orbitTiltX
    const tiltZ = node.orbitTiltZ

    // Rotate around X
    const cosX = Math.cos(tiltX)
    const sinX = Math.sin(tiltX)
    const oy1 = oy * cosX - oz * sinX
    const oz1 = oy * sinX + oz * cosX

    // Rotate around Z
    const cosZ = Math.cos(tiltZ)
    const sinZ = Math.sin(tiltZ)
    const ox1 = ox * cosZ - oy1 * sinZ
    const oy2 = ox * sinZ + oy1 * cosZ

    const nc = node.color
    // Orbital particles are dimmer, slightly more washed out
    const brightness = 0.4 + Math.random() * 0.3

    return {
      x: node.x + ox1,
      y: node.y + oy2,
      z: node.z + oz1,
      r: Math.min(1, nc.r * brightness + 0.1),
      g: Math.min(1, nc.g * brightness + 0.05),
      b: Math.min(1, nc.b * brightness + 0.08),
      size: randomRange(0.1, 0.3),
    }
  }
}
