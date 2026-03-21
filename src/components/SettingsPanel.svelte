<script>
  /**
   * SettingsPanel — hidden behind a gear icon in the bottom-right corner.
   * Replaces the intrusive HandPrompt and EyeTrackingPrompt buttons.
   */
  import HandPrompt from './HandPrompt.svelte'
  import EyeTrackingPrompt from './EyeTrackingPrompt.svelte'

  let open = $state(false)
</script>

<div class="settings-container">
  {#if open}
    <div class="settings-panel" role="dialog" aria-label="Controls">
      <div class="panel-title">Controls</div>
      <div class="panel-row">
        <HandPrompt />
      </div>
      <div class="panel-row">
        <EyeTrackingPrompt />
      </div>
    </div>
  {/if}

  <button
    class="gear-btn"
    class:active={open}
    onclick={() => open = !open}
    aria-label="Toggle settings panel"
    aria-expanded={open}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  </button>
</div>

<style>
  .settings-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }

  .gear-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
    outline: none;
  }

  .gear-btn:hover {
    background: rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 16px rgba(106, 13, 173, 0.3);
  }

  .gear-btn.active {
    background: rgba(106, 13, 173, 0.25);
    color: #fff;
    border-color: rgba(106, 13, 173, 0.5);
    box-shadow: 0 0 20px rgba(106, 13, 173, 0.4);
  }

  .settings-panel {
    background: rgba(10, 5, 20, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    width: 200px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    animation: panelIn 0.2s ease-out both;
  }

  @keyframes panelIn {
    from { opacity: 0; transform: translateY(8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .panel-title {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }

  .panel-row {
    display: flex;
    align-items: center;
  }

  .panel-row :global(button),
  .panel-row :global(.prompt-btn) {
    width: 100%;
    justify-content: flex-start;
    font-size: 0.8rem;
  }
</style>
