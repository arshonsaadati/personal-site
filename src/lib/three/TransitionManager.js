import { easeInOutCubic } from '../utils/easing.js'
import { navigationState } from '../stores/navigation.svelte.js'

/**
 * Orchestrates transitions between sections:
 * - Animates particle morphing (sets targets, drives transition progress)
 * - Animates camera along the spline path
 * - Updates navigation store state
 */
export class TransitionManager {
  /**
   * @param {import('./ParticleSystem.js').ParticleSystem} particleSystem
   * @param {import('./CameraPath.js').CameraPath} cameraPath
   * @param {import('./SceneManager.js').SceneManager} sceneManager
   */
  constructor(particleSystem, cameraPath, sceneManager) {
    this.particleSystem = particleSystem
    this.cameraPath = cameraPath
    this.sceneManager = sceneManager

    /** @type {Array<{ name: string, getPositions: function }>} */
    this.sections = []

    // Camera progress state
    this._currentCameraProgress = 0
    this._targetCameraProgress = 0
    this._cameraAnimStartProgress = 0

    // Transition timing
    this._transitionStartTime = 0
    this._transitionDuration = 2.0 // seconds
    this._isAnimating = false
  }

  /**
   * Register sections in order. Call once after all scene modules are loaded.
   * @param {Array<{ name: string, getPositions: function }>} sections
   */
  registerSections(sections) {
    this.sections = sections
  }

  /**
   * Transition to a section by index. Called by the navigation store.
   * @param {number} sectionIndex
   */
  transitionTo(sectionIndex) {
    if (sectionIndex < 0 || sectionIndex >= this.sections.length) return
    if (this._isAnimating) return

    const section = this.sections[sectionIndex]
    if (!section) return

    // Snap current particles to their current interpolated positions
    // before starting a new transition (so we animate FROM where they are now)
    this.particleSystem.snapToTargets()

    // Set new targets from the destination scene
    this.particleSystem.setTargets(section.getPositions)

    // Reset particle transition progress to 0 (shader will animate 0→1)
    this.particleSystem.transitionProgress = 0

    // Camera: animate from current progress to section's stop
    this._cameraAnimStartProgress = this._currentCameraProgress
    this._targetCameraProgress = this.cameraPath.getSectionProgress(sectionIndex)

    // Update navigation store
    navigationState.isTransitioning = true
    navigationState.targetSection = sectionIndex
    navigationState.transitionProgress = 0

    // Start animation
    this._transitionStartTime = performance.now() / 1000
    this._isAnimating = true
  }

  /**
   * Called every frame from the render loop.
   * @param {number} deltaTime
   * @param {number} elapsed - total elapsed time
   */
  update(deltaTime, elapsed) {
    if (this._isAnimating) {
      const timeSinceStart = (performance.now() / 1000) - this._transitionStartTime
      const rawProgress = Math.min(timeSinceStart / this._transitionDuration, 1)

      // Eased progress for camera movement
      const easedProgress = easeInOutCubic(rawProgress)

      // Camera progress: lerp from start to target
      this._currentCameraProgress =
        this._cameraAnimStartProgress +
        (this._targetCameraProgress - this._cameraAnimStartProgress) * easedProgress

      // Particle transition progress: use raw time-based progress
      // (the shader handles per-particle easing/stagger internally)
      this.particleSystem.transitionProgress = rawProgress

      // Update navigation store
      navigationState.transitionProgress = rawProgress

      // Check if transition complete
      if (rawProgress >= 1) {
        this._isAnimating = false
        this.particleSystem.snapToTargets()
        this.particleSystem.transitionProgress = 1.0

        navigationState.isTransitioning = false
        navigationState.currentSection = navigationState.targetSection
        navigationState.transitionProgress = 1
      }
    }

    // Update camera position from spline (always, even when not transitioning — for idle anim)
    const transform = this.cameraPath.getTransform(this._currentCameraProgress, elapsed)
    this.sceneManager.camera.position.copy(transform.position)
    this.sceneManager.camera.lookAt(transform.lookAt)
  }

  /**
   * Jump immediately to a section without animation.
   */
  jumpTo(sectionIndex) {
    if (sectionIndex < 0 || sectionIndex >= this.sections.length) return

    const section = this.sections[sectionIndex]
    this.particleSystem.setImmediate(section.getPositions)

    this._currentCameraProgress = this.cameraPath.getSectionProgress(sectionIndex)
    this._targetCameraProgress = this._currentCameraProgress

    navigationState.currentSection = sectionIndex
    navigationState.targetSection = sectionIndex
    navigationState.isTransitioning = false
    navigationState.transitionProgress = 1
  }
}
