<script>
  import { handState } from '../lib/stores/hand.svelte.js'
  import { HandTracker } from '../lib/hand/HandTracker.js'
  import { GestureRecognizer } from '../lib/hand/GestureRecognizer.js'
  import { HandCursor } from '../lib/hand/HandCursor.js'
  import { navigateNext, navigatePrev } from '../lib/stores/navigation.svelte.js'

  let tracker = null
  let recognizer = null
  let cursor = null
  let animFrameId = null

  async function enableHand() {
    if (handState.isLoading) return
    handState.error = null
    handState.isLoading = true

    try {
      tracker = new HandTracker()
      recognizer = new GestureRecognizer()
      cursor = new HandCursor()

      await tracker.init()
      handState.handEnabled = true
      handState.isLoading = false
      startLoop()
    } catch (err) {
      handState.isLoading = false
      handState.error = err.message || 'Failed to start hand tracking'
      disableHand()
    }
  }

  function disableHand() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }

    if (tracker) {
      tracker.destroy()
      tracker = null
    }

    if (recognizer) {
      recognizer.reset()
      recognizer = null
    }

    if (cursor) {
      cursor.reset()
      cursor = null
    }

    handState.handEnabled = false
    handState.handDetected = false
    handState.currentGesture = 'none'
  }

  function toggleHand() {
    if (handState.handEnabled) {
      disableHand()
    } else {
      enableHand()
    }
  }

  function startLoop() {
    function loop() {
      if (!tracker || !tracker.running) return

      const landmarks = tracker.detect()
      handState.handDetected = landmarks !== null

      if (landmarks) {
        // Update cursor
        const pos = cursor.update(landmarks)
        handState.cursorPosition = pos

        // Classify gesture
        const gesture = recognizer.classify(landmarks)
        handState.currentGesture = gesture

        // Handle gesture actions
        if (gesture === 'swipe_right') {
          navigateNext()
        } else if (gesture === 'swipe_left') {
          navigatePrev()
        }

        // Fist transition = click
        if (recognizer.isFistTransition(gesture)) {
          // Could dispatch a custom event for click actions
          window.dispatchEvent(new CustomEvent('hand-click', {
            detail: cursor.getScreenPosition()
          }))
        }
      }

      animFrameId = requestAnimationFrame(loop)
    }

    animFrameId = requestAnimationFrame(loop)
  }

  // Status indicator color
  let statusColor = $derived(
    !handState.handEnabled ? '#666' :
    handState.handDetected ? '#4caf50' : '#f44336'
  )

  let statusLabel = $derived(
    handState.isLoading ? 'Loading...' :
    !handState.handEnabled ? 'Hand Control Off' :
    handState.handDetected ? 'Hand Detected' : 'No Hand'
  )
</script>

<div class="hand-prompt">
  <button
    class="toggle-btn"
    class:active={handState.handEnabled}
    class:loading={handState.isLoading}
    onclick={toggleHand}
    disabled={handState.isLoading}
  >
    <span class="status-dot" style="background: {statusColor}"></span>
    <span class="label">{statusLabel}</span>
  </button>

  {#if handState.error}
    <div class="error">{handState.error}</div>
  {/if}
</div>

<style>
  .hand-prompt {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toggle-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .toggle-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    color: #fff;
  }

  .toggle-btn.active {
    border-color: rgba(0, 229, 255, 0.4);
    color: #fff;
  }

  .toggle-btn.loading {
    opacity: 0.7;
    cursor: wait;
  }

  .toggle-btn:disabled {
    cursor: wait;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: background 0.3s ease;
  }

  .label {
    line-height: 1;
  }

  .error {
    padding: 6px 12px;
    background: rgba(244, 67, 54, 0.2);
    border: 1px solid rgba(244, 67, 54, 0.4);
    border-radius: 8px;
    color: #ef9a9a;
    font-size: 12px;
    max-width: 240px;
  }
</style>
