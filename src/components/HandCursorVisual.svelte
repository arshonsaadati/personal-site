<script>
  import { handState } from '../lib/stores/hand.svelte.js'

  // Map gesture to color
  function getGestureColor(gesture) {
    switch (gesture) {
      case 'open_palm': return 'rgba(255, 255, 255, 0.9)'
      case 'point':     return 'rgba(0, 229, 255, 0.9)'
      case 'fist':      return 'rgba(0, 230, 118, 0.9)'
      case 'pinch':     return 'rgba(255, 213, 79, 0.9)'
      default:          return 'rgba(255, 255, 255, 0.7)'
    }
  }

  function getGlowColor(gesture) {
    switch (gesture) {
      case 'open_palm': return 'rgba(255, 255, 255, 0.3)'
      case 'point':     return 'rgba(0, 229, 255, 0.4)'
      case 'fist':      return 'rgba(0, 230, 118, 0.4)'
      case 'pinch':     return 'rgba(255, 213, 79, 0.4)'
      default:          return 'rgba(255, 255, 255, 0.2)'
    }
  }
</script>

{#if handState.handEnabled && handState.handDetected}
  <div
    class="hand-cursor"
    style:left="{handState.cursorPosition.x * 100}%"
    style:top="{handState.cursorPosition.y * 100}%"
    style:--cursor-color={getGestureColor(handState.currentGesture)}
    style:--glow-color={getGlowColor(handState.currentGesture)}
  >
    <div class="cursor-glow"></div>
    <div class="cursor-ring"></div>
    <div class="cursor-dot"></div>
  </div>
{/if}

<style>
  .hand-cursor {
    position: fixed;
    z-index: 50;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.05s linear, top 0.05s linear;
    will-change: left, top;
  }

  /* Outer glow */
  .cursor-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
    animation: glowPulse 2s ease-in-out infinite;
  }

  /* Ring */
  .cursor-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid var(--cursor-color);
    transition: border-color 0.2s ease, width 0.2s ease, height 0.2s ease;
  }

  /* Center dot */
  .cursor-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--cursor-color);
    box-shadow: 0 0 8px var(--cursor-color);
    transition: background 0.2s ease, box-shadow 0.2s ease;
  }

  @keyframes glowPulse {
    0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.15); }
  }
</style>
