<script>
  import Canvas from './components/Canvas.svelte'
  import SectionOverlay from './components/SectionOverlay.svelte'
  import NavigationHUD from './components/NavigationHUD.svelte'
  import HandPrompt from './components/HandPrompt.svelte'
  import HandCursorVisual from './components/HandCursorVisual.svelte'
</script>

<main>
  <Canvas />
  <SectionOverlay />
  <HandCursorVisual />
  <NavigationHUD />
  <HandPrompt />
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #000;
    font-family: 'Inter', -apple-system, 'Helvetica Neue', sans-serif;
    color: #fff;
    height: 100%;
    width: 100%;
  }

  :global(*) {
    box-sizing: border-box;
  }

  main {
    width: 100%;
    height: 100vh;
    position: relative;
  }
</style>
