import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas = () => {
  const mountRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check WebGL availability
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setIsSupported(false);
      return;
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 580;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Group for mouse interaction and floating
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Sculptural Geometric Form (Champagne Lustre Torus Ring)
    const torusGeometry = new THREE.TorusGeometry(1.6, 0.38, 36, 100);
    const champagneMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe8d5b5,
      emissive: 0x221a0f,
      roughness: 0.22,
      metalness: 0.65,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });
    const mainMesh = new THREE.Mesh(torusGeometry, champagneMaterial);
    mainMesh.rotation.x = Math.PI / 4.5;
    mainMesh.rotation.y = Math.PI / 6;
    mainGroup.add(mainMesh);

    // 2. Secondary Inner Translucent Ring (Contrasting Satin Obsidian/Smoke)
    const innerGeometry = new THREE.TorusGeometry(1.1, 0.18, 30, 80);
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x27272a,
      roughness: 0.3,
      metalness: 0.85,
      clearcoat: 0.5,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    innerMesh.rotation.x = -Math.PI / 3;
    innerMesh.rotation.z = Math.PI / 4;
    mainGroup.add(innerMesh);

    // 3. Central Core Halo Bead (Gleaming Warm Accent)
    const coreGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      roughness: 0.1,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 4. Subtle Ambient Particle Halo (Soft champagne dust)
    const particleCount = window.innerWidth < 768 ? 40 : 90;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc5a880,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particleSystem);

    // Lighting (Warm Studio Rig)
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.4);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc5a880, 1.6);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.0, 15);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // Cursor tracking with smooth lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      mouseX = (clientX / rect.width - 0.5) * 2;
      mouseY = (clientY / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      if (!prefersReducedMotion) {
        const elapsedTime = clock.getElapsedTime();

        // Smooth cursor lerp
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Subtle floating motion + cursor parallax
        mainGroup.rotation.y = elapsedTime * 0.25 + targetX * 0.45;
        mainGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.12 - targetY * 0.35;
        mainGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.08;

        innerMesh.rotation.y = -elapsedTime * 0.35;
        particleSystem.rotation.y = elapsedTime * 0.08;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Clean up WebGL resources
      torusGeometry.dispose();
      innerGeometry.dispose();
      coreGeometry.dispose();
      particleGeometry.dispose();
      champagneMaterial.dispose();
      innerMaterial.dispose();
      coreMaterial.dispose();
      particleMaterial.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[580px] flex items-center justify-center relative pointer-events-none select-none"
      aria-hidden="true"
    />
  );
};
