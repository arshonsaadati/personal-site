import { randomRange, randomGaussian } from '../../utils/math.js'

/**
 * About/Skills scene: gold constellation with skill nodes.
 *
 * Camera: (25, 12, -30) looking at (0, 5, -30)
 * Color palette: gold (#ffd54f), amber (#ffab00), soft white (#fff8e1)
 *
 * Distribution:
 *   0-29%  (24K) — Dense spherical clusters at node positions
 *   30-49% (16K) — Connection line particles between nodes
 *   50-79% (24K) — Constellation background stars, warm-tinted
 *   80-100%(16K) — Orbital ring particles around nodes
 */

// Center offset: constellation is centered at the camera lookAt target
const CX = 0, CY = 5, CZ = -30

// Skill node positions in circular constellation layout (radius ~30)
const SKILL_NODES = [
  { x: CX,      y: CY,      z: CZ,     label: 'Arshon',   radius: 5 },    // center
  { x: CX + 20, y: CY + 12, z: CZ + 5, label: 'Frontend', radius: 3.5 },
  { x: CX - 18, y: CY + 14, z: CZ - 4, label: 'Backend',  radius: 3.5 },
  { x: CX + 24, y: CY - 8,  z: CZ + 3, label: 'Mobile',   radius: 3 },
  { x: CX - 22, y: CY - 10, z: CZ - 6, label: 'DevOps',   radius: 3 },
  { x: CX + 10, y: CY - 20, z: CZ + 4, label: 'AI/ML',    radius: 3 },
  { x: CX - 10, y: CY + 22, z: CZ - 2, label: 'Design',   radius: 2.5 },
  { x: CX + 30, y: CY + 2,  z: CZ - 4, label: 'Systems',  radius: 2.5 },
  { x: CX - 28, y: CY + 3,  z: CZ + 6, label: 'Data',     radius: 2.5 },
]

// Connections between nodes (indices into SKILL_NODES)
const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],  // center to all inner
  [1, 6], [2, 8], [3, 7], [4, 8], [5, 2],  // inner to outer
  [1, 7], [6, 2],                            // cross links
]

export function getPositions(i, total) {
  const nodesEnd = Math.floor(total * 0.3)
  const linesEnd = Math.floor(total * 0.5)
  const bgEnd = Math.floor(total * 0.8)

  if (i < nodesEnd) {
    // ─── Skill node clusters (30%): dense spherical clusters ───
    const nodeIndex = i % SKILL_NODES.length
    const node = SKILL_NODES[nodeIndex]

    // Spherical distribution within node radius
    const r = node.radius * Math.cbrt(Math.random()) * 0.6
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    const offsetX = r * Math.sin(phi) * Math.cos(theta)
    const offsetY = r * Math.sin(phi) * Math.sin(theta)
    const offsetZ = r * Math.cos(phi) * 0.6

    // Gold tones with variation per node
    const goldShift = (nodeIndex * 0.05) % 0.3
    const brightness = nodeIndex === 0 ? 1.0 : 0.85

    return {
      x: node.x + offsetX,
      y: node.y + offsetY,
      z: node.z + offsetZ,
      r: brightness * (0.85 + goldShift),
      g: brightness * (0.7 + goldShift * 0.5),
      b: brightness * (0.15 + Math.random() * 0.15),
      size: nodeIndex === 0 ? randomRange(0.6, 1.4) : randomRange(0.4, 1.0),
    }
  }

  if (i < linesEnd) {
    // ─── Connection lines (20%): particles along edges ───
    const connIndex = i % CONNECTIONS.length
    const [fromIdx, toIdx] = CONNECTIONS[connIndex]
    const from = SKILL_NODES[fromIdx]
    const to = SKILL_NODES[toIdx]
    const t = Math.random()

    return {
      x: from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 0.4,
      y: from.y + (to.y - from.y) * t + (Math.random() - 0.5) * 0.4,
      z: from.z + (to.z - from.z) * t + (Math.random() - 0.5) * 0.4,
      r: 0.7 + Math.random() * 0.2,
      g: 0.55 + Math.random() * 0.15,
      b: 0.08 + Math.random() * 0.08,
      size: randomRange(0.15, 0.35),
    }
  }

  if (i < bgEnd) {
    // ─── Constellation background stars (30%): warm-tinted ───
    return {
      x: CX + (Math.random() - 0.5) * 160,
      y: CY + (Math.random() - 0.5) * 120,
      z: CZ + (Math.random() - 0.5) * 100,
      r: 0.6 + Math.random() * 0.3,
      g: 0.5 + Math.random() * 0.2,
      b: 0.15 + Math.random() * 0.15,
      size: randomRange(0.15, 0.4),
    }
  }

  // ─── Orbital ring particles (20%): circling around nodes ───
  const nodeIndex = i % SKILL_NODES.length
  const node = SKILL_NODES[nodeIndex]
  const angle = Math.random() * Math.PI * 2
  const orbitRadius = node.radius * 1.4 + randomRange(0.5, 2.5)

  // Slight tilt per node for visual variety
  const tilt = (nodeIndex * 0.3) % (Math.PI * 0.5)
  const cosT = Math.cos(tilt)
  const sinT = Math.sin(tilt)

  const rx = Math.cos(angle) * orbitRadius
  const ry = Math.sin(angle) * orbitRadius

  return {
    x: node.x + rx,
    y: node.y + ry * cosT,
    z: node.z + ry * sinT + (Math.random() - 0.5) * 1.5,
    r: 0.9 + Math.random() * 0.1,
    g: 0.75 + Math.random() * 0.1,
    b: 0.15 + Math.random() * 0.1,
    size: randomRange(0.1, 0.3),
  }
}
