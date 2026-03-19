<script>
  import { onDestroy } from 'svelte'
  import { eyeState } from '../lib/stores/eye.svelte.js'
  import { EyeTracker } from '../lib/eye/EyeTracker.js'

  let tracker = null

  // Calibration state
  let calibrationPoints = []
  let currentCalibPoint = 0
  let clicksPerPoint = 0
  const CLICKS_NEEDED = 3 // clicks per calibration point
  const CALIBRATION_GRID = [
    { x: 10, y: 10 },   { x: 50, y: 10 },  { x: 90, y: 10 },
    { x: 10, y: 50 },   { x: 50, y: 50 },  { x: 90, y: 50 },
    { x: 10, y: 90 },   { x: 50, y: 90 },  { x: 90, y: 90 },
  ]

  async function toggleEyeTracking() {
    if (eyeState.enabled) {
      await disableTracking()
      return
    }
    await enableTracking()
  }

  async function enableTracking() {
    eyeState.isLoading = true
    eyeState.error = null

    try {
      tracker = new EyeTracker()
      await tracker.init()
      eyeState.isLoading = false

      // Start calibration immediately
      startCalibration()
    } catch (err) {
      eyeState.isLoading = false
      if (err.name === 'NotAllowedError') {
        eyeState.error = 'Camera access denied.'
      } else {
        eyeState.error = `Eye tracking failed: ${err.message}`
      }
      console.error('Eye tracking init error:', err)
      cleanup()
    }
  }

  async function disableTracking() {
    cleanup()
    eyeState.reset()
  }

  function startCalibration() {
    eyeState.isCalibrating = true
    currentCalibPoint = 0
    clicksPerPoint = 0
  }

  function handleCalibrationClick(e) {
    if (!eyeState.isCalibrating || !tracker) return

    const point = CALIBRATION_GRID[currentCalibPoint]
    const screenX = (point.x / 100) * window.innerWidth
    const screenY = (point.y / 100) * window.innerHeight

    // Record this click as calibration data
    tracker.recordCalibrationPoint(screenX, screenY)
    clicksPerPoint++

    if (clicksPerPoint >= CLICKS_NEEDED) {
      clicksPerPoint = 0
      currentCalibPoint++

      if (currentCalibPoint >= CALIBRATION_GRID.length) {
        // Calibration complete
        eyeState.isCalibrating = false
      }
    }
  }

  function skipCalibration() {
    eyeState.isCalibrating = false
  }

  function cleanup() {
    if (tracker) {
      tracker.destroy()
      tracker = null
    }
  }

  onDestroy(() => {
    cleanup()
    eyeState.reset()
  })
</script>

<!-- Toggle button -->
<button
  class="eye-prompt"
  class:enabled={eyeState.enabled && !eyeState.isCalibrating}
  class:loading={eyeState.isLoading}
  class:calibrating={eyeState.isCalibrating}
  class:has-error={!!eyeState.error}
  onclick={toggleEyeTracking}
  title={eyeState.enabled ? 'Disable eye tracking' : 'Enable eye tracking'}
>
  <span class="status-dot"></span>
  <span class="label">
    {#if eyeState.isLoading}
      Loading...
    {:else if eyeState.error}
      Error
    {:else if eyeState.isCalibrating}
      Calibrating
    {:else if eyeState.enabled}
      Eye Tracking
    {:else}
      Enable Eyes
    {/if}
  </span>
  <span class="eye-icon">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  </span>
</button>

{#if eyeState.error}
  <div class="error-tooltip eye-error">
    {eyeState.error}
  </div>
{/if}

<!-- Calibration overlay -->
{#if eyeState.isCalibrating}
  <div class="calibration-overlay">
    <div class="calibration-instructions">
      <p>Look at each dot and click it {CLICKS_NEEDED} times</p>
      <p class="calibration-progress">Point {currentCalibPoint + 1} / {CALIBRATION_GRID.length}</p>
      <button class="skip-btn" onclick={skipCalibration}>Skip calibration</button>
    </div>

    {#each CALIBRATION_GRID as point, i}
      {@const isActive = i === currentCalibPoint}
      {@const isDone = i < currentCalibPoint}
      <button
        class="calibration-dot"
        class:active={isActive}
        class:done={isDone}
        class:future={i > currentCalibPoint}
        style="left: {point.x}%; top: {point.y}%;"
        onclick={handleCalibrationClick}
        disabled={!isActive}
      >
        {#if isActive}
          <span class="dot-ring"></span>
          <span class="dot-clicks">{clicksPerPoint}/{CLICKS_NEEDED}</span>
        {/if}
      </button>
    {/each}
  </div>
{/if}

<!-- Gaze cursor (visible when tracking is active and not calibrating) -->
{#if eyeState.enabled && !eyeState.isCalibrating}
  <div
    class="gaze-cursor"
    style="left: {eyeState.gazePosition.x}px; top: {eyeState.gazePosition.y}px;"
  >
    <div class="gaze-outer"></div>
    <div class="gaze-inner"></div>
  </div>
{/if}

<style>
  /* ── Toggle button ── */
  .eye-prompt {
    position: fixed;
    top: 20px;
    left: 160px;
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

  .eye-prompt:hover {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.25);
    color: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .eye-prompt.loading .status-dot {
    background: #ffab00;
    animation: pulse 1.2s ease-in-out infinite;
  }

  .eye-prompt.enabled .status-dot {
    background: #00e5ff;
    box-shadow: 0 0 6px rgba(0, 229, 255, 0.6);
  }

  .eye-prompt.calibrating .status-dot {
    background: #ffd54f;
    animation: pulse 1s ease-in-out infinite;
  }

  .eye-prompt.has-error .status-dot {
    background: #ff5252;
  }

  .eye-icon {
    display: flex;
    align-items: center;
    opacity: 0.7;
  }

  .eye-prompt.loading .eye-icon {
    animation: spin 1.5s linear infinite;
  }

  .label { user-select: none; }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .error-tooltip.eye-error {
    position: fixed;
    top: 60px;
    left: 160px;
    z-index: 99;
    max-width: 280px;
    padding: 10px 14px;
    background: rgba(255, 50, 50, 0.15);
    border: 1px solid rgba(255, 50, 50, 0.3);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    color: rgba(255, 200, 200, 0.9);
    font-size: 11px;
    line-height: 1.5;
  }

  /* ── Calibration overlay ── */
  .calibration-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.85);
  }

  .calibration-instructions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    z-index: 201;
    pointer-events: auto;
  }

  .calibration-instructions p {
    margin: 0 0 8px;
  }

  .calibration-progress {
    color: #00e5ff;
    font-weight: 600;
    font-size: 14px;
  }

  .skip-btn {
    margin-top: 16px;
    padding: 8px 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .skip-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
  }

  /* ── Calibration dots ── */
  .calibration-dot {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    padding: 0;
  }

  .calibration-dot.future {
    background: rgba(255, 255, 255, 0.15);
    cursor: default;
  }

  .calibration-dot.done {
    background: rgba(0, 229, 255, 0.3);
    cursor: default;
  }

  .calibration-dot.active {
    background: #00e5ff;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.6), 0 0 40px rgba(0, 229, 255, 0.3);
    animation: calibPulse 1.5s ease-in-out infinite;
  }

  .dot-ring {
    position: absolute;
    inset: -8px;
    border: 2px solid rgba(0, 229, 255, 0.4);
    border-radius: 50%;
    animation: ringExpand 1.5s ease-out infinite;
  }

  .dot-clicks {
    position: absolute;
    bottom: -20px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
  }

  @keyframes calibPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.2); }
  }

  @keyframes ringExpand {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  /* ── Gaze cursor ── */
  .gaze-cursor {
    position: fixed;
    z-index: 90;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.08s linear, top 0.08s linear;
  }

  .gaze-outer {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(0, 229, 255, 0.4);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: gazeBreath 2s ease-in-out infinite;
  }

  .gaze-inner {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 229, 255, 0.8);
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes gazeBreath {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
    50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
  }

  /* Responsive */
  @media (max-width: 600px) {
    .eye-prompt {
      padding: 6px 10px;
      font-size: 11px;
      left: auto;
      right: 20px;
    }
    .label { display: none; }
  }
</style>
