import { randomRange } from '../../utils/math.js'

/**
 * Contact scene placeholder: portal/vortex made of particles.
 * The "scenes" agent will refine with proper torus parametric positioning,
 * logarithmic spiral, and glow effects.
 *
 * Color palette: magenta, pink, violet
 */

const MAJOR_RADIUS = 20
const MINOR_RADIUS = 3

export function getPositions(i, total) {
  const torusEnd = Math.floor(total * 0.4)
  const spiralEnd = Math.floor(total * 0.6)
  const glowEnd = Math.floor(total * 0.8)

  if (i < torusEnd) {
    // ─── Torus/portal ring (40%) ───
    const u = Math.random() * Math.PI * 2  // angle around major circle
    const v = Math.random() * Math.PI * 2  // angle around minor circle

    const x = (MAJOR_RADIUS + MINOR_RADIUS * Math.cos(v)) * Math.cos(u)
    const y = (MAJOR_RADIUS + MINOR_RADIUS * Math.cos(v)) * Math.sin(u)
    const z = MINOR_RADIUS * Math.sin(v)

    // Magenta/pink
    const pinkShift = Math.random() * 0.3
    return {
      x,
      y,
      z,
      r: 0.85 + pinkShift * 0.15,
      g: 0.1 + Math.random() * 0.2,
      b: 0.7 + pinkShift,
      size: randomRange(0.5, 1.0),
    }
  }

  if (i < spiralEnd) {
    // ─── Inner spiral (20%): particles spiraling toward center ───
    const angle = Math.random() * Math.PI * 2 * 4  // 4 full rotations
    const t = Math.random()  // 0 = outer edge, 1 = center
    const radius = MAJOR_RADIUS * (1 - t * 0.8)  // spiral inward

    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      z: (Math.random() - 0.5) * 3,
      r: 0.5 + Math.random() * 0.2,
      g: 0.15 + Math.random() * 0.15,
      b: 0.85 + Math.random() * 0.15,
      size: randomRange(0.3, 0.7),
    }
  }

  if (i < glowEnd) {
    // ─── Outer glow (20%): scattered around torus with radial falloff ───
    const angle = Math.random() * Math.PI * 2
    const dist = MAJOR_RADIUS + randomRange(-15, 25)

    return {
      x: dist * Math.cos(angle) + (Math.random() - 0.5) * 10,
      y: dist * Math.sin(angle) + (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 15,
      r: 0.6 + Math.random() * 0.2,
      g: 0.1 + Math.random() * 0.15,
      b: 0.4 + Math.random() * 0.3,
      size: randomRange(0.15, 0.45),
    }
  }

  // ─── Background void (20%): very sparse, distant ───
  return {
    x: (Math.random() - 0.5) * 250,
    y: (Math.random() - 0.5) * 250,
    z: (Math.random() - 0.5) * 250,
    r: 0.2 + Math.random() * 0.1,
    g: 0.05 + Math.random() * 0.05,
    b: 0.3 + Math.random() * 0.15,
    size: randomRange(0.1, 0.3),
  }
}
