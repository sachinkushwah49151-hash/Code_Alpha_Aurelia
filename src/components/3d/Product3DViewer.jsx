import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';

// Procedural 3D Headphone Model
function HeadphonesModel({ finishColor = '#1a1a1c', autoRotate = true }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]} scale={1.15}>
      {/* 1. Curved Headband */}
      <mesh position={[0, 0.75, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.1, 0.08, 24, 64, Math.PI]} />
        <meshStandardMaterial
          color="#222"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Headband Comfort Memory Cushion */}
      <mesh position={[0, 0.77, 0]}>
        <torusGeometry args={[1.08, 0.065, 16, 48, Math.PI * 0.7]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* 2. Left Ear Cup Assembly */}
      <group position={[-1.1, -0.1, 0]}>
        {/* Metal Yoke / Fork */}
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 10]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Left Outer Cup */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.55, 0.52, 0.32, 48]} />
          <meshStandardMaterial
            color={finishColor}
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>
        {/* Left Ear Cushion */}
        <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.56, 0.56, 0.18, 48]} />
          <meshStandardMaterial color="#1e1e24" roughness={0.85} metalness={0.05} />
        </mesh>
        {/* Left Driver Grille Trim Accent */}
        <mesh position={[-0.165, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[0.25, 0.48, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* 3. Right Ear Cup Assembly */}
      <group position={[1.1, -0.1, 0]}>
        {/* Metal Yoke / Fork */}
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, -Math.PI / 10]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Right Outer Cup */}
        <mesh rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.55, 0.52, 0.32, 48]} />
          <meshStandardMaterial
            color={finishColor}
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>
        {/* Right Ear Cushion */}
        <mesh position={[-0.14, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.56, 0.56, 0.18, 48]} />
          <meshStandardMaterial color="#1e1e24" roughness={0.85} metalness={0.05} />
        </mesh>
        {/* Right Driver Grille Trim Accent */}
        <mesh position={[0.165, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <ringGeometry args={[0.25, 0.48, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

export const Product3DViewer = ({
  finishColor = '#1c1c1e',
  autoRotate = true,
  interactive = true,
  className = 'h-80 sm:h-96 w-full',
}) => {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mq.matches);
      const handler = (e) => setReducedMotion(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } catch {
      // ignore
    }
  }, []);

  const shouldAutoRotate = autoRotate && !reducedMotion;

  return (
    <div className={`relative ${className} select-none`}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-stone-100/60 rounded-2xl animate-pulse">
            <span className="text-xs font-mono text-stone-400">Loading 3D Studio...</span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.5, 3.8], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          {/* Studio Environment Lighting */}
          <ambientLight intensity={0.9} color="#ffffff" />
          <directionalLight position={[4, 5, 4]} intensity={2.4} color="#ffffff" castShadow />
          <directionalLight position={[-4, 2, -3]} intensity={1.2} color="#94a3b8" />
          <pointLight position={[0, -2, 2]} intensity={0.8} color="#d4af37" />

          {/* Model */}
          <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.1} floatIntensity={reducedMotion ? 0 : 0.3}>
            <HeadphonesModel finishColor={finishColor} autoRotate={shouldAutoRotate} />
          </Float>

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -1.3, 0]}
            opacity={0.35}
            scale={5}
            blur={2}
            far={3}
          />

          {/* User Interaction Controls */}
          {interactive && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.7}
            />
          )}
        </Canvas>
      </Suspense>

      {interactive && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] uppercase font-mono tracking-widest text-stone-400 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-200/80 shadow-xs whitespace-nowrap">
          Drag to Rotate 360°
        </div>
      )}
    </div>
  );
};
