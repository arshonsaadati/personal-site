<script>
  // Hero section: subtitle beneath particle text, scroll hint, hand CTA
</script>

<div class="hero">
  <p class="subtitle">Software Engineer</p>

  <div class="scroll-hint">
    <span>Scroll to explore</span>
    <div class="arrows">
      <span class="chevron"></span>
      <span class="chevron"></span>
    </div>
  </div>
</div>

<style>
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    margin-top: 12vh;
    pointer-events: none;
  }

  .subtitle {
    font-size: 1.15rem;
    font-weight: 300;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
    text-shadow: 0 0 20px rgba(0, 229, 255, 0.25);
  }

  .scroll-hint {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.7rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    pointer-events: auto;
    cursor: default;
  }

  .arrows {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .chevron {
    display: block;
    width: 10px;
    height: 10px;
    border-right: 1.5px solid rgba(255, 255, 255, 0.3);
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.3);
    transform: rotate(45deg);
    animation: bounce 2.4s infinite;
  }

  .chevron:nth-child(2) {
    animation-delay: 0.15s;
    opacity: 0.5;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: rotate(45deg) translateY(0); }
    40% { transform: rotate(45deg) translateY(5px); }
    60% { transform: rotate(45deg) translateY(2px); }
  }

  @media (max-width: 640px) {
    .subtitle {
      font-size: 0.9rem;
      letter-spacing: 4px;
    }
  }
</style>
