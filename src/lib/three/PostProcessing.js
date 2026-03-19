import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

// ──────────────────────────────────────────────
// Chromatic Aberration Shader
// ──────────────────────────────────────────────
const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    uOffset: { value: new THREE.Vector2(0.002, 0.002) },
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
    uniform vec2 uOffset;
    varying vec2 vUv;
    void main() {
      float r = texture2D(tDiffuse, vUv + uOffset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - uOffset).b;
      float a = texture2D(tDiffuse, vUv).a;
      gl_FragColor = vec4(r, g, b, a);
    }
  `,
}

// ──────────────────────────────────────────────
// Vignette Shader
// ──────────────────────────────────────────────
const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    uDarkness: { value: 1.2 },
    uOffset: { value: 1.0 },
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
    uniform float uDarkness;
    uniform float uOffset;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 center = vUv - 0.5;
      float dist = length(center);
      float vignette = smoothstep(0.8, uOffset * 0.5, dist * (uDarkness + uOffset));
      color.rgb *= vignette;
      gl_FragColor = color;
    }
  `,
}

/**
 * Post-processing pipeline: RenderPass → UnrealBloom → ChromaticAberration → Vignette → Output
 */
export class PostProcessing {
  /**
   * @param {THREE.WebGLRenderer} renderer
   * @param {THREE.Scene} scene
   * @param {THREE.PerspectiveCamera} camera
   */
  constructor(renderer, scene, camera) {
    this.composer = new EffectComposer(renderer)

    // 1. Render pass
    const renderPass = new RenderPass(scene, camera)
    this.composer.addPass(renderPass)

    // 2. Bloom — strength 1.5, radius 0.4, threshold 0.2
    const resolution = new THREE.Vector2(
      renderer.domElement.clientWidth,
      renderer.domElement.clientHeight
    )
    this.bloomPass = new UnrealBloomPass(resolution, 1.5, 0.4, 0.2)
    this.composer.addPass(this.bloomPass)

    // 3. Chromatic aberration
    this.chromaticPass = new ShaderPass(ChromaticAberrationShader)
    this.composer.addPass(this.chromaticPass)

    // 4. Vignette
    this.vignettePass = new ShaderPass(VignetteShader)
    this.composer.addPass(this.vignettePass)

    // 5. Output (tone mapping + color space)
    const outputPass = new OutputPass()
    this.composer.addPass(outputPass)
  }

  render() {
    this.composer.render()
  }

  setSize(width, height) {
    this.composer.setSize(width, height)
  }

  dispose() {
    this.composer.dispose()
  }
}
