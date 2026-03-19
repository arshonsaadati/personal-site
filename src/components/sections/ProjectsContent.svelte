<script>
  import { projects } from '../../data/projects.js'
</script>

<div class="projects">
  <h2 class="section-title">Projects</h2>
  <div class="cards-grid">
    {#each projects as project}
      <div class="card" style="--accent: {project.color};">
        <h3 class="card-title">{project.title}</h3>
        <p class="card-desc">{project.description}</p>
        <div class="tech-pills">
          {#each project.tech as t}
            <span class="pill">{t}</span>
          {/each}
        </div>
        <div class="card-links">
          {#if project.links.github}
            <a href={project.links.github} class="link" target="_blank" rel="noopener">GitHub</a>
          {/if}
          {#if project.links.live}
            <a href={project.links.live} class="link" target="_blank" rel="noopener">Live</a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .projects {
    width: 100%;
    max-width: 1000px;
    padding: 0 24px;
    pointer-events: none;
  }

  .section-title {
    font-size: 1.6rem;
    font-weight: 200;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 40px;
    color: var(--projects-primary, #00e5ff);
    text-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 24px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    pointer-events: auto;
  }

  .card:hover {
    border-color: var(--accent);
    box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 20%, transparent);
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: var(--accent);
  }

  .card-desc {
    font-size: 0.82rem;
    font-weight: 300;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 14px 0;
  }

  .tech-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
  }

  .pill {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 3px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
  }

  .card-links {
    display: flex;
    gap: 12px;
  }

  .link {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--accent);
    text-decoration: none;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .link:hover {
    opacity: 1;
    text-shadow: 0 0 8px var(--accent);
  }

  @media (max-width: 640px) {
    .cards-grid {
      grid-template-columns: 1fr;
    }

    .section-title {
      font-size: 1.2rem;
    }
  }
</style>
