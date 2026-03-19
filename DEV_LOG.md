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

## 2026-03-19 — AGENT: scenes (Section 2) — COMPLETE

- Created `src/lib/utils/textSampler.js` — offscreen canvas text-to-particle sampler with Fisher-Yates sampling and caching
- Rewrote all 4 scene distribution functions with complex multi-layer distributions:
  - **HeroScene.js**: 32K stars (spherical shell R=80-200 with highlight stars), 16K nebula (5 weighted gaussian clusters), 16K text "ARSHON SAADATI" (via textSampler), 16K ambient floaters (3 sub-distributions)
  - **ProjectsScene.js**: 48K card particles (6 cards, 2x3 grid, edge-biased outlines), 20K starfield, 12K connecting arc streams between 7 card pairs
  - **AboutScene.js**: 24K skill node clusters (9 nodes, cbrt spherical), 16K connection lines (12 edges, endpoint bias), 24K background stars (3 layers), 16K tilted orbital rings. All centered at camera lookAt (0,5,-30)
  - **ContactScene.js**: 32K torus (R=20, r=3, organic variance, color cycling), 16K logarithmic spiral (5 rotations, funnel z-spread), 16K outer glow (gaussian falloff), 16K background void (3 sub-distributions). All centered at (0,0,-100)
- Build verified successfully

---

## 2026-03-19 — AGENT: hand-gestures (Section 3) — COMPLETE

- Installed @mediapipe/tasks-vision
- Created `src/lib/stores/hand.svelte.js` — Svelte 5 runes store (handEnabled, handDetected, cursorPosition, currentGesture, isLoading, error)
- Created `src/lib/hand/HandTracker.js` — MediaPipe HandLandmarker wrapper (GPU delegate, 0.5 confidence, webcam 640x480)
- Created `src/lib/hand/GestureRecognizer.js` — 6 gestures (open_palm, fist, point, pinch, swipe_left/right), 3-frame stability, edge-triggered fist, 500ms swipe cooldown
- Created `src/lib/hand/HandCursor.js` — palm center to screen coords, mirrored x, EMA smoothing (0.3), edge margin remap
- Created `src/components/HandPrompt.svelte` — glass-morphism toggle button, status dot (gray/amber/green/red), detection loop in rAF, gesture→navigation mapping
- Created `src/components/HandCursorVisual.svelte` — 3-layer cursor (glow+ring+dot), gesture color-coded, CSS transitions
- Updated App.svelte with HandPrompt + HandCursorVisual
- Build verified successfully

---

## 2026-03-19 — AGENT: ui-content (Section 4) — COMPLETE

- Created `src/data/projects.js` — 6 real projects from resume (Skyryse, FCC Simulator, Yolked AI, Amazon SCOT, Build-a-Fair, Portfolio)
- Created `src/components/sections/HeroContent.svelte` — subtitle with glow, animated bouncing chevron scroll hint
- Created `src/components/sections/ProjectsContent.svelte` — responsive glass-morphism card grid, per-card accent colors, tech stack pills
- Created `src/components/sections/AboutContent.svelte` — bio card, 23 skills in 3 categories, 4-entry career timeline with rail/dot/line pattern
- Created `src/components/sections/ContactContent.svelte` — GitHub/LinkedIn/Email glowing pills with inline SVG icons
- Rewrote SectionOverlay.svelte — $derived opacity, conditional rendering, scrollable wrappers
- Rewrote NavigationHUD.svelte — section-colored dots (purple/cyan/gold/magenta), color-mix() glow, responsive
- Rewrote app.css — Inter font import, glass morphism variables, glow utilities, scrollbar hide
- Updated App.svelte — overflow: hidden
- Build verified successfully

---

## 2026-03-19 — AGENT: polish (Section 5) — COMPLETE

- Created `src/lib/three/PostProcessing.js` — EffectComposer with RenderPass + UnrealBloomPass (1.5/0.4/0.2) + custom vignette ShaderPass
- Created `src/components/LoadingScreen.svelte` — dark overlay with 3 pulsing dots, fades out on `ready` prop
- Modified `SceneManager.js` — integrated PostProcessing, render through composer, mobile pixel ratio cap (1.5), skip antialias on mobile
- Modified `ParticleSystem.js` — added `uCursorPosition` uniform + cursor repulsion in vertex shader (8.0 unit radius, 3.0 unit displacement), `setCursorPosition()`/`resetCursorPosition()` methods, `configureForDevice()` for mobile (40K particles)
- Modified `Canvas.svelte` — keyboard nav (arrows/PageUp/Down/1-4/Escape), touch swipe (vertical > 50px), hand cursor→world position raycasting for particle repulsion, `onReady` callback, unified `canNavigate()` debounce
- Modified `App.svelte` — added LoadingScreen with `sceneReady` state
- Modified `index.html` — title "Arshon Saadati — Software Engineer", meta description, OG tags, theme-color
- Build verified: 160 modules, 18.91KB CSS, 744KB JS

---

## 2026-03-19 — Integration & Merge

- Merged all 4 agent worktrees (scenes, hand-gestures, ui-content, polish) into main
- Resolved App.svelte merge (combined hand tracking + loading screen + overflow:hidden)
- Installed @mediapipe/tasks-vision dependency
- Final build: 160 modules, SUCCESS
- All 5 sections complete
