<script>
  /**
   * ProjectDetail — full-screen overlay showing detailed project info.
   * Opens when user clicks "View Details" in the HUD panel.
   */
  import { projectDetailState } from '../lib/stores/projectDetail.svelte.js'

  const project = $derived(projectDetailState.project)
  const visible = $derived(projectDetailState.visible)

  function close() {
    projectDetailState.visible = false
    projectDetailState.project = null
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') close()
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible && project}
  <div class="detail-backdrop" onclick={close} role="button" tabindex="-1" aria-label="Close detail">
    <div class="detail-panel" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <!-- Hero image -->
      <div class="hero-image" style="background-image: url('{project.image}')">
        <div class="hero-overlay"></div>
        <button class="close-btn" onclick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div class="hero-title">
          <h1 style="--accent: {project.color}">{project.title}</h1>
        </div>
      </div>

      <!-- Scrollable content -->
      <div class="content">
        <!-- Long description -->
        <div class="section">
          {#each (project.longDescription ?? project.description).split('\n\n') as para}
            <p>{para}</p>
          {/each}
        </div>

        <!-- Key achievements -->
        {#if project.achievements}
          <div class="section">
            <h2 style="--accent: {project.color}">Key Achievements</h2>
            <ul class="achievements">
              {#each project.achievements as item}
                <li style="--accent: {project.color}">{item}</li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Tech stack -->
        <div class="section">
          <h2 style="--accent: {project.color}">Tech Stack</h2>
          <div class="tech-tags">
            {#each project.tech as tag}
              <span class="tag" style="--accent: {project.color}">{tag}</span>
            {/each}
          </div>
        </div>

        <!-- Links -->
        {#if project.links?.github || project.links?.demo}
          <div class="section links-section">
            {#if project.links.github}
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" class="link-btn" style="--accent: {project.color}">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            {/if}
            {#if project.links.demo}
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" class="link-btn" style="--accent: {project.color}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Live Demo
              </a>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .detail-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: backdropIn 0.3s ease both;
    cursor: pointer;
  }

  @keyframes backdropIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .detail-panel {
    width: min(780px, 94vw);
    max-height: 88vh;
    background: rgba(8, 8, 16, 0.96);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: default;
    animation: panelIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
  }

  @keyframes panelIn {
    from { opacity: 0; transform: scale(0.92) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .hero-image {
    position: relative;
    height: 220px;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(8,8,16,0.85) 100%);
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 2;
    padding: 0;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .close-btn svg {
    width: 18px;
    height: 18px;
  }

  .hero-title {
    position: absolute;
    bottom: 20px;
    left: 28px;
    z-index: 2;
  }

  .hero-title h1 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: white;
    text-shadow: 0 2px 12px rgba(0,0,0,0.5);
  }

  .content {
    padding: 24px 28px 28px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.1) transparent;
    flex: 1;
  }

  .content::-webkit-scrollbar {
    width: 4px;
  }

  .content::-webkit-scrollbar-track {
    background: transparent;
  }

  .content::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
  }

  .section {
    margin-bottom: 24px;
  }

  .section p {
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 12px 0;
  }

  .section h2 {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--accent) 80%, white);
    margin: 0 0 12px 0;
  }

  .achievements {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .achievements li {
    font-size: 0.85rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.75);
    padding-left: 18px;
    position: relative;
    line-height: 1.5;
  }

  .achievements li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: color-mix(in srgb, var(--accent) 80%, white);
    font-size: 0.8rem;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tag {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 4px 12px;
    border-radius: 100px;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: color-mix(in srgb, var(--accent) 85%, white);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
  }

  .links-section {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .link-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 8px 18px;
    border-radius: 100px;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: color-mix(in srgb, var(--accent) 90%, white);
    border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
    text-decoration: none;
    transition: all 0.2s ease;
    letter-spacing: 0.5px;
  }

  .link-btn:hover {
    background: color-mix(in srgb, var(--accent) 20%, transparent);
    color: white;
    border-color: color-mix(in srgb, var(--accent) 50%, transparent);
  }

  @media (max-width: 640px) {
    .detail-panel {
      width: 96vw;
      max-height: 92vh;
      border-radius: 16px;
    }

    .hero-image {
      height: 160px;
    }

    .hero-title h1 {
      font-size: 1.3rem;
    }

    .content {
      padding: 18px 20px 20px;
    }
  }
</style>
