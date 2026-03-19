<script>
  import { onMount } from 'svelte'
  import { SceneManager } from '../lib/three/SceneManager.js'
  import { ParticleSystem } from '../lib/three/ParticleSystem.js'
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
    navigationState,
  } from '../lib/stores/navigation.svelte.js'

  let container
  let sceneManager
  let particleSystem
  let cameraPath
  let transitionManager

  // Scroll debounce
  let lastScrollTime = 0
  const SCROLL_COOLDOWN = 1200 // ms between scroll navigations

  onMount(() => {
    // Initialize Three.js systems
    sceneManager = new SceneManager(container)
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
    })

    // Scroll/wheel handler for navigation
    const handleWheel = (e) => {
      e.preventDefault()

      const now = Date.now()
      if (now - lastScrollTime < SCROLL_COOLDOWN) return
      if (navigationState.isTransitioning) return

      lastScrollTime = now

      if (e.deltaY > 0) {
        navigateNext()
      } else if (e.deltaY < 0) {
        navigatePrev()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
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
