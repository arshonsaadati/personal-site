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
    { label: "Home" },
    { label: "Projects" },
    { label: "About" },
    { label: "Contact" },
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
    outline: 2px solid rgba(150, 80, 255, 0.8);
    outline-offset: 4px;
    border-radius: 8px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    transition: all 0.35s ease;
    flex-shrink: 0;
  }

  .nav-dot:hover .dot {
    background: rgba(255, 255, 255, 0.65);
    border-color: rgba(255, 255, 255, 0.7);
    transform: scale(1.3);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  }

  .nav-dot.transitioning .dot {
    background: rgba(255, 255, 255, 0.65);
    transform: scale(1.3);
    animation: dotPulse 0.8s ease-in-out infinite;
  }

  .nav-dot.active .dot {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(255, 255, 255, 1);
    transform: scale(1.33);
    animation: activePulse 2s ease-in-out infinite;
    box-shadow: 0 0 8px rgba(150, 80, 255, 0.8), 0 0 16px rgba(150, 80, 255, 0.4);
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
    color: rgba(255, 255, 255, 0.8);
  }

  .nav-dot.active .label {
    color: rgba(255, 255, 255, 0.6);
  }

  @keyframes activePulse {
    0%, 100% { box-shadow: 0 0 8px rgba(150, 80, 255, 0.8), 0 0 16px rgba(150, 80, 255, 0.4); }
    50% { box-shadow: 0 0 14px rgba(150, 80, 255, 1), 0 0 28px rgba(150, 80, 255, 0.6); }
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
