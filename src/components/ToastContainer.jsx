import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
          info: <Info className="w-4 h-4 text-neutral-900 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 bg-white',
          error: 'border-rose-200 bg-white',
          info: 'border-stone-200 bg-white',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg shadow-neutral-950/5 text-neutral-900 text-sm transition-all duration-300 animate-in slide-in-from-bottom-4 ${
              borders[toast.type] || borders.info
            }`}
          >
            <div className="flex items-center gap-2.5">
              {icons[toast.type] || icons.info}
              <span className="font-medium text-xs sm:text-sm tracking-wide leading-tight">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 -mr-1 cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
