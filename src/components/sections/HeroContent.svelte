<script>
  /**
   * HeroContent — minimal overlay for the Hero section.
   * The particle text "ARSHON SAADATI" does the heavy lifting.
   * This just shows a subtitle + scroll hint.
   */
</script>

<div class="hero-content">
  <h1 class="hero-name">Arshon Saadati</h1>
  <p class="subtitle">Software Engineer</p>

  <div class="scroll-hint">
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


  .hero-name {
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: clamp(3rem, 8vw, 7rem);
    letter-spacing: -0.02em;
    color: white;
    text-align: center;
    margin: 0 0 0.3em 0;
    line-height: 1;
    text-shadow: 0 0 40px rgba(180, 100, 255, 0.6), 0 0 80px rgba(100, 50, 200, 0.3);
  }

  .subtitle {
    font-size: 1.3rem;
    font-weight: 300;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 80px 0;
    text-shadow:
      0 0 20px rgba(106, 13, 173, 0.5),
      0 0 60px rgba(0, 229, 255, 0.15);
    animation: subtitleFadeIn 1.5s ease-out both;
    animation-delay: 0.3s;
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
    0%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    50% {
      transform: translateY(6px);
      opacity: 1;
    }
  }

  @keyframes subtitleFadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
  
  .hero-name {
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: clamp(3rem, 8vw, 7rem);
    letter-spacing: -0.02em;
    color: white;
    text-align: center;
    margin: 0 0 0.3em 0;
    line-height: 1;
    text-shadow: 0 0 40px rgba(180, 100, 255, 0.6), 0 0 80px rgba(100, 50, 200, 0.3);
  }

  .subtitle {
      font-size: 1rem;
      letter-spacing: 4px;
    }

    .hero-content {
      padding-bottom: 40px;
    }
  }
</style>
