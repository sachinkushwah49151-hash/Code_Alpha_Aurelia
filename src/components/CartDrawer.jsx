import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Truck, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { Button } from './Button';

export const CartDrawer = () => {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cart,
    totalItemCount,
    cartSubtotal,
    freeShippingThreshold,
    shippingFee,
    discountAmount,
    cartTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, closeCartDrawer]);

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  const handleProceedToCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleViewBag = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
          />

          {/* Slide-out Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden border-l border-stone-200"
            >
              {/* Header */}
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-neutral-950">
                    Your Bag
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeCartDrawer}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Tracker */}
              <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-neutral-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-stone-500" />
                    {amountNeededForFreeShipping === 0 ? (
                      <span className="text-emerald-700 font-semibold">
                        Free Express Delivery Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <span className="font-bold text-neutral-900">{formatPrice(amountNeededForFreeShipping)}</span> for free shipping
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-[11px] text-stone-500">{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      freeShippingProgress >= 100 ? 'bg-emerald-600' : 'bg-neutral-900'
                    }`}
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List or Empty State */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-neutral-900">Your bag is empty</p>
                      <p className="text-xs text-stone-500 max-w-xs">
                        Explore our latest audio releases and everyday essentials.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        closeCartDrawer();
                        navigate('/shop');
                      }}
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                              {item.name}
                            </h4>
                            <span className="text-xs font-bold text-neutral-950 shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                          {item.color && (
                            <p className="text-[11px] text-stone-500">{item.color}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          {/* Stepper */}
                          <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="p-1 text-stone-500 hover:text-neutral-900 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="p-1 text-stone-500 hover:text-neutral-900 disabled:opacity-30 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Summary */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-neutral-900">
                        {formatPrice(cartSubtotal)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-emerald-700 font-semibold uppercase">Free</span>
                        ) : (
                          formatPrice(shippingFee)
                        )}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-neutral-900">Total</span>
                      <span className="text-lg font-bold text-neutral-950">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleProceedToCheckout}
                      className="group shadow-md"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={handleViewBag}
                      className="bg-white"
                    >
                      View Full Bag
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
