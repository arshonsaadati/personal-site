<script>
  import { onDestroy } from 'svelte'
  import { handState } from '../lib/stores/hand.svelte.js'
  import { navigateNext, navigatePrev } from '../lib/stores/navigation.svelte.js'
  import { HandTracker } from '../lib/hand/HandTracker.js'
  import { GestureRecognizer } from '../lib/hand/GestureRecognizer.js'
  import { HandCursor } from '../lib/hand/HandCursor.js'

  let tracker = null
  let recognizer = null
  let cursor = null
  let animFrameId = null

  /**
   * Toggle hand tracking on/off.
   */
  async function toggleHandTracking() {
    if (handState.handEnabled) {
      disableTracking()
      return
    }

    await enableTracking()
  }

  /**
   * Initialize and start hand tracking.
   */
  async function enableTracking() {
    handState.isLoading = true
    handState.error = null

    try {
      tracker = new HandTracker()
      recognizer = new GestureRecognizer()
      cursor = new HandCursor()

      await tracker.init()

      handState.handEnabled = true
      handState.isLoading = false

      // Start detection loop
      startDetectionLoop()
    } catch (err) {
      handState.isLoading = false

      if (err.name === 'NotAllowedError') {
        handState.error = 'Camera access denied. Please allow camera access and try again.'
      } else if (err.name === 'NotFoundError') {
        handState.error = 'No camera found. Please connect a webcam.'
      } else {
        handState.error = `Failed to start hand tracking: ${err.message}`
      }

      console.error('Hand tracking init error:', err)
      cleanup()
    }
  }

  /**
   * Disable and clean up hand tracking.
   */
  function disableTracking() {
    cleanup()
    handState.reset()
  }

  /**
   * Main detection loop — runs in requestAnimationFrame.
   */
  function startDetectionLoop() {
    function loop() {
      if (!tracker || !tracker.isReady) return

      const landmarks = tracker.detect()

      if (landmarks) {
        handState.handDetected = true

        // Update cursor position
        cursor.update(landmarks)
        const pos = cursor.getNormalizedPosition()
        handState.cursorPosition = { x: pos.x, y: pos.y }

        // Classify gesture
        const gesture = recognizer.classify(landmarks)
        handState.currentGesture = gesture

        // Map gestures to navigation
        if (gesture === 'swipe_right') {
          navigateNext()
        } else if (gesture === 'swipe_left') {
          navigatePrev()
        }

        // Fist transition → dispatch click event
        if (recognizer.isFistTransition()) {
          const screenPos = cursor.getScreenPosition()
          window.dispatchEvent(new CustomEvent('hand-click', {
            detail: {
              x: screenPos.x,
              y: screenPos.y,
              normalizedX: pos.x,
              normalizedY: pos.y,
            }
          }))
        }
      } else {
        handState.handDetected = false
        handState.currentGesture = 'none'
      }

      animFrameId = requestAnimationFrame(loop)
    }

    animFrameId = requestAnimationFrame(loop)
  }

  /**
   * Clean up all tracking resources.
   */
  function cleanup() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }

    if (tracker) {
      tracker.destroy()
      tracker = null
    }

    if (cursor) {
      cursor.destroy()
      cursor = null
    }

    if (recognizer) {
      recognizer.reset()
      recognizer = null
    }
  }

  onDestroy(() => {
    cleanup()
    handState.reset()
  })
</script>

<button
  class="hand-prompt"
  class:enabled={handState.handEnabled}
  class:loading={handState.isLoading}
  class:detected={handState.handEnabled && handState.handDetected}
  class:no-hand={handState.handEnabled && !handState.handDetected && !handState.isLoading}
  class:has-error={!!handState.error}
  onclick={toggleHandTracking}
  title={handState.handEnabled ? 'Disable hand control' : 'Enable hand control'}
  aria-label={handState.handEnabled ? 'Disable hand control' : 'Enable hand control'}
>
  <span class="status-dot"></span>
  <span class="label">
    {#if handState.isLoading}
      Loading...
    {:else if handState.error}
      Error
    {:else if handState.handEnabled}
      Hand Control
    {:else}
      Enable Hands
    {/if}
  </span>
  <span class="hand-icon">
    {#if handState.isLoading}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    {:else}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 16"/>
      </svg>
    {/if}
  </span>
</button>

{#if handState.error}
  <div class="error-tooltip">
    {handState.error}
  </div>
{/if}

<style>
  .hand-prompt {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    white-space: nowrap;
  }

  .hand-prompt:hover {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.25);
    color: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  .hand-prompt:active {
    transform: translateY(0);
  }

  .hand-prompt.enabled {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .hand-prompt.has-error {
    border-color: rgba(255, 80, 80, 0.4);
  }

  /* Status dot */
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  /* Disabled state — gray dot */
  .hand-prompt:not(.enabled):not(.loading) .status-dot {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Loading state — pulsing amber dot */
  .hand-prompt.loading .status-dot {
    background: #ffab00;
    animation: pulse 1.2s ease-in-out infinite;
  }

  /* Enabled + hand detected — green dot */
  .hand-prompt.detected .status-dot {
    background: #00e676;
    box-shadow: 0 0 6px rgba(0, 230, 118, 0.6);
  }

  /* Enabled + no hand — red dot */
  .hand-prompt.no-hand .status-dot {
    background: #ff5252;
    box-shadow: 0 0 6px rgba(255, 82, 82, 0.4);
  }

  /* Error state — red dot */
  .hand-prompt.has-error .status-dot {
    background: #ff5252;
  }

  .label {
    user-select: none;
  }

  .hand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
  }

  .hand-prompt.loading .hand-icon {
    animation: spin 1.5s linear infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Error tooltip */
  .error-tooltip {
    position: fixed;
    top: 60px;
    left: 20px;
    z-index: 99;
    max-width: 280px;
    padding: 10px 14px;
    background: rgba(255, 50, 50, 0.15);
    border: 1px solid rgba(255, 50, 50, 0.3);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: rgba(255, 200, 200, 0.9);
    font-size: 11px;
    line-height: 1.5;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive: smaller on mobile */
  @media (max-width: 600px) {
    .hand-prompt {
      padding: 6px 10px;
      font-size: 11px;
    }

    .label {
      display: none;
    }
  }
</style>
