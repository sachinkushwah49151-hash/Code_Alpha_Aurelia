import React, { useRef, useState } from 'react';

export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.08)',
  theme = 'dark', // 'dark' | 'light'
  ...props
}) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const defaultColor =
    theme === 'dark'
      ? 'rgba(255, 255, 255, 0.07)'
      : 'rgba(15, 23, 42, 0.04)';

  const activeColor = spotlightColor || defaultColor;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Spotlight Radial Overlay */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${activeColor}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
};
