import * as THREE from 'three'

/**
 * Manages the core Three.js scene, camera, renderer, and render loop.
 * Other systems (ParticleSystem, CameraPath, etc.) attach to this.
 */
export class SceneManager {
  constructor(container) {
    this.container = container
    this.clock = new THREE.Clock()
    this._animationId = null
    this._onUpdate = null

    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)

    // Camera
    const aspect = container.clientWidth / container.clientHeight
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    this.camera.position.set(0, 0, 100)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(this.renderer.domElement)

    // Resize handler
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if (this._composer) {
      this._composer.setSize(width, height)
    }
  }

  _animate() {
    this._animationId = requestAnimationFrame(() => this._animate())

    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()

    if (this._onUpdate) {
      this._onUpdate(delta, elapsed)
    }

    // If a post-processing composer is set, use it; otherwise fall back to direct render
    if (this._composer) {
      this._composer.render()
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }

  /** Set an EffectComposer to replace direct renderer.render() */
  setComposer(composer) {
    this._composer = composer
  }

  dispose() {
    if (this._animationId) {
      cancelAnimationFrame(this._animationId)
      this._animationId = null
    }

    window.removeEventListener('resize', this._onResize)

    this.renderer.dispose()
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }
  }
}
