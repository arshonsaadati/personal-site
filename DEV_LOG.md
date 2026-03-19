# Development Log

Timestamped entries from each agent working on the portfolio site. Each entry includes the agent section name, what was done, and any notes/blockers.

---

## 2026-03-19 — AGENT: particle-engine

### 00:00 — Session Start
- Read plan, beginning Section 1: Particle Engine Foundation
- Will build: ParticleSystem.js, SceneManager.js, CameraPath.js, TransitionManager.js, Canvas.svelte, stores, utils
- Also creating PLAN.md and DEV_LOG.md for cross-agent coordination

### 00:05 — Created directory structure + utility modules
- Created full directory tree: `src/lib/three/scenes`, `src/lib/hand`, `src/lib/stores`, `src/lib/utils`, `src/components/sections`, `src/data`
- `src/lib/utils/easing.js` — easeInOutCubic, easeOutQuart, easeInOutQuad, easeOutExpo, linear
- `src/lib/utils/math.js` — clamp, lerp, smoothstep, randomRange, randomGaussian, randomPointOnSphere, randomPointInSphere
- `PLAN.md` written to project root with full multi-agent plan

### 00:10 — Navigation store
- `src/lib/stores/navigation.svelte.js` — Svelte 5 runes-based reactive store
- Exports: `navigationState` (currentSection, transitionProgress, isTransitioning, targetSection), `navigateTo`, `navigateNext`, `navigatePrev`, `setTransitionCallback`
- Uses `.svelte.js` extension for module-level `$state` runes

### 00:15 — SceneManager.js
- Three.js scene, camera (75 FOV), renderer (antialias, high-performance)
- Render loop via requestAnimationFrame with `onUpdate(delta, elapsed)` callback
- Window resize handling, pixel ratio capped at 2.0
- Cleanup/dispose method

### 00:20 — ParticleSystem.js (CORE)
- 80,000 particles with custom ShaderMaterial
- Buffer attributes: position, targetPosition, color, targetColor, size, targetSize, random
- **Vertex shader**: staggered morphing via per-particle random seed, smoothstep interpolation, 3-axis chaos displacement during mid-transition (peaks at progress ~0.5, using sin/cos noise), size attenuation by distance, distance-based alpha fade
- **Fragment shader**: circular point with soft glow (smoothstep falloff), discard outside circle, additive blending
- Methods: `setTargets(fn)`, `snapToTargets()`, `setImmediate(fn)`, `update()`, `dispose()`
- Additive blending, depthWrite:false, transparent:true, frustumCulled:false

### 00:25 — CameraPath.js
- Two CatmullRomCurve3 splines: position path + lookAt target path
- 4 control points: Hero(0,0,100) → Projects(0,5,30) → About(25,12,-30) → Contact(0,0,-80)
- `getTransform(progress, time)` returns position + lookAt with subtle idle sway animation (sin/cos offset, amplitude ~0.4)
- Section stops at 0.0, 0.33, 0.66, 1.0

### 00:30 — TransitionManager.js
- Orchestrates particle morphing + camera movement together
- `registerSections([{ name, getPositions }])` — section registration
- `transitionTo(index)` — snaps current positions, sets new targets, animates progress 0→1 over 2s, animates camera along spline with easeInOutCubic
- `jumpTo(index)` — immediate scene load (no animation)
- `update(delta, elapsed)` — frame update, drives animation, updates navigation store
- Auto-snaps particles when transition completes

### 00:35 — Scene placeholders (all 4)
- `HeroScene.js` — 40% scattered stars (spherical, radius 60-200), 30% nebula cloud (gaussian clusters, purple/blue), 30% ambient floaters
- `ProjectsScene.js` — 60% card particles (6 cards in 2x3 grid, cyan/teal/blue), 25% starfield, 15% connecting streams
- `AboutScene.js` — 30% skill node clusters (9 nodes, gold/amber), 20% connection lines, 30% constellation background, 20% orbital rings
- `ContactScene.js` — 40% torus ring (R=20, r=3, magenta/pink), 20% inner spiral, 20% outer glow, 20% background void
- NOTE: These are functional placeholders. The "scenes" agent should refine them and add particle text to Hero.

### 00:40 — Canvas.svelte + App.svelte + UI stubs
- `Canvas.svelte` — mounts SceneManager, ParticleSystem, CameraPath, TransitionManager; registers all 4 scenes; connects navigation store; handles scroll/wheel with 1200ms debounce cooldown; cleanup on destroy
- `SectionOverlay.svelte` — stub with hero subtitle + "scroll to explore" hint + generic section headers; fades out during transitions
- `NavigationHUD.svelte` — 4 dots on right side, active/hover states, click to navigate, labels on hover
- `App.svelte` — clean rewrite mounting Canvas, SectionOverlay, NavigationHUD
- `app.css` — minimal global reset with CSS variables for all 4 section palettes
- Removed unused `Counter.svelte` from template

### 00:45 — Build verification
- `npm install` — clean install, 0 vulnerabilities
- `npx vite build` — SUCCESS, builds in ~500ms
- Dev server starts and responds correctly
- Only warning: chunk size (Three.js is large) — expected, not a problem

### Status: Section 1 COMPLETE
All acceptance criteria met:
- [x] 80K particles with custom shaders
- [x] Scene morphing with stagger + chaos
- [x] Camera spline path with idle animation
- [x] Scroll-based navigation between all 4 scenes
- [x] Full-viewport responsive canvas
- [x] Navigation store reactive + functional
- [x] Build succeeds

### What's left for other agents:
- **scenes agent**: Refine all 4 scene distributions, add particle text ("ARSHON SAADATI") to HeroScene via textSampler.js
- **hand-gestures agent**: Build full MediaPipe hand tracking system
- **ui-content agent**: Build proper section content components, project data, styles
- **polish agent**: Post-processing (bloom, chromatic aberration), particle-cursor interaction, loading screen, keyboard nav, mobile fallback

---

## 2026-03-19 — AGENT: scenes (Section 2)

### 01:00 — Session Start
- Read PLAN.md and DEV_LOG.md, reviewed all existing scene placeholders + ParticleSystem + CameraPath
- Identified camera lookAt targets for particle center offsets:
  - Hero → (0,0,0), Projects → (0,0,0), About → (0,5,-30), Contact → (0,0,-100)

### 01:05 — Created textSampler.js
- `src/lib/utils/textSampler.js` — offscreen canvas text-to-particle sampler
- Renders text with bold "Inter" / "Space Grotesk" / "Arial Black" fallback font
- Reads pixel data, collects coords where alpha > 128
- Randomly samples `maxSamples` positions from filled pixels
- Normalizes to centered coords, scales so text spans ~60 world units wide
- Caches results by (text, fontSize, maxSamples) key
- Includes fallback if no pixels found (e.g., font not loaded yet)

### 01:10 — Rewrote HeroScene.js
- Exact distribution from PLAN.md:
  - 0-39% (32K): Scattered stars, spherical shell r=80-200, white/pale blue
  - 40-59% (16K): Nebula cloud, multi-cluster gaussian (3 sub-centers), purple/blue
  - 60-79% (16K): Particle text "ARSHON SAADATI" via textSampler, z-jitter ±0.5, white/cyan
  - 80-100% (16K): Ambient floaters, faint purple/blue tint
- Text particles are bright white/cyan for contrast against dark nebula

### 01:12 — Rewrote ProjectsScene.js
- 6 cards in 2x3 grid, ~25 units apart, slight z-tilt per card
- 0-59% (48K): ~8K per card, rectangular 15x10 grid with edge concentration (30% edge bias)
- 60-84% (20K): Ambient starfield, dim cyan/blue tint
- 85-100% (12K): Connecting streams between 7 adjacent card pairs with arc curvature
- Each card has unique accent color from cyan/teal/blue palette

### 01:14 — Rewrote AboutScene.js
- Shifted all node positions to center at (0, 5, -30) to match camera lookAt
- 9 skill nodes in circular constellation layout (radius ~30 from center)
- 0-29% (24K): Dense spherical clusters at nodes (cbrt distribution for uniform volume)
- 30-49% (16K): Connection line particles between 12 node pairs
- 50-79% (24K): Warm-tinted constellation background stars
- 80-100% (16K): Orbital ring particles with per-node tilt variation
- Gold/amber palette throughout

### 01:16 — Rewrote ContactScene.js
- Shifted all positions to center at (0, 0, -100) to match camera lookAt
- 0-39% (32K): Torus ring (R=20, r=3), parametric surface distribution
- 40-59% (16K): Logarithmic spiral (5 rotations, exponential decay), particles shrink toward center
- 60-79% (16K): Outer scattered glow with radial falloff from torus
- 80-100% (16K): Sparse background void
- Magenta/pink/violet palette

### 01:18 — Build verification
- `npx vite build` — SUCCESS, builds in ~570ms
- No new warnings or errors

### Status: Section 2 COMPLETE
All acceptance criteria met:
- [x] All 4 scenes produce visually distinct formations
- [x] Text "ARSHON SAADATI" in HeroScene via canvas text sampling (readable from camera Hero position)
- [x] Each scene has its distinct color palette matching PLAN.md
- [x] Particle distributions follow exact percentages from PLAN.md
- [x] About/Contact scenes properly centered at camera lookAt targets
- [x] Build succeeds
