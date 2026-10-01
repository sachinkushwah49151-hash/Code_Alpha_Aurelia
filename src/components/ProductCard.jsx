import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice, calculateDiscountPercent } from '../utils/formatters';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const discount = calculateDiscountPercent(product.price, product.originalPrice);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, product.colors ? product.colors[0]?.name : null);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 hover:border-stone-400 transition-all duration-300 hover:shadow-xl hover:shadow-stone-900/5 overflow-hidden">
      {/* Top Image Container with 4:5 Aspect Ratio */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 block"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-900 text-white backdrop-blur-md shadow-xs">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button with Motion Spring Pop */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlist}
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/85 text-stone-600 hover:bg-white hover:text-neutral-950 backdrop-blur-xs'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : 'group-hover:scale-105'
            }`}
          />
        </motion.button>

        {/* Primary Image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-104 ${
            product.secondaryImage ? 'group-hover:opacity-0' : ''
          }`}
        />

        {/* Secondary Angle / Lifestyle Image (Smooth Cross-fade Reveal) */}
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-104"
          />
        )}

        {/* Quick Add Button Reveal on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:block">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900/90 hover:bg-neutral-900 text-white backdrop-blur-md'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Info Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="uppercase tracking-widest text-[10px] font-mono text-stone-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-stone-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-semibold">{product.rating}</span>
              <span className="text-[10px] text-stone-400">({product.reviews})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.id}`}
            className="group-hover:text-neutral-600 transition-colors"
          >
            <h3 className="font-medium text-sm sm:text-base text-neutral-900 tracking-tight leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Short Descriptor */}
          {product.shortDescriptor && (
            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-normal">
              {product.shortDescriptor}
            </p>
          )}
        </div>

        {/* Price & Mobile Quick Add */}
        <div className="flex items-baseline justify-between pt-1 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile visible add button */}
          <button
            onClick={handleQuickAdd}
            type="button"
            className="sm:hidden p-1.5 rounded-lg bg-stone-100 text-stone-800 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
