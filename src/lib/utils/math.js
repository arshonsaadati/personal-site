/**
 * Math utilities for the particle system and animations.
 */

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function lerp(a, b, t) {
  return a + (b - a) * t
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

export function randomRange(min, max) {
  return min + Math.random() * (max - min)
}

export function randomGaussian(mean = 0, stddev = 1) {
  // Box-Muller transform
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + z * stddev
}

export function randomPointOnSphere(radius) {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.sin(phi) * Math.sin(theta),
    z: radius * Math.cos(phi)
  }
}

export function randomPointInSphere(radius) {
  const r = radius * Math.cbrt(Math.random())
  return randomPointOnSphere(r)
}
