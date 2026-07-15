"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useApp } from "@/context/AppContext";

// 1. Procedural Building Canvas Texture Generator
const makeBuildingTexture = (theme: string) => {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Base building color
  ctx.fillStyle = "#1a0808";
  ctx.fillRect(0, 0, 128, 256);

  // Set window colors based on theme
  let lightColor = "#fffbde";
  let darkColor = "#111625";
  if (theme === "miles") {
    lightColor = "#ffd700";
    darkColor = "#18080f";
  } else if (theme === "gwen") {
    lightColor = "#a5f3fc";
    darkColor = "#170f20";
  } else if (theme === "2099") {
    lightColor = "#00f0ff";
    darkColor = "#08041a";
  }

  // Draw window grid
  for (let y = 8; y < 248; y += 14) {
    for (let x = 8; x < 120; x += 12) {
      const active = Math.random() > 0.4;
      ctx.fillStyle = active ? lightColor : darkColor;
      ctx.fillRect(x, y, 6, 8);
      
      // Neon glow bleed (simulated)
      if (active && (theme === "2099" || theme === "miles")) {
        ctx.fillStyle = theme === "2099" ? "rgba(255, 0, 85, 0.3)" : "rgba(255, 42, 42, 0.2)";
        ctx.fillRect(x - 2, y - 2, 10, 12);
      }
    }
  }

  return new THREE.CanvasTexture(canvas);
};

// 2. Helicopter Element
const Helicopter: React.FC = () => {
  const meshRef = useRef<THREE.Group | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Circular path
    const r = 25;
    meshRef.current.position.x = Math.cos(t * 0.2) * r;
    meshRef.current.position.z = Math.sin(t * 0.2) * r - 20;
    meshRef.current.position.y = 8 + Math.sin(t * 1.5) * 1.5;

    // Point forward along path
    meshRef.current.rotation.y = -t * 0.2 + Math.PI / 2;
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.8, 0.4, 1.2]} />
        <meshBasicMaterial color="#1a1c23" />
      </mesh>
      {/* Searchlight cone */}
      <mesh position={[0, -1, 0.5]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[1, 3, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Blinking red signal light */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
};

// 3. Traffic / Car Light Trails
const CarTraffic: React.FC<{ count: number; theme: string }> = ({ count, theme }) => {
  const points = useMemo(() => {
    const list = [];
    const colorA = theme === "miles" ? "#ff003c" : theme === "2099" ? "#ff0055" : "#ff3333";
    const colorB = theme === "gwen" ? "#00ffff" : theme === "2099" ? "#00ffff" : "#ffffaa";

    for (let i = 0; i < count; i++) {
      // Choose a street coordinate (streets lie in valleys between skyscrapers)
      const isEastWest = Math.random() > 0.5;
      const streetOffset = (Math.floor(Math.random() * 5) - 2) * 12 + 6;
      const speed = 2 + Math.random() * 5;
      
      list.push({
        isEastWest,
        offset: streetOffset,
        speed,
        progress: Math.random() * 100,
        color: Math.random() > 0.5 ? colorA : colorB,
        y: -14.8, // Street level
      });
    }
    return list;
  }, [count, theme]);

  const meshesRef = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    if (!meshesRef.current) return;
    const children = meshesRef.current.children;
    points.forEach((item, i) => {
      const child = children[i] as THREE.Mesh;
      if (!child) return;
      
      item.progress += delta * item.speed;
      if (item.progress > 60) {
        item.progress = -60;
      }
      
      if (item.isEastWest) {
        child.position.set(item.progress, item.y, item.offset);
      } else {
        child.position.set(item.offset, item.y, item.progress);
      }
    });
  });

  return (
    <group ref={meshesRef}>
      {points.map((pt, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.2, 0.1, 0.4]} />
          <meshBasicMaterial color={pt.color} />
        </mesh>
      ))}
    </group>
  );
};

// 4. Fog / Particle Mist
const CityFog: React.FC = () => {
  const count = 40;
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 80,
        y: -15 + Math.random() * 12,
        z: (Math.random() - 0.5) * 80 - 10,
        scale: 2 + Math.random() * 4,
        speed: 0.1 + Math.random() * 0.3,
        amplitude: 0.2 + Math.random() * 0.4,
      });
    }
    return arr;
  }, []);

  const groupRef = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      // Slowly float upwards
      child.position.y += delta * p.speed;
      child.position.x += Math.sin(t * 0.5 + p.y) * 0.01;
      
      if (child.position.y > 10) {
        child.position.y = -15;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.scale, 8, 8]} />
          <meshBasicMaterial
            color="#1a0505"
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

// 5. Procedural City Mesh Assembly
const CityGrid: React.FC<{ theme: string }> = ({ theme }) => {
  const grid = useMemo(() => {
    const list = [];
    const spacing = 12;
    const size = 6; // Grid dimensions (6x6 skyscrapers)

    const texture = makeBuildingTexture(theme);
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    }

    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        // Skip streets or center plaza
        if (x % 2 === 0 && z % 2 === 0) continue;
        if (Math.abs(x) < 1 && Math.abs(z) < 1) continue; // Keep core center free for main views

        const posX = x * spacing + (Math.random() - 0.5) * 2;
        const posZ = z * spacing + (Math.random() - 0.5) * 2 - 10;
        const width = 4 + Math.random() * 4;
        const height = 10 + Math.random() * 25; // Random tower heights
        const depth = 4 + Math.random() * 4;

        list.push({
          x: posX,
          z: posZ,
          h: height,
          w: width,
          d: depth,
        });
      }
    }
    return { list, material };
  }, [theme]);

  return (
    <group>
      {grid.list.map((b, i) => (
        <mesh key={i} position={[b.x, -15 + b.h / 2, b.z]} material={grid.material}>
          <boxGeometry args={[b.w, b.h, b.d]} />
        </mesh>
      ))}
    </group>
  );
};

// 6. Camera Controller linking Scroll & Cursor Mouse Movement
const CameraController: React.FC = () => {
  const { isMobile } = useApp();
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useFrame((state, delta) => {
    // 1. Scroll-linked height path
    // Scroll height shifts camera from y=10 (top) down to y=-10 (street/office)
    const maxScroll = typeof document !== "undefined" ? document.body.scrollHeight - window.innerHeight : 1000;
    const scrollPercent = maxScroll > 0 ? scrollY.current / maxScroll : 0;

    // Dynamic Camera Path
    const targetY = 10 - scrollPercent * 20; // drop downwards
    const targetZ = 18 - scrollPercent * 5;   // zoom closer
    const targetX = Math.sin(scrollPercent * Math.PI) * 4; // slight weave

    // 2. Mouse Parallax (Tilt)
    // Decreased weight on mobile
    const mouseMult = isMobile ? 0.05 : 0.8;
    const tiltX = targetX + mouse.current.x * mouseMult * 3;
    const tiltY = targetY + mouse.current.y * mouseMult * 2;
    const tiltZ = targetZ;

    // Smooth Lerps
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tiltX, delta * 3);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, tiltY, delta * 3);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tiltZ, delta * 3);

    // Camera always looks slightly down toward the central plaza
    const lookTarget = new THREE.Vector3(0, -6 - scrollPercent * 4, -10);
    const lookMatrix = new THREE.Matrix4().lookAt(camera.position, lookTarget, new THREE.Vector3(0, 1, 0));
    const targetRotation = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);
    camera.quaternion.slerp(targetRotation, delta * 3);
  });

  return null;
};

// 7. Background Star particles
const StarSky: React.FC = () => {
  const count = 150;
  const positions = useMemo(() => {
    const list = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 20;
      const theta = Math.random() * Math.PI; // semi-sphere above horizon
      const phi = Math.random() * Math.PI * 2;
      
      list[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      list[i * 3 + 1] = Math.abs(radius * Math.sin(theta) * Math.sin(phi)) + 2; // Keep in sky
      list[i * 3 + 2] = radius * Math.cos(theta) - 20;
    }
    return list;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.25}
        transparent
        opacity={0.7}
        sizeAttenuation={true}
      />
    </points>
  );
};

export const CityBackground: React.FC = () => {
  const { theme, isMobile } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -2,
        pointerEvents: "none",
      }}
    >
      {/* Semi-transparent dark overlay to blend background image with 3D city */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10, 2, 2, 0.55)",
        zIndex: 0,
      }} />
      <Canvas
        style={{ position: "relative", zIndex: 1, mixBlendMode: "screen" }}
        camera={{ position: [0, 8, 18], fov: 60 }}
        gl={{ antialias: !isMobile, powerPreference: "high-performance", alpha: true }}
        onCreated={({ gl }) => { gl.setClearColor(new THREE.Color('#000000'), 0); }}
      >
        <StarSky />
        <CityGrid theme={theme} />
        <CarTraffic count={isMobile ? 15 : 40} theme={theme} />
        <CityFog />
        <Helicopter />
        <CameraController />
      </Canvas>
    </div>
  );
};
export default CityBackground;
