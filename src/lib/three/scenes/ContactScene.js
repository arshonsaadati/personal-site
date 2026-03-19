import { randomRange } from '../../utils/math.js'

/**
 * Contact scene: magenta torus portal with spiral and glow.
 *
 * Camera: (0, 0, -80) looking at (0, 0, -100)
 * Color palette: magenta (#e040fb), pink (#ff4081), violet (#7c4dff)
 *
 * Distribution:
 *   0-39%  (32K) — Torus ring (major R=20, minor r=3), parametric
 *   40-59% (16K) — Inner logarithmic spiral toward center
 *   60-79% (16K) — Outer scattered glow with radial falloff
 *   80-100%(16K) — Sparse background void
 */

const MAJOR_RADIUS = 20
const MINOR_RADIUS = 3

// Center offset: torus is at the camera lookAt target
const CX = 0, CY = 0, CZ = -100

export function getPositions(i, total) {
  const torusEnd = Math.floor(total * 0.4)
  const spiralEnd = Math.floor(total * 0.6)
  const glowEnd = Math.floor(total * 0.8)

  if (i < torusEnd) {
    // ─── Torus portal ring (40%): parametric torus surface ───
    const u = Math.random() * Math.PI * 2  // major circle angle
    const v = Math.random() * Math.PI * 2  // minor circle angle

    // Parametric torus: the ring faces the camera (oriented in xy plane)
    const x = (MAJOR_RADIUS + MINOR_RADIUS * Math.cos(v)) * Math.cos(u)
    const y = (MAJOR_RADIUS + MINOR_RADIUS * Math.cos(v)) * Math.sin(u)
    const z = MINOR_RADIUS * Math.sin(v)

    // Magenta/pink gradient around the ring
    const hueShift = Math.random() * 0.3
    return {
      x: CX + x,
      y: CY + y,
      z: CZ + z,
      r: 0.82 + hueShift * 0.18,
      g: 0.1 + Math.random() * 0.15,
      b: 0.65 + hueShift,
      size: randomRange(0.5, 1.0),
    }
  }

  if (i < spiralEnd) {
    // ─── Inner logarithmic spiral (20%): swirling toward center ───
    const t = Math.random()  // 0 = outer edge, 1 = center
    const angle = t * Math.PI * 2 * 5  // 5 full spiral rotations

    // Logarithmic spiral: radius decreases exponentially toward center
    const radius = MAJOR_RADIUS * Math.exp(-1.8 * t)

    return {
      x: CX + radius * Math.cos(angle),
      y: CY + radius * Math.sin(angle),
      z: CZ + (Math.random() - 0.5) * 3,
      r: 0.45 + Math.random() * 0.2,
      g: 0.12 + Math.random() * 0.12,
      b: 0.8 + Math.random() * 0.2,
      size: randomRange(0.3, 0.7) * (1 - t * 0.5), // smaller toward center
    }
  }

  if (i < glowEnd) {
    // ─── Outer glow (20%): scattered around torus with radial falloff ───
    const angle = Math.random() * Math.PI * 2
    // Radial falloff: more particles near torus, fewer far away
    const distFromRing = randomRange(0, 30)
    const dist = MAJOR_RADIUS + distFromRing * (Math.random() < 0.5 ? 1 : -0.5)

    return {
      x: CX + dist * Math.cos(angle) + (Math.random() - 0.5) * 8,
      y: CY + dist * Math.sin(angle) + (Math.random() - 0.5) * 8,
      z: CZ + (Math.random() - 0.5) * 15,
      r: 0.5 + Math.random() * 0.2,
      g: 0.08 + Math.random() * 0.1,
      b: 0.35 + Math.random() * 0.3,
      size: randomRange(0.15, 0.45),
    }
  }

  // ─── Background void (20%): sparse, distant, dark ───
  return {
    x: CX + (Math.random() - 0.5) * 250,
    y: CY + (Math.random() - 0.5) * 250,
    z: CZ + (Math.random() - 0.5) * 200,
    r: 0.18 + Math.random() * 0.1,
    g: 0.04 + Math.random() * 0.05,
    b: 0.25 + Math.random() * 0.15,
    size: randomRange(0.1, 0.3),
  }
}
