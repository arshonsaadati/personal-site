<script>
  /**
   * ProjectsContent — responsive card grid with glass-morphism cards.
   * Imports real project data from src/data/projects.js.
   */
  import { projects } from '../../data/projects.js';
</script>

<div class="projects-content">
  <header class="section-header">
    <h2 class="section-title">Projects</h2>
    <p class="section-subtitle">Things I've built</p>
  </header>

  <div class="card-grid">
    {#each projects as project (project.id)}
      <article
        class="project-card glass"
        style="--card-accent: {project.color}"
      >
        <div class="card-accent-line"></div>
        <h3 class="card-title">{project.title}</h3>
        <p class="card-description">{project.description}</p>
        <div class="tech-pills">
          {#each project.tech as tech}
            <span class="tech-pill">{tech}</span>
          {/each}
        </div>
        {#if project.links && Object.keys(project.links).length > 0}
          <div class="card-links">
            {#if project.links.github}
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                class="card-link"
              >
                GitHub
              </a>
            {/if}
            {#if project.links.live}
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                class="card-link"
              >
                Live
              </a>
            {/if}
          </div>
        {/if}
      </article>
    {/each}
  </div>
</div>

<style>
  .projects-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
    pointer-events: auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .section-title {
    font-size: 2.2rem;
    font-weight: 200;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin: 0 0 12px 0;
    color: var(--projects-primary);
    text-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
  }

  .section-subtitle {
    font-size: 1rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 2px;
    margin: 0;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }

  .project-card {
    position: relative;
    padding: 28px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.35s ease, border-color 0.3s ease;
    cursor: default;
  }

  .project-card:hover {
    transform: translateY(-4px);
    border-color: color-mix(in srgb, var(--card-accent) 40%, transparent);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 20px color-mix(in srgb, var(--card-accent) 15%, transparent);
  }

  .card-accent-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--card-accent),
      transparent
    );
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  .project-card:hover .card-accent-line {
    opacity: 1;
  }

  .card-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #fff;
    letter-spacing: 0.5px;
  }

  .card-description {
    font-size: 0.88rem;
    font-weight: 300;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 20px 0;
  }

  .tech-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .tech-pill {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 4px 10px;
    border-radius: 100px;
    background: color-mix(in srgb, var(--card-accent) 12%, transparent);
    color: color-mix(in srgb, var(--card-accent) 85%, white);
    border: 1px solid color-mix(in srgb, var(--card-accent) 20%, transparent);
    white-space: nowrap;
  }

  .card-links {
    display: flex;
    gap: 12px;
    margin-top: 4px;
  }

  .card-link {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--card-accent);
    text-decoration: none;
    letter-spacing: 0.5px;
    padding: 4px 0;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease;
  }

  .card-link:hover {
    border-bottom-color: var(--card-accent);
  }

  @media (max-width: 768px) {
    .card-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .section-title {
      font-size: 1.6rem;
    }

    .project-card {
      padding: 20px;
    }
  }

  @media (max-width: 480px) {
    .projects-content {
      padding: 24px 16px;
    }

    .card-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
