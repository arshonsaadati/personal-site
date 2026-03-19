<script>
  import { navigationState } from '../lib/stores/navigation.svelte.js'
  import HeroContent from './sections/HeroContent.svelte'
  import ProjectsContent from './sections/ProjectsContent.svelte'
  import AboutContent from './sections/AboutContent.svelte'
  import ContactContent from './sections/ContactContent.svelte'

  const sections = [HeroContent, ProjectsContent, AboutContent, ContactContent]

  // Opacity driven by transition progress: fade out as transition starts, fade in as it ends
  let opacity = $derived(
    navigationState.isTransitioning
      ? 1 - Math.min(navigationState.transitionProgress * 2, 1)
      : 1
  )
</script>

<div class="section-overlay" style="opacity: {opacity};">
  {#if navigationState.currentSection === 0}
    <HeroContent />
  {:else if navigationState.currentSection === 1}
    <ProjectsContent />
  {:else if navigationState.currentSection === 2}
    <AboutContent />
  {:else if navigationState.currentSection === 3}
    <ContactContent />
  {/if}
</div>

<style>
  .section-overlay {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s ease-out;
  }
</style>
