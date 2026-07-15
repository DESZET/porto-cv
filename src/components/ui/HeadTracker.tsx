"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import styles from "./HeadTracker.module.css";

export const HeadTracker: React.FC = () => {
  const { theme } = useApp();
  const headRef = useRef<HTMLDivElement | null>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const [idleLook, setIdleLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headRef.current) return;

      // Reset idle look timer
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
      setIdleLook({ x: 0, y: 0 });

      const rect = headRef.current.getBoundingClientRect();
      const headCenterX = rect.left + 50; // Approximating head X center in SVG space
      const headCenterY = rect.top + 90;  // Approximating head Y center

      const dx = e.clientX - headCenterX;
      const dy = e.clientY - headCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Eye pupil movement radius in pixels
      const maxOffset = 6;
      const angle = Math.atan2(dy, dx);
      
      const distanceWeight = Math.min(distance / 500, 1.0);
      const moveX = Math.cos(angle) * maxOffset * distanceWeight;
      const moveY = Math.sin(angle) * maxOffset * distanceWeight;

      setEyeOffset({ x: moveX, y: moveY });

      // Trigger idle animation if no movement for 2.5s
      idleTimer.current = setTimeout(triggerIdleGlance, 2500);
    };

    const triggerIdleGlance = () => {
      const randomLookX = (Math.random() - 0.5) * 8;
      const randomLookY = (Math.random() - 0.5) * 4;
      setIdleLook({ x: randomLookX, y: randomLookY });

      idleTimer.current = setTimeout(() => {
        setIdleLook({ x: 0, y: 0 });
        idleTimer.current = setTimeout(triggerIdleGlance, 2000 + Math.random() * 2000);
      }, 1000);
    };

    const handleMouseDown = () => {
      setIsBlinking(true);
    };

    const handleMouseUp = () => {
      setIsBlinking(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    idleTimer.current = setTimeout(triggerIdleGlance, 2000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const getColors = () => {
    switch (theme) {
      case "miles":
        return {
          mask: "#0c0c0f",
          webLines: "#ff003c",
          outerEye: "#ff003c",
          innerEye: "#ffffff",
          hand: "#ff003c",
        };
      case "gwen":
        return {
          mask: "#ffffff",
          webLines: "#ff7ebb",
          outerEye: "#111116",
          innerEye: "#00e5ff",
          hand: "#ff7ebb",
        };
      case "2099":
        return {
          mask: "#001a4e",
          webLines: "#ff0055",
          outerEye: "#00ffff",
          innerEye: "#ff0055",
          hand: "#ff0055",
        };
      default: // classic
        return {
          mask: "#e23636",
          webLines: "#000000",
          outerEye: "#000000",
          innerEye: "#ffffff",
          hand: "#e23636",
        };
    }
  };

  const colors = getColors();
  const finalX = eyeOffset.x + idleLook.x;
  const finalY = eyeOffset.y + idleLook.y;

  return (
    <div ref={headRef} className={styles.headContainer}>
      <svg
        width="130"
        height="180"
        viewBox="0 0 130 180"
        className={styles.headSvg}
      >
        {/* VIEWPORT WALL LINE (Peeking boundary) */}
        <line x1="110" y1="0" x2="110" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />

        {/* CHIBI SPIDEY HEAD (translated to peek from the right) */}
        <g transform="translate(10, 10)">
          {/* Head base path */}
          <path
            d="M 60 20 C 25 20, 10 50, 10 80 C 10 110, 35 130, 60 130 C 85 130, 95 110, 95 80 C 95 50, 85 20, 60 20 Z"
            fill={colors.mask}
            stroke={colors.webLines}
            strokeWidth="2.5"
          />

          {/* Web Lines on Mask */}
          <path
            d="M 60 20 L 60 130 M 10 80 Q 60 80, 95 80 M 20 50 Q 60 62, 90 58 M 20 110 Q 60 98, 90 102
               M 60 20 Q 35 50, 10 80 M 60 20 Q 75 50, 95 80 M 60 130 Q 35 105, 10 80 M 60 130 Q 80 105, 95 80"
            stroke={colors.webLines}
            strokeWidth="0.8"
            fill="none"
            opacity="0.5"
          />

          {/* EYE OUTLINES (BLACK RIMS) */}
          {/* Left Eye Rim */}
          <path
            d="M 18 68 C 16 55, 36 60, 44 80 C 34 83, 20 83, 18 68 Z"
            fill={colors.outerEye}
          />
          {/* Right Eye Rim */}
          <path
            d="M 85 68 C 87 55, 67 60, 59 80 C 69 83, 83 83, 85 68 Z"
            fill={colors.outerEye}
          />

          {/* EYE PUPILS (WHITE INNER GLOW) - Translating with mouse tracking */}
          <g style={{ transform: `translate3d(${finalX}px, ${finalY}px, 0)` }}>
            {/* Left Eye White Inner */}
            <path
              d="M 21 69 C 20 60, 32 63, 39 77 C 31 79, 23 78, 21 69 Z"
              fill={colors.innerEye}
              style={{ transform: isBlinking ? "scaleY(0.1)" : "none", transformOrigin: "30px 73px" }}
              className={styles.pupil}
            />
            {/* Right Eye White Inner */}
            <path
              d="M 82 69 C 83 60, 71 63, 64 77 C 72 79, 80 78, 82 69 Z"
              fill={colors.innerEye}
              style={{ transform: isBlinking ? "scaleY(0.1)" : "none", transformOrigin: "73px 73px" }}
              className={styles.pupil}
            />
          </g>
        </g>

        {/* LITTLE HAND GRASPING THE SCREEN BORDER (x = 110) */}
        <g transform="translate(100, 85)">
          {/* 4 Fingers wrapping around */}
          <circle cx="10" cy="5" r="5.5" fill={colors.hand} stroke={colors.webLines} strokeWidth="1" />
          <circle cx="12" cy="14" r="5.5" fill={colors.hand} stroke={colors.webLines} strokeWidth="1" />
          <circle cx="10" cy="23" r="5.5" fill={colors.hand} stroke={colors.webLines} strokeWidth="1" />
          <circle cx="4" cy="31" r="5" fill={colors.hand} stroke={colors.webLines} strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};
export default HeadTracker;
