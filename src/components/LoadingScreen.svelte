<script>
  /**
   * LoadingScreen — shown until Three.js is initialized.
   * Dark background with animated dots, fades out when ready.
   */
  let { ready = false } = $props()

  let fadingOut = $state(false)
  let hidden = $state(false)

  // When ready becomes true, start fade-out, then hide entirely
  $effect(() => {
    if (ready && !fadingOut) {
      fadingOut = true
      // After fade-out transition completes, remove from DOM
      setTimeout(() => {
        hidden = true
      }, 600)
    }
  })
</script>

{#if !hidden}
  <div class="loading-screen" class:fade-out={fadingOut}>
    <div class="loading-content">
      <div class="dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <p class="loading-text">Loading...</p>
    </div>
  </div>
{/if}

<style>
  .loading-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.5s ease-out;
    opacity: 1;
  }

  .loading-screen.fade-out {
    opacity: 0;
    pointer-events: none;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }

  .dots {
    display: flex;
    gap: 0.6rem;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    animation: pulse 1.4s ease-in-out infinite;
  }

  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes pulse {
    0%, 80%, 100% {
      opacity: 0.2;
      transform: scale(0.8);
    }
    40% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  .loading-text {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 0.85rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
  }
</style>
