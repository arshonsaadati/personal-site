<script>
  import Canvas from './components/Canvas.svelte'
  import SectionOverlay from './components/SectionOverlay.svelte'
  import NavigationHUD from './components/NavigationHUD.svelte'
  import HandCursorVisual from './components/HandCursorVisual.svelte'
  import LoadingScreen from './components/LoadingScreen.svelte'
  import SettingsPanel from './components/SettingsPanel.svelte'
  import ProjectDetail from './components/ProjectDetail.svelte'

  let sceneReady = $state(false)

  function handleReady() {
    sceneReady = true
  }
</script>

<main>
  <LoadingScreen ready={sceneReady} />
  <Canvas onReady={handleReady} />
  <SectionOverlay />
  <HandCursorVisual />
  <NavigationHUD />
  <SettingsPanel />
  <ProjectDetail />
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
