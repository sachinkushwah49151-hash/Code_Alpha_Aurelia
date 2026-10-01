import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface Background3DProps {
  className?: string;
}

export const Background3D: React.FC<Background3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', checkMobile);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile || !containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 750;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfaf8f5, 0.04);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9.5);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to CSS background', e);
      return;
    }

    // 2. Lights (Warm Ivory & Champagne Glow)
    const ambientLight = new THREE.AmbientLight(0xfffdfa, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf2e3cd, 1.2);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xe4d3be, 0.8, 30);
    fillLight.position.set(-6, -3, 4);
    scene.add(fillLight);

    // 3. Flowing Translucent Architectural Wave Surface
    // A diagonal ribbon plane with organic, smooth vertex oscillations
    const planeWidth = 24;
    const planeHeight = 16;
    const segmentsX = 40;
    const segmentsY = 28;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsX, segmentsY);

    // Save initial coordinates for harmonic displacement
    const posAttribute = geometry.attributes.position;
    const origPositions = posAttribute.array.slice() as Float32Array;

    const material = new THREE.MeshStandardMaterial({
      color: 0xf8f4ee,
      roughness: 0.82,
      metalness: 0.08,
      transparent: true,
      opacity: 0.52,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -0.55;
    mesh.rotation.z = -0.22;
    mesh.position.set(0.5, -0.6, -1.8);
    scene.add(mesh);

    // 4. Subtle Ambient Motes (18 Champagne Studio Particles)
    const particleCount = 20;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      particleScales[i] = Math.random() * 0.8 + 0.4;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom circle particle texture
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 32;
    canvasTexture.height = 32;
    const ctx = canvasTexture.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(197, 168, 128, 0.95)');
      gradient.addColorStop(0.4, 'rgba(212, 187, 151, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvasTexture);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 5. Mouse Parallax & Dynamic State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = ((clientX / rect.width) - 0.5) * 2;
      mouse.targetY = ((clientY / rect.height) - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 750;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop (60fps lerp interpolation)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Smooth lerp mouse response
        mouse.x += (mouse.targetX - mouse.x) * 0.038;
        mouse.y += (mouse.targetY - mouse.y) * 0.038;

        // Subtle camera parallax
        camera.position.x = mouse.x * 0.65;
        camera.position.y = 0.5 - mouse.y * 0.45;
        camera.lookAt(0, 0, 0);

        // Slow wave oscillation across vertex plane
        const pos = geometry.attributes.position;
        const array = pos.array as Float32Array;

        for (let i = 0; i < array.length; i += 3) {
          const origX = origPositions[i];
          const origY = origPositions[i + 1];

          // Gentle layered wave math
          const wave1 = Math.sin(origX * 0.28 + elapsedTime * 0.5) * 0.45;
          const wave2 = Math.cos(origY * 0.35 + elapsedTime * 0.38) * 0.35;
          const wave3 = Math.sin((origX + origY) * 0.18 + elapsedTime * 0.25) * 0.25;

          array[i + 2] = origPositions[i + 2] + wave1 + wave2 + wave3;
        }
        pos.needsUpdate = true;
        geometry.computeVertexNormals();

        // Slow calm particles drift
        particles.rotation.y = elapsedTime * 0.02 + mouse.x * 0.08;
        particles.rotation.x = elapsedTime * 0.015 - mouse.y * 0.06;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (prefersReducedMotion) {
      // Render single pristine static frame
      renderer.render(scene, camera);
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    // Cleanup
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [isMobile, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 3D WebGL Canvas for Desktop/Tablet */}
      {!isMobile ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block will-change-transform"
        />
      ) : (
        /* Lightweight 2.5D CSS Animated Luxury Backdrop for Mobile */
        <div className="absolute inset-0 w-full h-full overflow-hidden opacity-60">
          <div
            className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] animate-pulse"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 50% 40%, rgba(242, 227, 205, 0.45) 0%, rgba(250, 248, 245, 0.1) 60%, transparent 100%)',
              animationDuration: '9s',
            }}
          />
        </div>
      )}

      {/* Warm Ambient Vignette for Seamless Blending into Aurelia Ivory Foundation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 40%, rgba(250, 248, 245, 0.65) 80%, #faf8f5 100%)',
        }}
      />
    </div>
  );
};

export default Background3D;
