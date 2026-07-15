"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { soundSynth } from "@/utils/soundSynth";

export type SpideyTheme = "classic" | "miles" | "gwen" | "2099";

interface Scores {
  goblin: number;
  swing: number;
  catcher: number;
  venom: number;
}

interface AppContextProps {
  introActive: boolean;
  setIntroActive: (active: boolean) => void;
  theme: SpideyTheme;
  setTheme: (theme: SpideyTheme) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  activeGame: "goblin" | "swing" | "catcher" | "venom" | null;
  setActiveGame: (game: "goblin" | "swing" | "catcher" | "venom" | null) => void;
  scores: Scores;
  updateScore: (game: keyof Scores, score: number) => void;
  playSFX: (type: "thwip" | "whoosh" | "boom" | "glitch" | "zap") => void;
  isMobile: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [introActive, setIntroActive] = useState<boolean>(true);
  const [theme, setThemeState] = useState<SpideyTheme>("classic");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [volume, setVolumeState] = useState<number>(0.5);
  const [activeGame, setActiveGame] = useState<"goblin" | "swing" | "catcher" | "venom" | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [scores, setScores] = useState<Scores>({
    goblin: 0,
    swing: 0,
    catcher: 0,
    venom: 0,
  });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update sound synth volume
  useEffect(() => {
    soundSynth.setVolume(soundEnabled ? volume : 0);
  }, [soundEnabled, volume]);

  const setTheme = (newTheme: SpideyTheme) => {
    setThemeState(newTheme);
    if (soundEnabled) {
      soundSynth.playGlitch();
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
  };

  const updateScore = (game: keyof Scores, score: number) => {
    setScores((prev) => {
      const nextScores = { ...prev };
      if (score > nextScores[game]) {
        nextScores[game] = score;
      }
      return nextScores;
    });
  };

  const playSFX = (type: "thwip" | "whoosh" | "boom" | "glitch" | "zap") => {
    if (!soundEnabled) return;
    switch (type) {
      case "thwip":
        soundSynth.playThwip();
        break;
      case "whoosh":
        soundSynth.playWhoosh();
        break;
      case "boom":
        soundSynth.playBoom();
        break;
      case "glitch":
        soundSynth.playGlitch();
        break;
      case "zap":
        soundSynth.playZap();
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        introActive,
        setIntroActive,
        theme,
        setTheme,
        soundEnabled,
        setSoundEnabled,
        volume,
        setVolume,
        activeGame,
        setActiveGame,
        scores,
        updateScore,
        playSFX,
        isMobile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
