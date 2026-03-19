<script>
  import Canvas from './components/Canvas.svelte'
  import SectionOverlay from './components/SectionOverlay.svelte'
  import NavigationHUD from './components/NavigationHUD.svelte'
</script>

<main>
  <!-- z-index 0: Three.js particle canvas -->
  <Canvas />
  <!-- z-index 1: HTML section content overlay -->
  <SectionOverlay />
  <!-- z-index 2: HandCursorVisual (added by hand-gestures agent) -->
  <!-- z-index 3: Navigation dots -->
  <NavigationHUD />
  <!-- z-index 4: HandPrompt (added by hand-gestures agent) -->
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
</style>
