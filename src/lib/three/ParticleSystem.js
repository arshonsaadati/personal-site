import * as THREE from 'three'

const PARTICLE_COUNT = 80000

// ──────────────────────────────────────────────
// Vertex Shader
// ──────────────────────────────────────────────
const vertexShader = /* glsl */ `
  attribute vec3 targetPosition;
  attribute vec3 color;
  attribute vec3 targetColor;
  attribute float size;
  attribute float targetSize;
  attribute float random;

  uniform float uTransitionProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Per-particle staggered progress: each particle starts and finishes its
    // transition at a slightly different time based on its random seed.
    // The 0.4 stagger range means particles spread across 40% of the transition.
    float stagger = random * 0.4;
    float particleProgress = smoothstep(stagger, stagger + 0.6, uTransitionProgress);

    // Interpolate position
    vec3 pos = mix(position, targetPosition, particleProgress);

    // Mid-transition chaos displacement:
    // Peaks when particleProgress is near 0.5 (mid-morph), zero at start/end.
    float chaosFactor = 1.0 - abs(particleProgress - 0.5) * 2.0;
    chaosFactor = max(chaosFactor, 0.0);
    chaosFactor *= chaosFactor; // Square for sharper falloff

    // Only apply chaos when actually transitioning (progress between 0 and 1 exclusive)
    float isTransitioning = step(0.01, uTransitionProgress) * (1.0 - step(0.99, uTransitionProgress));
    chaosFactor *= isTransitioning;

    // 3-axis noise displacement using sin waves at different frequencies
    vec3 chaosOffset = vec3(
      sin(uTime * 2.0 + random * 6.2831 + pos.y * 0.1) * 8.0,
      cos(uTime * 1.7 + random * 4.1888 + pos.x * 0.1) * 8.0,
      sin(uTime * 2.3 + random * 5.0265 + pos.z * 0.1) * 8.0
    ) * chaosFactor;

    pos += chaosOffset;

    // Interpolate color and size
    vColor = mix(color, targetColor, particleProgress);
    float currentSize = mix(size, targetSize, particleProgress);

    // Project position
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size attenuation: particles further away appear smaller
    float sizeAttenuation = 300.0 / -mvPosition.z;
    gl_PointSize = currentSize * uPixelRatio * sizeAttenuation;
    gl_PointSize = max(gl_PointSize, 1.0); // Minimum 1px

    gl_Position = projectionMatrix * mvPosition;

    // Fade out particles that are very far away
    float dist = length(mvPosition.xyz);
    vAlpha = smoothstep(500.0, 200.0, dist);
  }
`

// ──────────────────────────────────────────────
// Fragment Shader
// ──────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Distance from center of point sprite
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Discard pixels outside circle
    if (dist > 0.5) discard;

    // Soft glow falloff
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= alpha; // Sharper glow core, softer edges

    alpha *= vAlpha;

    gl_FragColor = vec4(vColor, alpha);
  }
`

/**
 * Core particle system: 80,000 particles with GPU-based morphing
 * between scenes via custom ShaderMaterial.
 */
export class ParticleSystem {
  constructor(scene) {
    this.count = PARTICLE_COUNT
    this.scene = scene

    this._createGeometry()
    this._createMaterial()

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.frustumCulled = false // Particles span entire scene
    this.scene.add(this.points)
  }

  _createGeometry() {
    this.geometry = new THREE.BufferGeometry()

    // Allocate all buffer attributes
    const positions = new Float32Array(this.count * 3)
    const targetPositions = new Float32Array(this.count * 3)
    const colors = new Float32Array(this.count * 3)
    const targetColors = new Float32Array(this.count * 3)
    const sizes = new Float32Array(this.count)
    const targetSizes = new Float32Array(this.count)
    const randoms = new Float32Array(this.count)

    // Initialize with random positions (scattered in space) and random seeds
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3

      // Start scattered
      positions[i3] = (Math.random() - 0.5) * 200
      positions[i3 + 1] = (Math.random() - 0.5) * 200
      positions[i3 + 2] = (Math.random() - 0.5) * 200

      // Target = same as start initially
      targetPositions[i3] = positions[i3]
      targetPositions[i3 + 1] = positions[i3 + 1]
      targetPositions[i3 + 2] = positions[i3 + 2]

      // White-ish default color
      colors[i3] = 0.5 + Math.random() * 0.5
      colors[i3 + 1] = 0.5 + Math.random() * 0.5
      colors[i3 + 2] = 0.5 + Math.random() * 0.5

      targetColors[i3] = colors[i3]
      targetColors[i3 + 1] = colors[i3 + 1]
      targetColors[i3 + 2] = colors[i3 + 2]

      sizes[i] = 0.5 + Math.random() * 0.5
      targetSizes[i] = sizes[i]

      // Per-particle random seed: fixed once, used for stagger in shader
      randoms[i] = Math.random()
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3))
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('targetColor', new THREE.BufferAttribute(targetColors, 3))
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    this.geometry.setAttribute('targetSize', new THREE.BufferAttribute(targetSizes, 1))
    this.geometry.setAttribute('random', new THREE.BufferAttribute(randoms, 1))
  }

  _createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTransitionProgress: { value: 1.0 }, // Start at 1.0 (fully arrived)
        uTime: { value: 0.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }

  /**
   * Set target positions/colors/sizes for all particles using a scene's
   * distribution function.
   *
   * @param {function} getPositionsFn - (index, totalCount) => { x, y, z, r, g, b, size }
   */
  setTargets(getPositionsFn) {
    const targetPos = this.geometry.getAttribute('targetPosition')
    const targetCol = this.geometry.getAttribute('targetColor')
    const targetSize = this.geometry.getAttribute('targetSize')

    for (let i = 0; i < this.count; i++) {
      const p = getPositionsFn(i, this.count)
      const i3 = i * 3

      targetPos.array[i3] = p.x
      targetPos.array[i3 + 1] = p.y
      targetPos.array[i3 + 2] = p.z

      targetCol.array[i3] = p.r
      targetCol.array[i3 + 1] = p.g
      targetCol.array[i3 + 2] = p.b

      targetSize.array[i] = p.size
    }

    targetPos.needsUpdate = true
    targetCol.needsUpdate = true
    targetSize.needsUpdate = true
  }

  /**
   * "Snap" current position/color/size to target values.
   * Call after a transition completes so the current buffers match targets.
   */
  snapToTargets() {
    const pos = this.geometry.getAttribute('position')
    const targetPos = this.geometry.getAttribute('targetPosition')
    const col = this.geometry.getAttribute('color')
    const targetCol = this.geometry.getAttribute('targetColor')
    const size = this.geometry.getAttribute('size')
    const targetSize = this.geometry.getAttribute('targetSize')

    pos.array.set(targetPos.array)
    col.array.set(targetCol.array)
    size.array.set(targetSize.array)

    pos.needsUpdate = true
    col.needsUpdate = true
    size.needsUpdate = true
  }

  /**
   * Set targets AND immediately snap to them (for initial scene load).
   */
  setImmediate(getPositionsFn) {
    this.setTargets(getPositionsFn)
    this.snapToTargets()
    this.material.uniforms.uTransitionProgress.value = 1.0
  }

  update(deltaTime, elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  get transitionProgress() {
    return this.material.uniforms.uTransitionProgress.value
  }

  set transitionProgress(value) {
    this.material.uniforms.uTransitionProgress.value = value
  }

  dispose() {
    this.scene.remove(this.points)
    this.geometry.dispose()
    this.material.dispose()
  }
}

export { PARTICLE_COUNT }
