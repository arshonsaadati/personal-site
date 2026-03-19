<script>
  /**
   * ContactContent — glowing contact links with magenta/pink palette.
   */
  const links = [
    {
      label: "GitHub",
      href: "https://github.com/arshonsaadati",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/arshonsaadati",
      icon: "linkedin",
    },
    {
      label: "Email",
      href: "mailto:arshon@umich.edu",
      icon: "email",
    },
  ];
</script>

<div class="contact-content">
  <header class="section-header">
    <h2 class="section-title">Get in Touch</h2>
    <p class="section-subtitle">Let's build something together</p>
  </header>

  <div class="contact-links">
    {#each links as link}
      <a
        href={link.href}
        target={link.icon !== "email" ? "_blank" : undefined}
        rel={link.icon !== "email" ? "noopener noreferrer" : undefined}
        class="contact-pill glass"
      >
        <!-- SVG icons -->
        {#if link.icon === "github"}
          <svg class="link-icon" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        {:else if link.icon === "linkedin"}
          <svg class="link-icon" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        {:else if link.icon === "email"}
          <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="M2 7l10 7 10-7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}
        <span class="link-label">{link.label}</span>
      </a>
    {/each}
  </div>
</div>

<style>
  .contact-content {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 24px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .section-header {
    text-align: center;
  }

  .section-title {
    font-size: 2.2rem;
    font-weight: 200;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin: 0 0 12px 0;
    color: var(--contact-primary);
    text-shadow: 0 0 30px rgba(224, 64, 251, 0.3);
  }

  .section-subtitle {
    font-size: 1rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 2px;
    margin: 0;
  }

  .contact-links {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 360px;
  }

  .contact-pill {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 24px;
    border-radius: 14px;
    border: 1px solid rgba(224, 64, 251, 0.15);
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    text-decoration: none;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .contact-pill:hover {
    border-color: rgba(224, 64, 251, 0.4);
    background: rgba(224, 64, 251, 0.08);
    box-shadow:
      0 0 24px rgba(224, 64, 251, 0.15),
      0 4px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    color: #fff;
  }

  .link-icon {
    flex-shrink: 0;
    color: var(--contact-primary);
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  .contact-pill:hover .link-icon {
    opacity: 1;
  }

  .link-label {
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 1px;
  }

  @media (max-width: 640px) {
    .contact-content {
      padding: 24px 16px;
      gap: 36px;
    }

    .section-title {
      font-size: 1.6rem;
    }

    .contact-pill {
      padding: 14px 20px;
    }
  }
</style>
