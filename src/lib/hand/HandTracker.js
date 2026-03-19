/**
 * MediaPipe HandLandmarker wrapper.
 * Manages webcam access, hand detection, and landmark extraction.
 */
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'

export class HandTracker {
  constructor() {
    this.landmarker = null
    this.video = null
    this.stream = null
    this.lastTimestamp = -1
    this.running = false
  }

  /**
   * Initialize MediaPipe HandLandmarker and request webcam access.
   * @returns {Promise<void>}
   */
  async init() {
    const vision = await FilesetResolver.forVisionTasks(WASM_URL)

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

    // Create hidden video element for webcam feed
    this.video = document.createElement('video')
    this.video.setAttribute('playsinline', '')
    this.video.setAttribute('autoplay', '')
    this.video.style.display = 'none'
    document.body.appendChild(this.video)

    // Request webcam
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 },
    })

    this.video.srcObject = this.stream
    await this.video.play()
    this.running = true
  }

  /**
   * Detect hand landmarks from current video frame.
   * @returns {Array|null} 21 landmarks [{x, y, z}, ...] or null if no hand detected
   */
  detect() {
    if (!this.running || !this.landmarker || !this.video) return null
    if (this.video.readyState < 2) return null

    const timestamp = performance.now()
    // MediaPipe requires strictly increasing timestamps
    if (timestamp <= this.lastTimestamp) return null
    this.lastTimestamp = timestamp

    const results = this.landmarker.detectForVideo(this.video, timestamp)

    if (results.landmarks && results.landmarks.length > 0) {
      return results.landmarks[0] // First hand, 21 landmarks
    }

    return null
  }

  /**
   * Stop video stream and close landmarker.
   */
  destroy() {
    this.running = false

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    if (this.video) {
      this.video.remove()
      this.video = null
    }

    if (this.landmarker) {
      this.landmarker.close()
      this.landmarker = null
    }
  }
}
