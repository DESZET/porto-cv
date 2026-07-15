"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import styles from "./CustomCursor.module.css";

interface WebLine {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  amplitude: number;
  frequency: number;
  progress: number; // 0 to 1
  decay: number;    // speed of progress
  isHold: boolean;
}

interface WebParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
}

export const CustomCursor: React.FC = () => {
  const { playSFX, theme } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [spiderSense, setSpiderSense] = useState(false);
  const [mouseMoved, setMouseMoved] = useState(false);

  const websRef = useRef<WebLine[]>([]);
  const particlesRef = useRef<WebParticle[]>([]);
  const lastWebIdRef = useRef(0);
  const holdWebRef = useRef<WebLine | null>(null);
  const activeKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });
      setMouseMoved(true);

      if (typeof document !== "undefined") {
        document.body.classList.add("custom-cursor-active");
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      // If holding, update the moving end of the web line
      if (holdWebRef.current) {
        holdWebRef.current.endX = clientX;
        holdWebRef.current.endY = clientY;
      }

      // Check if cursor is over a button or anchor to trigger Spider-Sense
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("interactive-node");

        setSpiderSense(!!isInteractive);
      }
    };

    const spawnWebSplats = (x: number, y: number) => {
      // Spawn particles
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1 + Math.random() * 3,
          alpha: 1.0,
          decay: 0.04 + Math.random() * 0.05,
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsPressed(true);
      playSFX("thwip");

      const id = ++lastWebIdRef.current;
      const startX = e.clientX;
      const startY = e.clientY;

      // Spawn click particles
      spawnWebSplats(startX, startY);

      // Create a web that starts from cursor and anchors to the screen
      // We simulate a web shoot by drawing a line that begins at a random building height/offscreen and hits the mouse
      const screenWidth = window.innerWidth;
      const offscreenSourceX = startX + (Math.random() - 0.5) * 200;
      const offscreenSourceY = 0; // Shoots from top or sky

      const newWeb: WebLine = {
        id,
        startX: offscreenSourceX,
        startY: offscreenSourceY,
        endX: startX,
        endY: startY,
        amplitude: 25 + Math.random() * 25,
        frequency: 4 + Math.random() * 4,
        progress: 0,
        decay: 4.5, // Fades quickly
        isHold: false,
      };

      websRef.current.push(newWeb);

      // Initialize hold web
      const holdWeb: WebLine = {
        id: ++lastWebIdRef.current,
        startX, // Anchored to click point
        startY,
        endX: startX, // Moving nozzle
        endY: startY,
        amplitude: 15,
        frequency: 6,
        progress: 0,
        decay: 1.0,
        isHold: true,
      };
      holdWebRef.current = holdWeb;
      websRef.current.push(holdWeb);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
      if (holdWebRef.current) {
        // Convert hold web to decaying web
        holdWebRef.current.isHold = false;
        holdWebRef.current.decay = 6.0; // Decay instantly
        holdWebRef.current = null;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [playSFX]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw web particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        // Gravity & friction
        p.vy += 0.05;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = theme === "miles" ? `rgba(255, 215, 0, ${p.alpha})` : `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw webs
      const webs = websRef.current;
      for (let i = webs.length - 1; i >= 0; i--) {
        const web = webs[i];

        if (!web.isHold) {
          web.progress += 0.016 * web.decay;
        }

        if (web.progress >= 1) {
          webs.splice(i, 1);
          continue;
        }

        // Color styling based on theme
        let webColor = "rgba(255, 255, 255, 0.8)";
        let glowColor = "rgba(255, 255, 255, 0.4)";
        if (theme === "miles") {
          webColor = "rgba(255, 215, 0, 0.9)";
          glowColor = "rgba(255, 0, 60, 0.6)";
        } else if (theme === "gwen") {
          webColor = "rgba(255, 255, 255, 0.95)";
          glowColor = "rgba(255, 126, 187, 0.7)";
        } else if (theme === "2099") {
          webColor = "rgba(0, 255, 255, 0.9)";
          glowColor = "rgba(255, 0, 85, 0.8)";
        }

        const opacity = web.isHold ? 0.95 : 1.0 - web.progress;

        ctx.strokeStyle = webColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;

        ctx.beginPath();

        const dx = web.endX - web.startX;
        const dy = web.endY - web.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Draw wavy elastic line
        const segments = Math.floor(distance / 5);
        if (segments > 1) {
          ctx.moveTo(web.startX, web.startY);
          
          // Wobble decreases over time or is static for hold
          const currentAmp = web.amplitude * (web.isHold ? 0.3 : Math.cos(web.progress * Math.PI * 0.5));
          
          for (let j = 1; j < segments; j++) {
            const t = j / segments;
            // Linear point
            const px = web.startX + dx * t;
            const py = web.startY + dy * t;
            
            // Perpendicular offset for wave
            const nx = -dy / distance;
            const ny = dx / distance;
            
            // Sine oscillation
            const wave = Math.sin(t * Math.PI * web.frequency) * Math.sin(t * Math.PI);
            const offset = wave * currentAmp;
            
            ctx.lineTo(px + nx * offset, py + ny * offset);
          }
          ctx.lineTo(web.endX, web.endY);
        } else {
          ctx.moveTo(web.startX, web.startY);
          ctx.lineTo(web.endX, web.endY);
        }

        ctx.lineWidth = web.isHold ? 2.5 : 1.5 * (1.0 - web.progress);
        ctx.stroke();

        // Extra spider web threads radiating from anchor on long hold
        if (web.isHold && distance > 100) {
          ctx.strokeStyle = theme === "miles" ? "rgba(255, 0, 60, 0.3)" : "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          // Radiating arcs
          const ringCount = 3;
          for (let r = 1; r <= ringCount; r++) {
            const rt = r / (ringCount + 1);
            const cx = web.startX + dx * rt;
            const cy = web.startY + dy * rt;
            const rSize = 10 * r;
            ctx.arc(cx, cy, rSize, 0, Math.PI * 2);
          }
          ctx.stroke();
        }

        ctx.shadowBlur = 0; // Reset shadow
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  // Color mapping for cursor visual elements
  const getThemeColor = () => {
    switch (theme) {
      case "miles":
        return "#ffd700";
      case "gwen":
        return "#ff7ebb";
      case "2099":
        return "#00ffff";
      default:
        return "#ff2a2a";
    }
  };

  const getThemeWebColor = () => {
    switch (theme) {
      case "miles":
        return "#ff003c";
      case "gwen":
        return "#00e5ff";
      case "2099":
        return "#ff0055";
      default:
        return "#0070f3";
    }
  };

  return (
    <>
      {/* Spider-Sense Screen Glow Overlay */}
      {spiderSense && <div className="spider-sense-active" />}

      {/* Web Shooter Drawings Canvas */}
      <canvas ref={canvasRef} className={styles.webCanvas} />

      {/* Cursor Nozzle Reticle */}
      {mouseMoved && (
        <div ref={cursorRef} className={styles.cursorWrapper}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className={`${styles.reticleSvg} ${isPressed ? styles.pressed : ""}`}
          >
            {/* Outer circle */}
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke={getThemeColor()}
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 4"
              className={styles.outerCircle}
            />
            {/* Inner target dot */}
            <circle cx="20" cy="20" r="3" fill={getThemeColor()} />
            
            {/* Crosshairs */}
            <line x1="20" y1="4" x2="20" y2="10" stroke={getThemeColor()} strokeWidth="1.5" />
            <line x1="20" y1="30" x2="20" y2="36" stroke={getThemeColor()} strokeWidth="1.5" />
            <line x1="4" y1="20" x2="10" y2="20" stroke={getThemeColor()} strokeWidth="1.5" />
            <line x1="30" y1="20" x2="36" y2="20" stroke={getThemeColor()} strokeWidth="1.5" />

            {/* Diagonal Web-Shooter Spiders */}
            <path
              d="M 12 12 L 8 8 M 28 12 L 32 8 M 12 28 L 8 32 M 28 28 L 32 32"
              stroke={getThemeWebColor()}
              strokeWidth="1"
            />
          </svg>

          {/* Small Web Nozzle */}
          <div
            className={styles.nozzle}
            style={{ backgroundColor: getThemeColor() }}
          />
        </div>
      )}
    </>
  );
};
export default CustomCursor;
