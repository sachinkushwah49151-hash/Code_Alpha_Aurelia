import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex gap-4 sm:gap-6 py-5 border-b border-stone-200/80 items-start">
      {/* Product Image */}
      <Link
        to={`/product/${item.id}`}
        className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0 block"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-24 sm:h-28">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/product/${item.id}`}
                className="text-sm sm:text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1"
              >
                {item.name}
              </Link>
              {item.color && (
                <p className="text-xs text-neutral-500 mt-0.5">
                  Color / Finish: <span className="font-medium text-neutral-700">{item.color}</span>
                </p>
              )}
            </div>

            {/* Total for this line item */}
            <span className="text-sm sm:text-base font-semibold text-neutral-900 shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>

          <p className="text-xs text-stone-400 mt-0.5">
            {formatPrice(item.price)} each
          </p>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center justify-between pt-2">
          {/* Stepper */}
          <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
              className="p-1.5 sm:p-2 text-neutral-500 hover:text-neutral-950 hover:bg-stone-50 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 sm:px-3.5 text-xs font-semibold text-neutral-900 select-none">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="p-1.5 sm:p-2 text-neutral-500 hover:text-neutral-950 hover:bg-stone-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(item.cartItemId)}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
