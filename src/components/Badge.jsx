import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    accent: 'bg-neutral-900 text-white border-neutral-900',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    blue: 'bg-sky-50 text-sky-800 border-sky-200',
    outline: 'bg-transparent text-stone-700 border-stone-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide border uppercase ${
        variants[variant] || variants.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
};
