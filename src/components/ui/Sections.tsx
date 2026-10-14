"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  Mail,
  Terminal,
  ExternalLink,
  Shield,
  Zap,
  RotateCw,
  Cpu,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  Volume2,
  VolumeX,
} from "lucide-react";
import styles from "./Sections.module.css";

// Custom SVG Icons for brands to support all lucide versions offline
const Github: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Linkedin: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// --- PROJECT DATA ---
const PROJECTS = [
  {
    id: 1,
    title: "Project Spider-Bot AI",
    desc: "An intelligent chatbot assistant programmed to answer profile queries, leveraging advanced NLP and vector embeddings.",
    tags: ["NextJS", "TypeScript", "OpenAI", "Vector DB"],
    link: "https://github.com",
    role: "Lead Developer",
    stats: "99% Precision Rate",
  },
  {
    id: 2,
    title: "Multiverse portal CMS",
    desc: "A headless CMS system built for parallel universe dimensions, enabling real-time content sync across virtual servers.",
    tags: ["React", "NodeJS", "WebSockets", "MongoDB"],
    link: "https://github.com",
    role: "Full Stack Engineer",
    stats: "15ms Real-time Latency",
  },
  {
    id: 3,
    title: "OsCorp Security Shield",
    desc: "A robust authorization firewall shield blocking malicious cyber injections and executing automated threat containment.",
    tags: ["Laravel", "PHP", "Docker", "Redis"],
    link: "https://github.com",
    role: "Backend Architect",
    stats: "Blocked 10K+ Attacks",
  },
];

// --- EXPERIENCE DATA ---
const TIMELINE_NODES = [
  {
    id: "edu1",
    title: "High School Graduation",
    subtitle: "Science Major",
    date: "2018 - 2021",
    desc: "Acquired fundamentals in programming logic, mathematics, and science structures.",
    x: 80,
    y: 80,
    type: "edu",
  },
  {
    id: "work1",
    title: "Junior Web Developer",
    subtitle: "OsCorp Biotech Web Division",
    date: "2021 - 2023",
    desc: "Built data dashboards, managed PHP/Laravel projects, and optimized frontend layout speeds.",
    x: 280,
    y: 180,
    type: "work",
  },
  {
    id: "work2",
    title: "Full-Stack Freelancer",
    subtitle: "Web Verse Agencies",
    date: "2023 - 2025",
    desc: "Delivered interactive React/Next applications, custom UI animations, and automated database integrations.",
    x: 480,
    y: 120,
    type: "work",
  },
  {
    id: "work3",
    title: "Senior Full Stack Engineer",
    subtitle: "Daily Bugle Tech Division",
    date: "2025 - Present",
    desc: "Developing state-of-the-art cinematic web interfaces, leading AI search integrations, and hosting microservice networks.",
    x: 680,
    y: 220,
    type: "work",
  },
];

export const Sections: React.FC = () => {
  const {
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    playSFX,
    setActiveGame,
    scores,
  } = useApp();

  // Hero Section Redesign states and handlers
  const [sonarLetter, setSonarLetter] = useState<number | null>(null);
  const lastSoundTime = useRef(0);
  const handleLetterHover = (idx: number) => {
    setSonarLetter(idx);
    const now = Date.now();
    if (now - lastSoundTime.current > 180) {
      playSFX("thwip");
      lastSoundTime.current = now;
    }
  };

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 10; // Max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;   // Max 10 deg
    setTilt({ rx: rotateX, ry: rotateY });
  };

  const handleMouseLeaveCard = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  // About Me - Backpack
  const [backpackOpen, setBackpackOpen] = useState(false);

  // Experience Node Selection
  const [activeNodeId, setActiveNodeId] = useState<string>("edu1");
  const activeNode = TIMELINE_NODES.find((node) => node.id === activeNodeId) || TIMELINE_NODES[0];

  // Projects Modal & Selected Project
  const [zoomedProject, setZoomedProject] = useState<typeof PROJECTS[0] | null>(null);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleNodeClick = (nodeId: string) => {
    playSFX("thwip");
    setActiveNodeId(nodeId);
  };

  const openProject = (project: typeof PROJECTS[0]) => {
    playSFX("boom");
    setZoomedProject(project);
  };

  const closeProject = () => {
    playSFX("whoosh");
    setZoomedProject(null);
  };

  // Convert theme text for UI display
  const getThemeDisplayName = () => {
    switch (theme) {
      case "miles": return "Miles Morales (Brooklyn)";
      case "gwen": return "Spider-Gwen (Earth-65)";
      case "2099": return "Miguel O'Hara (2099)";
      default: return "Peter Parker (Classic)";
    }
  };

  return (
    <div className={styles.container}>
      {/* Spider-Man Swing Animation - runs across top of screen in the sections too */}
      <div className={styles.swingScene}>
        <div className={styles.swingContainer}>
          <div className={styles.swingPendulum}>
            <div className={styles.swingWebTrail} />
            <Image
              src="/spiderman-wing.png"
              alt="Spider-Man Swinging"
              className={styles.swingSpiderman}
              draggable={false}
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>

      {/* Hanging Spider-Man Decoration - Draggable */}
      <div className={styles.hangingSpideyWrapper}>
        <motion.div
          className={styles.draggableSpidey}
          drag="y"
          dragConstraints={{ top: 0, bottom: 400 }}
          dragElastic={0.4}
          whileDrag={{ cursor: 'grabbing' }}
          style={{ cursor: 'grab', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className={styles.hangingWebRope} />
          <Image
            src="/spiderman-gelantung.png"
            alt="Hanging Spider-Man"
            className={styles.hangingSpidey}
            draggable={false}
            width={100}
            height={150}
          />
        </motion.div>
      </div>

      {/* Floating Header UI */}
      <header className={`${styles.header} glass-panel`}>
        <div className={styles.logo}>
          <span>SPIDER-PORTFOLIO</span>
        </div>
        <div className={styles.headerControls}>
          {/* Theme Selector */}
          <div className={styles.themeBadge}>
            <span>Theme: <strong>{getThemeDisplayName()}</strong></span>
            <div className={styles.themeDots}>
              <span className={`${styles.themeDot} ${styles.dotClassic} ${theme === "classic" ? styles.dotActive : ""}`} onClick={() => setTheme("classic")} title="Classic Red/Blue" />
              <span className={`${styles.themeDot} ${styles.dotMiles} ${theme === "miles" ? styles.dotActive : ""}`} onClick={() => setTheme("miles")} title="Miles Morales" />
              <span className={`${styles.themeDot} ${styles.dotGwen} ${theme === "gwen" ? styles.dotActive : ""}`} onClick={() => setTheme("gwen")} title="Spider-Gwen" />
              <span className={`${styles.themeDot} ${styles.dot2099} ${theme === "2099" ? styles.dotActive : ""}`} onClick={() => setTheme("2099")} title="Spider-Man 2099" />
            </div>
          </div>

          {/* Sound Toggle */}
          <button className={styles.controlBtn} onClick={toggleSound} title={soundEnabled ? "Mute SFX" : "Unmute SFX"}>
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Start Mini Game Button */}
          <button
            className={`${styles.gameBtn} comic-panel`}
            onClick={() => {
              playSFX("whoosh");
              setActiveGame("goblin");
            }}
          >
            PLAY GAME
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className={styles.heroSection} id="hero">
        <div
          ref={cardRef}
          className={styles.dribbbleCard}
          onMouseMove={handleMouseMoveCard}
          onMouseLeave={handleMouseLeaveCard}
          style={{
            "--rx": `${tilt.rx}deg`,
            "--ry": `${tilt.ry}deg`,
          } as React.CSSProperties}
        >
          {/* LEFT: Title */}
          <div className={styles.dribbbleLeft}>
            <h1 className={styles.dribbbleTitle}>
              {/* DESTA — per letter animated */}
              <span className={styles.heroWordRow}>
                {"DESTA".split("").map((ch, i) => (
                  <span
                    key={`d-${i}`}
                    className={styles.heroLetter}
                    style={{
                      animationDelay: `${i * 0.07}s`,
                      '--letter-color': [
                        '#ffffff','#c0c0c0','#ffffff','#b22020','#ffffff'
                      ][i % 5],
                    } as React.CSSProperties}
                    onMouseEnter={() => handleLetterHover(i)}
                    onMouseLeave={() => setSonarLetter(null)}
                  >
                    {ch}
                    {sonarLetter === i && (
                      <>
                        <span className={styles.sonarRing} style={{ animationDelay: '0ms' }} />
                        <span className={styles.sonarRing} style={{ animationDelay: '200ms' }} />
                        <span className={styles.sonarRing} style={{ animationDelay: '400ms' }} />
                      </>
                    )}
                  </span>
                ))}
              </span>
              <br />
              {/* ANANDHIKA — per letter animated */}
              <span className={styles.heroWordRow}>
                {"ANANDHIKA".split("").map((ch, i) => (
                  <span
                    key={`a-${i}`}
                    className={styles.heroLetter}
                    style={{
                      animationDelay: `${0.35 + i * 0.07}s`,
                      '--letter-color': [
                        '#c0c0c0','#ffffff','#b22020','#ffffff','#c0c0c0',
                        '#ffffff','#c0c0c0','#ffffff','#b22020'
                      ][i % 9],
                    } as React.CSSProperties}
                    onMouseEnter={() => handleLetterHover(10 + i)}
                    onMouseLeave={() => setSonarLetter(null)}
                  >
                    {ch}
                    {sonarLetter === 10 + i && (
                      <>
                        <span className={styles.sonarRing} style={{ animationDelay: '0ms' }} />
                        <span className={styles.sonarRing} style={{ animationDelay: '200ms' }} />
                        <span className={styles.sonarRing} style={{ animationDelay: '400ms' }} />
                      </>
                    )}
                  </span>
                ))}
              </span>
            </h1>
            <a
              href="#projects"
              className={styles.dribbbleLink}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              SEE FULL DETAILS
            </a>
          </div>

          {/* CENTER: Spider-Man Image */}
          <div className={styles.dribbbleCenter}>
            <Image src="/spiderman-hero.png" alt="Spider-Man" className={styles.dribbbleSpidey} draggable={false} width={150} height={200} />
          </div>

          {/* RIGHT: Traits */}
          <div className={styles.dribbbleRight}>
            <div className={styles.traitItem}>
              <div className={styles.traitHeader}>
                <svg className={styles.traitIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 13v8" />
                  <path d="M9 13l-4 4" />
                  <path d="M15 13l4 4" />
                  <path d="M9 7L5 3" />
                  <path d="M15 7l4-4" />
                </svg>
                <h3>DEVELOPER</h3>
              </div>
              <p>An ordinary coder navigating classes, frameworks, and the weight of extraordinary projects.</p>
            </div>
            
            <div className={styles.traitItem}>
              <div className={styles.traitHeader}>
                <svg className={styles.traitIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 13v8" />
                  <path d="M9 13l-4 4" />
                  <path d="M15 13l4 4" />
                  <path d="M9 7L5 3" />
                  <path d="M15 7l4-4" />
                </svg>
                <h3>CREATIVE</h3>
              </div>
              <p>Bright, curious, and always building something that ends up changing the user experience.</p>
            </div>
            
            <div className={styles.traitItem}>
              <div className={styles.traitHeader}>
                <svg className={styles.traitIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 13v8" />
                  <path d="M9 13l-4 4" />
                  <path d="M15 13l4 4" />
                  <path d="M9 7L5 3" />
                  <path d="M15 7l4-4" />
                </svg>
                <h3>ARCHITECT</h3>
              </div>
              <p>The dev no one notices — until he rises to build more scalable systems than anyone expected.</p>
            </div>
          </div>
        </div>

        <div
          className={styles.scrollIndicatorWeb}
          onClick={() => {
            playSFX("whoosh");
            const nextSection = document.getElementById("about");
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div className={styles.webThreadLine} />
          <div className={styles.hangingSpider}>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="35" r="9" fill="var(--accent-red)" stroke="#000" strokeWidth="2.5" />
              <path d="M 45 35 L 49 32 L 49 36 Z" fill="#fff" stroke="#000" strokeWidth="1" />
              <path d="M 55 35 L 51 32 L 51 36 Z" fill="#fff" stroke="#000" strokeWidth="1" />
              <ellipse cx="50" cy="56" rx="13" ry="17" fill="var(--accent-red)" stroke="#000" strokeWidth="2.5" />
              <path d="M 42 56 Q 50 49 58 56 Q 50 63 42 56 Z" fill="var(--accent-blue, #0070f3)" stroke="#000" strokeWidth="1" />
              <path d="M 46 62 Q 50 59 54 62" stroke="#000" strokeWidth="1.5" fill="none" />
              <path d="M 41 46 C 26 38 28 20 30 12" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 39 52 C 22 47 20 28 23 18" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 39 59 C 18 57 16 38 18 28" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 42 66 C 20 70 18 52 20 42" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 59 46 C 74 38 72 20 70 12" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 61 52 C 78 47 80 28 77 18" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 61 59 C 82 57 84 38 82 28" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 58 66 C 80 70 82 52 80 42" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div className={styles.scrollDownText}>
            Scroll to climb down
          </div>
        </div>
      </section>

      {/* --- ABOUT ME SECTION (Backpack & Console) --- */}
      <section className={styles.section} id="about">
        <h2 className="comic-title">🎒 Spidey&apos;s Backpack (About Me)</h2>
        <div className={styles.aboutGrid}>
          
          {/* Backpack Interactive Model */}
          <div className={styles.backpackCol}>
            <div
              className={`${styles.backpackContainer} ${backpackOpen ? styles.open : ""}`}
              onClick={() => {
                playSFX("whoosh");
                setBackpackOpen(!backpackOpen);
              }}
            >
              <div className={styles.webStrand} />
              <div className={styles.backpackModel}>
                <div className={styles.zipper}>
                  <span>{backpackOpen ? "CLOSE BACKPACK" : "CLICK TO OPEN BAG"}</span>
                </div>
                {/* Visual backpack components */}
                <div className={styles.backpackBody}>
                  <div className={styles.backpackPocket} />
                </div>
              </div>
            </div>
          </div>

          {/* Backpack Contents (Glowing Retro Terminal) */}
          <div className={styles.consoleCol}>
            <div className={`${styles.laptopConsole} glass-panel ${backpackOpen ? styles.consoleVisible : ""}`}>
              <div className={styles.consoleHeader}>
                <Terminal size={14} className={styles.consoleIcon} />
                <span>spidey-terminal://desta-profile.sh</span>
                <div className={styles.consoleDots}>
                  <span className={styles.cDot} />
                  <span className={styles.cDot} />
                  <span className={styles.cDot} />
                </div>
              </div>
              <div className={styles.consoleBody}>
                {backpackOpen ? (
                  <>
                    <p className={styles.cmd} style={{ animationDelay: '0s', animationFillMode: 'both' }}>$ cat profile_info.json</p>
                    <div className={styles.output} style={{ animationDelay: '1s' }}>
                      <p><span className={styles.key}>&quot;identity&quot;:</span> &quot;Desta Anandhika&quot;,</p>
                      <p><span className={styles.key}>&quot;role&quot;:</span> &quot;Full Stack Web Developer&quot;,</p>
                      <p><span className={styles.key}>&quot;location&quot;:</span> &quot;Jakarta, Indonesia&quot;,</p>
                      <p><span className={styles.key}>&quot;specialty&quot;:</span> [&quot;TypeScript/React&quot;, &quot;GSAP Shaders&quot;, &quot;Laravel/PHP&quot;, &quot;MatterJS Physics&quot;],</p>
                    </div>

                    <p className={styles.cmd} style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>$ run query_bio.bin</p>
                    <div className={styles.output} style={{ animationDelay: '2.5s' }}>
                      <p className={styles.bioText}>
                        &quot;Bitten by the coding bug in high school. Since then, I&apos;ve spent days developing modular backend pipelines and nights building visual, interactive interfaces. I strive to make websites feel like cinematic experiences.&quot;
                      </p>
                    </div>

                    <p className={styles.cmd} style={{ animationDelay: '3s', animationFillMode: 'both' }}>$ status --skills</p>
                    <div className={styles.output} style={{ animationDelay: '4s' }}>
                      <p className={styles.greenText}>✓ WebGL Canvas active. 60 FPS target maintained.</p>
                      <p className={styles.greenText}>✓ All web shooters fully reloaded with web fluid.</p>
                    </div>
                  </>
                ) : (
                  <div className={styles.consolePlaceholder}>
                    <p className={styles.blinkText}>[ SYSTEM HIBERNATED ]</p>
                    <p>Click Spidey&apos;s backpack hanging on the web to boot the system.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SKILLS GADGETS --- */}
      <section className={styles.section} id="skills">
        <h2 className="comic-title">🛠️ Web Shooters & Gadgets (Skills)</h2>
        <p className={styles.sectionDesc}>Hover over the tech gadgets to charge up their energy cores.</p>
        
        <div className={styles.skillsGrid}>
          
          {/* HTML */}
          <div className={`${styles.skillCard} comic-panel`} onMouseEnter={() => playSFX("zap")}>
            <div className={styles.skillCardInner}>
              <div className={styles.skillCardFront}>
                <Award size={36} className={styles.gadgetIcon} />
                <h3>HTML 5</h3>
                <span className={styles.skillType}>Structure Web</span>
              </div>
              <div className={styles.skillCardBack}>
                <p>Semantic tags, SEO foundation, structured DOM node trees, microdata formatting.</p>
                <div className={styles.powerBar}><div className={styles.powerFill} style={{ width: "95%" }} /></div>
              </div>
            </div>
          </div>

          {/* CSS */}
          <div className={`${styles.skillCard} comic-panel`} onMouseEnter={() => playSFX("zap")}>
            <div className={styles.skillCardInner}>
              <div className={styles.skillCardFront}>
                <Shield size={36} className={styles.gadgetIcon} />
                <h3>CSS 3</h3>
                <span className={styles.skillType}>Web Shield</span>
              </div>
              <div className={styles.skillCardBack}>
                <p>Flexbox/Grid layout, complex animation keyframes, glassmorphism, responsive designs.</p>
                <div className={styles.powerBar}><div className={styles.powerFill} style={{ width: "90%" }} /></div>
              </div>
            </div>
          </div>

          {/* JS */}
          <div className={`${styles.skillCard} comic-panel`} onMouseEnter={() => playSFX("zap")}>
            <div className={styles.skillCardInner}>
              <div className={styles.skillCardFront}>
                <Zap size={36} className={styles.gadgetIcon} />
                <h3>JavaScript</h3>
                <span className={styles.skillType}>Lightning Core</span>
              </div>
              <div className={styles.skillCardBack}>
                <p>Async operations, ES6+, Web API synthesis, Event loops, Canvas drawings.</p>
                <div className={styles.powerBar}><div className={styles.powerFill} style={{ width: "92%" }} /></div>
              </div>
            </div>
          </div>

          {/* React */}
          <div className={`${styles.skillCard} comic-panel`} onMouseEnter={() => playSFX("zap")}>
            <div className={styles.skillCardInner}>
              <div className={styles.skillCardFront}>
                <RotateCw size={36} className={styles.gadgetIcon} />
                <h3>React / Next</h3>
                <span className={styles.skillType}>Fusion Reactor</span>
              </div>
              <div className={styles.skillCardBack}>
                <p>R3F 3D grids, SSR architecture, custom hooks, dynamic route states.</p>
                <div className={styles.powerBar}><div className={styles.powerFill} style={{ width: "88%" }} /></div>
              </div>
            </div>
          </div>

          {/* Laravel */}
          <div className={`${styles.skillCard} comic-panel`} onMouseEnter={() => playSFX("zap")}>
            <div className={styles.skillCardInner}>
              <div className={styles.skillCardFront}>
                <Cpu size={36} className={styles.gadgetIcon} />
                <h3>Laravel</h3>
                <span className={styles.skillType}>Engine Portal</span>
              </div>
              <div className={styles.skillCardBack}>
                <p>Eloquent ORM, robust API routes, queues, jobs, security protocols.</p>
                <div className={styles.powerBar}><div className={styles.powerFill} style={{ width: "85%" }} /></div>
              </div>
            </div>
          </div>

          {/* Node */}
          <div className={`${styles.skillCard} comic-panel`} onMouseEnter={() => playSFX("zap")}>
            <div className={styles.skillCardInner}>
              <div className={styles.skillCardFront}>
                <Layers size={36} className={styles.gadgetIcon} />
                <h3>NodeJS</h3>
                <span className={styles.skillType}>Electric Cluster</span>
              </div>
              <div className={styles.skillCardBack}>
                <p>WebSockets, high-performance API structures, Express, package networks.</p>
                <div className={styles.powerBar}><div className={styles.powerFill} style={{ width: "86%" }} /></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- EXPERIENCE TIMELINE WEB --- */}
      <section className={styles.section} id="experience">
        <h2 className="comic-title">🕸️ Timeline Web (Experience)</h2>
        <p className={styles.sectionDesc}>Click the web nodes to zip Spider-Man directly to that career milestone.</p>
        
        <div className={styles.experienceWrapper}>
          {/* SVG Web Node Chart */}
          <div className={styles.svgContainer}>
            <svg viewBox="0 0 800 300" className={styles.webSvg}>
              {/* Web Strands radiating from nodes */}
              <line x1="80" y1="80" x2="280" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="280" y1="180" x2="480" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="480" y1="120" x2="680" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              
              {/* Extra spider web structural lines */}
              <path d="M 80 80 Q 200 40, 280 180 M 280 180 Q 380 90, 480 120 M 480 120 Q 580 130, 680 220" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <path d="M 80 80 Q 380 280, 680 220" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.2" />

              {/* Clickable interactive nodes */}
              {TIMELINE_NODES.map((node) => {
                const isActive = activeNodeId === node.id;
                return (
                  <g key={node.id} onClick={() => handleNodeClick(node.id)} className={styles.nodeGroup}>
                    {/* Pulsing glow ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isActive ? "20" : "14"}
                      fill="none"
                      stroke={isActive ? "var(--accent-cyan)" : "rgba(255, 255, 255, 0.3)"}
                      strokeWidth="1.5"
                      className={isActive ? styles.pulseRing : ""}
                    />
                    {/* Core node */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="8"
                      fill={isActive ? "var(--accent-red)" : "#fff"}
                      className={styles.nodeCore}
                    />
                    {/* Year Label */}
                    <text
                      x={node.x}
                      y={node.y - 25}
                      textAnchor="middle"
                      fill={isActive ? "var(--accent-cyan)" : "#8e8e93"}
                      className={styles.nodeText}
                    >
                      {node.date.split(" - ")[0]}
                    </text>
                  </g>
                );
              })}

              {/* Spidey gliding mask indicator */}
              <g
                style={{
                  transform: `translate3d(${activeNode.x}px, ${activeNode.y}px, 0)`,
                  transition: "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
                }}
              >
                <circle cx="0" cy="0" r="14" fill="rgba(255, 42, 42, 0.2)" stroke="var(--accent-red)" strokeWidth="1.5" />
                <path d="M -5 -3 L 5 -3 L 0 5 Z" fill="var(--accent-red)" />
              </g>
            </svg>
          </div>

          {/* Experience Detail Comic Box */}
          <div className={`${styles.nodeDetails} comic-panel`}>
            <div className={styles.detailsHeader}>
              <span className={styles.nodeCategoryIcon}>
                {activeNode.type === "edu" ? <BookOpen size={16} /> : <Briefcase size={16} />}
              </span>
              <h3>{activeNode.title}</h3>
              <span className={styles.nodeDate}>{activeNode.date}</span>
            </div>
            <h4>{activeNode.subtitle}</h4>
            <p className={styles.nodeDesc}>{activeNode.desc}</p>
          </div>

        </div>
      </section>

      {/* --- PROJECTS SKY SCRAPERS --- */}
      <section className={styles.section} id="projects">
        <h2 className="comic-title">🏙️ Skyscrapers (Projects Showcase)</h2>
        <p className={styles.sectionDesc}>Select a building project to inspect inside our monitor terminal.</p>
        
        {/* Buildings Display List */}
        <div className={styles.buildingsGrid}>
          {PROJECTS.map((proj, idx) => {
            const heightClass = idx === 0 ? styles.tall : idx === 1 ? styles.medium : styles.short;
            return (
              <div
                key={proj.id}
                className={`${styles.buildingCard} ${heightClass} comic-panel`}
                onClick={() => openProject(proj)}
              >
                <div className={styles.buildingWindows}>
                  <div className={styles.windowRow} />
                  <div className={styles.windowRow} />
                  <div className={styles.windowRow} />
                  <div className={styles.windowRow} />
                </div>
                <div className={styles.buildingName}>{proj.title}</div>
              </div>
            );
          })}
        </div>

        {/* Retro 3D CRT Monitor Overlay zoom */}
        {zoomedProject && (
          <div className={styles.crtOverlay}>
            <div className={`${styles.crtMonitor} glass-panel`}>
              
              {/* Monitor Frame controls */}
              <div className={styles.crtHeader}>
                <span>CRT SECURITY MONITOR - CAMERA {zoomedProject.id}</span>
                <button className={styles.closeBtn} onClick={closeProject}>✖</button>
              </div>

              {/* Monitor Screen content */}
              <div className={styles.crtScreen}>
                <div className={styles.crtScanlines} />
                <div className={styles.crtContentInner}>
                  
                  <div className={styles.crtGrid}>
                    <div className={styles.crtTerminalCol}>
                      <h3 className={styles.crtProjTitle}>{zoomedProject.title}</h3>
                      <p className={styles.crtProjDesc}>{zoomedProject.desc}</p>
                      
                      <div className={styles.crtMeta}>
                        <p><strong>ROLE:</strong> {zoomedProject.role}</p>
                        <p><strong>KEY STAT:</strong> {zoomedProject.stats}</p>
                      </div>

                      <div className={styles.crtTags}>
                        {zoomedProject.tags.map((tag) => (
                          <span key={tag} className={styles.crtTag}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.crtScreenCol}>
                      <div className={styles.wireframeBox}>
                        <div className={styles.matrixRadar} />
                        <span>[ SECURE APP LINK ENCRYPTED ]</span>
                        <a
                          href={zoomedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.crtLink} comic-panel`}
                          onClick={() => playSFX("zap")}
                        >
                          LAUNCH REPO <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Under Monitor Buttons */}
              <div className={styles.crtFooter}>
                <div className={styles.dialTuner} />
                <div className={styles.powerSwitch} onClick={closeProject} />
              </div>

            </div>
          </div>
        )}
      </section>

      {/* --- CONTACT & FOOTER --- */}
      <section className={styles.contactSection} id="contact">
        <div className={styles.contactContent}>
          <h2 className="comic-title">📩 Alert Web-Net (Contact)</h2>
          <p>
            Got a job proposal, freelance gig, or just want to discuss coding physics? Shoot a message directly.
          </p>

          <div className={styles.contactContainer}>
            {/* Ledge sitting Spider-Man illustration coordinates */}
            <div className={styles.ledgeSpidey}>
              <div className={styles.spideyWave} />
            </div>

            {/* Social Anchors grid */}
            <div className={styles.socialGrid}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialNode} comic-panel`}
                onMouseEnter={() => playSFX("thwip")}
              >
                <Github size={20} /> GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialNode} comic-panel`}
                onMouseEnter={() => playSFX("thwip")}
              >
                <Linkedin size={20} /> LinkedIn
              </a>
              <a
                href="mailto:example@gmail.com"
                className={`${styles.socialNode} comic-panel`}
                onMouseEnter={() => playSFX("thwip")}
              >
                <Mail size={20} /> Email
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialNode} comic-panel`}
                onMouseEnter={() => playSFX("thwip")}
              >
                <Instagram size={20} /> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Footer info & Game high-scores */}
        <footer className={styles.footer}>
          <div className={styles.footerScores}>
            <span>⚡ Game High Scores: </span>
            <span>Goblin: <strong>{scores.goblin}</strong> | </span>
            <span>Catcher: <strong>{scores.catcher}</strong> | </span>
            <span>Venom: <strong>{scores.venom}</strong></span>
          </div>
          <div className={styles.footerCopyright}>
            <p>© {new Date().getFullYear()} Desta Anandhika. Built with Next.js, R3F & Web Audio.</p>
          </div>
        </footer>
      </section>
    </div>
  );
};
export default Sections;
