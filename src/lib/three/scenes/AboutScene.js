import { randomRange, randomGaussian } from '../../utils/math.js'

/**
 * About/Skills scene placeholder: constellation graph with skill nodes.
 * The "scenes" agent will refine with proper skill data, connection lines,
 * and orbital particles.
 *
 * Color palette: gold, amber, soft white
 */

// Skill node positions in a constellation layout
const SKILL_NODES = [
  { x: 0, y: 0, z: 0, label: 'Arshon', radius: 5 },        // center
  { x: 18, y: 10, z: 5, label: 'Frontend', radius: 3.5 },
  { x: -15, y: 12, z: -3, label: 'Backend', radius: 3.5 },
  { x: 22, y: -8, z: 2, label: 'Mobile', radius: 3 },
  { x: -20, y: -10, z: -5, label: 'DevOps', radius: 3 },
  { x: 8, y: -18, z: 4, label: 'AI/ML', radius: 3 },
  { x: -8, y: 20, z: -2, label: 'Design', radius: 2.5 },
  { x: 28, y: 2, z: -4, label: 'Systems', radius: 2.5 },
  { x: -25, y: 3, z: 6, label: 'Data', radius: 2.5 },
]

// Connections between nodes (indices)
const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 6], [2, 8], [3, 7], [4, 8], [5, 2],
  [1, 7], [6, 2],
]

export function getPositions(i, total) {
  const nodesEnd = Math.floor(total * 0.3)
  const linesEnd = Math.floor(total * 0.5)
  const bgEnd = Math.floor(total * 0.8)

  if (i < nodesEnd) {
    // ─── Skill node clusters (30%) ───
    const nodeIndex = i % SKILL_NODES.length
    const node = SKILL_NODES[nodeIndex]

    const offsetX = randomGaussian(0, node.radius * 0.5)
    const offsetY = randomGaussian(0, node.radius * 0.5)
    const offsetZ = randomGaussian(0, node.radius * 0.3)

    // Gold tones with variation per node
    const goldShift = (nodeIndex * 0.05) % 0.3
    return {
      x: node.x + offsetX,
      y: node.y + offsetY,
      z: node.z + offsetZ,
      r: 0.85 + goldShift,
      g: 0.7 + goldShift * 0.5,
      b: 0.15 + Math.random() * 0.15,
      size: nodeIndex === 0 ? randomRange(0.6, 1.4) : randomRange(0.4, 1.0),
    }
  }

  if (i < linesEnd) {
    // ─── Connection lines (20%) ───
    const connIndex = i % CONNECTIONS.length
    const [fromIdx, toIdx] = CONNECTIONS[connIndex]
    const from = SKILL_NODES[fromIdx]
    const to = SKILL_NODES[toIdx]
    const t = Math.random()

    return {
      x: from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 0.3,
      y: from.y + (to.y - from.y) * t + (Math.random() - 0.5) * 0.3,
      z: from.z + (to.z - from.z) * t + (Math.random() - 0.5) * 0.3,
      r: 0.7 + Math.random() * 0.2,
      g: 0.55 + Math.random() * 0.15,
      b: 0.1,
      size: randomRange(0.15, 0.35),
    }
  }

  if (i < bgEnd) {
    // ─── Constellation background (30%) ───
    return {
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 120,
      z: (Math.random() - 0.5) * 100,
      r: 0.6 + Math.random() * 0.3,
      g: 0.5 + Math.random() * 0.2,
      b: 0.2 + Math.random() * 0.15,
      size: randomRange(0.15, 0.4),
    }
  }

  // ─── Orbital ring particles (20%) ───
  const nodeIndex = i % SKILL_NODES.length
  const node = SKILL_NODES[nodeIndex]
  const angle = Math.random() * Math.PI * 2
  const orbitRadius = node.radius * 1.5 + Math.random() * 2

  return {
    x: node.x + Math.cos(angle) * orbitRadius,
    y: node.y + Math.sin(angle) * orbitRadius,
    z: node.z + (Math.random() - 0.5) * 2,
    r: 0.9,
    g: 0.75,
    b: 0.2,
    size: randomRange(0.1, 0.3),
  }
}
