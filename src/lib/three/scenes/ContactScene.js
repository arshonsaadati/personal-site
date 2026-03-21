import { randomRange, randomGaussian } from '../../utils/math.js'
import { sampleTextPositions } from '../../utils/textSampler.js'

/**
 * Contact scene: "CONTACT" in particle text at top, dual torus arcs flanking center.
 *
 * Camera: (0, 0, -80) looking at (0, 0, -100)
 *
 * Particle budget (80,000 total):
 *   0–10%   (8K) — "CONTACT" particle text, top area
 *  10–45%  (28K) — Left torus arc
 *  45–80%  (28K) — Right torus arc
 *  80–92%  (9.6K) — Connecting stream
 *  92–100%  (6.4K) — Sparse background
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

let contactTextPositions = null

function ensureTextSampled() {
  if (!contactTextPositions) {
    // fontSize=70 sets canvas resolution; targetWidth=40 sets world-unit span
    // Contact camera at z=-80, text at z=-100 (distance=20), viewport ~55 wide
    // targetWidth=40 → text fills ~73% of viewport width
    contactTextPositions = sampleTextPositions('CONTACT', 70, 6000, 40)
  }
  return contactTextPositions
}

export function getPositions(i, total) {
  const textEnd   = Math.floor(total * 0.10)
  const leftEnd   = Math.floor(total * 0.45)
  const rightEnd  = Math.floor(total * 0.80)
  const streamEnd = Math.floor(total * 0.92)

  // ─── "CONTACT" TEXT (0–9%): top area, magenta/pink ───
  if (i < textEnd) {
    const positions = ensureTextSampled()

    if (!positions || positions.length === 0) {
      return {
        x: (Math.random() - 0.5) * 40,
        y: CY + 8,
        z: CZ,
        r: MAGENTA.r, g: MAGENTA.g, b: MAGENTA.b,
        size: 1.0,
      }
    }

    const textIdx = i % positions.length
    const pos = positions[textIdx]

    const variation = (Math.random() - 0.5) * 0.1
    const nc = lerpColor(MAGENTA, PINK, Math.random())

    return {
      x: pos.x,
      y: CY + 8 + pos.y,    // top area at y=8 (safe within viewport)
      z: CZ + (Math.random() - 0.5) * 0.8,
      r: Math.min(0.60, nc.r + variation),
      g: Math.min(0.60, nc.g + variation),
      b: Math.min(0.60, nc.b + variation),
      size: randomRange(1.0, 1.4),
    }
  }

  // ─── LEFT TORUS ARC (10–44%) ───
  if (i < leftEnd) {
    return torusParticle(LEFT_CX, Math.PI * 0.4, Math.PI * 1.6)
  }

  // ─── RIGHT TORUS ARC (45–79%) ───
  if (i < rightEnd) {
    return torusParticle(RIGHT_CX, -Math.PI * 0.6, Math.PI * 0.6)
  }

  // ─── CONNECTING STREAM (80–91%): dim wisps through center ───
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

  // ─── SPARSE BACKGROUND (92–100%) ───
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
      x,
      y: CY + y,
      z: CZ + z,
      r: dimness * 0.6 + violetShift * 0.08,
      g: dimness * 0.2,
      b: dimness + violetShift * 0.12,
      size: randomRange(0.08, 0.25),
    }
  }
}
