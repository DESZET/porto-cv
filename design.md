# Design Document - SpiderVerse Portfolio Experience

## 1. Visual Theme & Art Direction

### 1.1 Color Palette
*   **Background (Dominant)**: Dark Void / Space Blue (`#080b11` to `#0d131f`)
*   **Spidey Red (Accent 1)**: Classic Crimson (`#e23636`) / Neon Electric Red (`#ff2a2a`)
*   **Spidey Blue (Accent 2)**: Neon Cyber Blue (`#00f0ff`) / Deep Blue (`#005a9c`)
*   **Spider-Sense / Glitch Alert**: Neon Yellow (`#ffd700`) & Neon Magenta (`#ff007f`)
*   **Cards & Glassmorphism**: Translucent white backdrop-filter (`rgba(255, 255, 255, 0.03)` with a `1px` border of `rgba(255, 255, 255, 0.08)` and blur of `16px`).

### 1.2 Typography
*   **Headers & Comics**: `Bangers` or `Marvel` (via Google Fonts) - bold, condensed comic-book display fonts.
*   **Subheaders**: `Space Grotesk` or `Outfit` - clean, tech-oriented sans-serif with geometric structure.
*   **Body Text**: `Inter` - neutral, highly legible sans-serif.

### 1.3 UI Elements & Styling
*   **Comic Book Borders**: Outer borders with thick solid lines (`3px solid #000`) and slight shadow offsets to replicate retro comic book printing.
*   **Half-tone Textures**: SVG or CSS pattern overlays representing comic dots.
*   **Spiderweb Accents**: CSS-drawn or SVG background vectors anchoring various sections.

---

## 2. Architecture & File Structure

```text
src/
├── app/
│   ├── layout.tsx         # Global imports, Google Fonts, Lenis wrapper
│   ├── page.tsx           # Orchestrator / main page layout
│   └── globals.css        # Core design tokens, global resets, custom animations
├── components/
│   ├── 3d/
│   │   ├── CityBackground.tsx   # R3F NYC Skyline (particles, cars, shaders)
│   │   ├── LaptopScene.tsx      # Interactive 3D laptop for About Me
│   │   └── SkyscraperScene.tsx  # Zoomable towers for Projects
│   ├── ui/
│   │   ├── Intro.tsx            # Opening scene (glitch logo, portal enter)
│   │   ├── HeadTracker.tsx      # Corner Spidey head following cursor
│   │   ├── PhysicsHead.tsx      # MatterJS rolling head on left border
│   │   ├── CustomCursor.tsx     # Web-shooter cursor drawing lines
│   │   ├── AudioToggle.tsx      # Ambient city/spider music player
│   │   └── Sections.tsx         # HTML wrapper sections (Hero, Skills, Exp, Contact)
│   ├── games/
│   │   ├── GameContainer.tsx    # Handles game overlays and scoring
│   │   ├── GoblingGame.tsx      # Shoot Green Goblin game
│   │   └── BossFight.tsx        # Tap Venom game
│   └── hooks/
│       ├── useKonamiCode.ts     # Triggers multiverse glitch mode
│       └── useAudio.ts          # Integrates Howler.js for SFX
├── context/
│   └── AppContext.tsx          # Shared state (Game Mode, Active Theme, Volume)
```

---

## 3. Technology Stack & Integration Details

### 3.1 3D Rendering (React Three Fiber + Three.js)
*   **Main City Canvas**: Absolute, fixed background container. Contains low-poly building meshes, particle systems for stars/fog, and moving line meshes for traffic.
*   **Camera Motion**: GSAP controls the `camera.position` and `camera.rotation` based on `ScrollTrigger` scroll progress.
*   **Laptop & Office Scenes**: Heavy models are avoided. Instead, clean geometric meshes are created programmatically (procedural R3F geometries) to maximize performance and avoid broken external resources.
*   **Shaders (GLSL)**:
    *   **Portal Shader**: A custom fragment shader generating an organic spinning vortex with chromatic aberration for the intro transition.
    *   **Glitch Shader**: Applied post-processing or via canvas material to simulate Spider-Verse "dimension glitching" when Konami code is triggered.

### 3.2 Animation & Scrolling (GSAP + ScrollTrigger + Lenis)
*   **Scroll Syncing**: `Lenis` provides high-precision smooth scrolling.
*   **Timeline Orchestration**: GSAP maps the timeline of the camera going down the skyscrapers, pivoting, and focusing on different interactive nodes.
*   **Framer Motion**: Handles pure HTML overlay transitions, menu sliders, hover cards, and game overlays for seamless spring animations.

### 3.3 Physics Simulation (Matter.js)
*   **Engine & Runner**: Running on a hidden side-canvas.
*   **Colliders**: The screen borders (left, bottom, right) form the static walls.
*   **Rigid Bodies**: A circular body representing the rolling Spider-Man head. It listens to window scroll velocities and translates them into rotational and directional force.
*   **Interactions**: Clicking the head applies a vertical vector impulse (jump force).

### 3.4 Interactive Web Shooter (HTML5 Canvas + Howler.js)
*   **Canvas Overlay**: Covers the full screen, tracing the cursor's path.
*   **Drawing**: A custom script uses bezier curves to draw a web line from the web shooter to the click coordinate.
*   **Physics/Fade**: The drawn lines oscillate (rebounding elastic string) and fade out over 300ms using custom canvas redraw loops.
*   **Howler.js Integration**: Pre-loaded sound assets. Playing web-shoots (*thwip*), explosions (*boom*), and portals (*whoosh*) with low latency.
