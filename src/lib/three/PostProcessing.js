import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

/**
 * Custom vignette shader — darkens edges of the screen subtly.
 */
const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    uOffset: { value: 1.0 },    // vignette spread
    uDarkness: { value: 1.2 },  // vignette intensity
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uOffset;
    uniform float uDarkness;
    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);

      // Distance from center (0,0 at center, ~0.7 at corners)
      vec2 uv = (vUv - vec2(0.5)) * vec2(uOffset);
      float vignette = 1.0 - dot(uv, uv);
      vignette = clamp(vignette, 0.0, 1.0);
      vignette = pow(vignette, uDarkness);

      texel.rgb *= vignette;
      gl_FragColor = texel;
    }
  `,
}

/**
 * Post-processing pipeline: RenderPass -> UnrealBloomPass -> Vignette
 * Makes particles glow beautifully with bloom and adds cinematic vignette.
 */
export class PostProcessing {
  /**
   * @param {THREE.WebGLRenderer} renderer
   * @param {THREE.Scene} scene
   * @param {THREE.PerspectiveCamera} camera
   */
  constructor(renderer, scene, camera) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    const size = renderer.getSize(new THREE.Vector2())

    // Create EffectComposer
    this.composer = new EffectComposer(renderer)

    // Pass 1: Base scene render
    this.renderPass = new RenderPass(scene, camera)
    this.composer.addPass(this.renderPass)

    // Pass 2: Unreal Bloom — makes bright particles glow
    // strength: 1.5 (strong bloom), radius: 0.4 (medium spread), threshold: 0.2 (low — most particles glow)
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.x, size.y),
      0.35,  // strength — reduced to show particle structure
      0.25,  // radius
      0.4    // threshold
    )
    this.composer.addPass(this.bloomPass)

    // Pass 3: Vignette — subtle edge darkening for cinematic feel
    this.vignettePass = new ShaderPass(VignetteShader)
    this.vignettePass.uniforms.uOffset.value = 1.0
    this.vignettePass.uniforms.uDarkness.value = 1.2
    this.composer.addPass(this.vignettePass)
  }

  /**
   * Render the scene through the post-processing pipeline.
   * Call this instead of renderer.render(scene, camera).
   */
  render() {
    this.composer.render()
  }

  /**
   * Update composer and pass sizes on window resize.
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.composer.setSize(width, height)
    this.bloomPass.resolution.set(width, height)
  }

  /**
   * Clean up all passes and the composer.
   */
  dispose() {
    this.composer.dispose()
  }
}
