<script>
  /**
   * AboutContent — Bio, skills grid, and career timeline.
   * All data pulled from Arshon's real resume.
   */

  const skills = [
    { name: "Rust", category: "lang" },
    { name: "C / C++", category: "lang" },
    { name: "Python", category: "lang" },
    { name: "Swift", category: "lang" },
    { name: "JavaScript", category: "lang" },
    { name: "TypeScript", category: "lang" },
    { name: "Java", category: "lang" },
    { name: "Scala", category: "lang" },
    { name: "Lua", category: "lang" },
    { name: "React", category: "framework" },
    { name: "Node.js", category: "framework" },
    { name: "Flask", category: "framework" },
    { name: "SwiftUI", category: "framework" },
    { name: "ElectronJS", category: "framework" },
    { name: "Three.js", category: "framework" },
    { name: "AWS", category: "infra" },
    { name: "Apache Spark", category: "infra" },
    { name: "Metal", category: "infra" },
    { name: "Redis", category: "infra" },
    { name: "InfluxDB", category: "infra" },
    { name: "MongoDB", category: "infra" },
    { name: "DynamoDB", category: "infra" },
    { name: "Unity", category: "infra" },
  ];

  const timeline = [
    {
      period: "2023 \u2014 Present",
      role: "Advanced Technologies Display Software Engineer",
      company: "Skyryse",
      location: "Los Angeles",
      highlights: [
        "Led first optionally piloted FAA-conforming fly-by-wire helicopter development",
        "Shipped C RTOS modules and Rust ground station over LoS/5G",
        "40 Hz telemetry, control p50 4\u20136ms / p99 10\u201312ms",
        "Contributed to $30M US Army award",
      ],
      color: "#00e5ff",
    },
    {
      period: "2022 \u2014 2023",
      role: "Software Development Engineer",
      company: "Amazon \u2014 SCOT",
      location: "Bellevue",
      highlights: [
        "Migrated ML model backtesting to serverless \u2014 600% data granularity boost",
        "Built TypeScript/React dashboard with DynamoDB optimization",
        "Engineered multi-stage data ETL orchestration platform",
      ],
      color: "#ffd54f",
    },
    {
      period: "2020 \u2014 2021",
      role: "Software Development Engineer Intern",
      company: "Amazon",
      location: "Seattle",
      highlights: [
        "Built modular sampling service in Scala on AWS EMR/Lambda/Spark",
        "Reduced runtime and server costs by 44%",
        "Python Numpy/Pandas data visualization automation",
      ],
      color: "#ffab00",
    },
    {
      period: "2017 \u2014 2021",
      role: "BSE Computer Science, Minor Mathematics",
      company: "University of Michigan",
      location: "Ann Arbor",
      highlights: [
        "DS&A, Machine Learning, Operating Systems",
        "Distributed Systems, Security, iOS, Architecture",
      ],
      color: "#e040fb",
    },
  ];

  const categoryLabels = {
    lang: "Languages",
    framework: "Frameworks",
    infra: "Infrastructure",
  };

  const categoryColors = {
    lang: "#ffd54f",
    framework: "#ffab00",
    infra: "#ff8f00",
  };
</script>

<div class="about-content">
  <!-- Bio Section -->
  <section class="bio-section">
    <div class="bio-card glass">
      <h2 class="bio-name">Arshon Saadati</h2>
      <p class="bio-text">
        Software Engineer at <strong>Skyryse</strong> building low-latency flight control
        and telemetry systems for FAA-conforming fly-by-wire helicopters.
        University of Michigan CS grad. Previously at <strong>Amazon</strong>.
      </p>
      <div class="bio-tags">
        <span class="bio-tag">Low-Latency Systems</span>
        <span class="bio-tag">Real-Time Telemetry</span>
        <span class="bio-tag">Full-Stack</span>
      </div>
    </div>
  </section>

  <!-- Skills Section -->
  <section class="skills-section">
    <h3 class="subsection-title">Skills</h3>
    {#each Object.entries(categoryLabels) as [cat, label]}
      <div class="skill-category">
        <span class="category-label" style="color: {categoryColors[cat]}">{label}</span>
        <div class="skills-pills">
          {#each skills.filter(s => s.category === cat) as skill}
            <span
              class="skill-pill"
              style="
                --pill-color: {categoryColors[cat]};
              "
            >
              {skill.name}
            </span>
          {/each}
        </div>
      </div>
    {/each}
  </section>

  <!-- Career Timeline -->
  <section class="timeline-section">
    <h3 class="subsection-title">Career</h3>
    <div class="timeline">
      {#each timeline as entry, i}
        <div class="timeline-entry" style="--entry-color: {entry.color}">
          <div class="timeline-rail">
            <div class="timeline-dot"></div>
            {#if i < timeline.length - 1}
              <div class="timeline-line"></div>
            {/if}
          </div>
          <div class="timeline-card glass">
            <div class="timeline-header">
              <span class="timeline-period">{entry.period}</span>
              <span class="timeline-location">{entry.location}</span>
            </div>
            <h4 class="timeline-company">{entry.company}</h4>
            <p class="timeline-role">{entry.role}</p>
            <ul class="timeline-highlights">
              {#each entry.highlights as highlight}
                <li>{highlight}</li>
              {/each}
            </ul>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .about-content {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    gap: 48px;
  }

  /* Bio */
  .bio-section {
    text-align: center;
  }

  .bio-card {
    padding: 36px 32px;
    border-radius: 20px;
    border: 1px solid rgba(255, 213, 79, 0.12);
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .bio-name {
    font-size: 2rem;
    font-weight: 200;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin: 0 0 16px 0;
    color: var(--about-primary);
    text-shadow: 0 0 30px rgba(255, 213, 79, 0.25);
  }

  .bio-text {
    font-size: 1.05rem;
    font-weight: 300;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 20px 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .bio-text strong {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
  }

  .bio-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }

  .bio-tag {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    background: rgba(255, 213, 79, 0.1);
    color: var(--about-primary);
    border: 1px solid rgba(255, 213, 79, 0.2);
  }

  /* Skills */
  .skills-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .subsection-title {
    font-size: 1.1rem;
    font-weight: 300;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  .skill-category {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .category-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .skills-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .skill-pill {
    font-size: 0.78rem;
    font-weight: 400;
    padding: 5px 14px;
    border-radius: 100px;
    background: color-mix(in srgb, var(--pill-color) 10%, transparent);
    color: color-mix(in srgb, var(--pill-color) 90%, white);
    border: 1px solid color-mix(in srgb, var(--pill-color) 18%, transparent);
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .skill-pill:hover {
    background: color-mix(in srgb, var(--pill-color) 20%, transparent);
    border-color: color-mix(in srgb, var(--pill-color) 35%, transparent);
  }

  /* Timeline */
  .timeline-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .timeline-entry {
    display: flex;
    gap: 20px;
    position: relative;
  }

  .timeline-rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 20px;
    padding-top: 20px;
  }

  .timeline-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--entry-color);
    box-shadow: 0 0 10px color-mix(in srgb, var(--entry-color) 50%, transparent);
    flex-shrink: 0;
    z-index: 1;
  }

  .timeline-line {
    width: 1px;
    flex: 1;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--entry-color) 40%, transparent),
      rgba(255, 255, 255, 0.06)
    );
    margin-top: 4px;
  }

  .timeline-card {
    flex: 1;
    padding: 20px 24px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    margin-bottom: 16px;
    transition: border-color 0.3s ease;
  }

  .timeline-card:hover {
    border-color: color-mix(in srgb, var(--entry-color) 25%, transparent);
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .timeline-period {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 1px;
    color: var(--entry-color);
  }

  .timeline-location {
    font-size: 0.72rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.5px;
  }

  .timeline-company {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: #fff;
  }

  .timeline-role {
    font-size: 0.85rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.55);
    margin: 0 0 12px 0;
    line-height: 1.4;
  }

  .timeline-highlights {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .timeline-highlights li {
    font-size: 0.8rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.5;
    padding-left: 14px;
    position: relative;
  }

  .timeline-highlights li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 7px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--entry-color);
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    .about-content {
      padding: 24px 16px;
      gap: 36px;
    }

    .bio-name {
      font-size: 1.5rem;
      letter-spacing: 3px;
    }

    .bio-text {
      font-size: 0.95rem;
    }

    .bio-card {
      padding: 24px 20px;
    }

    .timeline-card {
      padding: 16px 18px;
    }

    .timeline-rail {
      width: 16px;
    }
  }

  @media (max-width: 480px) {
    .timeline-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }

    .timeline-entry {
      gap: 12px;
    }
  }
</style>
