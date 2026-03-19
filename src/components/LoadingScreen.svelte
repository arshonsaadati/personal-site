<script>
  let { ready = false } = $props()

  let visible = $state(true)
  let fadeOut = $state(false)

  $effect(() => {
    if (ready && !fadeOut) {
      fadeOut = true
      setTimeout(() => { visible = false }, 800)
    }
  })
</script>

{#if visible}
  <div class="loading-screen" class:fade-out={fadeOut}>
    <div class="loader">
      <div class="ring"></div>
      <span class="label">Loading</span>
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
    transition: opacity 0.8s ease;
  }

  .loading-screen.fade-out {
    opacity: 0;
    pointer-events: none;
  }

  .loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .ring {
    width: 48px;
    height: 48px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-top-color: rgba(106, 13, 173, 0.8);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .label {
    color: rgba(255, 255, 255, 0.4);
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.75rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
