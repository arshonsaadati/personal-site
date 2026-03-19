<script>
  import { onMount } from 'svelte'
  import * as THREE from 'three'
  import { SceneManager } from '../lib/three/SceneManager.js'
  import { ParticleSystem, setParticleCount } from '../lib/three/ParticleSystem.js'
  import { CameraPath } from '../lib/three/CameraPath.js'
  import { TransitionManager } from '../lib/three/TransitionManager.js'
  import { PostProcessing } from '../lib/three/PostProcessing.js'
  import { getPositions as heroPositions } from '../lib/three/scenes/HeroScene.js'
  import { getPositions as projectsPositions } from '../lib/three/scenes/ProjectsScene.js'
  import { getPositions as aboutPositions } from '../lib/three/scenes/AboutScene.js'
  import { getPositions as contactPositions } from '../lib/three/scenes/ContactScene.js'
  import { bindKeyboard, unbindKeyboard } from '../lib/utils/keyboard.js'
  import { isMobile } from '../lib/utils/mobile.js'
  import {
    setTransitionCallback,
    navigateNext,
    navigatePrev,
    navigationState,
  } from '../lib/stores/navigation.svelte.js'

  let { onready = () => {} } = $props()

  let container
  let sceneManager
  let particleSystem
  let cameraPath
  let transitionManager
  let postProcessing

  // Scroll debounce
  let lastScrollTime = 0
  const SCROLL_COOLDOWN = 1200

  // Touch swipe state
  let touchStartY = 0
  let touchStartX = 0
  const SWIPE_THRESHOLD = 50

  // Mouse → 3D cursor for particle repulsion
  const mouse = new THREE.Vector2(9999, 9999)
  const raycaster = new THREE.Raycaster()
  const cursorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const cursorTarget = new THREE.Vector3(9999, 9999, 9999)

  onMount(() => {
    const mobile = isMobile()

    // Reduce particles on mobile
    if (mobile) setParticleCount(30000)

    // Initialize Three.js systems
    sceneManager = new SceneManager(container)
    particleSystem = new ParticleSystem(sceneManager.scene)
    cameraPath = new CameraPath()
    transitionManager = new TransitionManager(particleSystem, cameraPath, sceneManager)

    // Post-processing pipeline
    postProcessing = new PostProcessing(
      sceneManager.renderer,
      sceneManager.scene,
      sceneManager.camera
    )
    sceneManager.setComposer(postProcessing)

    // Register all sections
    transitionManager.registerSections([
      { name: 'hero', getPositions: heroPositions },
      { name: 'projects', getPositions: projectsPositions },
      { name: 'about', getPositions: aboutPositions },
      { name: 'contact', getPositions: contactPositions },
    ])

    // Connect navigation store to transition manager
    setTransitionCallback((sectionIndex) => {
      transitionManager.transitionTo(sectionIndex)
    })

    // Load initial scene (Hero) immediately
    transitionManager.jumpTo(0)

    // Set up render loop callback
    sceneManager.setOnUpdate((delta, elapsed) => {
      particleSystem.update(delta, elapsed)
      transitionManager.update(delta, elapsed)
    })

    // Keyboard navigation
    bindKeyboard()

    // Signal ready to loading screen
    onready()

    // ── Mouse cursor → particle repulsion ──
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(mouse, sceneManager.camera)
      const hit = new THREE.Vector3()
      raycaster.ray.intersectPlane(cursorPlane, hit)
      if (hit) cursorTarget.copy(hit)
      particleSystem.setCursorPosition(cursorTarget.x, cursorTarget.y, cursorTarget.z)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // ── Scroll/wheel handler ──
    const handleWheel = (e) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastScrollTime < SCROLL_COOLDOWN) return
      if (navigationState.isTransitioning) return
      lastScrollTime = now
      if (e.deltaY > 0) navigateNext()
      else if (e.deltaY < 0) navigatePrev()
    }
    container.addEventListener('wheel', handleWheel, { passive: false })

    // ── Touch swipe (mobile) ──
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
    }
    const handleTouchEnd = (e) => {
      const dy = e.changedTouches[0].clientY - touchStartY
      const dx = e.changedTouches[0].clientX - touchStartX
      if (Math.abs(dy) < SWIPE_THRESHOLD && Math.abs(dx) < SWIPE_THRESHOLD) return
      if (navigationState.isTransitioning) return
      const now = Date.now()
      if (now - lastScrollTime < SCROLL_COOLDOWN) return
      lastScrollTime = now
      // Prefer vertical swipe
      if (Math.abs(dy) >= Math.abs(dx)) {
        if (dy < -SWIPE_THRESHOLD) navigateNext()
        else if (dy > SWIPE_THRESHOLD) navigatePrev()
      } else {
        if (dx < -SWIPE_THRESHOLD) navigateNext()
        else if (dx > SWIPE_THRESHOLD) navigatePrev()
      }
    }
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      unbindKeyboard()
      window.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
      postProcessing.dispose()
      particleSystem.dispose()
      sceneManager.dispose()
    }
  })
</script>

<div class="canvas-container" bind:this={container}></div>

<style>
  .canvas-container {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }

  .canvas-container :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
