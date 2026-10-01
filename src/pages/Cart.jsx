import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';
import { OrderSummary } from '../components/OrderSummary';
import { Button } from '../components/Button';

export const Cart = () => {
  useDocumentTitle('Shopping Cart');
  const { cart, updateQuantity, removeFromCart, clearCart, totalItemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Polished Empty Cart State */}
        <div className="max-w-md mx-auto text-center space-y-6 bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-neutral-800 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-8 h-8 text-neutral-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-light text-neutral-950">
              Your bag is <span className="font-semibold">empty</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              You haven&apos;t added any items yet. Discover our latest acoustic releases,
              minimal task lighting, and everyday essentials.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/shop">
              <Button variant="primary" size="lg" fullWidth className="group">
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Quick Category links */}
          <div className="pt-4 border-t border-stone-100">
            <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
              Popular Destinations
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                to="/shop?category=electronics"
                className="text-xs px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Electronics
              </Link>
              <Link
                to="/shop?category=home"
                className="text-xs px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Home & Living
              </Link>
              <Link
                to="/shop?category=fashion"
                className="text-xs px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Fashion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
            Order Review
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-neutral-950 mt-1">
            Shopping <span className="font-semibold">Cart</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-600 transition-colors p-2 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Bag</span>
        </button>
      </div>

      {/* Two Column Layout: Cart Items (Left) + Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cart Items List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm">
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

          <div className="pt-6 mt-4 flex items-center justify-between text-xs text-neutral-600 border-t border-stone-100">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-neutral-900 font-semibold hover:text-neutral-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
            <span className="text-stone-400">Taxes calculated at checkout</span>
          </div>
        </div>

        {/* Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 sticky top-28">
          <OrderSummary showCheckoutButton={true} />
        </div>
      </div>
    </div>
  );
};
