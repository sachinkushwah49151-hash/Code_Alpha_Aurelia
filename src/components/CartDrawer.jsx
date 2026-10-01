import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { CartItem } from './CartItem';
import { Button } from './Button';

export const CartDrawer = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    freeShippingThreshold,
    totalItemCount,
  } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        setIsCartDrawerOpen(false);
      }
    };
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl border-l border-stone-200 z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-neutral-900" />
            <h3 className="text-base font-semibold text-neutral-900">
              Your Bag ({totalItemCount})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#faf8f5] px-5 py-3 border-b border-stone-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-stone-700">
              <Truck className="w-3.5 h-3.5 text-[#b38a4a]" />
              {amountNeeded === 0 ? (
                <span className="font-semibold text-emerald-700">
                  Complimentary express shipping unlocked
                </span>
              ) : (
                <span>
                  Add <span className="font-semibold text-neutral-900">{formatPrice(amountNeeded)}</span> for free shipping
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold text-stone-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                progressPercent >= 100 ? 'bg-emerald-600' : 'bg-[#c5a880]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <p className="text-base font-semibold text-neutral-900">Your bag is empty</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  Explore our curated architectural hardware and timeless wardrobe staples.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/shop');
                }}
              >
                Browse Catalog
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {cart.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200/90 bg-[#faf8f5]/60 space-y-4">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-neutral-900">Subtotal</span>
                <span className="text-base font-bold text-neutral-950">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Taxes, shipping, and promotional codes computed at final checkout
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                className="group shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </Button>

              <button
                type="button"
                onClick={handleViewCart}
                className="w-full py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors text-center cursor-pointer"
              >
                View Full Cart Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
