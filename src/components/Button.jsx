import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 hover:-translate-y-[1px] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none';

  const sizes = {
    sm: 'text-xs px-4 py-2 min-h-[38px] rounded-lg gap-1.5',
    md: 'text-[14px] sm:text-[15px] px-5 py-2.5 min-h-[46px] rounded-xl gap-2',
    lg: 'text-[15px] sm:text-base px-7 py-3.5 min-h-[54px] sm:min-h-[56px] rounded-xl gap-2.5',
    icon: 'p-2.5 rounded-lg min-h-[42px] min-w-[42px]',
  };

  const variants = {
    primary:
      'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm hover:shadow hover:brightness-105 border border-neutral-900',
    secondary:
      'bg-stone-100 text-neutral-900 hover:bg-stone-200 border border-stone-200/80',
    outline:
      'bg-transparent text-neutral-900 border border-stone-300 hover:bg-stone-50 hover:border-neutral-900',
    ghost:
      'bg-transparent text-neutral-700 hover:text-neutral-950 hover:bg-stone-100 border border-transparent',
    danger:
      'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizes[size] || sizes.md}
        ${variants[variant] || variants.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
