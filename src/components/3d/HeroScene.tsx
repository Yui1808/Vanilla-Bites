'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Luxury Vanilla Gourmet Burger Centerpiece
function GourmetBurgerModel({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const groupRef = useRef<THREE.Group>(null);
  const cheeseRef = useRef<THREE.Mesh>(null);

  // Generate floating seeds on top of the bun
  const seeds = useMemo(() => {
    const list = [];
    for (let i = 0; i < 48; i++) {
      const phi = Math.random() * Math.PI * 0.45;
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.48;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) + 0.15;
      const z = radius * Math.sin(phi) * Math.sin(theta);
      list.push({ pos: [x, y, z] as [number, number, number], rot: [Math.random(), Math.random(), Math.random()] as [number, number, number] });
    }
    return list;
  }, []);

  // Floating ingredients surrounding the hero burger
  const floatingAccents = useMemo(() => {
    return [
      { pos: [-2.6, 1.2, 0.5] as [number, number, number], scale: 0.28, color: '#C58B52', speed: 1.2, rotSpeed: 0.02 }, // Caramel drop
      { pos: [2.5, 0.8, -0.4] as [number, number, number], scale: 0.35, color: '#432719', speed: 0.9, rotSpeed: 0.015 }, // Chocolate shard
      { pos: [-2.2, -1.1, 0.8] as [number, number, number], scale: 0.22, color: '#F4C9A4', speed: 1.5, rotSpeed: 0.025 }, // Vanilla bean wafer
      { pos: [2.2, -1.3, 0.6] as [number, number, number], scale: 0.3, color: '#FFF8ED', speed: 1.1, rotSpeed: 0.018 }, // Vanilla cream cloud
      { pos: [0.3, 2.4, -0.8] as [number, number, number], scale: 0.2, color: '#D4A373', speed: 1.4, rotSpeed: 0.02 }, // Golden glaze chip
      { pos: [-1.4, 2.2, 0.4] as [number, number, number], scale: 0.18, color: '#10B981', speed: 1.3, rotSpeed: 0.03 }, // Crisp herb leaf
    ];
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth continuous slow rotation
      groupRef.current.rotation.y += delta * 0.35;

      // Mouse parallax tilt
      const targetRotX = mouse.current[1] * 0.4;
      const targetRotZ = -mouse.current[0] * 0.4;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} scale={1.15}>
      {/* 1. TOP BRIOCHE BUN */}
      <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.5, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial
          color="#D49B55"
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>
      {/* Bun Base Flattening */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.48, 1.48, 0.06, 36]} />
        <meshStandardMaterial color="#C48842" roughness={0.4} />
      </mesh>

      {/* Sesame Seeds */}
      {seeds.map((s, idx) => (
        <mesh key={idx} position={s.pos} rotation={s.rot}>
          <capsuleGeometry args={[0.02, 0.06, 4, 8]} />
          <meshStandardMaterial color="#FFF8ED" roughness={0.2} />
        </mesh>
      ))}

      {/* 2. VANILLA BOURBON GLAZE & MELTED RACLETTE CHEESE */}
      <mesh ref={cheeseRef} position={[0, 0.58, 0]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2.3, 0.08, 2.3]} />
        <meshStandardMaterial
          color="#F9B338"
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>

      {/* 3. SMOKED CARAMEL ONION JAM & CRISPY BACON LAYER */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[1.42, 1.42, 0.12, 32]} />
        <meshStandardMaterial color="#5A2E17" roughness={0.6} />
      </mesh>

      {/* 4. BLACK ANGUS SMASH PATTY */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.55, 0.32, 32]} />
        <meshStandardMaterial
          color="#381D11"
          roughness={0.8}
          metalness={0.15}
        />
      </mesh>

      {/* 5. FRESH CRUMPLED ORGANIC LETTUCE LEAF */}
      <mesh position={[0, 0.02, 0]} rotation={[0.05, 0.8, -0.05]}>
        <cylinderGeometry args={[1.62, 1.58, 0.06, 24]} />
        <MeshDistortMaterial
          color="#22C55E"
          speed={1.5}
          distort={0.25}
          roughness={0.5}
        />
      </mesh>

      {/* 6. BOTTOM BRIOCHE BUN */}
      <mesh position={[0, -0.32, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.45, 1.35, 0.5, 36]} />
        <meshStandardMaterial
          color="#C98B48"
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* FLOATING ARTISANAL ACCENTS */}
      {floatingAccents.map((accent, idx) => (
        <Float
          key={idx}
          speed={accent.speed}
          rotationIntensity={1.2}
          floatIntensity={1.5}
          position={accent.pos}
        >
          <mesh castShadow scale={accent.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={accent.color}
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function HeroScene() {
  const mouse = useRef<[number, number]>([0, 0]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouse.current = [x, y];
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="w-full h-full min-h-[460px] lg:min-h-[580px] relative select-none cursor-grab active:cursor-grabbing"
    >
      <Canvas
        camera={{ position: [0, 1.2, 5.2], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.2} />
        {/* Warm key light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
        />
        {/* Subtle rim light for golden caramel sheen */}
        <pointLight position={[-4, 3, -3]} intensity={2.0} color="#F4C9A4" />
        <pointLight position={[3, -2, 2]} intensity={1.2} color="#FFF8ED" />

        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.6}>
          <GourmetBurgerModel mouse={mouse} />
        </Float>

        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.65}
          scale={7}
          blur={2.4}
          far={3}
          color="#251710"
        />
      </Canvas>
    </div>
  );
}

