import { randomRange, randomGaussian } from '../../utils/math.js'

/**
 * Contact scene: dramatic portal/vortex — a torus ring with a spiraling
 * inner vortex, scattered outer glow, and sparse background void.
 *
 * Camera: (0, 0, -80) looking at (0, 0, -100)
 * All positions centered at (0, 0, -100) to match camera lookAt.
 *
 * Color palette: magenta (#e040fb), pink (#ff4081), violet (#7c4dff)
 *
 * Particle budget (80,000 total):
 *   0–39%  (32K) — Torus ring (R=20, r=3): parametric surface
 *  40–59%  (16K) — Logarithmic spiral: 5 rotations, exponential decay
 *  60–79%  (16K) — Outer scattered glow with radial falloff
 *  80–100% (16K) — Sparse background void
 */

// Scene center (matches camera lookAt)
const CX = 0
const CY = 0
const CZ = -100

// Torus parameters
const MAJOR_RADIUS = 20  // distance from torus center to tube center
const MINOR_RADIUS = 3   // tube radius

// Color palette (normalized RGB)
const MAGENTA = { r: 0.878, g: 0.251, b: 0.984 }
const PINK    = { r: 1.000, g: 0.251, b: 0.506 }
const VIOLET  = { r: 0.486, g: 0.302, b: 1.000 }

function lerpColor(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  }
}

export function getPositions(i, total) {
  const torusEnd = Math.floor(total * 0.4)
  const spiralEnd = Math.floor(total * 0.6)
  const glowEnd = Math.floor(total * 0.8)

  // ─── TORUS RING (0–39%): parametric surface with density variation ───
  if (i < torusEnd) {
    const u = Math.random() * Math.PI * 2  // angle around major circle (tube path)
    const v = Math.random() * Math.PI * 2  // angle around minor circle (tube cross-section)

    // Vary minor radius slightly for organic feel
    const minorR = MINOR_RADIUS * (0.7 + Math.random() * 0.6)

    // Parametric torus equations
    const x = (MAJOR_RADIUS + minorR * Math.cos(v)) * Math.cos(u)
    const y = (MAJOR_RADIUS + minorR * Math.cos(v)) * Math.sin(u)
    const z = minorR * Math.sin(v)

    // Color varies around the major circle: magenta → pink → violet → magenta
    const colorT = (u / (Math.PI * 2))
    let color
    if (colorT < 0.33) {
      color = lerpColor(MAGENTA, PINK, colorT / 0.33)
    } else if (colorT < 0.66) {
      color = lerpColor(PINK, VIOLET, (colorT - 0.33) / 0.33)
    } else {
      color = lerpColor(VIOLET, MAGENTA, (colorT - 0.66) / 0.34)
    }

    // Outer surface of torus is brighter (faces camera more)
    const outerBias = 0.7 + Math.cos(v) * 0.3  // cos(v)=1 at outer edge
    const brightness = outerBias * (0.7 + Math.random() * 0.3)

    return {
      x: CX + x,
      y: CY + y,
      z: CZ + z,
      r: Math.min(1, color.r * brightness + Math.random() * 0.05),
      g: Math.min(1, color.g * brightness + Math.random() * 0.03),
      b: Math.min(1, color.b * brightness + Math.random() * 0.05),
      size: randomRange(0.4, 1.0) * outerBias,
    }
  }

  // ─── LOGARITHMIC SPIRAL (40–59%): 5 rotations with exponential decay ───
  if (i < spiralEnd) {
    // t=0 at outer edge, t=1 at center
    const t = Math.random()

    // Logarithmic spiral: r = a * e^(b*theta)
    // 5 full rotations = 10*PI total angle
    const totalRotations = 5
    const theta = t * totalRotations * Math.PI * 2

    // Exponential radius decay: starts at major radius, shrinks toward center
    const decayRate = 2.5
    const radius = MAJOR_RADIUS * Math.exp(-decayRate * t)

    // Spiral in the XY plane (torus is in XY plane)
    const x = radius * Math.cos(theta)
    const y = radius * Math.sin(theta)

    // Z: thin near the plane of the torus, with slight funnel shape
    const zSpread = 1.5 + t * 4  // widens toward center (funnel)
    const z = randomGaussian(0, zSpread * 0.3)

    // Color: transitions from magenta (outer) to violet (inner) with brightness pulse
    const color = lerpColor(MAGENTA, VIOLET, t)
    // Brightness increases toward center for "energy concentration" effect
    const brightness = 0.4 + t * 0.5 + Math.random() * 0.15

    return {
      x: CX + x,
      y: CY + y,
      z: CZ + z,
      r: Math.min(1, color.r * brightness),
      g: Math.min(1, color.g * brightness),
      b: Math.min(1, color.b * brightness),
      size: randomRange(0.2, 0.65) * (0.5 + t * 0.8),
    }
  }

  // ─── OUTER SCATTERED GLOW (60–79%): radial falloff around the torus ───
  if (i < glowEnd) {
    // Random angle around the torus center
    const angle = Math.random() * Math.PI * 2

    // Radial distance: biased toward the torus ring, with falloff outward
    // Use a distribution that peaks near MAJOR_RADIUS and falls off
    const baseR = MAJOR_RADIUS
    const spreadR = 8 + Math.random() * 20  // extends well beyond torus
    const direction = Math.random() < 0.6 ? 1 : -1  // mostly outward
    const dist = baseR + direction * Math.pow(Math.random(), 0.7) * spreadR

    const x = dist * Math.cos(angle)
    const y = dist * Math.sin(angle)

    // Z spread: wider further from the torus center for a "halo" shape
    const zSpread = 5 + Math.abs(dist - baseR) * 0.5
    const z = randomGaussian(0, zSpread * 0.4)

    // Radial falloff: dimmer further from torus ring
    const distFromRing = Math.abs(dist - baseR)
    const falloff = Math.exp(-distFromRing * distFromRing / (15 * 15))

    // Blend pink/violet for the glow
    const color = lerpColor(PINK, VIOLET, Math.random())
    const brightness = falloff * (0.3 + Math.random() * 0.25)

    return {
      x: CX + x,
      y: CY + y,
      z: CZ + z,
      r: Math.min(1, color.r * brightness + Math.random() * 0.03),
      g: Math.min(1, color.g * brightness + Math.random() * 0.02),
      b: Math.min(1, color.b * brightness + Math.random() * 0.04),
      size: randomRange(0.12, 0.5) * (0.3 + falloff * 0.7),
    }
  }

  // ─── SPARSE BACKGROUND VOID (80–100%): distant, dim ───
  {
    // Large spread with multiple distribution shapes
    const strategy = Math.random()

    let x, y, z
    if (strategy < 0.5) {
      // Wide spherical scatter
      const radius = 60 + Math.random() * 150
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      x = radius * Math.sin(phi) * Math.cos(theta)
      y = radius * Math.sin(phi) * Math.sin(theta)
      z = radius * Math.cos(phi)
    } else if (strategy < 0.8) {
      // Elongated along z-axis (depth) for tunnel feel
      x = randomGaussian(0, 20)
      y = randomGaussian(0, 20)
      z = (Math.random() - 0.5) * 300
    } else {
      // Random cube for fill
      x = (Math.random() - 0.5) * 250
      y = (Math.random() - 0.5) * 250
      z = (Math.random() - 0.5) * 250
    }

    // Very dim violet/purple tones
    const dimness = 0.08 + Math.random() * 0.12
    const violetShift = Math.random() * 0.5

    return {
      x: CX + x,
      y: CY + y,
      z: CZ + z,
      r: dimness * 0.6 + violetShift * 0.1,
      g: dimness * 0.2,
      b: dimness + violetShift * 0.15,
      size: randomRange(0.08, 0.3),
    }
  }
}
