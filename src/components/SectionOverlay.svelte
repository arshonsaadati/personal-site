<script>
  /**
   * SectionOverlay — renders section-specific HTML content on top of the 3D canvas.
   * Fades out during transitions based on transitionProgress.
   * Container is pointer-events:none; interactive children set auto.
   */
  import { navigationState } from '../lib/stores/navigation.svelte.js';
  import HeroContent from './sections/HeroContent.svelte';
  import ProjectsContent from './sections/ProjectsContent.svelte';
  import AboutContent from './sections/AboutContent.svelte';
  import ContactContent from './sections/ContactContent.svelte';

  // Fade out during first half of transition, fade in during second half
  const opacity = $derived(
    navigationState.isTransitioning
      ? Math.max(0, 1 - navigationState.transitionProgress * 2.5)
      : 1
  );

  const currentSection = $derived(navigationState.currentSection);
</script>

<div
  class="section-overlay"
  style="opacity: {opacity}"
>
  {#if currentSection === 0}
    <HeroContent />
  {:else if currentSection === 1}
    <div class="scrollable-section">
      <ProjectsContent />
    </div>
  {:else if currentSection === 2}
    <div class="scrollable-section">
      <AboutContent />
    </div>
  {:else if currentSection === 3}
    <div class="scrollable-section center-content">
      <ContactContent />
    </div>
  {/if}
</div>

<style>
  .section-overlay {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    transition: opacity 0.15s ease-out;
  }

  .scrollable-section {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    pointer-events: auto;

    /* Hide scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .scrollable-section::-webkit-scrollbar {
    display: none;
  }

  .center-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
