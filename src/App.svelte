<script>
  import Canvas from './components/Canvas.svelte'
  import SectionOverlay from './components/SectionOverlay.svelte'
  import NavigationHUD from './components/NavigationHUD.svelte'
</script>

<main>
  <Canvas />
  <SectionOverlay />
  <NavigationHUD />
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
