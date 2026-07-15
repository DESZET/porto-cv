"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import styles from "./Intro.module.css";

const MENU_ITEMS = [
  { id: "start", label: "START GAME", icon: "▶", desc: "Enter the Spider-Verse portfolio" },
  { id: "projects", label: "PROJECTS", icon: "◆", desc: "View web development missions" },
  { id: "about", label: "ABOUT ME", icon: "★", desc: "Spidey's backpack & origin story" },
  { id: "skills", label: "SKILLS", icon: "⚡", desc: "Spider powers & tech abilities" },
  { id: "contact", label: "CONTACT", icon: "✉", desc: "Send a web-message" },
];

export const Intro: React.FC = () => {
  const { introActive, setIntroActive, playSFX, theme } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [particles, setParticles] = useState<Array<{x: number; y: number; delay: number; size: number}>>([]);

  // Generate floating particles on mount
  useEffect(() => {
    const pts = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: 2 + Math.random() * 4,
    }));
    setParticles(pts);
  }, []);

  useEffect(() => {
    if (!introActive) return;

    const timer1 = setTimeout(() => {
      setShowTitle(true);
    }, 400);

    const timer2 = setTimeout(() => {
      setShowHero(true);
    }, 800);

    const timer3 = setTimeout(() => {
      playSFX("thwip");
      setShowMenu(true);
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [introActive, playSFX]);

  // Keyboard navigation for game-like feel
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!introActive || !showMenu || isEntering) return;

    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      e.preventDefault();
      playSFX("thwip");
      setSelectedIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
    } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      e.preventDefault();
      playSFX("thwip");
      setSelectedIndex((prev) => (prev + 1) % MENU_ITEMS.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMenuClick(MENU_ITEMS[selectedIndex].id);
    }
  }, [introActive, showMenu, isEntering, selectedIndex, playSFX]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleMenuClick = (id: string) => {
    playSFX("whoosh");
    setIsEntering(true);

    setTimeout(() => {
      setIntroActive(false);
      // Scroll to section if not "start"
      if (id !== "start") {
        setTimeout(() => {
          const section = document.getElementById(id);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 200);
      }
    }, 1200);
  };

  const getThemeAccent = () => {
    switch (theme) {
      case "miles": return "#ff003c";
      case "gwen": return "#ff7ebb";
      case "2099": return "#00ffff";
      default: return "#ff2a2a";
    }
  };

  if (!introActive) return null;

  const accent = getThemeAccent();

  return (
    <div className={`${styles.introOverlay} ${isEntering ? styles.fadeAway : ""}`}>
      {/* Spider-Man Swing Animation - runs across top of screen */}
      <div className={styles.swingScene}>
        <div className={styles.swingContainer}>
          <div className={styles.swingPendulum}>
            <div className={styles.swingWebTrail} />
            <img
              src="/spiderman-wing.png"
              alt="Spider-Man Swinging"
              className={styles.swingSpiderman}
              draggable={false}
            />
          </div>
        </div>
      </div>
      {/* Animated web background lines */}
      <div className={styles.webBg}>
        <svg viewBox="0 0 1920 1080" className={styles.webBgSvg} preserveAspectRatio="xMidYMid slice">
          {/* Radial web from bottom-right corner */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const endX = 1500 + Math.cos(angle) * 2000;
            const endY = 800 + Math.sin(angle) * 2000;
            return (
              <line
                key={`strand-${i}`}
                x1="1500"
                y1="800"
                x2={endX}
                y2={endY}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}
          {/* Concentric arcs */}
          {[200, 400, 600, 900, 1200].map((r, i) => (
            <circle
              key={`ring-${i}`}
              cx="1500"
              cy="800"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Floating particles */}
      <div className={styles.particlesContainer}>
        {particles.map((p, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              background: accent,
            }}
          />
        ))}
      </div>

      {/* Vignette overlay */}
      <div className={styles.vignette} />

      {/* Main content split layout */}
      <div className={styles.splitLayout}>
        
        {/* LEFT SIDE - Menu */}
        <div className={`${styles.menuSide} ${showMenu ? styles.menuVisible : ""}`}>
          
          {/* Game Title */}
          <div className={`${styles.titleBlock} ${showTitle ? styles.titleVisible : ""}`}>
            <div className={styles.titleSub}>DESTA ANANDHIKA</div>
            <h1 className={styles.titleMain}>
              <span className={styles.titleSpider}>SPIDER</span>
              <span className={styles.titleDash}>—</span>
              <span className={styles.titlePortfolio}>PORTFOLIO</span>
            </h1>
            <div className={styles.titleTagline}>
              FULL STACK DEVELOPER // CREATIVE WEB ARCHITECT
            </div>
          </div>

          {/* Menu Items */}
          <nav className={styles.menuNav}>
            {MENU_ITEMS.map((item, index) => (
              <button
                key={item.id}
                className={`${styles.menuItem} ${
                  selectedIndex === index ? styles.menuItemActive : ""
                } ${hoveredIndex === index ? styles.menuItemHover : ""}`}
                onClick={() => handleMenuClick(item.id)}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setSelectedIndex(index);
                  playSFX("thwip");
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  animationDelay: `${1.6 + index * 0.12}s`,
                  ...(selectedIndex === index ? { '--accent': accent } as React.CSSProperties : {}),
                }}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
                {selectedIndex === index && (
                  <span className={styles.menuDesc}>{item.desc}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Controls Hint */}
          <div className={`${styles.controlsHint} ${showMenu ? styles.hintVisible : ""}`}>
            <span className={styles.hintKey}>↑↓</span> Navigate
            <span className={styles.hintSeparator}>|</span>
            <span className={styles.hintKey}>Enter</span> Select
            <span className={styles.hintSeparator}>|</span>
            <span className={styles.hintKey}>Click</span> Choose
          </div>
        </div>

        {/* RIGHT SIDE - Spider-Man Hero Image */}
        <div className={`${styles.heroSide} ${showHero ? styles.heroVisible : ""}`}>
          <div className={styles.heroImageWrapper}>
            {/* Glow behind character */}
            <div className={styles.heroGlow} style={{ background: `radial-gradient(circle, ${accent}40 0%, transparent 70%)` }} />
            
            {/* Spider-Man Image */}
            <img
              src="/spiderman-hero.png"
              alt="Spider-Man Hero"
              className={styles.heroImage}
              draggable={false}
            />

            {/* Spider logo watermark */}
            <div className={styles.spiderLogo}>
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 30 C95 50,98 70,100 85 C102 70,105 50,100 30 M100 85 C90 85,78 95,78 115 C78 135,90 145,100 145 C110 145,122 135,122 115 C122 95,110 85,100 85 M78 95 C60 80,30 90,20 65 M122 95 C140 80,170 90,180 65 M78 115 C50 112,24 135,10 120 M122 115 C150 112,176 135,190 120 M78 135 C55 155,30 175,25 190 M122 135 C145 155,170 175,175 190"
                  stroke={accent}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.15"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Version / Copyright */}
      <div className={`${styles.versionTag} ${showMenu ? styles.versionVisible : ""}`}>
        v2.0 — © {new Date().getFullYear()} Desta Anandhika
      </div>

      {/* Portal transition effect */}
      {isEntering && (
        <div className={styles.portalSpinner}>
          <div className={styles.vortex} style={{ background: `radial-gradient(circle, ${accent}cc 0%, ${accent}66 40%, transparent 70%)` }} />
        </div>
      )}
    </div>
  );
};

export default Intro;
