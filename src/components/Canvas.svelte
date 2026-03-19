<script>
  import * as THREE from 'three'
  import { onMount } from 'svelte'
  import { SceneManager } from '../lib/three/SceneManager.js'
  import { ParticleSystem, configureForDevice, isMobileDevice } from '../lib/three/ParticleSystem.js'
  import { CameraPath } from '../lib/three/CameraPath.js'
  import { TransitionManager } from '../lib/three/TransitionManager.js'
  import { getPositions as heroPositions } from '../lib/three/scenes/HeroScene.js'
  import { getPositions as projectsPositions } from '../lib/three/scenes/ProjectsScene.js'
  import { getPositions as aboutPositions } from '../lib/three/scenes/AboutScene.js'
  import { getPositions as contactPositions } from '../lib/three/scenes/ContactScene.js'
  import {
    setTransitionCallback,
    navigateNext,
    navigatePrev,
    navigateTo,
    navigationState,
  } from '../lib/stores/navigation.svelte.js'
  import { handState } from '../lib/stores/hand.svelte.js'

  // Props: onReady callback for loading screen
  let { onReady = () => {} } = $props()

  let container
  let sceneManager
  let particleSystem
  let cameraPath
  let transitionManager

  // Scroll/keyboard debounce
  let lastNavTime = 0
  const NAV_COOLDOWN = 1200 // ms between navigations

  // Mobile detection
  const mobile = typeof window !== 'undefined' ? isMobileDevice() : false

  // Touch tracking for swipe
  let touchStartY = 0
  let touchStartX = 0
  const SWIPE_THRESHOLD = 50 // px minimum swipe distance

  // Raycaster for cursor -> world position
  const raycaster = new THREE.Raycaster()
  const cursorNDC = new THREE.Vector2()
  const cursorWorldPos = new THREE.Vector3()

  /**
   * Check if navigation cooldown has elapsed and we're not mid-transition.
   */
  function canNavigate() {
    const now = Date.now()
    if (now - lastNavTime < NAV_COOLDOWN) return false
    if (navigationState.isTransitioning) return false
    lastNavTime = now
    return true
  }

  onMount(() => {
    // Configure particle count for device
    configureForDevice()

    // Initialize Three.js systems (with mobile flag)
    sceneManager = new SceneManager(container, { isMobile: mobile })
    particleSystem = new ParticleSystem(sceneManager.scene)
    cameraPath = new CameraPath()
    transitionManager = new TransitionManager(particleSystem, cameraPath, sceneManager)

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

      // Update cursor position for particle repulsion when hand tracking is active
      if (handState.handEnabled && handState.handDetected) {
        // Convert normalized cursor (0-1) to NDC (-1 to 1)
        cursorNDC.x = handState.cursorPosition.x * 2 - 1
        cursorNDC.y = -(handState.cursorPosition.y * 2 - 1)

        // Raycast into scene to get 3D world position
        raycaster.setFromCamera(cursorNDC, sceneManager.camera)
        // Project cursor onto a plane ~30 units in front of camera
        const dist = 30
        cursorWorldPos.copy(raycaster.ray.direction).multiplyScalar(dist).add(raycaster.ray.origin)
        particleSystem.setCursorPosition(cursorWorldPos)
      } else {
        particleSystem.resetCursorPosition()
      }
    })

    // Signal ready for loading screen
    onReady()

    // ── Scroll/wheel handler ──
    const handleWheel = (e) => {
      e.preventDefault()
      if (!canNavigate()) return

      if (e.deltaY > 0) {
        navigateNext()
      } else if (e.deltaY < 0) {
        navigatePrev()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    // ── Keyboard navigation ──
    const handleKeydown = (e) => {
      // Don't intercept if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          if (canNavigate()) navigateNext()
          break
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          if (canNavigate()) navigatePrev()
          break
        case '1':
        case '2':
        case '3':
        case '4':
          e.preventDefault()
          if (canNavigate()) navigateTo(parseInt(e.key) - 1)
          break
        case 'Escape':
          e.preventDefault()
          if (canNavigate()) navigateTo(0)
          break
      }
    }

    window.addEventListener('keydown', handleKeydown)

    // ── Touch/swipe handlers (mobile) ──
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
    }

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY - touchEndY
      const deltaX = touchStartX - touchEndX

      // Only handle vertical swipes (ignore horizontal)
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > SWIPE_THRESHOLD) {
        if (!canNavigate()) return

        if (deltaY > 0) {
          navigateNext() // swipe up -> next section
        } else {
          navigatePrev() // swipe down -> prev section
        }
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Cleanup
    return () => {
      container.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeydown)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
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
