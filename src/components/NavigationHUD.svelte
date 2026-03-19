<script>
  import {
    navigationState,
    navigateTo,
    SECTIONS,
  } from '../lib/stores/navigation.svelte.js'

  const labels = ['Home', 'Projects', 'About', 'Contact']
</script>

<nav class="navigation-hud">
  {#each SECTIONS as section, i}
    <button
      class="nav-dot"
      class:active={navigationState.currentSection === i}
      class:transitioning={navigationState.isTransitioning && navigationState.targetSection === i}
      onclick={() => navigateTo(i)}
      aria-label="Navigate to {labels[i]}"
      title={labels[i]}
    >
      <span class="dot"></span>
      <span class="label">{labels[i]}</span>
    </button>
  {/each}
</nav>

<style>
  .navigation-hud {
    position: fixed;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-end;
  }

  .nav-dot {
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    flex-direction: row-reverse;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .nav-dot:hover .dot,
  .nav-dot.transitioning .dot {
    background: rgba(255, 255, 255, 0.6);
    transform: scale(1.3);
  }

  .nav-dot.active .dot {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.5);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  }

  .label {
    color: rgba(255, 255, 255, 0);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: color 0.3s ease;
    white-space: nowrap;
  }

  .nav-dot:hover .label {
    color: rgba(255, 255, 255, 0.7);
  }
</style>
