<script>
  /**
   * NavigationHUD — section-colored navigation dots on the right edge.
   * Active dot glows with its section color. Hover reveals label.
   * Accessible with focus-visible outlines. Responsive sizing.
   */
  import {
    navigationState,
    navigateTo,
    SECTIONS,
  } from '../lib/stores/navigation.svelte.js';

  const sections = [
    { label: "Home", color: "#6a0dad" },
    { label: "Projects", color: "#00e5ff" },
    { label: "About", color: "#ffd54f" },
    { label: "Contact", color: "#e040fb" },
  ];
</script>

<nav class="navigation-hud" aria-label="Section navigation">
  {#each sections as section, i}
    <button
      class="nav-dot"
      class:active={navigationState.currentSection === i}
      class:transitioning={navigationState.isTransitioning && navigationState.targetSection === i}
      onclick={() => navigateTo(i)}
      aria-label="Navigate to {section.label}"
      aria-current={navigationState.currentSection === i ? "true" : undefined}
      style="--dot-color: {section.color}"
    >
      <span class="dot"></span>
      <span class="label">{section.label}</span>
    </button>
  {/each}
</nav>

<style>
  .navigation-hud {
    position: fixed;
    right: 28px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: flex-end;
    pointer-events: auto;
  }

  .nav-dot {
    display: flex;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    flex-direction: row-reverse;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-dot:focus-visible {
    outline: 2px solid var(--dot-color);
    outline-offset: 4px;
    border-radius: 8px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--dot-color) 35%, transparent);
    border: 1.5px solid color-mix(in srgb, var(--dot-color) 40%, transparent);
    transition: all 0.35s ease;
    flex-shrink: 0;
  }

  .nav-dot:hover .dot {
    background: color-mix(in srgb, var(--dot-color) 60%, transparent);
    border-color: color-mix(in srgb, var(--dot-color) 70%, transparent);
    transform: scale(1.3);
    box-shadow: 0 0 8px color-mix(in srgb, var(--dot-color) 30%, transparent);
  }

  .nav-dot.transitioning .dot {
    background: color-mix(in srgb, var(--dot-color) 65%, transparent);
    transform: scale(1.3);
    animation: dotPulse 0.8s ease-in-out infinite;
  }

  .nav-dot.active .dot {
    background: var(--dot-color);
    border-color: var(--dot-color);
    transform: scale(1.33);
    animation: activePulse 2s ease-in-out infinite;
    box-shadow:
      0 0 12px color-mix(in srgb, var(--dot-color) 50%, transparent),
      0 0 24px color-mix(in srgb, var(--dot-color) 25%, transparent);
  }

  .label {
    color: transparent;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: color 0.3s ease;
    white-space: nowrap;
    user-select: none;
  }

  .nav-dot:hover .label {
    color: color-mix(in srgb, var(--dot-color) 80%, white);
  }

  .nav-dot.active .label {
    color: color-mix(in srgb, var(--dot-color) 50%, white);
  }

  @keyframes activePulse {
    0%, 100% { box-shadow: 0 0 12px color-mix(in srgb, var(--dot-color) 50%, transparent), 0 0 24px color-mix(in srgb, var(--dot-color) 25%, transparent); }
    50% { box-shadow: 0 0 18px color-mix(in srgb, var(--dot-color) 75%, transparent), 0 0 36px color-mix(in srgb, var(--dot-color) 40%, transparent); }
  }

  @keyframes dotPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  /* Responsive: smaller dots + hide labels on mobile */
  @media (max-width: 768px) {
    .navigation-hud {
      right: 14px;
      gap: 18px;
    }

    .dot {
      width: 8px;
      height: 8px;
    }

    .label {
      display: none;
    }

    .nav-dot {
      padding: 4px;
    }
  }

  @media (max-width: 480px) {
    .navigation-hud {
      right: 10px;
      gap: 14px;
    }

    .dot {
      width: 7px;
      height: 7px;
    }
  }
</style>
