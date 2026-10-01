import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ShieldCheck, ArrowRight, Truck, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { Button } from './Button';

export const OrderSummary = ({ showCheckoutButton = true, onCheckout, isCheckingOut = false }) => {
  const {
    cartSubtotal,
    shippingFee,
    discountAmount,
    estimatedTax,
    cartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    freeShippingThreshold,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-5">
      <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
        Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-neutral-800">
            <Truck className="w-3.5 h-3.5 text-neutral-600" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-semibold">You unlocked Free Express Shipping!</span>
            ) : (
              <span>
                Add <span className="font-semibold text-neutral-900">{formatPrice(amountNeededForFreeShipping)}</span> for free shipping
              </span>
            )}
          </span>
          <span className="font-bold text-[11px] text-neutral-500">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              freeShippingProgress >= 100 ? 'bg-emerald-600' : 'bg-neutral-900'
            }`}
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Promo Code Input */}
      <div>
        {appliedPromo ? (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-medium">
              <Tag className="w-3.5 h-3.5" />
              <span>
                Code <span className="font-bold font-mono">{appliedPromo.code}</span> applied ({appliedPromo.discountPercent ? `${appliedPromo.discountPercent}% OFF` : 'Free Shipping'})
              </span>
            </div>
            <button
              type="button"
              onClick={removePromoCode}
              className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="space-y-1">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code (e.g. AURELIA10)"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoError('');
                }}
                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs uppercase tracking-wider text-neutral-900 placeholder:normal-case placeholder:tracking-normal placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              />
              <Button type="submit" variant="secondary" size="sm">
                Apply
              </Button>
            </div>
            {promoError && (
              <p className="text-[11px] text-rose-500 font-medium">{promoError}</p>
            )}
          </form>
        )}
      </div>

      {/* Financial Line Items */}
      <div className="space-y-3 pt-2 text-sm border-t border-stone-100">
        <div className="flex justify-between text-neutral-600 text-xs sm:text-sm">
          <span>Subtotal</span>
          <span className="font-medium text-neutral-900">{formatPrice(cartSubtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 text-xs sm:text-sm">
            <span>Promotional Discount</span>
            <span className="font-semibold">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-neutral-600 text-xs sm:text-sm">
          <span>Estimated Shipping</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-emerald-700 font-semibold text-xs uppercase tracking-wider">Free</span>
            ) : (
              <span className="font-medium text-neutral-900">{formatPrice(shippingFee)}</span>
            )}
          </span>
        </div>

        <div className="flex justify-between text-neutral-600 text-xs sm:text-sm">
          <span className="flex items-center gap-1">
            Estimated GST (18%)
            <span className="text-[10px] text-stone-400">(Inclusive)</span>
          </span>
          <span className="text-stone-500">{formatPrice(estimatedTax)}</span>
        </div>

        <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
          <div>
            <span className="text-base font-semibold text-neutral-900">Total</span>
            <p className="text-[11px] text-stone-400">Includes all applicable duties & taxes</p>
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
            {formatPrice(cartTotal)}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      {showCheckoutButton && (
        <div className="pt-2">
          <Link to="/checkout" className="block">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      )}

      {/* Checkout button trigger when used directly inside Checkout page */}
      {onCheckout && (
        <div className="pt-2">
          <Button
            type="button"
            onClick={onCheckout}
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isCheckingOut}
            className="group"
          >
            <span>Place Order</span>
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

      {/* Trust & Guarantee Badges */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-4 text-[11px] text-stone-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          256-Bit SSL Encrypted
        </span>
        <span>•</span>
        <span>30-Day Free Returns</span>
      </div>
    </div>
  );
};
