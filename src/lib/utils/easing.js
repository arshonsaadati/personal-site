/**
 * Easing functions for animations and transitions.
 * All functions take t in [0, 1] and return a value in [0, 1].
 */

export function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

export function easeInOutQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2
}

export function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function linear(t) {
  return t
}
