import { eyeState } from '../stores/eye.svelte.js'

/**
 * Wraps WebGazer.js for eye/gaze tracking.
 *
 * WebGazer uses the webcam to predict where the user is looking
 * on the screen, returning (x, y) pixel coordinates.
 *
 * It self-calibrates from user clicks but we also offer an
 * explicit calibration flow for better accuracy.
 */
export class EyeTracker {
  constructor() {
    this._webgazer = null
    this._smoothX = 0
    this._smoothY = 0
    this._smoothFactor = 0.3 // EMA smoothing (lower = smoother, more lag)
    this._firstFrame = true
    this._active = false
  }

  /**
   * Initialize WebGazer and start predictions.
   */
  async init() {
    // Dynamic import — WebGazer is large and expects a browser environment
    const webgazer = (await import('webgazer')).default

    this._webgazer = webgazer

    // Configure before starting
    webgazer.params.showVideoPreview = false // hide default webcam preview
    webgazer.params.showFaceOverlay = false
    webgazer.params.showFaceFeedbackBox = false

    // Set regression model (ridge is default and most stable)
    webgazer.setRegression('ridge')

    // Set up the gaze listener
    webgazer.setGazeListener((data, timestamp) => {
      if (!data) return

      const x = data.x
      const y = data.y

      // Discard obviously bad predictions
      if (x == null || y == null || isNaN(x) || isNaN(y)) return
      if (x < -100 || y < -100 || x > window.innerWidth + 100 || y > window.innerHeight + 100) return

      // Smooth with EMA
      if (this._firstFrame) {
        this._smoothX = x
        this._smoothY = y
        this._firstFrame = false
      } else {
        this._smoothX += (x - this._smoothX) * this._smoothFactor
        this._smoothY += (y - this._smoothY) * this._smoothFactor
      }

      // Update store with pixel coordinates
      eyeState.gazePosition = {
        x: this._smoothX,
        y: this._smoothY
      }
    })

    // Start WebGazer (requests camera, begins predictions)
    await webgazer.begin()

    // Hide WebGazer's default video + canvas elements
    this._hideWebGazerUI()

    this._active = true
    eyeState.enabled = true
  }

  /**
   * WebGazer injects its own video/canvas elements. Hide them.
   */
  _hideWebGazerUI() {
    const videoEl = document.getElementById('webgazerVideoFeed')
    const canvasEl = document.getElementById('webgazerVideoCanvas')
    const faceCanvas = document.getElementById('webgazerFaceOverlay')
    const faceFeedback = document.getElementById('webgazerFaceFeedbackBox')
    const gazeDot = document.getElementById('webgazerGazeDot')

    ;[videoEl, canvasEl, faceCanvas, faceFeedback, gazeDot].forEach(el => {
      if (el) el.style.display = 'none'
    })
  }

  /**
   * Feed a calibration click at the given screen position.
   * WebGazer learns from clicks — the user looks at a point and clicks.
   */
  recordCalibrationPoint(x, y) {
    if (this._webgazer) {
      this._webgazer.recordScreenPosition(x, y, 'click')
    }
  }

  /**
   * Pause predictions (saves CPU).
   */
  pause() {
    if (this._webgazer && this._active) {
      this._webgazer.pause()
    }
  }

  /**
   * Resume predictions.
   */
  resume() {
    if (this._webgazer && this._active) {
      this._webgazer.resume()
    }
  }

  /**
   * Stop and clean up.
   */
  async destroy() {
    if (this._webgazer) {
      try {
        await this._webgazer.end()
      } catch (e) {
        // WebGazer can throw on cleanup — ignore
      }
      this._webgazer = null
    }
    this._active = false
    this._firstFrame = true
  }
}
