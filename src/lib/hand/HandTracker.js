/**
 * HandTracker — wraps MediaPipe HandLandmarker for webcam-based hand detection.
 *
 * Usage:
 *   const tracker = new HandTracker()
 *   await tracker.init()
 *   const landmarks = tracker.detect() // call in rAF loop
 *   tracker.destroy() // cleanup
 */

import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
const VISION_WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'

export class HandTracker {
  constructor() {
    /** @type {HandLandmarker|null} */
    this.landmarker = null
    /** @type {HTMLVideoElement|null} */
    this.video = null
    /** @type {MediaStream|null} */
    this.stream = null
    this._lastTimestamp = -1
    this._ready = false
  }

  /**
   * Initialize the HandLandmarker and request webcam access.
   * Creates a hidden video element for the webcam feed.
   * @returns {Promise<void>}
   * @throws {Error} If camera access is denied or model fails to load
   */
  async init() {
    // Load MediaPipe vision WASM runtime
    const vision = await FilesetResolver.forVisionTasks(VISION_WASM_URL)

    // Create the hand landmarker
    this.landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    // Request webcam
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user',
      },
      audio: false,
    })

    // Create hidden video element
    this.video = document.createElement('video')
    this.video.srcObject = this.stream
    this.video.setAttribute('playsinline', '')
    this.video.setAttribute('autoplay', '')
    this.video.style.position = 'absolute'
    this.video.style.top = '-9999px'
    this.video.style.left = '-9999px'
    this.video.style.width = '640px'
    this.video.style.height = '480px'
    this.video.style.pointerEvents = 'none'
    document.body.appendChild(this.video)

    // Wait for video to be ready
    await new Promise((resolve, reject) => {
      this.video.onloadeddata = resolve
      this.video.onerror = reject
      this.video.play().catch(reject)
    })

    this._ready = true
  }

  /**
   * Run hand detection on the current video frame.
   * Must be called from a requestAnimationFrame loop.
   * @returns {Array|null} Array of 21 normalized landmarks [{x, y, z}, ...] or null if no hand
   */
  detect() {
    if (!this._ready || !this.landmarker || !this.video) return null
    if (this.video.readyState < 2) return null

    const timestamp = performance.now()
    // MediaPipe requires strictly increasing timestamps
    if (timestamp <= this._lastTimestamp) return null
    this._lastTimestamp = timestamp

    try {
      const results = this.landmarker.detectForVideo(this.video, timestamp)

      if (results.landmarks && results.landmarks.length > 0) {
        return results.landmarks[0] // 21 landmarks for first hand
      }
    } catch (e) {
      // Silently handle detection errors — they happen occasionally on frame drops
      console.warn('Hand detection frame error:', e.message)
    }

    return null
  }

  /**
   * Check if the tracker is initialized and ready.
   * @returns {boolean}
   */
  get isReady() {
    return this._ready
  }

  /**
   * Clean up all resources: stop camera, remove video element, close landmarker.
   */
  destroy() {
    this._ready = false

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }

    if (this.video) {
      this.video.pause()
      this.video.srcObject = null
      if (this.video.parentNode) {
        this.video.parentNode.removeChild(this.video)
      }
      this.video = null
    }

    if (this.landmarker) {
      this.landmarker.close()
      this.landmarker = null
    }
  }
}
