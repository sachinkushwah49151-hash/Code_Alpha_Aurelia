import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroProductStudio = () => {
  const containerRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Smooth interpolated rotation & floating values
  const currentRot = useRef({ x: 0, y: 0, z: 0, floatY: 0 });
  const targetRot = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let startTime = performance.now();

    const updateMotion = (now) => {
      const elapsed = (now - startTime) / 1000;

      // Continuous subtle breathing float (2-3px) & gentle angular drift (1.5-2 deg)
      const idleFloatY = Math.sin(elapsed * 1.4) * 3;
      const idleRotZ = Math.sin(elapsed * 0.9) * 1.2;
      const idleRotX = Math.cos(elapsed * 1.1) * 1.5;

      // Cursor target tilt (max 3.5 deg X, 4.5 deg Y)
      const targetX = (targetRot.current.x * -3.5) + idleRotX;
      const targetY = (targetRot.current.y * 4.5);

      // Smooth lerp (linear interpolation) for weighted luxury feel
      currentRot.current.x += (targetX - currentRot.current.x) * 0.06;
      currentRot.current.y += (targetY - currentRot.current.y) * 0.06;
      currentRot.current.z += (idleRotZ - currentRot.current.z) * 0.06;
      currentRot.current.floatY += (idleFloatY - currentRot.current.floatY) * 0.06;

      const stage = containerRef.current;
      if (stage) {
        const productEl = stage.querySelector('.studio-product-model');
        const shadowEl = stage.querySelector('.studio-floor-shadow');
        const sheenEl = stage.querySelector('.studio-specular-sheen');

        if (productEl) {
          productEl.style.transform = `
            perspective(1200px)
            translateY(${currentRot.current.floatY}px)
            rotateX(${currentRot.current.x.toFixed(2)}deg)
            rotateY(${currentRot.current.y.toFixed(2)}deg)
            rotateZ(${currentRot.current.z.toFixed(2)}deg)
            translateZ(15px)
          `;
        }

        if (shadowEl) {
          // Shadow shifts slightly opposite to mouse tilt & softens as product floats higher
          const shadowOffsetX = -currentRot.current.y * 2.2;
          const shadowBlur = 24 + currentRot.current.floatY * -2;
          const shadowScale = 1 - currentRot.current.floatY * 0.02;
          const shadowOpacity = 0.32 - currentRot.current.floatY * 0.015;

          shadowEl.style.transform = `translateX(${shadowOffsetX.toFixed(1)}px) scale(${shadowScale.toFixed(2)})`;
          shadowEl.style.filter = `blur(${Math.max(16, shadowBlur).toFixed(1)}px)`;
          shadowEl.style.opacity = Math.max(0.18, Math.min(0.42, shadowOpacity)).toFixed(2);
        }

        if (sheenEl) {
          // Dynamic specular light reflection shifting across the surface
          const lightX = 50 + currentRot.current.y * 6;
          const lightY = 40 + currentRot.current.x * 6;
          sheenEl.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 248, 235, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`;
        }
      }

      animFrameRef.current = requestAnimationFrame(updateMotion);
    };

    animFrameRef.current = requestAnimationFrame(updateMotion);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [prefersReducedMotion]);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    targetRot.current = {
      x: Math.max(-1, Math.min(1, y)),
      y: Math.max(-1, Math.min(1, x)),
    };
  };

  const handleMouseLeave = () => {
    targetRot.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center select-none py-4"
      aria-label="Aurelia Air X1 3D Product Presentation"
    >
      {/* Studio Stage Canvas */}
      <div className="relative w-full aspect-[4/4.2] sm:aspect-[4/4.4] flex flex-col items-center justify-center">
        {/* Soft Warm Studio Ambient Glow */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(245, 238, 226, 0.85) 0%, rgba(250, 248, 245, 0.4) 60%, transparent 85%)',
          }}
        />

        {/* 14 Faint Ambient Champagne Studio Motes (barely noticeable) */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
            {[
              { top: '18%', left: '22%', size: '3px', delay: '0s', dur: '14s' },
              { top: '35%', left: '78%', size: '2.5px', delay: '2s', dur: '18s' },
              { top: '70%', left: '25%', size: '3px', delay: '4s', dur: '16s' },
              { top: '22%', left: '65%', size: '2px', delay: '1s', dur: '19s' },
              { top: '55%', left: '15%', size: '2.5px', delay: '3s', dur: '15s' },
              { top: '65%', left: '82%', size: '3px', delay: '5s', dur: '17s' },
              { top: '42%', left: '88%', size: '2px', delay: '2.5s', dur: '20s' },
              { top: '80%', left: '45%', size: '2.5px', delay: '6s', dur: '13s' },
              { top: '15%', left: '48%', size: '2px', delay: '3.5s', dur: '16s' },
              { top: '30%', left: '32%', size: '3px', delay: '4.5s', dur: '18s' },
              { top: '75%', left: '70%', size: '2px', delay: '1.5s', dur: '15s' },
              { top: '48%', left: '20%', size: '2.5px', delay: '5.5s', dur: '19s' },
              { top: '60%', left: '60%', size: '2px', delay: '0.5s', dur: '17s' },
              { top: '25%', left: '85%', size: '2.5px', delay: '6.5s', dur: '14s' },
            ].map((mote, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-[#c5a880]/35 blur-[0.6px] animate-pulse"
                style={{
                  top: mote.top,
                  left: mote.left,
                  width: mote.size,
                  height: mote.size,
                  animationDelay: mote.delay,
                  animationDuration: mote.dur,
                }}
              />
            ))}
          </div>
        )}

        {/* 3D / 2.5D Product Model Wrapper */}
        <div
          className="studio-product-model relative w-[80%] sm:w-[82%] max-w-[380px] aspect-square flex items-center justify-center transition-transform duration-100 ease-out will-change-transform z-10"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Main Product Image (High-Res Commercial Studio Portrayal) */}
          <img
            src="/images/aurelia-air-x1-hero.jpg"
            alt="Aurelia Air X1 Wireless Headphones"
            className="w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
            loading="eager"
            decoding="async"
          />

          {/* Interactive Studio Specular Sheen (Curvature Lighting Highlight) */}
          <div
            className="studio-specular-sheen absolute inset-0 rounded-full pointer-events-none mix-blend-soft-light transition-all duration-300"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(255, 248, 235, 0.45) 0%, rgba(255, 255, 255, 0) 65%)',
            }}
          />
        </div>

        {/* Soft Studio Floor Contact Shadow */}
        <div
          className="studio-floor-shadow absolute bottom-[10%] w-[68%] max-w-[320px] h-9 sm:h-11 rounded-[100%] bg-neutral-950/30 blur-2xl pointer-events-none transition-all duration-150 -z-5"
          style={{ transform: 'scale(1)' }}
        />
      </div>

      {/* Elegant Integrated Product Information (No large white cards, clean typography) */}
      <div className="mt-2 sm:mt-3 text-center space-y-1.5 z-20">
        <p className="text-[11px] font-mono tracking-[0.28em] uppercase text-stone-500 font-semibold">
          AURELIA AIR X1
        </p>

        <div className="flex items-center justify-center gap-2.5 text-xs">
          <span className="text-neutral-600 font-normal">Wireless Spatial Audio</span>
          <span className="text-stone-300">•</span>
          <span className="text-sm font-semibold text-neutral-950">₹8,499</span>
        </div>

        <div className="pt-1">
          <Link
            to="/product/aurelia-air-x1"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-[#b38a4a] transition-colors tracking-wide group"
          >
            <span>Explore Product</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-[#b38a4a]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
