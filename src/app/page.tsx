"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { CityBackground } from "@/components/3d/CityBackground";
import { HeadTracker } from "@/components/ui/HeadTracker";
import { PhysicsHead } from "@/components/ui/PhysicsHead";
import { Sections } from "@/components/ui/Sections";
import { GameHub } from "@/components/games/GameHub";
import { Intro } from "@/components/ui/Intro";
import { useKonamiCode } from "@/hooks/useKonamiCode";

function PageOrchestrator() {
  // Activate keyboard easter egg sequence listener
  useKonamiCode();
  const { theme, introActive } = useApp();

  return (
    <div data-theme={theme} className="app-wrapper">
      {/* Cinematic Intro (plays first) */}
      <Intro />

      {/* Renders main components after intro loading */}
      {!introActive && (
        <>
          {/* 3D WebGL Background City */}
          <CityBackground />

          {/* Comic Book Cell Grid Overlay & Giant Spider Watermark */}
          <div className="comic-grid-overlay">
            <svg width="100%" height="100%" fill="none" className="comic-grid-svg">
              {/* Radiating spiderweb strands - 16 directions for dense web */}
              <line x1="50%" y1="50%" x2="100%" y2="50%" />
              <line x1="50%" y1="50%" x2="0%" y2="50%" />
              <line x1="50%" y1="50%" x2="50%" y2="100%" />
              <line x1="50%" y1="50%" x2="50%" y2="0%" />
              <line x1="50%" y1="50%" x2="100%" y2="100%" />
              <line x1="50%" y1="50%" x2="0%" y2="0%" />
              <line x1="50%" y1="50%" x2="100%" y2="0%" />
              <line x1="50%" y1="50%" x2="0%" y2="100%" />
              <line x1="50%" y1="50%" x2="75%" y2="3%" />
              <line x1="50%" y1="50%" x2="25%" y2="97%" />
              <line x1="50%" y1="50%" x2="25%" y2="3%" />
              <line x1="50%" y1="50%" x2="75%" y2="97%" />
              <line x1="50%" y1="50%" x2="97%" y2="25%" />
              <line x1="50%" y1="50%" x2="3%" y2="75%" />
              <line x1="50%" y1="50%" x2="97%" y2="75%" />
              <line x1="50%" y1="50%" x2="3%" y2="25%" />

              {/* Concentric spiderweb rings - 8 rings for denser web pattern */}
              <circle cx="50%" cy="50%" r="5%" />
              <circle cx="50%" cy="50%" r="10%" />
              <circle cx="50%" cy="50%" r="17%" />
              <circle cx="50%" cy="50%" r="25%" />
              <circle cx="50%" cy="50%" r="34%" />
              <circle cx="50%" cy="50%" r="44%" />
              <circle cx="50%" cy="50%" r="56%" />
              <circle cx="50%" cy="50%" r="70%" />
            </svg>
            <div className="comic-grid-spider" />
          </div>

          {/* Left-Border MatterJS physics ball */}
          <PhysicsHead />

          {/* Corner Eye Tracker Spidey Mask */}
          <HeadTracker />

          {/* Main Portfolio Sections */}
          <Sections />

          {/* Interactive Arcade Mini-Game Overlay */}
          <GameHub />
        </>
      )}

      {/* Web-Shooter Cursor Lines (Always Active) */}
      <CustomCursor />

      <style jsx global>{`
        /* Sync background transitions for themes */
        /* Sync background transitions for themes */
        .app-wrapper {
          min-height: 100vh;
          width: 100%;
          position: relative;
          background-image: url('/background spider .jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          background-repeat: no-repeat;
          transition: background 0.4s ease;
        }

        .app-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(226, 54, 54, 0.4) 0%, rgba(10, 5, 5, 0.8) 100%);
          pointer-events: none;
          z-index: 0;
        }

        
        /* Remove the old SVG web background from globals.css logic by replacing it here */
        .web-background {
          display: none;
        }

        .comic-grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          color: var(--accent-red);
          background: radial-gradient(circle at 50% 50%, rgba(226, 54, 54, 0.2) 0%, transparent 70%);
          transition: color 0.4s ease;
        }

        .comic-grid-svg {
          width: 100vw;
          height: 100vh;
        }

        /* Web lines - much more visible for Spider-Man aesthetic */
        .comic-grid-svg line {
          stroke: rgba(20, 0, 0, 0.35) !important;
          stroke-width: 1.2 !important;
        }

        .comic-grid-svg circle {
          stroke: rgba(20, 0, 0, 0.28) !important;
          stroke-width: 1 !important;
        }

        /* Giant Spider Logo watermark - bigger & more visible */
        .comic-grid-spider {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          opacity: 0.12;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none'%3E%3Cpath d='M100 30 C95 50,98 70,100 85 C102 70,105 50,100 30 M100 85 C90 85,78 95,78 115 C78 135,90 145,100 145 C110 145,122 135,122 115 C122 95,110 85,100 85 M78 95 C60 80,30 90,20 65 M122 95 C140 80,170 90,180 65 M78 115 C50 112,24 135,10 120 M122 115 C150 112,176 135,190 120 M78 135 C55 155,30 175,25 190 M122 135 C145 155,170 175,175 190 M78 100 C55 92,25 105,8 85 M122 100 C145 92,175 105,192 85' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat center;
          background-size: contain;
          animation: slow-pulse 10s ease-in-out infinite alternate;
        }

        @keyframes slow-pulse {
          0% {
            opacity: 0.06;
            transform: translate(-50%, -50%) scale(0.96);
          }
          100% {
            opacity: 0.12;
            transform: translate(-50%, -50%) scale(1.04);
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return <PageOrchestrator />;
}
