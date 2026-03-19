import { randomRange, randomPointInSphere, randomGaussian } from '../../utils/math.js'

/**
 * Hero scene: cosmic nebula with scattered stars.
 * This is the initial placeholder — the "scenes" agent will add
 * particle text for "ARSHON SAADATI" and refine the nebula.
 *
 * Color palette: deep blues, purples, white stars
 */
export function getPositions(i, total) {
  // Divide particles into groups
  const starsEnd = Math.floor(total * 0.4)
  const nebulaEnd = Math.floor(total * 0.7)

  if (i < starsEnd) {
    // ─── Scattered stars (40%): wide spherical distribution ───
    const radius = randomRange(60, 200)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    const brightness = 0.6 + Math.random() * 0.4
    // Slight blue tint
    const blueTint = Math.random() * 0.2

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
    // ─── Nebula cloud (30%): dense gaussian clusters near center ───
    const clusterX = randomGaussian(0, 15)
    const clusterY = randomGaussian(0, 10)
    const clusterZ = randomGaussian(0, 12)

    // Purple/blue tones
    const purpleAmount = Math.random()
    return {
      x: clusterX,
      y: clusterY,
      z: clusterZ,
      r: 0.15 + purpleAmount * 0.25,   // dark to medium purple
      g: 0.05 + Math.random() * 0.1,
      b: 0.3 + purpleAmount * 0.4,      // strong blue
      size: randomRange(0.5, 1.8),
    }
  }

  // ─── Ambient floaters (30%): wide spread, faint ───
  return {
    x: (Math.random() - 0.5) * 250,
    y: (Math.random() - 0.5) * 250,
    z: (Math.random() - 0.5) * 250,
    r: 0.15 + Math.random() * 0.15,
    g: 0.1 + Math.random() * 0.1,
    b: 0.2 + Math.random() * 0.2,
    size: randomRange(0.2, 0.5),
  }
}
