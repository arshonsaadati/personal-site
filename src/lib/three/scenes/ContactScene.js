import { randomRange, randomGaussian } from '../../utils/math.js'

/**
 * Contact scene: dual torus rings flanking the center — a "parted curtain"
 * effect that leaves the center content area (x: -12 to +12) clear.
 *
 * Camera: (0, 0, -80) looking at (0, 0, -100)
 * Two ring arcs: LEFT centered at (-25, 0, -100) and RIGHT at (+25, 0, -100).
 * Each ring has MAJOR_RADIUS=20, so they naturally span:
 *   Left:  x ≈ -45 to -5
 *   Right: x ≈ +5  to +45
 * Center column (x: -5 to +5) stays nearly empty — headings and buttons safe.
 *
 * Color palette: magenta, pink, violet. Brightness capped at 0.6.
 */

const CY = 0
const CZ = -100
const LEFT_CX  = -25
const RIGHT_CX = +25
const MAJOR_RADIUS = 20
const MINOR_RADIUS = 3
const MAX_BRIGHTNESS = 0.6

const MAGENTA = { r: 0.878 * MAX_BRIGHTNESS, g: 0.251 * MAX_BRIGHTNESS, b: 0.984 * MAX_BRIGHTNESS }
const PINK    = { r: 1.000 * MAX_BRIGHTNESS, g: 0.251 * MAX_BRIGHTNESS, b: 0.506 * MAX_BRIGHTNESS }
const VIOLET  = { r: 0.486 * MAX_BRIGHTNESS, g: 0.302 * MAX_BRIGHTNESS, b: 1.000 * MAX_BRIGHTNESS }

function lerpColor(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  }
}

function torusParticle(cx, arcStart, arcEnd) {
  const u = arcStart + Math.random() * (arcEnd - arcStart)
  const v = Math.random() * Math.PI * 2
  const minorR = MINOR_RADIUS * (0.7 + Math.random() * 0.6)

  const x = (MAJOR_RADIUS + minorR * Math.cos(v)) * Math.cos(u)
  const y = (MAJOR_RADIUS + minorR * Math.cos(v)) * Math.sin(u)
  const z = minorR * Math.sin(v)

  const colorT = (u - arcStart) / (arcEnd - arcStart)
  let color
  if (colorT < 0.33) {
    color = lerpColor(MAGENTA, PINK, colorT / 0.33)
  } else if (colorT < 0.66) {
    color = lerpColor(PINK, VIOLET, (colorT - 0.33) / 0.33)
  } else {
    color = lerpColor(VIOLET, MAGENTA, (colorT - 0.66) / 0.34)
  }

  const outerBias = 0.7 + Math.cos(v) * 0.3
  const brightness = Math.min(1.0, outerBias * (0.65 + Math.random() * 0.2))

  return {
    x: cx + x,
    y: CY + y,
    z: CZ + z,
    r: Math.min(MAX_BRIGHTNESS, color.r * brightness + Math.random() * 0.02),
    g: Math.min(MAX_BRIGHTNESS, color.g * brightness + Math.random() * 0.01),
    b: Math.min(MAX_BRIGHTNESS, color.b * brightness + Math.random() * 0.02),
    size: randomRange(0.3, 0.85) * outerBias,
  }
}

export function getPositions(i, total) {
  const leftEnd   = Math.floor(total * 0.35)
  const rightEnd  = Math.floor(total * 0.70)
  const streamEnd = Math.floor(total * 0.85)

  // LEFT TORUS ARC: outward-facing left half
  if (i < leftEnd) {
    return torusParticle(LEFT_CX, Math.PI * 0.4, Math.PI * 1.6)
  }

  // RIGHT TORUS ARC: outward-facing right half
  if (i < rightEnd) {
    return torusParticle(RIGHT_CX, -Math.PI * 0.6, Math.PI * 0.6)
  }

  // CONNECTING STREAM: very dim wisps through center
  if (i < streamEnd) {
    const t = Math.random()
    const startX = LEFT_CX + MAJOR_RADIUS * 0.7
    const endX   = RIGHT_CX - MAJOR_RADIUS * 0.7
    const bx = startX + (endX - startX) * t
    const by = CY + Math.sin(t * Math.PI) * 8 * (Math.random() < 0.5 ? 1 : -1)
    const bz = CZ + randomGaussian(0, 2)
    const color = lerpColor(MAGENTA, VIOLET, t)
    const brightness = 0.12 + Math.random() * 0.12

    return {
      x: bx + (Math.random() - 0.5) * 1.5,
      y: by + (Math.random() - 0.5) * 1.5,
      z: bz,
      r: Math.min(MAX_BRIGHTNESS, color.r * brightness),
      g: Math.min(MAX_BRIGHTNESS, color.g * brightness),
      b: Math.min(MAX_BRIGHTNESS, color.b * brightness),
      size: randomRange(0.08, 0.28),
    }
  }

  // SPARSE BACKGROUND VOID
  {
    const strategy = Math.random()
    let x, y, z
    if (strategy < 0.5) {
      const radius = 60 + Math.random() * 150
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      x = radius * Math.sin(phi) * Math.cos(theta)
      y = radius * Math.sin(phi) * Math.sin(theta)
      z = radius * Math.cos(phi)
    } else if (strategy < 0.8) {
      x = randomGaussian(0, 25)
      y = randomGaussian(0, 20)
      z = (Math.random() - 0.5) * 300
    } else {
      x = (Math.random() - 0.5) * 250
      y = (Math.random() - 0.5) * 250
      z = (Math.random() - 0.5) * 250
    }
    const dimness = 0.06 + Math.random() * 0.10
    const violetShift = Math.random() * 0.5
    return {
      x: x,
      y: CY + y,
      z: CZ + z,
      r: dimness * 0.6 + violetShift * 0.08,
      g: dimness * 0.2,
      b: dimness + violetShift * 0.12,
      size: randomRange(0.08, 0.25),
    }
  }
}
