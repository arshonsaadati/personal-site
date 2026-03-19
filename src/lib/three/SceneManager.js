import * as THREE from 'three'
import { PostProcessing } from './PostProcessing.js'

/**
 * Manages the core Three.js scene, camera, renderer, and render loop.
 * Includes post-processing pipeline (bloom + vignette).
 * Other systems (ParticleSystem, CameraPath, etc.) attach to this.
 */
export class SceneManager {
  constructor(container, { isMobile = false } = {}) {
    this.container = container
    this.clock = new THREE.Clock()
    this._animationId = null
    this._onUpdate = null
    this.isMobile = isMobile

    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)

    // Camera
    const aspect = container.clientWidth / container.clientHeight
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    this.camera.position.set(0, 0, 100)

    // Pixel ratio cap: 1.5 on mobile, 2.0 on desktop
    const maxPixelRatio = isMobile ? 1.5 : 2.0

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isMobile, // skip antialias on mobile for perf
      powerPreference: 'high-performance',
    })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio))
    container.appendChild(this.renderer.domElement)

    // Post-processing pipeline
    this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera)

    // Resize handler
    this._maxPixelRatio = maxPixelRatio
    this._onResize = this._handleResize.bind(this)
    window.addEventListener('resize', this._onResize)

    // Start render loop
    this._animate()
  }

  setOnUpdate(callback) {
    this._onUpdate = callback
  }

  _handleResize() {
    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this._maxPixelRatio))

    // Resize post-processing pipeline
    this.postProcessing.resize(width, height)
  }

  _animate() {
    this._animationId = requestAnimationFrame(() => this._animate())

    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()

    if (this._onUpdate) {
      this._onUpdate(delta, elapsed)
    }

    // Render through post-processing pipeline (bloom + vignette)
    this.postProcessing.render()
  }

  dispose() {
    if (this._animationId) {
      cancelAnimationFrame(this._animationId)
      this._animationId = null
    }

    window.removeEventListener('resize', this._onResize)

    this.postProcessing.dispose()
    this.renderer.dispose()
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }
  }
}
