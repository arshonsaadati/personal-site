import { easeInOutCubic } from '../utils/easing.js'
import { navigationState } from '../stores/navigation.svelte.js'

/**
 * Orchestrates transitions between sections:
 * - Animates particle morphing (sets targets, drives transition progress)
 * - Animates camera along the spline path
 * - Updates navigation store state
 */
export class TransitionManager {
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

    // Section transition timing (camera movement + particle morph)
    this._transitionStartTime = 0
    this._transitionDuration = 2.0
    this._isSectionAnimating = false

    // Node-only transition (no camera movement)
    this._nodeTransitionStartTime = 0
    this._nodeTransitionDuration = 1.5
    this._isNodeAnimating = false
  }

  registerSections(sections) {
    this.sections = sections
  }

  transitionTo(sectionIndex) {
    if (sectionIndex < 0 || sectionIndex >= this.sections.length) return
    if (this._isSectionAnimating) return

    const section = this.sections[sectionIndex]
    if (!section) return

    // Cancel any in-progress node transition cleanly
    this._isNodeAnimating = false
    this.particleSystem.snapToTargets()

    this.particleSystem.setTargets(section.getPositions)
    this.particleSystem.transitionProgress = 0

    this._cameraAnimStartProgress = this._currentCameraProgress
    this._targetCameraProgress = this.cameraPath.getSectionProgress(sectionIndex)

    navigationState.isTransitioning = true
    navigationState.targetSection = sectionIndex
    navigationState.transitionProgress = 0

    this._transitionStartTime = performance.now() / 1000
    this._isSectionAnimating = true
  }

  /**
   * Transition particles to a new formation without moving the camera.
   * Used for project node sub-navigation.
   * @param {function} getPositionsFn - (i, total) => {x,y,z,r,g,b,size}
   */
  transitionToNode(getPositionsFn) {
    // Don't interrupt a section transition
    if (this._isSectionAnimating) return

    this.particleSystem.snapToTargets()
    this.particleSystem.setTargets(getPositionsFn)
    this.particleSystem.transitionProgress = 0

    this._nodeTransitionStartTime = performance.now() / 1000
    this._isNodeAnimating = true
  }

  /**
   * Forcefully cancel any in-progress node transition.
   * Snaps particles to their current targets to avoid visual pop.
   */
  cancelNodeTransition() {
    this._isNodeAnimating = false
    this.particleSystem.snapToTargets()
    this.particleSystem.transitionProgress = 1.0
  }

  update(deltaTime, elapsed) {
    if (this._isSectionAnimating) {
      const timeSinceStart = (performance.now() / 1000) - this._transitionStartTime
      const rawProgress = Math.min(timeSinceStart / this._transitionDuration, 1)
      const easedProgress = easeInOutCubic(rawProgress)

      this._currentCameraProgress =
        this._cameraAnimStartProgress +
        (this._targetCameraProgress - this._cameraAnimStartProgress) * easedProgress

      this.particleSystem.transitionProgress = rawProgress
      navigationState.transitionProgress = rawProgress

      if (rawProgress >= 1) {
        this._isSectionAnimating = false
        this.particleSystem.snapToTargets()
        this.particleSystem.transitionProgress = 1.0

        navigationState.isTransitioning = false
        navigationState.currentSection = navigationState.targetSection
        navigationState.transitionProgress = 1
      }
    }

    if (this._isNodeAnimating) {
      const t = Math.min(
        (performance.now() / 1000 - this._nodeTransitionStartTime) / this._nodeTransitionDuration,
        1
      )
      this.particleSystem.transitionProgress = t
      if (t >= 1) {
        this._isNodeAnimating = false
        this.particleSystem.snapToTargets()
        this.particleSystem.transitionProgress = 1.0
      }
    }

    // Update camera position (always, for idle animation)
    const transform = this.cameraPath.getTransform(this._currentCameraProgress, elapsed)
    this.sceneManager.camera.position.copy(transform.position)
    this.sceneManager.camera.lookAt(transform.lookAt)
  }

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
