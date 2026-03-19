# Portfolio Site — Master Plan

## Vision

An immersive Three.js personal portfolio where **one continuous particle system (~80,000 particles)** morphs between scenes as you fly through a 3D tunnel. Hand gesture control via MediaPipe Hands is the star interaction. Each section has a distinct color palette and particle formation.

## Tech Stack

- **Svelte 5** — UI layer, state management via `$state` runes
- **Three.js** — 3D rendering, custom GLSL shaders
- **@mediapipe/tasks-vision** — Hand landmark detection via webcam
- **Vite 8** — Build system

## Multi-Agent Workflow

This project is built by multiple Claude agent instances. Each agent is assigned a section.

- **`PLAN.md`** (this file) — Master plan with detailed per-section specs. Read this first.
- **`DEV_LOG.md`** — Timestamped log. Every agent writes entries here: what it did, what's left, any blockers. Entries must include the agent's assigned section name.

When starting work, an agent should:
1. Read `PLAN.md` to understand the full architecture and their section's detailed plan
2. Read `DEV_LOG.md` to see what's been done and what's pending
3. Do the work, logging timestamped entries in `DEV_LOG.md` as you go
4. Note anything left unimplemented or shortcuts taken

## File Structure

```
src/
├── lib/
│   ├── three/
│   │   ├── ParticleSystem.js       ← Core: BufferGeometry + ShaderMaterial + morphing
│   │   ├── scenes/
│   │   │   ├── HeroScene.js        ← Particle targets: nebula + literal text name
│   │   │   ├── ProjectsScene.js    ← Particle targets: floating project cards
│   │   │   ├── AboutScene.js       ← Particle targets: skill constellation
│   │   │   └── ContactScene.js     ← Particle targets: portal/vortex
│   │   ├── CameraPath.js           ← CatmullRom spline camera rail
│   │   ├── TransitionManager.js    ← Orchestrates morphing + camera movement
│   │   ├── PostProcessing.js       ← Bloom, chromatic aberration, vignette
│   │   └── SceneManager.js         ← Three.js setup, render loop, resize
│   ├── hand/
│   │   ├── HandTracker.js          ← MediaPipe Hands integration
│   │   ├── GestureRecognizer.js    ← Gesture classification (palm, fist, swipe, point)
│   │   └── HandCursor.js           ← Hand position → 3D raycasted cursor
│   ├── stores/
│   │   ├── navigation.js           ← Current section, transition state
│   │   └── hand.js                 ← Hand tracking state, gesture events
│   └── utils/
│       ├── easing.js               ← Easing functions
│       └── math.js                 ← Vector helpers, noise
├── components/
│   ├── Canvas.svelte               ← Three.js canvas mount + lifecycle
│   ├── HandPrompt.svelte           ← "Enable Camera" overlay
│   ├── NavigationHUD.svelte        ← Section dots/indicators
│   ├── SectionOverlay.svelte       ← HTML content layer synced to section
│   ├── sections/
│   │   ├── HeroContent.svelte      ← Name, title, tagline
│   │   ├── ProjectsContent.svelte  ← Project cards, descriptions, links
│   │   ├── AboutContent.svelte     ← Bio, skills labels
│   │   └── ContactContent.svelte   ← Contact info, links
│   └── HandCursorVisual.svelte     ← Glowing orb following hand
├── data/
│   └── projects.js                 ← Project data (title, desc, tech, links, color)
├── App.svelte                      ← Root orchestrator
├── app.css                         ← Global styles, CSS variables
└── main.js                         ← Entry point
```

## Shared Contracts (All agents must follow these)

### Particle System Interface
Every scene file exports a single function:
```js
export function getPositions(particleIndex, totalCount) {
  return { x, y, z, r, g, b, size }
}
```
This is called once per particle to generate target positions. Same signature as the shrine example.

### Navigation Store (`navigation.js`)
```js
// Svelte 5 runes — these are reactive
export const navigationState = (() => {
  let currentSection = $state(0)      // 0=Hero, 1=Projects, 2=About, 3=Contact
  let transitionProgress = $state(0)   // 0.0 → 1.0 during transitions
  let isTransitioning = $state(false)
  // ... navigateTo, navigateNext, navigatePrev functions
  return { /* getters/setters */ }
})()
```

### Hand Store (`hand.js`)
```js
export const handState = (() => {
  let handEnabled = $state(false)
  let handDetected = $state(false)
  let cursorPosition = $state({ x: 0, y: 0 })
  let currentGesture = $state('none')
  return { /* getters/setters */ }
})()
```

### Section registration
Each section defines: `{ name, getPositions }`. The TransitionManager holds an array of these and maps section indices to camera path progress values.

---

## Section 1: Particle Engine (AGENT: particle-engine)

### Scope
Build the core particle system, shader pipeline, scene manager, camera path, and transition system. This is the foundation everything else depends on.

### Detailed Tasks

#### 1a. ParticleSystem.js
- Create a `THREE.BufferGeometry` with 80,000 particles
- Buffer attributes (all Float32):
  - `position` (3) — current positions
  - `targetPosition` (3) — where particles are heading
  - `color` (3) — current RGB
  - `targetColor` (3) — target RGB
  - `size` (1) — current size
  - `targetSize` (1) — target size
  - `random` (1) — per-particle random seed (0-1, assigned once, used for stagger)
- Custom `THREE.ShaderMaterial`:
  - **Uniforms**: `uTransitionProgress` (float 0-1), `uTime` (float), `uPixelRatio` (float)
  - **Vertex shader**:
    - Mix `position` toward `targetPosition` using smoothstep of `(uTransitionProgress - random * 0.3)` clamped to 0-1 (particles stagger based on their random seed)
    - Mix `color` toward `targetColor` similarly
    - Mix `size` toward `targetSize`
    - Apply slight noise displacement during mid-transition (when progress ~0.5) for "chaos" effect: offset position by `sin(uTime + random * 6.28) * (1.0 - abs(progress - 0.5) * 2.0) * 5.0`
    - Set `gl_PointSize` from interpolated size, scaled by pixel ratio and distance attenuation
    - Pass interpolated color to fragment shader via varying
  - **Fragment shader**:
    - Circular point: discard if `length(gl_PointCoord - 0.5) > 0.5`
    - Soft glow: alpha = `1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5))`
    - Color from varying, additive blending
- Methods:
  - `constructor(scene)` — creates geometry, material, adds Points to scene
  - `setTargets(getPositionsFn)` — calls getPositions for each particle, updates target buffers
  - `update(deltaTime)` — updates `uTime` uniform
  - `dispose()` — cleanup geometry + material
- Blending: `THREE.AdditiveBlending`, `depthWrite: false`, `transparent: true`

#### 1b. SceneManager.js
- Creates `THREE.Scene`, `THREE.PerspectiveCamera` (75 FOV), `THREE.WebGLRenderer`
- Renderer: antialias, alpha: false, powerPreference: 'high-performance'
- Background color: `#000000`
- Handle window resize (update camera aspect + renderer size)
- Render loop via `requestAnimationFrame`
- Expose `scene`, `camera`, `renderer`, `clock`
- Accept an `onUpdate(deltaTime)` callback for the animation loop
- Mount renderer canvas to a provided DOM element

#### 1c. CameraPath.js
- Create a `THREE.CatmullRomCurve3` with control points for the camera position path
- A parallel `CatmullRomCurve3` for camera lookAt targets
- Suggested positions (adjustable by later agents):
  - Hero: `(0, 0, 100)` looking at `(0, 0, 0)`
  - Projects: `(0, 5, 30)` looking at `(0, 0, 0)`
  - About: `(30, 10, -30)` looking at `(0, 5, -30)`
  - Contact: `(0, 0, -80)` looking at `(0, 0, -100)`
- Method: `getTransform(progress)` → `{ position: Vector3, lookAt: Vector3 }` where progress is 0.0-1.0
- Idle animation: add subtle sinusoidal offset to position (amplitude ~0.5, period ~4s)

#### 1d. TransitionManager.js
- Holds array of section definitions: `[{ name, getPositions, cameraProgress }]`
- `cameraProgress` values: Hero=0.0, Projects=0.33, About=0.66, Contact=1.0
- `transitionTo(sectionIndex)`:
  1. Set `isTransitioning = true`
  2. Call `particleSystem.setTargets(section.getPositions)`
  3. Animate `transitionProgress` from 0→1 over ~2s using requestAnimationFrame
  4. Simultaneously animate camera along spline to section's `cameraProgress`
  5. Set `isTransitioning = false` when done
- Uses easing (ease-in-out cubic) for camera movement
- Particles use their own stagger in the shader

#### 1e. Navigation Store (`src/lib/stores/navigation.js`)
- Svelte 5 module-level `$state` runes
- State: `currentSection`, `transitionProgress`, `isTransitioning`
- Functions: `navigateTo(index)`, `navigateNext()`, `navigatePrev()`
- `setTransitionCallback(fn)` — Canvas.svelte connects the TransitionManager here
- Guard: don't navigate during active transition

#### 1f. Utility modules
- `src/lib/utils/easing.js` — easeInOutCubic, easeOutQuart, linear
- `src/lib/utils/math.js` — clamp, lerp, smoothstep, randomRange

#### 1g. Canvas.svelte
- Svelte component that mounts the Three.js renderer
- `onMount`: create SceneManager, ParticleSystem, CameraPath, TransitionManager
- Register a simple HeroScene (nebula only, no text — text comes in Section 2)
- Wire scroll events to navigation (mouse wheel → navigateNext/navigatePrev with debounce)
- `onDestroy`: cleanup (dispose geometry, material, renderer)
- Full viewport: `position: fixed; inset: 0; z-index: 0`

#### 1h. App.svelte rewrite
- Remove existing Three.js code and Counter import
- Mount `<Canvas />` as background
- Placeholder section overlay + navigation HUD (stubs for Section 4 agent)
- Clean structure for other agents to plug into

### Acceptance Criteria
- 80K particles render at 60fps
- HeroScene shows particles forming a nebula
- Scroll triggers transitions between at least 2 scenes (Hero + a placeholder second scene)
- Particles morph with stagger and mid-transition chaos
- Canvas is full-viewport, responsive
- Navigation store is reactive and functional

---

## Section 2: Scene Definitions (AGENT: scenes)

### Scope
Implement all 4 particle scene distribution functions + the particle text technique for the Hero name.

### Dependencies
- Section 1 (Particle Engine) must be complete — needs `ParticleSystem.setTargets()` interface

### Detailed Tasks

#### 2a. Particle Text Utility (`src/lib/utils/textSampler.js`)
- Function: `sampleTextPositions(text, fontSize, maxSamples)` → `Array<{x, y}>`
- Create offscreen `<canvas>`, render text with bold font (e.g., "Space Grotesk" or "Inter Black")
- `getImageData()`, iterate pixels, collect coordinates where alpha > 128
- Randomly sample `maxSamples` positions from collected coordinates
- Normalize to centered coordinates (x: -width/2 to width/2, y: -height/2 to height/2)
- Scale to appropriate 3D world units (text should span ~60 units wide)
- Cache results so repeated calls don't re-render

#### 2b. HeroScene.js (replace placeholder from Section 1)
- **Color palette**: Deep blues (#1a1a6e), purples (#6a0dad), white stars (#ffffff)
- Distribution (80,000 particles):
  - **0-39% (32K) — Scattered stars**: Spherical distribution, radius 80-200, colors white/pale blue, size 0.3-0.8
  - **40-59% (16K) — Nebula cloud**: Gaussian clusters centered near origin, radius 20-40, noise-based cloud density, colors deep purple/blue, size 0.5-1.5
  - **60-79% (16K) — Name text "ARSHON SAADATI"**: Use `sampleTextPositions()`, place at z=0, y centered, colors bright white/cyan, size 0.8-1.2. Slight z-jitter (±0.5) for depth
  - **80-100% (16K) — Ambient floaters**: Wide spread, faint colors, size 0.2-0.5

#### 2c. ProjectsScene.js
- **Color palette**: Cyan (#00e5ff), teal (#00bfa5), electric blue (#2979ff)
- 6 project "card" positions in 3D (2x3 grid, ~25 units apart, slight tilt)
- **0-59% (48K)**: Card particles — ~8K per card, flat rectangular grids (15x10), unique accent colors
- **60-84% (20K)**: Ambient starfield around cards
- **85-100% (12K)**: Connecting particle streams between adjacent cards

#### 2d. AboutScene.js
- **Color palette**: Gold (#ffd54f), amber (#ffab00), soft white (#fff8e1)
- 8-10 skill node positions in constellation layout (circular, radius ~30)
- Center node = "Arshon"
- **0-29% (24K)**: Dense spherical clusters at node positions
- **30-49% (16K)**: Connection line particles between nodes
- **50-79% (24K)**: Constellation background stars, warm-tinted
- **80-100% (16K)**: Orbital ring particles around nodes

#### 2e. ContactScene.js
- **Color palette**: Magenta (#e040fb), pink (#ff4081), violet (#7c4dff)
- **0-39% (32K)**: Torus ring (major R=20, minor r=3), parametric positioning
- **40-59% (16K)**: Inner logarithmic spiral toward center
- **60-79% (16K)**: Outer scattered glow with radial falloff
- **80-100% (16K)**: Sparse background void

### Acceptance Criteria
- All 4 scenes produce visually distinct, beautiful formations
- Text in HeroScene is clearly readable from camera's Hero position
- Transitions between any pair look smooth
- Each scene has its distinct color palette
- No visible artifacts

---

## Section 3: Hand Gesture System (AGENT: hand-gestures)

### Scope
Full MediaPipe Hands integration, gesture recognition, 3D cursor, and enable/disable UI.

### Dependencies
- Section 1 (needs SceneManager for raycasting, navigation store for triggering navigation)
- Can be developed in parallel with Section 2

### Detailed Tasks

#### 3a. Install & setup
- `npm install @mediapipe/tasks-vision`
- Hand store (`src/lib/stores/hand.js`): `handEnabled`, `handDetected`, `cursorPosition`, `currentGesture`

#### 3b. HandTracker.js
- Wraps MediaPipe `HandLandmarker`
- `async init()`: create landmarker, request webcam, create hidden video element
- `detect()`: call `detectForVideo()`, return 21 landmarks or null
- `destroy()`: stop video stream, close landmarker
- Model: `hand_landmarker/float16/1/hand_landmarker.task` from Google storage

#### 3c. GestureRecognizer.js
- Finger state: compare tip y to PIP joint y for each finger
- Gestures: `open_palm` (all extended), `fist` (none), `point` (index only), `pinch` (thumb+index close), `swipe_left`/`swipe_right` (velocity tracking over 10 frames)
- Debouncing: 3 frame stability, 500ms swipe cooldown, fist triggers on transition only

#### 3d. HandCursor.js
- Palm center (landmark 9) → normalized screen coords (mirrored x)
- Exponential moving average smoothing (factor 0.3)
- Raycast through camera into scene
- Update hand store cursor position

#### 3e. HandPrompt.svelte
- "Enable Hand Control" button with loading/error states
- Camera permission handling
- Always-visible toggle in corner
- Status indicator (green=detected, red=no hand, gray=disabled)

#### 3f. HandCursorVisual.svelte
- CSS overlay following cursor position
- Glowing circle, color-coded by state (white/cyan/green)
- Smooth transitions, only visible when hand enabled + detected

#### 3g. Gesture → Navigation wiring
- `swipe_right` → `navigateNext()`, `swipe_left` → `navigatePrev()`
- `fist` transition → click/select hovered element
- `open_palm` → cursor mode, highlight nearby elements

### Acceptance Criteria
- Camera permission requested cleanly with error handling
- Hand tracked at ~30fps, cursor moves smoothly
- Fist = click, swipe = navigate
- Coexists with mouse/keyboard
- Enable/disable toggle works

---

## Section 4: UI Content Layer (AGENT: ui-content)

### Scope
All Svelte HTML overlay components: section content, navigation HUD, project data, styling.

### Dependencies
- Section 1 (navigation store interface)
- Can be developed in parallel with Sections 2 & 3

### Detailed Tasks

#### 4a. SectionOverlay.svelte
- Container over canvas, shows/hides content per `currentSection`
- Fade transitions synced to `transitionProgress`
- `pointer-events: none` on container, `auto` on interactive children

#### 4b. HeroContent.svelte
- "Software Engineer" subtitle below particle text
- "Scroll to explore" hint with animated bounce
- "Enable Hand Control" CTA

#### 4c. ProjectsContent.svelte
- Project data from `src/data/projects.js` (6 placeholder projects)
- Card UI near 3D positions (3D→2D projection via `camera.project()`)
- Title, description, tech pills, links

#### 4d. AboutContent.svelte
- Bio, skill labels near constellation nodes
- "Career timeline coming soon" placeholder

#### 4e. ContactContent.svelte
- GitHub, LinkedIn, Email links as glowing pills
- Magenta palette styling

#### 4f. NavigationHUD.svelte
- Fixed dots (right side), one per section, current highlighted
- Click → navigateTo, labels on hover

#### 4g. App.svelte final integration
- Z-index layers: Canvas(0) → SectionOverlay(1) → HandCursor(2) → NavHUD(3) → HandPrompt(4)

#### 4h. Global styles (app.css)
- CSS variables per section palette
- Glass-morphism panels, glow utilities
- Responsive breakpoints
- Modern sans-serif font

### Acceptance Criteria
- All section content renders correctly
- Fades in/out during transitions
- Navigation HUD clickable and animated
- Text readable over particles
- Responsive

---

## Section 5: Post-Processing & Polish (AGENT: polish)

### Scope
Visual effects, performance, loading screen, keyboard nav, mobile fallback.

### Dependencies
- All previous sections substantially complete

### Detailed Tasks

#### 5a. PostProcessing.js
- EffectComposer: RenderPass → UnrealBloomPass (1.5/0.4/0.2) → ChromaticAberration → Vignette

#### 5b. Particle-cursor interaction
- Shader uniform `uCursorPosition` — particles repel from cursor (displacement ~2-3 units)

#### 5c. Loading screen
- Dark background, animated indicator, fades out when ready

#### 5d. Keyboard navigation
- Arrow keys / Page Up/Down → navigate, 1-4 → direct, Escape → Hero

#### 5e. Mobile fallback
- Reduced particles (30K), touch swipe, no hand tracking

#### 5f. Performance
- Target 60fps at 1080p, cap pixel ratio at 2.0

#### 5g. SEO
- Meta tags, OG tags, favicon

### Acceptance Criteria
- Bloom + chromatic aberration visible
- Particles react to cursor
- 60fps maintained
- Keyboard + mobile work

---

## Color Palettes Summary

| Section | Primary | Accent | Background |
|---------|---------|--------|-----------|
| Hero | #6a0dad purple | #00e5ff cyan | White/blue stars |
| Projects | #00e5ff cyan | #2979ff blue | Dim teal |
| About | #ffd54f gold | #ffab00 amber | Warm white |
| Contact | #e040fb magenta | #ff4081 pink | #7c4dff violet |

---

## Stretch Goals (Future)
- Resume/career timeline (user will provide resume data)
- Project detail views
- Two-hand interactions
- Easter eggs
- Sound design
- Deployment (Vercel/Netlify)
