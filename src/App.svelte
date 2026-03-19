<script>
  import Canvas from './components/Canvas.svelte'
  import SectionOverlay from './components/SectionOverlay.svelte'
  import NavigationHUD from './components/NavigationHUD.svelte'
  import HandPrompt from './components/HandPrompt.svelte'
  import HandCursorVisual from './components/HandCursorVisual.svelte'
  import LoadingScreen from './components/LoadingScreen.svelte'
  import { isMobile } from './lib/utils/mobile.js'

  let ready = $state(false)
  const mobile = isMobile()
</script>

<LoadingScreen {ready} />

<main>
  <!-- z-index 0: Three.js particle canvas -->
  <Canvas onready={() => { ready = true }} />
  <!-- z-index 1: HTML section content overlay -->
  <SectionOverlay />
  <!-- z-index 2: Hand cursor visual -->
  <HandCursorVisual />
  <!-- z-index 3: Navigation dots -->
  <NavigationHUD />
  <!-- z-index 4: Hand prompt toggle (hidden on mobile) -->
  {#if !mobile}
    <HandPrompt />
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
</style>
