<script>
  /**
   * HeroContent — minimal overlay for the Hero section.
   * "ARSHON SAADATI" and "SOFTWARE ENGINEER" are rendered as particle text.
   * This only shows the scroll hint.
   */
  import { navigationState } from '../../lib/stores/navigation.svelte.js'

  const showScrollHint = $derived(
    navigationState.currentSection === 0 && !navigationState.isTransitioning
  )
</script>

<div class="hero-content">
  <div class="scroll-hint" style="opacity: {showScrollHint ? 1 : 0}; transition: opacity 0.6s ease;">
    <span>Scroll to explore</span>
    <div class="chevrons">
      <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</div>

<style>
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100vh;
    padding-bottom: 60px;
    pointer-events: none;
    user-select: none;
  }

  .scroll-hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 3px;
    text-transform: uppercase;
    animation: subtitleFadeIn 2s ease-out both;
    animation-delay: 1s;
  }

  .chevrons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: -4px;
    margin-top: 4px;
  }

  .chevron {
    color: rgba(255, 255, 255, 0.6);
    animation: chevronBounce 2s ease-in-out infinite;
  }

  .chevron:nth-child(2) {
    margin-top: -8px;
    animation-delay: 0.15s;
    opacity: 0.6;
  }

  @keyframes chevronBounce {
    0%, 100% { transform: translateY(0); opacity: 0.7; }
    50% { transform: translateY(6px); opacity: 1; }
  }

  @keyframes subtitleFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .hero-content { padding-bottom: 40px; }
  }
</style>
