/**
 * HandCursor — maps hand landmark positions to smooth screen coordinates.
 *
 * Uses landmark 9 (middle finger MCP / palm center) for cursor positioning.
 * Applies exponential moving average (EMA) smoothing to eliminate jitter.
 * Mirrors x-axis since webcam is horizontally flipped.
 */

// Smoothing factor for exponential moving average (0 = no smoothing, 1 = no filtering)
const SMOOTHING_FACTOR = 0.3

// Margin to extend the usable range (prevents hard edges)
const MARGIN = 0.05

export class HandCursor {
  constructor() {
    this._smoothX = 0.5
    this._smoothY = 0.5
    this._hasInitialPosition = false
    this._screenWidth = window.innerWidth
    this._screenHeight = window.innerHeight

    // Update screen dimensions on resize
    this._onResize = () => {
      this._screenWidth = window.innerWidth
      this._screenHeight = window.innerHeight
    }
    window.addEventListener('resize', this._onResize)
  }

  /**
   * Update cursor position from hand landmarks.
   * @param {Array<{x: number, y: number, z: number}>} landmarks - 21 MediaPipe landmarks
   */
  update(landmarks) {
    if (!landmarks || landmarks.length < 21) return

    // Use landmark 9 (middle finger MCP) as palm center
    const palm = landmarks[9]

    // Mirror x-axis (webcam is flipped)
    const rawX = 1.0 - palm.x
    const rawY = palm.y

    // Remap to usable range with margins
    // This gives more range at the edges so the cursor can reach screen borders
    const mappedX = this._remap(rawX, MARGIN, 1.0 - MARGIN, 0, 1)
    const mappedY = this._remap(rawY, MARGIN, 1.0 - MARGIN, 0, 1)

    // Clamp to 0-1
    const clampedX = Math.max(0, Math.min(1, mappedX))
    const clampedY = Math.max(0, Math.min(1, mappedY))

    if (!this._hasInitialPosition) {
      // First frame: snap to position immediately (no smoothing lag)
      this._smoothX = clampedX
      this._smoothY = clampedY
      this._hasInitialPosition = true
    } else {
      // Exponential moving average smoothing
      this._smoothX += (clampedX - this._smoothX) * SMOOTHING_FACTOR
      this._smoothY += (clampedY - this._smoothY) * SMOOTHING_FACTOR
    }
  }

  /**
   * Get the cursor position in pixel screen coordinates.
   * @returns {{x: number, y: number}}
   */
  getScreenPosition() {
    return {
      x: this._smoothX * this._screenWidth,
      y: this._smoothY * this._screenHeight,
    }
  }

  /**
   * Get the cursor position as normalized coordinates (0-1 range).
   * @returns {{x: number, y: number}}
   */
  getNormalizedPosition() {
    return {
      x: this._smoothX,
      y: this._smoothY,
    }
  }

  /**
   * Remap a value from one range to another.
   * @param {number} value
   * @param {number} inMin
   * @param {number} inMax
   * @param {number} outMin
   * @param {number} outMax
   * @returns {number}
   */
  _remap(value, inMin, inMax, outMin, outMax) {
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
  }

  /**
   * Reset the cursor position and smoothing state.
   */
  reset() {
    this._smoothX = 0.5
    this._smoothY = 0.5
    this._hasInitialPosition = false
  }

  /**
   * Clean up event listeners.
   */
  destroy() {
    window.removeEventListener('resize', this._onResize)
  }
}
