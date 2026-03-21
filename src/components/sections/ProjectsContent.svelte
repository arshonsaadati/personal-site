<script>
  /**
   * ProjectsContent — minimal HUD panel showing current project details.
   * The particle text IS the title. This panel shows description + tech.
   */
  import { navigationState } from '../../lib/stores/navigation.svelte.js'
  import { projects } from '../../data/projects.js'

  const project = $derived(projects[navigationState.projectNodeIndex] ?? projects[0])
  const isProjects = $derived(navigationState.currentSection === 1)
</script>

{#if isProjects}
  <div class="project-hud" style="--accent: {project.color}">
    <div class="project-counter">
      {navigationState.projectNodeIndex + 1} / {projects.length}
    </div>
    <div class="project-detail">
      <p class="project-desc">{project.description}</p>
      <div class="tech-tags">
        {#each project.tech as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    </div>
    {#if project.links?.github}
      <a href={project.links.github} target="_blank" rel="noopener noreferrer" class="project-link">
        View on GitHub →
      </a>
    {/if}
    <div class="project-nav-hint">scroll to explore next project</div>
  </div>
{/if}

<style>
  .project-hud {
    position: fixed;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
    width: min(600px, 90vw);
    background: rgba(0, 0, 0, 0.68);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-top: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
    border-radius: 14px;
    padding: 1.5rem 2rem;
    pointer-events: auto;
    animation: hudFadeIn 0.5s ease both;
  }

  @keyframes hudFadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(12px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .project-counter {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--accent) 80%, white);
    margin-bottom: 0.75rem;
  }

  .project-detail {
    margin-bottom: 1rem;
  }

  .project-desc {
    font-size: 0.88rem;
    font-weight: 300;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.72);
    margin: 0 0 0.75rem 0;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tag {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 3px 10px;
    border-radius: 100px;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: color-mix(in srgb, var(--accent) 85%, white);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
  }

  .project-link {
    display: inline-block;
    font-size: 0.78rem;
    font-weight: 500;
    color: color-mix(in srgb, var(--accent) 90%, white);
    text-decoration: none;
    letter-spacing: 0.5px;
    margin-bottom: 0.75rem;
    transition: color 0.2s ease;
  }

  .project-link:hover {
    color: white;
  }

  .project-nav-hint {
    font-size: 0.65rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
    margin-top: 0.5rem;
  }

  @media (max-width: 640px) {
    .project-hud {
      bottom: 60px;
      padding: 1.2rem 1.5rem;
    }
  }
</style>
