import { randomRange, randomGaussian } from '../../utils/math.js'
import { sampleTextPositions } from '../../utils/textSampler.js'

/**
 * Hero scene: cosmic nebula with particle text "ARSHON SAADATI".
 *
 * Camera: (0, 0, 100) looking at (0, 0, 0)
 * Color palette: deep blues (#1a1a6e), purples (#6a0dad), white stars, cyan text
 *
 * Distribution:
 *   0-39%  (32K) — Scattered stars: spherical shell r=80-200
 *   40-59% (16K) — Nebula cloud: gaussian clusters near origin
 *   60-79% (16K) — Name text "ARSHON SAADATI" via canvas sampling
 *   80-100%(16K) — Ambient floaters: wide spread, faint
 */

let textPositions = null

function ensureTextPositions(count) {
  if (!textPositions) {
    textPositions = sampleTextPositions('ARSHON SAADATI', 80, count)
  }
}

export function getPositions(i, total) {
  const starsEnd = Math.floor(total * 0.4)
  const nebulaEnd = Math.floor(total * 0.6)
  const textEnd = Math.floor(total * 0.8)

  const textCount = textEnd - nebulaEnd

  if (i < starsEnd) {
    // ─── Scattered stars (40%): spherical shell, wide spread ───
    const radius = randomRange(80, 200)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    const brightness = 0.6 + Math.random() * 0.4
    const blueTint = Math.random() * 0.15

    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
      r: brightness - blueTint,
      g: brightness - blueTint * 0.5,
      b: brightness,
      size: randomRange(0.3, 0.8),
    }
  }

  if (i < nebulaEnd) {
    // ─── Nebula cloud (20%): gaussian clusters, purple/blue ───
    // Multiple cluster centers for organic shape
    const clusterSeed = Math.random()
    let cx = 0, cy = 0, cz = 0
    if (clusterSeed < 0.3) {
      cx = -8; cy = 5; cz = -3
    } else if (clusterSeed < 0.6) {
      cx = 10; cy = -3; cz = 5
    } else if (clusterSeed < 0.8) {
      cx = -5; cy = -8; cz = -8
    }

    const spread = randomRange(20, 40)
    const x = randomGaussian(cx, spread * 0.4)
    const y = randomGaussian(cy, spread * 0.3)
    const z = randomGaussian(cz, spread * 0.35)

    const purpleAmount = Math.random()
    return {
      x,
      y,
      z,
      r: 0.1 + purpleAmount * 0.3,     // #1a1a6e → purple range
      g: 0.05 + Math.random() * 0.08,
      b: 0.25 + purpleAmount * 0.45,    // strong blue/purple
      size: randomRange(0.5, 1.5),
    }
  }

  if (i < textEnd) {
    // ─── Name text "ARSHON SAADATI" (20%): sampled from canvas ───
    ensureTextPositions(textCount)

    const textIndex = i - nebulaEnd
    const pos = textPositions[textIndex % textPositions.length]

    // Slight z-jitter for depth
    const zJitter = (Math.random() - 0.5) * 1.0

    // Bright white/cyan text particles
    const cyanAmount = Math.random() * 0.3
    return {
      x: pos.x,
      y: pos.y,
      z: zJitter,
      r: 0.8 + Math.random() * 0.2 - cyanAmount * 0.3,
      g: 0.9 + Math.random() * 0.1,
      b: 1.0,
      size: randomRange(0.8, 1.2),
    }
  }

  // ─── Ambient floaters (20%): wide spread, faint colors ───
  return {
    x: (Math.random() - 0.5) * 300,
    y: (Math.random() - 0.5) * 300,
    z: (Math.random() - 0.5) * 300,
    r: 0.1 + Math.random() * 0.12,
    g: 0.08 + Math.random() * 0.08,
    b: 0.15 + Math.random() * 0.18,
    size: randomRange(0.2, 0.5),
  }
}
