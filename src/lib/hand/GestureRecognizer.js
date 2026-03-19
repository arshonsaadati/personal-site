/**
 * GestureRecognizer — classifies hand gestures from MediaPipe 21-landmark data.
 *
 * Landmark indices (MediaPipe hand model):
 *   0: WRIST
 *   1-4: THUMB (CMC, MCP, IP, TIP)
 *   5-8: INDEX (MCP, PIP, DIP, TIP)
 *   9-12: MIDDLE (MCP, PIP, DIP, TIP)
 *   13-16: RING (MCP, PIP, DIP, TIP)
 *   17-20: PINKY (MCP, PIP, DIP, TIP)
 *
 * Gestures recognized:
 *   open_palm  — 4+ fingers extended
 *   fist       — 0-1 fingers extended (but not index alone)
 *   point      — only index finger extended
 *   pinch      — thumb tip close to index tip
 *   swipe_left / swipe_right — palm center horizontal velocity over frames
 *   none       — unclassified
 */

// Stability buffer: gesture must be consistent for N frames before registering
const STABILITY_FRAMES = 3
// Swipe detection parameters
const SWIPE_HISTORY_LENGTH = 8
const SWIPE_VELOCITY_THRESHOLD = 0.06 // normalized units per frame
const SWIPE_COOLDOWN_MS = 500
// Pinch distance threshold (normalized hand space)
const PINCH_THRESHOLD = 0.06

export class GestureRecognizer {
  constructor() {
    // Stability buffer
    this._gestureHistory = []
    this._currentStableGesture = 'none'

    // Swipe tracking: history of palm center x positions
    this._palmXHistory = []
    this._lastSwipeTime = 0

    // Fist edge detection
    this._wasFist = false
    this._fistTransitionFired = false
  }

  /**
   * Classify the current gesture from 21 landmarks.
   * @param {Array<{x: number, y: number, z: number}>} landmarks - 21 MediaPipe hand landmarks (normalized 0-1)
   * @returns {string} Gesture name: 'open_palm' | 'fist' | 'point' | 'pinch' | 'swipe_left' | 'swipe_right' | 'none'
   */
  classify(landmarks) {
    if (!landmarks || landmarks.length < 21) return 'none'

    // Check for swipe first (it's a temporal gesture)
    const swipe = this._detectSwipe(landmarks)
    if (swipe) return swipe

    // Check for pinch (thumb tip to index tip proximity)
    if (this._isPinching(landmarks)) {
      return this._stabilize('pinch')
    }

    // Get finger extension states
    const fingers = this._getFingerStates(landmarks)
    const extendedCount = fingers.filter(Boolean).length

    // Classify based on finger states
    let rawGesture = 'none'

    if (extendedCount >= 4) {
      rawGesture = 'open_palm'
    } else if (fingers[1] && extendedCount === 1) {
      // Only index finger extended
      rawGesture = 'point'
    } else if (extendedCount <= 1 && !(fingers[1] && extendedCount === 1)) {
      // 0 or 1 fingers extended, and not "point" (index only)
      rawGesture = 'fist'
    }

    return this._stabilize(rawGesture)
  }

  /**
   * Check if a fist transition just occurred (open->fist edge).
   * Only fires once per transition, not while held.
   * @returns {boolean}
   */
  isFistTransition() {
    const isFist = this._currentStableGesture === 'fist'

    if (isFist && !this._wasFist) {
      this._wasFist = true
      return true
    }

    if (!isFist) {
      this._wasFist = false
    }

    return false
  }

  /**
   * Determine which fingers are extended.
   * For fingers (index, middle, ring, pinky): tip.y < PIP.y means extended (screen coords: y increases downward in normalized space)
   * For thumb: compare tip.x to IP.x laterally, accounting for hand side.
   * @returns {boolean[]} [thumb, index, middle, ring, pinky]
   */
  _getFingerStates(landmarks) {
    const fingers = []

    // Thumb: compare tip x (4) to IP x (3)
    // If wrist x < middle MCP x, it's a right hand (in mirrored webcam), thumb extends right
    // The logic: thumb tip should be further from palm center than IP joint
    const wrist = landmarks[0]
    const middleMCP = landmarks[9]
    const isRightHand = wrist.x < middleMCP.x

    if (isRightHand) {
      // Right hand in camera: thumb extends left (lower x in normalized coords)
      fingers.push(landmarks[4].x < landmarks[3].x)
    } else {
      // Left hand in camera: thumb extends right (higher x in normalized coords)
      fingers.push(landmarks[4].x > landmarks[3].x)
    }

    // Index: tip (8) vs PIP (6) — extended if tip is above (lower y)
    fingers.push(landmarks[8].y < landmarks[6].y)

    // Middle: tip (12) vs PIP (10)
    fingers.push(landmarks[12].y < landmarks[10].y)

    // Ring: tip (16) vs PIP (14)
    fingers.push(landmarks[16].y < landmarks[14].y)

    // Pinky: tip (20) vs PIP (18)
    fingers.push(landmarks[20].y < landmarks[18].y)

    return fingers
  }

  /**
   * Check if thumb and index are pinching (tips close together).
   * @returns {boolean}
   */
  _isPinching(landmarks) {
    const thumbTip = landmarks[4]
    const indexTip = landmarks[8]
    const dx = thumbTip.x - indexTip.x
    const dy = thumbTip.y - indexTip.y
    const dz = thumbTip.z - indexTip.z
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
    return dist < PINCH_THRESHOLD
  }

  /**
   * Detect swipe gestures by tracking palm center horizontal velocity.
   * Uses landmark 9 (middle finger MCP) as palm center proxy.
   * @returns {string|null} 'swipe_left', 'swipe_right', or null
   */
  _detectSwipe(landmarks) {
    const now = performance.now()

    // Cooldown
    if (now - this._lastSwipeTime < SWIPE_COOLDOWN_MS) {
      return null
    }

    const palmX = landmarks[9].x

    this._palmXHistory.push(palmX)
    if (this._palmXHistory.length > SWIPE_HISTORY_LENGTH) {
      this._palmXHistory.shift()
    }

    // Need enough frames for velocity calculation
    if (this._palmXHistory.length < 6) return null

    // Calculate velocity over the last several frames
    // Compare recent frames vs older frames
    const recentCount = 3
    const olderCount = 3
    const len = this._palmXHistory.length

    let recentAvg = 0
    for (let i = len - recentCount; i < len; i++) {
      recentAvg += this._palmXHistory[i]
    }
    recentAvg /= recentCount

    let olderAvg = 0
    for (let i = len - recentCount - olderCount; i < len - recentCount; i++) {
      olderAvg += this._palmXHistory[i]
    }
    olderAvg /= olderCount

    const velocity = recentAvg - olderAvg

    if (Math.abs(velocity) > SWIPE_VELOCITY_THRESHOLD) {
      this._lastSwipeTime = now
      this._palmXHistory = [] // Reset after detecting swipe

      // In webcam (mirrored) space: moving right in camera = moving left in world
      // Positive velocity in normalized coords (0=left, 1=right) means hand moved right in camera
      // Since camera is mirrored, rightward camera motion = leftward real-world motion
      // We want the gesture to feel natural: user swipes right = swipe_right
      // In mirrored cam: user swipes right -> hand moves LEFT in camera -> negative velocity
      if (velocity < -SWIPE_VELOCITY_THRESHOLD) {
        return 'swipe_right'
      } else if (velocity > SWIPE_VELOCITY_THRESHOLD) {
        return 'swipe_left'
      }
    }

    return null
  }

  /**
   * Stabilize gesture with a history buffer.
   * A gesture must appear in the last N frames to be accepted.
   * @param {string} rawGesture
   * @returns {string}
   */
  _stabilize(rawGesture) {
    this._gestureHistory.push(rawGesture)
    if (this._gestureHistory.length > STABILITY_FRAMES) {
      this._gestureHistory.shift()
    }

    // Check if all recent frames agree
    if (this._gestureHistory.length >= STABILITY_FRAMES) {
      const allSame = this._gestureHistory.every(g => g === rawGesture)
      if (allSame) {
        this._currentStableGesture = rawGesture
        return rawGesture
      }
    }

    // Return the last stable gesture if no consensus
    return this._currentStableGesture
  }

  /**
   * Reset all internal state. Useful when hand tracking is toggled off/on.
   */
  reset() {
    this._gestureHistory = []
    this._currentStableGesture = 'none'
    this._palmXHistory = []
    this._lastSwipeTime = 0
    this._wasFist = false
    this._fistTransitionFired = false
  }
}
