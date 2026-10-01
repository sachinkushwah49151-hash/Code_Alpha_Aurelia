import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Precision Hardware Sculpture (Aero Acoustic Core)
function AcousticCore({ mouse, reducedMotion = false }) {
  const coreRef = useRef();
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const floatGroupRef = useRef();

  useFrame((state, delta) => {
    if (reducedMotion) return;

    const t = state.clock.getElapsedTime();

    // Natural subtle rotation
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.25;
      coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.15;
      outerRingRef.current.rotation.x = Math.PI / 4 + Math.cos(t * 0.18) * 0.15;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = -t * 0.35;
      innerRingRef.current.rotation.z = Math.PI / 3 + Math.sin(t * 0.22) * 0.12;
    }

    // Smooth cursor parallax reaction (spring interpolation)
    if (floatGroupRef.current) {
      const targetRotX = mouse.current.y * 0.3;
      const targetRotY = mouse.current.x * 0.4;
      floatGroupRef.current.rotation.x = THREE.MathUtils.damp(
        floatGroupRef.current.rotation.x,
        targetRotX,
        4,
        delta
      );
      floatGroupRef.current.rotation.y = THREE.MathUtils.damp(
        floatGroupRef.current.rotation.y,
        targetRotY,
        4,
        delta
      );
    }
  });

  return (
    <group ref={floatGroupRef}>
      <Float
        speed={1.6}
        rotationIntensity={0.2}
        floatIntensity={0.5}
        floatingRange={[-0.15, 0.15]}
      >
        {/* Central Obsidian Beryllium Acoustic Driver Sphere */}
        <mesh ref={coreRef} castShadow receiveShadow>
          <sphereGeometry args={[0.9, 64, 64]} />
          <meshStandardMaterial
            color="#141416"
            metalness={0.88}
            roughness={0.18}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Central Audio Grille Ring Accent */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.92, 0.04, 32, 100]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.95}
            roughness={0.12}
          />
        </mesh>

        {/* Outer Anodized Aluminum Gimbal Ring */}
        <mesh ref={outerRingRef} castShadow>
          <torusGeometry args={[1.45, 0.05, 32, 120]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.92}
            roughness={0.15}
          />
        </mesh>

        {/* Inner Titanium Acoustic Waveguide Ring */}
        <mesh ref={innerRingRef} castShadow>
          <torusGeometry args={[1.2, 0.035, 24, 100]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Subtle Satellite Orbital Accents */}
        <mesh position={[1.35, 0.4, 0.2]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.25, -0.5, -0.3]}>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>

      {/* Grounding Contact Shadow */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.35}
        scale={6}
        blur={2.4}
        far={4}
      />
    </group>
  );
}

// Fallback image in case WebGL is disabled or during low-power
function FallbackHeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <div className="relative aspect-square max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl bg-stone-100 border border-stone-200">
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
          alt="NOVA Precision Hardware"
          className="w-full h-full object-cover object-center animate-pulse duration-1000"
        />
      </div>
    </div>
  );
}

export const Hero3DCanvas = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check WebGL availability and motion preferences
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setHasWebGL(supported);
    } catch {
      setHasWebGL(false);
    }

    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const handler = (e) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } catch {
      // ignore
    }
  }, []);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouse.current = { x, y };
  };

  const handlePointerLeave = () => {
    mouse.current = { x: 0, y: 0 };
  };

  if (!hasWebGL) {
    return <FallbackHeroVisual />;
  }

  return (
    <div
      className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] select-none cursor-grab active:cursor-grabbing"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Suspense fallback={<FallbackHeroVisual />}>
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          {/* Studio Lights */}
          <ambientLight intensity={0.9} color="#f8fafc" />
          <directionalLight
            position={[4, 6, 5]}
            intensity={2.2}
            color="#ffffff"
            castShadow
          />
          <directionalLight
            position={[-5, -2, -3]}
            intensity={1.1}
            color="#94a3b8"
          />
          <pointLight position={[0, 3, 2]} intensity={1.4} color="#fef08a" />

          {/* 3D Model with mouse reaction */}
          <AcousticCore mouse={mouse} reducedMotion={prefersReducedMotion} />
        </Canvas>
      </Suspense>

      {/* Subtle interaction badge */}
      <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] uppercase font-mono tracking-widest text-stone-400 bg-white/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-200/80 shadow-xs">
        Interactive 3D • Move cursor
      </div>
    </div>
  );
};
