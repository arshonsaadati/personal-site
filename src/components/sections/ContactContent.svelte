<script>
  const links = [
    { label: 'GitHub', href: 'https://github.com/arshon-saadati', icon: '↗' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/arshon-saadati', icon: '↗' },
    { label: 'Email', href: 'mailto:hello@arshon.dev', icon: '✉' },
  ]
</script>

<div class="contact">
  <h2 class="section-title">Get in Touch</h2>
  <p class="subtitle">Let's build something together</p>

  <div class="link-pills">
    {#each links as link}
      <a href={link.href} class="glow-pill" target="_blank" rel="noopener">
        <span class="pill-icon">{link.icon}</span>
        <span class="pill-label">{link.label}</span>
      </a>
    {/each}
  </div>
</div>

<style>
  .contact {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    pointer-events: none;
  }

  .section-title {
    font-size: 1.6rem;
    font-weight: 200;
    letter-spacing: 8px;
    text-transform: uppercase;
    color: var(--contact-primary, #e040fb);
    text-shadow: 0 0 30px rgba(224, 64, 251, 0.35);
  }

  .subtitle {
    font-size: 0.85rem;
    font-weight: 300;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
  }

  .link-pills {
    display: flex;
    gap: 16px;
    margin-top: 12px;
    pointer-events: auto;
  }

  .glow-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    border-radius: 999px;
    background: rgba(224, 64, 251, 0.08);
    border: 1px solid rgba(224, 64, 251, 0.25);
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }

  .glow-pill:hover {
    background: rgba(224, 64, 251, 0.18);
    border-color: var(--contact-primary, #e040fb);
    box-shadow: 0 0 20px rgba(224, 64, 251, 0.3), 0 0 60px rgba(224, 64, 251, 0.1);
    color: #fff;
    transform: translateY(-2px);
  }

  .pill-icon {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .glow-pill:hover .pill-icon {
    opacity: 1;
  }

  @media (max-width: 640px) {
    .link-pills {
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .section-title {
      font-size: 1.2rem;
    }

    .glow-pill {
      padding: 10px 24px;
      font-size: 0.75rem;
    }
  }
</style>
