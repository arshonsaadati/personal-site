/**
 * Gesture classification from hand landmarks.
 * Recognizes: open_palm, fist, point, pinch, swipe_left, swipe_right
 */

const SWIPE_COOLDOWN = 500    // ms between swipe triggers
const STABILITY_FRAMES = 3    // frames a gesture must hold to register
const HISTORY_SIZE = 10       // frames of position history for swipe detection
const SWIPE_THRESHOLD = 0.12  // normalized x-distance for swipe detection

export class GestureRecognizer {
  constructor() {
    this.positionHistory = []
    this.gestureBuffer = []
    this.lastSwipeTime = 0
    this.lastGesture = 'none'
    this.lastFistState = false
  }

  /**
   * Determine if each finger is extended.
   * Compares tip y to PIP joint y (lower y = higher on screen in normalized coords).
   * @param {Array} landmarks - 21 hand landmarks
   * @returns {{ thumb: boolean, index: boolean, middle: boolean, ring: boolean, pinky: boolean }}
   */
  getFingerStates(landmarks) {
    // Landmark indices: tip, pip
    // Thumb: compare tip x distance from wrist vs IP joint x distance (thumb extends laterally)
    const wrist = landmarks[0]
    const thumbTip = landmarks[4]
    const thumbIP = landmarks[3]

    // For thumb, check if tip is further from palm center than IP joint
    const thumbExtended =
      Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbIP.x - wrist.x)

    // For other fingers, tip y < pip y means extended (y increases downward in normalized coords)
    const indexExtended = landmarks[8].y < landmarks[6].y
    const middleExtended = landmarks[12].y < landmarks[10].y
    const ringExtended = landmarks[16].y < landmarks[14].y
    const pinkyExtended = landmarks[20].y < landmarks[18].y

    return {
      thumb: thumbExtended,
      index: indexExtended,
      middle: middleExtended,
      ring: ringExtended,
      pinky: pinkyExtended,
    }
  }

  /**
   * Calculate distance between two landmarks.
   */
  distance(a, b) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Classify the current gesture from landmarks.
   * @param {Array} landmarks - 21 hand landmarks
   * @returns {string} Gesture name
   */
  classify(landmarks) {
    if (!landmarks) return 'none'

    const fingers = this.getFingerStates(landmarks)
    const extendedCount = [fingers.thumb, fingers.index, fingers.middle, fingers.ring, fingers.pinky]
      .filter(Boolean).length

    // Track palm center (landmark 9) for swipe detection
    const palmCenter = landmarks[9]
    this.positionHistory.push({ x: palmCenter.x, y: palmCenter.y, time: performance.now() })
    if (this.positionHistory.length > HISTORY_SIZE) {
      this.positionHistory.shift()
    }

    // Check for swipe first (velocity-based)
    const swipe = this._detectSwipe()
    if (swipe) return swipe

    // Pinch: thumb tip and index tip very close
    if (this.distance(landmarks[4], landmarks[8]) < 0.05) {
      return this._stabilize('pinch')
    }

    // Fist: no fingers extended (or just thumb)
    if (extendedCount <= 1 && !fingers.index) {
      return this._stabilize('fist')
    }

    // Point: only index extended
    if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
      return this._stabilize('point')
    }

    // Open palm: all or most fingers extended
    if (extendedCount >= 4) {
      return this._stabilize('open_palm')
    }

    return this._stabilize('none')
  }

  /**
   * Detect swipe gestures from position history.
   * @returns {string|null} 'swipe_left', 'swipe_right', or null
   */
  _detectSwipe() {
    if (this.positionHistory.length < 6) return null

    const now = performance.now()
    if (now - this.lastSwipeTime < SWIPE_COOLDOWN) return null

    const recent = this.positionHistory.slice(-6)
    const dx = recent[recent.length - 1].x - recent[0].x
    const dt = recent[recent.length - 1].time - recent[0].time

    // Only count fast movements (under 400ms window)
    if (dt > 400) return null

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      this.lastSwipeTime = now
      this.positionHistory = []
      // Note: x is mirrored from webcam, so positive dx = visual left
      return dx > 0 ? 'swipe_left' : 'swipe_right'
    }

    return null
  }

  /**
   * Stabilize gesture detection with frame buffer.
   * Gesture must be consistent for STABILITY_FRAMES frames.
   * @param {string} gesture
   * @returns {string}
   */
  _stabilize(gesture) {
    this.gestureBuffer.push(gesture)
    if (this.gestureBuffer.length > STABILITY_FRAMES) {
      this.gestureBuffer.shift()
    }

    // Check if all recent frames agree
    const allSame = this.gestureBuffer.length >= STABILITY_FRAMES &&
      this.gestureBuffer.every((g) => g === gesture)

    if (allSame) {
      this.lastGesture = gesture
      return gesture
    }

    return this.lastGesture
  }

  /**
   * Check if fist just transitioned (for click-on-transition behavior).
   * @param {string} currentGesture
   * @returns {boolean}
   */
  isFistTransition(currentGesture) {
    const isFist = currentGesture === 'fist'
    const wasNotFist = !this.lastFistState
    this.lastFistState = isFist
    return isFist && wasNotFist
  }

  reset() {
    this.positionHistory = []
    this.gestureBuffer = []
    this.lastGesture = 'none'
    this.lastFistState = false
  }
}
