"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { X, Award, Heart, RefreshCw } from "lucide-react";
import styles from "./GameHub.module.css";

interface Sprite {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  speed: number;
  type: string;
}

export const GameHub: React.FC = () => {
  const { activeGame, setActiveGame, playSFX, scores, updateScore } = useApp();
  const [currentScore, setCurrentScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Venom Boss Fight states
  const [venomHp, setVenomHp] = useState(100);
  const [venomTimeLeft, setVenomTimeLeft] = useState(10);
  const [bossShake, setBossShake] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // Game sprites refs
  const spritesRef = useRef<Sprite[]>([]);
  const lastSpriteId = useRef(0);
  const basketX = useRef(200);

  const cleanGameStates = () => {
    setCurrentScore(0);
    setLives(3);
    setGameOver(false);
    setGameStarted(false);
    spritesRef.current = [];
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  const handleGameSelect = (game: "goblin" | "catcher" | "venom") => {
    playSFX("whoosh");
    setActiveGame(game);
    cleanGameStates();
  };

  const startGame = () => {
    playSFX("boom");
    setGameStarted(true);
    setGameOver(false);
    setCurrentScore(0);
    setLives(3);

    if (activeGame === "goblin") {
      spritesRef.current = [];
      spawnGoblin();
    } else if (activeGame === "catcher") {
      spritesRef.current = [];
      // Spawn initial falling skills
      for (let i = 0; i < 4; i++) {
        spawnSkill();
      }
    } else if (activeGame === "venom") {
      setVenomHp(100);
      setVenomTimeLeft(10);
    }
  };

  // --- GOBLIN HUNT SPAWN ---
  const spawnGoblin = () => {
    const id = ++lastSpriteId.current;
    spritesRef.current.push({
      id,
      x: -50,
      y: 80 + Math.random() * 150,
      vx: 2.5 + Math.random() * 3,
      vy: 0,
      size: 45,
      speed: 0.05 + Math.random() * 0.05,
      type: "goblin",
    });
  };

  // --- SKILL CATCHER SPAWN ---
  const spawnSkill = () => {
    const id = ++lastSpriteId.current;
    const skillTypes = ["HTML", "CSS", "JS", "React", "Node", "Laravel"];
    const randomSkill = skillTypes[Math.floor(Math.random() * skillTypes.length)];
    spritesRef.current.push({
      id,
      x: 30 + Math.random() * 340,
      y: -30,
      vx: 0,
      vy: 1.5 + Math.random() * 2.5,
      size: 40,
      speed: 0,
      type: randomSkill,
    });
  };

  // --- VENOM BOSS TIMER LOOP ---
  useEffect(() => {
    if (activeGame !== "venom" || !gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setVenomTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          playSFX("boom");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeGame, gameStarted, gameOver, playSFX]);

  // --- DEDICATED SCORE SYNC TO APP CONTEXT ---
  useEffect(() => {
    if (activeGame && gameStarted) {
      updateScore(activeGame as keyof typeof scores, currentScore);
    }
  }, [currentScore, activeGame, gameStarted, updateScore, scores]);

  // --- VENOM TAP ATTACK ---
  const attackVenom = () => {
    if (gameOver || !gameStarted) return;
    playSFX("thwip");
    setBossShake(true);
    setTimeout(() => setBossShake(false), 100);

    setVenomHp((prev) => {
      const nextHp = prev - 4;
      if (nextHp <= 0) {
        // Victory!
        playSFX("boom");
        const finalScore = venomTimeLeft * 150 + 500;
        setCurrentScore(finalScore);
        setGameOver(true);
        return 0;
      }
      return nextHp;
    });
  };

  // --- CANVAS GAME LOOP ORCHESTRATION ---
  useEffect(() => {
    if (!activeGame || !gameStarted || gameOver || activeGame === "venom") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 400);
    const height = (canvas.height = 450);

    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      basketX.current = e.clientX - rect.left;
    };
    canvas.addEventListener("mousemove", handleCanvasMouseMove);

    const runLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // --- 1. GOBLIN HUNT LOOP ---
      if (activeGame === "goblin") {
        const sprites = spritesRef.current;

        // Periodic spawns
        if (sprites.length < 2 && Math.random() > 0.98) {
          spawnGoblin();
        }

        for (let i = sprites.length - 1; i >= 0; i--) {
          const s = sprites[i];
          s.x += s.vx;
          // Flying sine wave paths
          s.y += Math.sin(s.x * s.speed) * 3;

          if (s.x > width + 50) {
            // Escaped! Deduct life
            playSFX("glitch");
            setLives((prev) => {
              const next = prev - 1;
              if (next <= 0) {
                setGameOver(true);
              }
              return next;
            });
            sprites.splice(i, 1);
            continue;
          }

          // Draw Goblin sprite (retro pumpkin bomb comic vector)
          ctx.fillStyle = "#8a2be2"; // Purple cloak
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size / 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#32cd32"; // Green face
          ctx.beginPath();
          ctx.arc(s.x, s.y - 4, s.size * 0.35, 0, Math.PI * 2);
          ctx.fill();

          // Pumpkin eyes
          ctx.fillStyle = "#ff8c00";
          ctx.beginPath();
          ctx.moveTo(s.x - 8, s.y - 6);
          ctx.lineTo(s.x - 3, s.y - 10);
          ctx.lineTo(s.x - 2, s.y - 6);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(s.x + 8, s.y - 6);
          ctx.lineTo(s.x + 3, s.y - 10);
          ctx.lineTo(s.x + 2, s.y - 6);
          ctx.closePath();
          ctx.fill();
        }
      }

      // --- 2. SKILL CATCHER LOOP ---
      if (activeGame === "catcher") {
        const sprites = spritesRef.current;

        // Draw Basket
        const bx = Math.max(40, Math.min(width - 40, basketX.current));
        ctx.fillStyle = "rgba(0, 240, 255, 0.4)";
        ctx.strokeStyle = "var(--accent-cyan)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Basket bowl shape
        ctx.arc(bx, height - 25, 30, 0, Math.PI, false);
        ctx.fill();
        ctx.stroke();
        
        // Draw grid net pattern
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx - 30, height - 25);
        ctx.lineTo(bx + 30, height - 25);
        ctx.stroke();

        for (let i = sprites.length - 1; i >= 0; i--) {
          const s = sprites[i];
          s.y += s.vy;

          if (s.y > height + 20) {
            // Dropped! Deduct life
            playSFX("glitch");
            setLives((prev) => {
              const next = prev - 1;
              if (next <= 0) {
                setGameOver(true);
              }
              return next;
            });
            sprites.splice(i, 1);
            spawnSkill();
            continue;
          }

          // Check intersection with basket bowl
          const basketDistY = Math.abs(s.y - (height - 25));
          const basketDistX = Math.abs(s.x - bx);
          
          if (basketDistY < 18 && basketDistX < 32) {
            // Caught! Score increment
            playSFX("zap");
            setCurrentScore((prev) => prev + 10);
            sprites.splice(i, 1);
            spawnSkill();
            continue;
          }

          // Draw skill badge capsule
          ctx.fillStyle = "rgba(2, 5, 12, 0.8)";
          ctx.strokeStyle = "var(--accent-red)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(s.x - 24, s.y - 12, 48, 24, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(s.type, s.x, s.y + 4);
        }
      }

      gameLoopRef.current = requestAnimationFrame(runLoop);
    };

    runLoop();

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      canvas.removeEventListener("mousemove", handleCanvasMouseMove);
    };
  }, [activeGame, gameStarted, gameOver, currentScore]);

  // Click on goblin shoot handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeGame !== "goblin" || gameOver || !gameStarted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const sprites = spritesRef.current;
    for (let i = sprites.length - 1; i >= 0; i--) {
      const s = sprites[i];
      const dx = clickX - s.x;
      const dy = clickY - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < s.size / 2 + 10) {
        // Goblin Shot!
        playSFX("thwip");
        sprites.splice(i, 1);
        
        setCurrentScore((prev) => prev + 25);

        // Spawn a replacement goblin
        spawnGoblin();
        break;
      }
    }
  };

  if (!activeGame) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.dashboard} glass-panel`}>
        
        {/* Game Header tabs and exit */}
        <div className={styles.header}>
          <h2 className="comic-title">🎮 Arcade Spider-Mode</h2>
          <button className={styles.exitBtn} onClick={() => setActiveGame(null)} title="Close Arcade">
            <X size={20} />
          </button>
        </div>

        {/* Game Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeGame === "goblin" ? styles.tabActive : ""}`} onClick={() => handleGameSelect("goblin")}>
            Goblin Hunt
          </button>
          <button className={`${styles.tab} ${activeGame === "catcher" ? styles.tabActive : ""}`} onClick={() => handleGameSelect("catcher")}>
            Skill Catcher
          </button>
          <button className={`${styles.tab} ${activeGame === "venom" ? styles.tabActive : ""}`} onClick={() => handleGameSelect("venom")}>
            Venom Boss Fight
          </button>
        </div>

        {/* Main Game Screen */}
        <div className={styles.screenWrapper}>
          
          {/* Status Bar */}
          {gameStarted && !gameOver && (
            <div className={styles.statusBar}>
              <div className={styles.scoreBadge}>
                <Award size={16} /> SCORE: <strong>{currentScore}</strong>
              </div>

              {activeGame !== "venom" ? (
                <div className={styles.lives}>
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      size={16}
                      fill={i < lives ? "var(--accent-red)" : "none"}
                      stroke="var(--accent-red)"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.timerBadge}>
                  ⏳ TIME REMAINING: <strong>{venomTimeLeft}s</strong>
                </div>
              )}
            </div>
          )}

          {/* Lobby Screen */}
          {!gameStarted && (
            <div className={styles.lobby}>
              <h3>
                {activeGame === "goblin" && "🟢 Green Goblin Shooter"}
                {activeGame === "catcher" && "🔵 Skill Badge Catcher"}
                {activeGame === "venom" && "🔴 Venom Boss tap Battle"}
              </h3>
              <p className={styles.lobbyDesc}>
                {activeGame === "goblin" && "Goblins fly across the screen. Tap them to shoot webs. Don't let them escape!"}
                {activeGame === "catcher" && "Falling technology badges. Move the cursor left-right to catch them in the web container!"}
                {activeGame === "venom" && "Click or tap Venom rapidly to tie him up in webs before the timer runs out!"}
              </p>
              
              <div className={styles.highScore}>
                Record: <strong>{scores[activeGame as keyof typeof scores] || 0}</strong>
              </div>

              <button className={`${styles.startBtn} comic-panel`} onClick={startGame}>
                START SIMULATION
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className={styles.gameOver}>
              <h3>{venomHp <= 0 && activeGame === "venom" ? "🏆 MISSION ACCOMPLISHED!" : "💀 SIMULATION OVER"}</h3>
              <p>
                {venomHp <= 0 && activeGame === "venom"
                  ? `You bound Venom in ${10 - venomTimeLeft} seconds!`
                  : "Spider-Man collapsed. Webs depleted."}
              </p>
              <div className={styles.finalScore}>
                FINAL SCORE: <strong>{currentScore}</strong>
              </div>
              <button className={`${styles.restartBtn} comic-panel`} onClick={startGame}>
                <RefreshCw size={14} /> TRY AGAIN
              </button>
            </div>
          )}

          {/* HTML5 canvas wrapper for arcade */}
          {gameStarted && !gameOver && activeGame !== "venom" && (
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className={styles.canvas}
            />
          )}

          {/* DOM Tap Layout specifically for Venom */}
          {gameStarted && !gameOver && activeGame === "venom" && (
            <div className={styles.venomRoom}>
              <div className={styles.bossHP}>
                <span>VENOM HP: {venomHp}%</span>
                <div className={styles.hpBar}>
                  <div className={styles.hpFill} style={{ width: `${venomHp}%` }} />
                </div>
              </div>
              
              <div
                className={`${styles.venomAvatar} ${bossShake ? styles.shake : ""}`}
                onClick={attackVenom}
              >
                <div className={styles.venomTeeth} />
              </div>
              <span className={styles.tapInstruction}>TAP VENOM RAPIDLY TO SHOOT WEBS!</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
export default GameHub;
