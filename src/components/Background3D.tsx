import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface Background3DProps {
  className?: string;
}

export const Background3D: React.FC<Background3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 740;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 10.5);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    } catch (e) {
      console.warn('WebGL init error:', e);
      return;
    }

    // 2. Sophisticated Studio Lighting
    // Warm ambient light foundation
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.2);
    scene.add(ambientLight);

    // Warm champagne directional key light
    const keyLight = new THREE.DirectionalLight(0xf5e6d0, 1.8);
    keyLight.position.set(6, 7, 8);
    scene.add(keyLight);

    // Interactive point light that subtly follows cursor
    const mouseLight = new THREE.PointLight(0xedd8be, 2.4, 35);
    mouseLight.position.set(2, 2, 5);
    scene.add(mouseLight);

    // Soft cool-neutral rim fill for physical depth definition
    const fillLight = new THREE.DirectionalLight(0xe2dcd4, 0.9);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    // 3. THREE DISTINCT 3D DEPTH LAYERS (Organic Translucent Curved Surfaces)

    // Layer A: Foreground Translucent Architectural Flow Surface
    const geoA = new THREE.PlaneGeometry(22, 14, 36, 26);
    const origPosA = (geoA.attributes.position.array as Float32Array).slice();
    const matA = new THREE.MeshStandardMaterial({
      color: 0xede4d8, // warm champagne tone with physical definition
      roughness: 0.38,
      metalness: 0.12,
      transparent: true,
      opacity: 0.62,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const meshA = new THREE.Mesh(geoA, matA);
    meshA.rotation.x = -0.58;
    meshA.rotation.y = 0.18;
    meshA.rotation.z = -0.25;
    meshA.position.set(1.2, -0.4, 0.5);
    scene.add(meshA);

    // Layer B: Middle Sculptural Fabric Surface
    const geoB = new THREE.PlaneGeometry(26, 16, 32, 24);
    const origPosB = (geoB.attributes.position.array as Float32Array).slice();
    const matB = new THREE.MeshStandardMaterial({
      color: 0xe2d4be, // richer champagne/warm beige for visible contrast
      roughness: 0.52,
      metalness: 0.08,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const meshB = new THREE.Mesh(geoB, matB);
    meshB.rotation.x = -0.42;
    meshB.rotation.y = -0.15;
    meshB.rotation.z = 0.18;
    meshB.position.set(-2.0, 0.8, -2.2);
    scene.add(meshB);

    // Layer C: Far Background Depth Layer (Undulating Horizon Wave)
    const geoC = new THREE.PlaneGeometry(32, 20, 28, 20);
    const origPosC = (geoC.attributes.position.array as Float32Array).slice();
    const matC = new THREE.MeshStandardMaterial({
      color: 0xd8caa8, // deeper champagne sand for clear depth perception
      roughness: 0.68,
      metalness: 0.05,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const meshC = new THREE.Mesh(geoC, matC);
    meshC.rotation.x = -0.65;
    meshC.rotation.z = -0.12;
    meshC.position.set(0, -1.2, -5.0);
    scene.add(meshC);

    // 4. Ambient Studio Motes (24 Floating Warm Particles)
    const particleCount = 26;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 20;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    // Crisp circular glowing mote canvas texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(197, 168, 128, 1)');
      grad.addColorStop(0.35, 'rgba(215, 190, 155, 0.6)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.28,
      map: pTexture,
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Smooth Mouse Parallax Physics
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Calculate normalized coords (-1 to 1) based on viewport
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      mouse.targetX = Math.max(-1.2, Math.min(1.2, x));
      mouse.targetY = Math.max(-1.2, Math.min(1.2, y));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 740;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 6. Dynamic Animation & Continuous Harmonic Wave Motion
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Smooth lerp (0.042) for calm, weighted response
        mouse.x += (mouse.targetX - mouse.x) * 0.042;
        mouse.y += (mouse.targetY - mouse.y) * 0.042;

        // Camera gentle parallax tilt
        camera.position.x = mouse.x * 0.75;
        camera.position.y = 0.4 - mouse.y * 0.5;
        camera.lookAt(0, 0, 0);

        // Point light tracks mouse to cast shifting specular highlights
        mouseLight.position.x = mouse.x * 4.5;
        mouseLight.position.y = -mouse.y * 3.5 + 2;

        // --- Wave Deformation: Layer A (Foreground) ---
        const posA = geoA.attributes.position;
        const arrA = posA.array as Float32Array;
        for (let i = 0; i < arrA.length; i += 3) {
          const ox = origPosA[i];
          const oy = origPosA[i + 1];
          const w1 = Math.sin(ox * 0.32 + t * 0.65) * 0.55;
          const w2 = Math.cos(oy * 0.38 + t * 0.48) * 0.42;
          const w3 = Math.sin((ox + oy) * 0.22 + t * 0.35) * 0.3;
          arrA[i + 2] = origPosA[i + 2] + w1 + w2 + w3;
        }
        posA.needsUpdate = true;
        geoA.computeVertexNormals();
        meshA.position.x = 1.2 + mouse.x * 0.25;
        meshA.position.y = -0.4 - mouse.y * 0.18;

        // --- Wave Deformation: Layer B (Middle) ---
        const posB = geoB.attributes.position;
        const arrB = posB.array as Float32Array;
        for (let i = 0; i < arrB.length; i += 3) {
          const ox = origPosB[i];
          const oy = origPosB[i + 1];
          const w1 = Math.cos(ox * 0.25 + t * 0.5) * 0.62;
          const w2 = Math.sin(oy * 0.3 + t * 0.4) * 0.45;
          arrB[i + 2] = origPosB[i + 2] + w1 + w2;
        }
        posB.needsUpdate = true;
        geoB.computeVertexNormals();
        meshB.position.x = -2.0 - mouse.x * 0.18;
        meshB.position.y = 0.8 + mouse.y * 0.12;

        // --- Wave Deformation: Layer C (Far Background) ---
        const posC = geoC.attributes.position;
        const arrC = posC.array as Float32Array;
        for (let i = 0; i < arrC.length; i += 3) {
          const ox = origPosC[i];
          const w1 = Math.sin(ox * 0.2 + t * 0.38) * 0.7;
          arrC[i + 2] = origPosC[i + 2] + w1;
        }
        posC.needsUpdate = true;
        geoC.computeVertexNormals();

        // Particles gentle float & slight rotation
        particles.rotation.y = t * 0.02 + mouse.x * 0.08;
        particles.rotation.x = t * 0.015 - mouse.y * 0.05;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(animate);
      }
    };

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animId = requestAnimationFrame(animate);
    }

    // Cleanup
    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      geoA.dispose();
      matA.dispose();
      geoB.dispose();
      matB.dispose();
      geoC.dispose();
      matC.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pTexture.dispose();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 3D WebGL Canvas Layer - Visibly positioned behind hero content */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block opacity-85 will-change-transform"
      />

      {/* Very subtle bottom blend into page background */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #faf8f5 15%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default Background3D;
