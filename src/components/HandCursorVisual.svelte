<script>
  import { handState } from '../lib/stores/hand.svelte.js'

  let visible = $derived(handState.handEnabled && handState.handDetected)

  let cursorX = $derived(handState.cursorPosition.x * 100)
  let cursorY = $derived(handState.cursorPosition.y * 100)

  // Color based on gesture state
  let glowColor = $derived(
    handState.currentGesture === 'fist' ? '#4caf50' :
    handState.currentGesture === 'point' ? '#00e5ff' :
    handState.currentGesture === 'pinch' ? '#ffd54f' :
    handState.currentGesture === 'open_palm' ? '#ffffff' :
    '#00e5ff'
  )
</script>

{#if visible}
  <div
    class="hand-cursor"
    style="left: {cursorX}%; top: {cursorY}%; --glow-color: {glowColor};"
  >
    <div class="cursor-ring"></div>
    <div class="cursor-dot"></div>
  </div>
{/if}

<style>
  .hand-cursor {
    position: fixed;
    z-index: 90;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.05s linear, top 0.05s linear;
  }

  .cursor-ring {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid var(--glow-color);
    opacity: 0.6;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 15px var(--glow-color), inset 0 0 10px rgba(0, 229, 255, 0.1);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .cursor-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--glow-color);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px var(--glow-color);
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
</style>
