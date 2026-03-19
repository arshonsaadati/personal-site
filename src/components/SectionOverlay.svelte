<script>
  import { navigationState } from '../lib/stores/navigation.svelte.js'

  // Stub: the ui-content agent will build out section-specific content components
  const sectionNames = ['Hero', 'Projects', 'About', 'Contact']
  const sectionSubtitles = [
    'Software Engineer',
    'Things I\'ve built',
    'Skills & Experience',
    'Get in touch',
  ]
</script>

<div
  class="section-overlay"
  class:transitioning={navigationState.isTransitioning}
>
  <div class="section-content">
    {#if navigationState.currentSection === 0 && !navigationState.isTransitioning}
      <div class="hero-content" >
        <p class="subtitle">{sectionSubtitles[0]}</p>
        <div class="scroll-hint">
          <span>Scroll to explore</span>
          <div class="arrow-down"></div>
        </div>
      </div>
    {/if}

    {#if navigationState.currentSection > 0 && !navigationState.isTransitioning}
      <div class="generic-section" >
        <h2>{sectionNames[navigationState.currentSection]}</h2>
        <p class="section-subtitle">{sectionSubtitles[navigationState.currentSection]}</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .section-overlay {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.5s ease;
  }

  .section-overlay.transitioning {
    opacity: 0;
  }

  .section-content {
    text-align: center;
    color: white;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .subtitle {
    font-size: 1.2rem;
    font-weight: 300;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  .scroll-hint {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.8rem;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .arrow-down {
    width: 12px;
    height: 12px;
    border-right: 2px solid rgba(255, 255, 255, 0.3);
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    transform: rotate(45deg);
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: rotate(45deg) translateY(0); }
    40% { transform: rotate(45deg) translateY(6px); }
    60% { transform: rotate(45deg) translateY(3px); }
  }

  .generic-section h2 {
    font-size: 2.5rem;
    font-weight: 200;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin: 0 0 12px 0;
  }

  .section-subtitle {
    font-size: 1rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 2px;
    margin: 0;
  }
</style>
