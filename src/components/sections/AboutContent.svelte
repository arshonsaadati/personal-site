<script>
  const skills = [
    { name: 'JavaScript / TypeScript', category: 'language' },
    { name: 'Python', category: 'language' },
    { name: 'Rust', category: 'language' },
    { name: 'Go', category: 'language' },
    { name: 'Svelte / React', category: 'frontend' },
    { name: 'Three.js / WebGL', category: 'frontend' },
    { name: 'Node.js / Deno', category: 'backend' },
    { name: 'PostgreSQL / Redis', category: 'backend' },
    { name: 'Docker / K8s', category: 'devops' },
    { name: 'ML / PyTorch', category: 'ml' },
  ]
</script>

<div class="about">
  <h2 class="section-title">About</h2>

  <div class="bio-card">
    <p class="bio">
      I'm a software engineer who builds things at the intersection of systems engineering,
      creative coding, and machine learning. I care about performance, craft, and shipping
      software that feels alive.
    </p>
  </div>

  <div class="skills-grid">
    {#each skills as skill}
      <span class="skill-pill" data-cat={skill.category}>{skill.name}</span>
    {/each}
  </div>

  <p class="timeline-placeholder">Career timeline coming soon</p>
</div>

<style>
  .about {
    width: 100%;
    max-width: 700px;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
    pointer-events: none;
  }

  .section-title {
    font-size: 1.6rem;
    font-weight: 200;
    letter-spacing: 8px;
    text-transform: uppercase;
    color: var(--about-primary, #ffd54f);
    text-shadow: 0 0 30px rgba(255, 213, 79, 0.3);
  }

  .bio-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 213, 79, 0.12);
    border-radius: 12px;
    padding: 28px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    pointer-events: auto;
  }

  .bio {
    font-size: 0.92rem;
    font-weight: 300;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    text-align: center;
  }

  .skills-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    pointer-events: auto;
  }

  .skill-pill {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 6px 16px;
    border-radius: 999px;
    background: rgba(255, 213, 79, 0.08);
    border: 1px solid rgba(255, 213, 79, 0.2);
    color: rgba(255, 255, 255, 0.8);
    transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
  }

  .skill-pill:hover {
    background: rgba(255, 213, 79, 0.15);
    border-color: var(--about-primary, #ffd54f);
    box-shadow: 0 0 12px rgba(255, 213, 79, 0.2);
  }

  .timeline-placeholder {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.25);
    letter-spacing: 2px;
    text-transform: uppercase;
    font-style: italic;
    margin: 0;
  }

  @media (max-width: 640px) {
    .section-title {
      font-size: 1.2rem;
    }

    .bio {
      font-size: 0.85rem;
    }
  }
</style>
