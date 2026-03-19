/**
 * Maps palm center landmark to smoothed screen coordinates.
 * Converts normalized hand position to screen-space cursor with EMA smoothing.
 */

const SMOOTHING_FACTOR = 0.3

export class HandCursor {
  constructor() {
    this.smoothX = 0.5
    this.smoothY = 0.5
  }

  /**
   * Update cursor position from hand landmarks.
   * Uses landmark 9 (middle finger MCP / palm center) for stable tracking.
   * @param {Array} landmarks - 21 hand landmarks
   * @returns {{ x: number, y: number }} Screen-space coordinates (0-1 range, mirrored x)
   */
  update(landmarks) {
    if (!landmarks) return { x: this.smoothX, y: this.smoothY }

    const palm = landmarks[9]

    // Mirror x (webcam is mirrored) and clamp
    const rawX = 1.0 - palm.x
    const rawY = palm.y

    // Exponential moving average smoothing
    this.smoothX += (rawX - this.smoothX) * SMOOTHING_FACTOR
    this.smoothY += (rawY - this.smoothY) * SMOOTHING_FACTOR

    return { x: this.smoothX, y: this.smoothY }
  }

  /**
   * Get current cursor position in pixel coordinates.
   * @returns {{ x: number, y: number }} Pixel coordinates
   */
  getScreenPosition() {
    return {
      x: this.smoothX * window.innerWidth,
      y: this.smoothY * window.innerHeight,
    }
  }

  reset() {
    this.smoothX = 0.5
    this.smoothY = 0.5
  }
}
