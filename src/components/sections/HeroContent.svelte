<script>
  /**
   * HeroContent — overlay for the Hero section.
   * "ARSHON SAADATI" and "SOFTWARE ENGINEER" are rendered as particle text.
   * This shows: tagline, social links, and scroll hint.
   */
  import { navigationState } from '../../lib/stores/navigation.svelte.js'

  const showHint = $derived(
    navigationState.currentSection === 0 && !navigationState.isTransitioning
  )
</script>

<div class="hero-content">
  <!-- Tagline centered below where particle text sits -->
  <div class="tagline-area" style="opacity: {showHint ? 1 : 0}">
    <p class="tagline">Building systems that fly, scale, and think.</p>
  </div>

  <!-- Bottom row: social links left, scroll hint right-ish center -->
  <div class="bottom-bar" style="opacity: {showHint ? 1 : 0}">
    <!-- Social icons bottom-left -->
    <div class="social-links">
      <a href="https://github.com/arshonsaadati" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="GitHub">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </a>
      <a href="https://linkedin.com/in/arshonsaadati" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
    </div>

    <!-- Scroll hint -->
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
</div>

<style>
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100vh;
    padding-bottom: 48px;
    pointer-events: none;
    user-select: none;
    gap: 0;
  }

  /* Tagline sits about 55-60% down the screen, below particle text */
  .tagline-area {
    position: absolute;
    top: 58%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    transition: opacity 0.6s ease;
    animation: fadeInUp 1.8s ease both;
    animation-delay: 1.2s;
  }

  .tagline {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.45);
    white-space: nowrap;
    font-style: italic;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .bottom-bar {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    transition: opacity 0.6s ease;
    animation: subtitleFadeIn 2s ease-out both;
    animation-delay: 1s;
  }

  /* Social links — bottom left */
  .social-links {
    position: absolute;
    left: 32px;
    bottom: 0;
    display: flex;
    gap: 10px;
    pointer-events: auto;
  }

  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .social-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }

  /* Scroll hint — centered */
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
  }

  .chevrons {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    .hero-content { padding-bottom: 32px; }
    .tagline { font-size: 0.75rem; white-space: normal; text-align: center; max-width: 280px; }
    .social-links { left: 16px; }
  }
</style>
