"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { useApp } from "@/context/AppContext";

export const PhysicsHead: React.FC = () => {
  const { theme, playSFX } = useApp();
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodyRef = useRef<Matter.Body | null>(null);
  const lastScrollY = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. MatterJS Module Setup
    const { Engine, World, Bodies, Body, Composite } = Matter;

    const width = 120;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const engine = Engine.create({
      gravity: { y: 0.8, x: 0 },
    });
    engineRef.current = engine;

    const world = engine.world;

    // 2. Rigid Bodies Creation
    // Floor boundary
    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, {
      isStatic: true,
      friction: 0.1,
      restitution: 0.6,
    });

    // Left and Right tube walls
    const leftWall = Bodies.rectangle(-10, height / 2, 20, height * 2, {
      isStatic: true,
      friction: 0.1,
    });
    const rightWall = Bodies.rectangle(width + 10, height / 2, 20, height * 2, {
      isStatic: true,
      friction: 0.1,
    });

    // Spidey rolling head circle
    const radius = 22;
    const headX = width / 2;
    const headY = 100;
    const head = Bodies.circle(headX, headY, radius, {
      density: 0.001,
      friction: 0.05,
      frictionAir: 0.01,
      restitution: 0.75, // bouncy!
    });
    bodyRef.current = head;

    Composite.add(world, [ground, leftWall, rightWall, head]);

    // 3. custom Canvas Drawing loop
    // (Instead of Matter.Render which can look basic, we draw high-quality Spidey SVG layers onto the canvas)
    let animationId: number;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      Engine.update(engine, 16.666); // Step the engine (~60fps)

      ctx.clearRect(0, 0, width, height);

      // Draw boundaries in debug mode (optional, left hidden for clean look)
      
      // Get head physical coordinates
      const { x, y } = head.position;
      const angle = head.angle;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Theme Colors
      let primaryColor = "#e23636";
      let eyeOutlineColor = "#000000";
      let eyeInnerColor = "#ffffff";
      let webColor = "#000000";

      if (theme === "miles") {
        primaryColor = "#0c0c0f";
        eyeOutlineColor = "#ff003c";
        eyeInnerColor = "#ffffff";
        webColor = "#ff003c";
      } else if (theme === "gwen") {
        primaryColor = "#ffffff";
        eyeOutlineColor = "#111116";
        eyeInnerColor = "#00e5ff";
        webColor = "#ff7ebb";
      } else if (theme === "2099") {
        primaryColor = "#001a4e";
        eyeOutlineColor = "#00ffff";
        eyeInnerColor = "#ff0055";
        webColor = "#ff0055";
      }

      // Draw Head Base
      ctx.fillStyle = primaryColor;
      ctx.strokeStyle = webColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw webbing lines
      ctx.strokeStyle = webColor;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      // Grid lines
      for (let i = 0; i < 4; i++) {
        const radAngle = (i * Math.PI) / 4;
        ctx.moveTo(-Math.cos(radAngle) * radius, -Math.sin(radAngle) * radius);
        ctx.lineTo(Math.cos(radAngle) * radius, Math.sin(radAngle) * radius);
      }
      ctx.stroke();
      
      // Inner concentric web circles
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
      ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Left Eye
      ctx.fillStyle = eyeOutlineColor;
      ctx.beginPath();
      ctx.moveTo(-12, -4);
      ctx.quadraticCurveTo(-4, -10, -2, 0);
      ctx.quadraticCurveTo(-6, 6, -12, -4);
      ctx.fill();

      ctx.fillStyle = eyeInnerColor;
      ctx.beginPath();
      ctx.moveTo(-10, -3);
      ctx.quadraticCurveTo(-5, -7, -3.5, 0);
      ctx.quadraticCurveTo(-6, 4, -10, -3);
      ctx.fill();

      // Draw Right Eye
      ctx.fillStyle = eyeOutlineColor;
      ctx.beginPath();
      ctx.moveTo(12, -4);
      ctx.quadraticCurveTo(4, -10, 2, 0);
      ctx.quadraticCurveTo(6, 6, 12, -4);
      ctx.fill();

      ctx.fillStyle = eyeInnerColor;
      ctx.beginPath();
      ctx.moveTo(10, -3);
      ctx.quadraticCurveTo(5, -7, 3.5, 0);
      ctx.quadraticCurveTo(6, 4, 10, -3);
      ctx.fill();

      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // 4. Scroll linkage: translate scroll speed to angular velocity and force
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY.current;
      lastScrollY.current = currentScroll;

      if (Math.abs(delta) > 1) {
        // Apply torque & force
        Body.setAngularVelocity(head, head.angularVelocity + delta * 0.003);
        // Push slightly sideways or upwards/downwards
        const verticalForce = delta * 0.0003;
        Body.applyForce(head, head.position, {
          x: (Math.random() - 0.5) * 0.0002,
          y: verticalForce,
        });
      }
    };

    // 5. Click to jump
    const handleWindowClick = (e: MouseEvent) => {
      // Find canvas bounds
      const rect = canvas.getBoundingClientRect();
      // Mouse position relative to canvas
      const mouseCanvasX = e.clientX - rect.left;
      const mouseCanvasY = e.clientY - rect.top;

      if (
        mouseCanvasX >= 0 &&
        mouseCanvasX <= width &&
        mouseCanvasY >= 0 &&
        mouseCanvasY <= height
      ) {
        const dx = mouseCanvasX - head.position.x;
        const dy = mouseCanvasY - head.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Clicked inside the rolling head
        if (dist <= radius + 5) {
          playSFX("zap");
          // Apply sudden upward jump impulse
          Body.applyForce(head, head.position, {
            x: (Math.random() - 0.5) * 0.02,
            y: -0.045, // Jump up
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousedown", handleWindowClick);

    const handleResize = () => {
      canvas.height = window.innerHeight;
      Body.setPosition(ground, { x: width / 2, y: window.innerHeight + 30 });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleWindowClick);
      window.removeEventListener("resize", handleResize);
      World.clear(world, false);
      Engine.clear(engine);
    };
  }, [mounted, theme, playSFX]);

  if (!mounted) return null;

  return (
    <div
      ref={sceneRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "120px",
        height: "100vh",
        zIndex: 99, // Floating on side, below custom cursor but above content
        pointerEvents: "none", // Allow clicks to pass through
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          pointerEvents: "auto", // Captures clicks specifically on its area
        }}
      />
    </div>
  );
};
export default PhysicsHead;
