# Product Requirement Document (PRD) - SpiderVerse Portfolio Experience

## 1. Overview & Objectives
The goal of this project is to build an immersive, highly interactive, cinematic web portfolio themed around **Spider-Man and the Spider-Verse**. Instead of a standard CV/portfolio, this website is structured as an interactive experience, blending a traditional developer portfolio with game-like elements, 3D scenes, physics simulations, scroll-linked animations, comic book aesthetics, and sound effects.

### Core Objectives
*   **Wow Factor**: Capture user attention immediately with a cinematic intro and premium 3D/physics interactions.
*   **Game-like Interaction**: Turn portfolio exploration into an active game, offering multiple mini-games, collectible skills, and interactive elements.
*   **Immersive Storytelling**: Use scroll-linked animations to guide the user through a journey (climbing buildings, entering a web developer laboratory, traveling the multiverse).
*   **High Performance**: Optimize 3D assets, textures, and physics simulations to run smoothly at 60 FPS on modern desktop and mobile browsers.

---

## 2. Target Audience
*   **Tech Recruiters & HR Managers**: Looking for standout frontend/full-stack talent.
*   **Potential Clients**: Searching for developers capable of building top-tier interactive experiences.
*   **Web Development Community**: Looking for creative showcases of Three.js, GSAP, Matter.js, and modern React.

---

## 3. Detailed Features & Requirements

### 3.1 Opening Scene (Cinematic Intro)
*   **Visuals**: High-contrast dark room. A *thwip* web shooter animation draws a spiderweb on screen. The "SpiderVerse" logo glitch-animates into view.
*   **Text Anim**: "DESTA | Full Stack Developer" resolves in a neon Marvel comic style.
*   **Action**: An "Enter the SpiderVerse" button with neon pulse and Spider-Sense warning glows.
*   **Transition**: Clicking "Enter" triggers a zoom-in camera transition into a glowing multiverse portal (shader-based), transitioning the user into the main landing page.

### 3.2 Interactive 3D Background (New York City)
*   **Technique**: React Three Fiber + Custom Shaders.
*   **Scenery**: Low-poly 3D New York City skyline at night.
*   **Depth & Parallax**: Camera shifts dynamically based on mouse coordinates.
*   **Ambience**: Flickering skyscraper windows, rising smog/fog (particle systems), moving headlights/traffic (light trails), a tiny searchlight helicopter, and a starry night sky.
*   **Day/Night Cycle**: A toggle switch allows users to shift the city from neon night to golden-hour day.

### 3.3 Custom Cursor (Web Shooter)
*   **Visuals**: Cursor replaced with a custom-rendered web shooter nozzle or reticle.
*   **Click Action**: *Thwip* sound effect triggers, and a short web line is drawn from the shooter to the click point, anchoring briefly before dissolving.
*   **Hold Action**: Long-press shoots a continuous web line that attaches to the nearest 3D building, applying a slight pull force.

### 3.4 Interactive Spider-Man Elements
*   **Top-Right Eye Tracker**: A stylized 2D/3D Spider-Man mask in the corner. The eyes dilate and rotate to follow the cursor. Clicking causes the eyes to squint/wink.
*   **Spider-Man Swinger**: Randomly every 10–15 seconds, a 3D/2D Spider-Man swings across the viewport (with acrobatics: flips, hangs, stops in center, salutes, then swings away).
*   **Physics Avatar (Left Side)**: A Matter.js-driven rolling/bouncing Spider-Man head. It falls with gravity and rolls down the side of the screen matching the user's scroll depth. Clicking the head makes it jump or bounce.

### 3.5 Content Sections & Interactive Parallax

#### Section 1: Hero Scene
*   **Concept**: Spider-Man crouched on a building ledge looking down at the NYC skyline.
*   **Interaction**: Parallax mouse movement shifts the camera angle (camera tilt).

#### Section 2: About Me (Spidey's Backpack)
*   **Concept**: A school backpack hangs from a web. Hovering triggers a zipper opening animation. A glowing laptop is pulled out and opens.
*   **Laptop Interface**: Displays interactive console terminal with profile info, bio, and education.

#### Section 3: Skills Gadgets
*   **HTML**: Comic card that flips on hover.
*   **CSS**: A Web Shield that blocks incoming particles.
*   **JavaScript**: Energy node sparking with yellow electric arcs (Canvas-based).
*   **React**: A spinning atomic model node that speeds up on hover.
*   **Laravel**: Opens a mini glowing portal when hovered.
*   **Node.js**: Emits glowing neon green lightning trails.

#### Section 4: Experience Web
*   **Concept**: A web network where nodes represent key career milestones (Education, Projects, Freelance).
*   **Interaction**: Clicking a node causes Spider-Man to zip-line (*thwip*) to that coordinate, opening a comic panel containing work details.

#### Section 5: Skyscrapers (Projects Showcase)
*   **Concept**: 3D towers labeled with project names.
*   **Interaction**: Clicking a tower zooms the camera inside a virtual developer office. A desk monitor displays the project showcase (interactive carousel).

#### Section 6: Contact & Footer
*   **Concept**: Spider-Man sitting on the footer edge, swinging legs.
*   **Social Links**: Hovering over GitHub, LinkedIn, or Email triggers a waving animation. Clicking them makes Spider-Man shoot a web and pull the social icon.

---

## 4. Mini-Game Hub
Users can toggle a "Game Mode" overlay to play 4 lightweight, high-score tracking mini-games:
1.  **Green Goblin Hunt**: Target shooter. Click on flying Green Goblins to shoot webs at them.
2.  **Web Swing Simulator**: Press and hold to attach webs to anchors and swing Spider-Man across obstacles.
3.  **Skill Catcher**: Use a web basket to catch falling HTML, CSS, React, and Node icons to increase "Developer Level".
4.  **Venom Boss Fight**: Fast clicker game. Shoot webs to wrap up Venom before the timer runs out.

---

## 5. Easter Eggs & Audio
*   **Konami Code (`↑↑↓↓←→←→BA`)**: Triggers "Spider-Verse Glitch Mode", swapping themes to Miles Morales (graffiti style), Spider-Gwen (pink/white neon), or Spider-Man 2099 (cyberpunk glitch).
*   **Audio Controller**: Ambient city sounds (wind, sirens, helicopter humming) with on/off toggle. Dynamic SFX for webs (*thwip*), portals (*whoosh*), and project entries.
