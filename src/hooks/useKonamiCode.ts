"use client";

import { useEffect, useRef } from "react";
import { useApp, SpideyTheme } from "@/context/AppContext";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export const useKonamiCode = () => {
  const { theme, setTheme, playSFX } = useApp();
  const inputSequence = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Keep track of the last N keys typed
      inputSequence.current.push(e.key);
      if (inputSequence.current.length > KONAMI_CODE.length) {
        inputSequence.current.shift();
      }

      // Check if matches Konami Code
      const matches = KONAMI_CODE.every(
        (key, index) => key.toLowerCase() === inputSequence.current[index]?.toLowerCase()
      );

      if (matches) {
        // Trigger easter egg!
        playSFX("glitch");
        
        // Pick a random alternative theme
        const themes: SpideyTheme[] = ["classic", "miles", "gwen", "2099"];
        const remaining = themes.filter((t) => t !== theme);
        const randomTheme = remaining[Math.floor(Math.random() * remaining.length)];
        
        setTheme(randomTheme);
        inputSequence.current = []; // Reset sequence

        // Show brief screen alert
        if (typeof document !== "undefined") {
          const glitchOverlay = document.createElement("div");
          glitchOverlay.style.position = "fixed";
          glitchOverlay.style.inset = "0";
          glitchOverlay.style.background = "rgba(255, 255, 255, 0.15)";
          glitchOverlay.style.backdropFilter = "blur(4px)";
          glitchOverlay.style.zIndex = "99999";
          glitchOverlay.style.display = "flex";
          glitchOverlay.style.alignItems = "center";
          glitchOverlay.style.justifyContent = "center";
          glitchOverlay.style.fontFamily = "var(--font-header), cursive";
          glitchOverlay.style.fontSize = "4rem";
          glitchOverlay.style.color = "var(--accent-red)";
          glitchOverlay.style.textShadow = "4px 4px 0px #000";
          glitchOverlay.style.webkitTextStroke = "2px #000";
          glitchOverlay.innerHTML = "MULTIVERSE COLLAPSE DETECTED!";
          
          document.body.appendChild(glitchOverlay);

          setTimeout(() => {
            document.body.removeChild(glitchOverlay);
          }, 1200);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, setTheme, playSFX]);
};
export default useKonamiCode;
