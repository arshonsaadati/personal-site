<script>
  import {
    navigationState,
    navigateTo,
    SECTIONS,
  } from '../lib/stores/navigation.svelte.js'

  const labels = ['Home', 'Projects', 'About', 'Contact']
  const colors = ['#6a0dad', '#00e5ff', '#ffd54f', '#e040fb']
</script>

<nav class="nav-hud" aria-label="Section navigation">
  {#each SECTIONS as _, i}
    {@const isActive = navigationState.currentSection === i}
    {@const isTarget = navigationState.isTransitioning && navigationState.targetSection === i}
    <button
      class="nav-item"
      class:active={isActive}
      class:target={isTarget}
      onclick={() => navigateTo(i)}
      aria-label="Navigate to {labels[i]}"
      aria-current={isActive ? 'true' : undefined}
      style="--dot-color: {colors[i]};"
    >
      <span class="label">{labels[i]}</span>
      <span class="dot"></span>
    </button>
  {/each}
</nav>

<style>
  .nav-hud {
    position: fixed;
    right: 28px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: flex-end;
    pointer-events: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 0;
    outline: none;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    position: relative;
  }

  .nav-item:hover .dot,
  .nav-item.target .dot {
    background: var(--dot-color);
    transform: scale(1.4);
    box-shadow: 0 0 10px color-mix(in srgb, var(--dot-color) 50%, transparent);
  }

  .nav-item.active .dot {
    background: var(--dot-color);
    transform: scale(1.6);
    box-shadow: 0 0 14px color-mix(in srgb, var(--dot-color) 60%, transparent),
                0 0 30px color-mix(in srgb, var(--dot-color) 20%, transparent);
  }

  .label {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: transparent;
    transition: color 0.3s ease;
    white-space: nowrap;
    user-select: none;
  }

  .nav-item:hover .label {
    color: rgba(255, 255, 255, 0.6);
  }

  .nav-item.active .label {
    color: rgba(255, 255, 255, 0.35);
  }

  .nav-item:focus-visible .dot {
    outline: 2px solid var(--dot-color);
    outline-offset: 4px;
  }

  @media (max-width: 640px) {
    .nav-hud {
      right: 14px;
      gap: 18px;
    }

    .label {
      display: none;
    }

    .dot {
      width: 8px;
      height: 8px;
    }
  }
</style>
