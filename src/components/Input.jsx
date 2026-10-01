import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  required = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-neutral-600 flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-neutral-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`
            w-full bg-white text-neutral-900 text-sm rounded-lg border transition-all duration-150
            placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900
            disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed
            ${Icon ? 'pl-10 pr-3.5 py-2.5' : 'px-3.5 py-2.5'}
            ${error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-stone-200 hover:border-stone-300'}
          `}
          {...props}
        />
      </div>

      {error ? (
        <span className="text-xs text-rose-600 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-neutral-500">{helperText}</span>
      ) : null}
    </div>
  );
};
