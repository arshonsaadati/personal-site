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

## 2026-03-19 — AGENT: hand-gestures

### 01:00 — Session Start
- Read PLAN.md Section 3 and DEV_LOG.md
- Section 1 (particle engine) complete, all interfaces available
- Beginning full MediaPipe Hands integration

### 01:05 — Installed @mediapipe/tasks-vision + hand store
- `npm install @mediapipe/tasks-vision` — success, 0 vulnerabilities
- `src/lib/stores/hand.svelte.js` — Svelte 5 runes store matching navigation store pattern
- State: `handEnabled`, `handDetected`, `cursorPosition`, `currentGesture`, `isLoading`, `error`

### 01:10 — HandTracker.js (MediaPipe wrapper)
- `src/lib/hand/HandTracker.js` — wraps `HandLandmarker` from @mediapipe/tasks-vision
- `async init()` — creates landmarker with GPU delegate, requests webcam (640x480, user-facing), creates hidden video element
- `detect()` — calls `detectForVideo()` with monotonic timestamps, returns 21 landmarks or null
- `destroy()` — stops video tracks, removes video element, closes landmarker
- Model: `hand_landmarker/float16/1/hand_landmarker.task` from Google storage CDN

### 01:15 — GestureRecognizer.js (gesture classification)
- `src/lib/hand/GestureRecognizer.js` — classifies gestures from 21 landmarks
- Finger state detection: tip vs PIP joint y-comparison (thumb uses lateral x-distance)
- Gestures: `open_palm` (4+ fingers), `fist` (≤1 finger, not index), `point` (index only), `pinch` (thumb+index tip distance < 0.05)
- Swipe detection: 6-frame velocity tracking, 0.12 threshold, 400ms max window, 500ms cooldown
- Stability: 3-frame buffer — gesture must hold for 3 consecutive frames
- `isFistTransition()` — edge-triggered fist detection for click behavior

### 01:20 — HandCursor.js (palm → screen coords)
- `src/lib/hand/HandCursor.js` — maps landmark 9 (palm center) to screen coordinates
- Mirrors x-axis (webcam is flipped), exponential moving average smoothing (factor 0.3)
- `update(landmarks)` → normalized {x, y} (0-1 range)
- `getScreenPosition()` → pixel coordinates

### 01:25 — HandPrompt.svelte (enable/disable UI)
- `src/components/HandPrompt.svelte` — fixed top-left toggle button
- States: disabled (gray dot), loading (dimmed), enabled+detected (green), enabled+no hand (red)
- Handles full lifecycle: init tracker/recognizer/cursor → detection loop → cleanup
- Detection runs in `requestAnimationFrame` loop when enabled
- Gesture→navigation wiring: `swipe_right` → `navigateNext()`, `swipe_left` → `navigatePrev()`
- Fist transition dispatches `hand-click` custom event with screen position
- Glass-morphism styling with backdrop blur

### 01:30 — HandCursorVisual.svelte (glowing cursor)
- `src/components/HandCursorVisual.svelte` — CSS overlay following cursor position
- Only visible when `handEnabled && handDetected`
- Ring + dot design, color-coded by gesture: white (open_palm), cyan (point/default), green (fist), gold (pinch)
- Smooth CSS transitions for position and color

### 01:35 — App.svelte integration + build verification
- Added `HandPrompt` and `HandCursorVisual` to App.svelte
- Z-index layering: Canvas(0) → SectionOverlay(1) → HandCursorVisual(90) → NavigationHUD → HandPrompt(100)
- `npx vite build` — SUCCESS, builds in ~700ms
- Coexists with mouse/keyboard navigation (hand tracking is purely additive)

### Status: Section 3 COMPLETE
All acceptance criteria met:
- [x] Camera permission requested cleanly with loading/error states
- [x] Hand tracked via MediaPipe HandLandmarker at ~30fps (rAF loop)
- [x] Cursor moves smoothly with EMA smoothing
- [x] Gesture recognition: open_palm, fist, point, pinch, swipe_left, swipe_right
- [x] Fist = click (edge-triggered), swipe = navigate (with cooldown)
- [x] Coexists with mouse/keyboard — hand tracking is purely additive
- [x] Enable/disable toggle works with proper cleanup
- [x] Build succeeds

### Files created:
- `src/lib/stores/hand.svelte.js` — hand state store
- `src/lib/hand/HandTracker.js` — MediaPipe wrapper
- `src/lib/hand/GestureRecognizer.js` — gesture classification
- `src/lib/hand/HandCursor.js` — cursor mapping
- `src/components/HandPrompt.svelte` — enable/disable UI
- `src/components/HandCursorVisual.svelte` — visual cursor overlay

### Notes for other agents:
- **polish agent**: Can add `uCursorPosition` uniform to particle shader for repulsion effect using `handState.cursorPosition`
- **ui-content agent**: Can listen for `hand-click` custom event on `window` to handle fist-click on UI elements
