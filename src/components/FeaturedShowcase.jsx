import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight, Check, Sparkles, Volume2, ShieldCheck, BatteryCharging } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { formatPrice } from '../utils/formatters';
import { Product3DViewer } from './3d/Product3DViewer';
import { SpotlightCard } from './SpotlightCard';
import { Button } from './Button';

export const FeaturedShowcase = () => {
  const product = PRODUCTS.find((p) => p.id === 'aero-x1-headphones') || PRODUCTS[0];
  const { addToCart } = useCart();

  const [selectedFinish, setSelectedFinish] = useState(
    product.colors ? product.colors[0] : { name: 'Matte Obsidian', hex: '#1c1c1e' }
  );
  const [autoRotate, setAutoRotate] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, 1, selectedFinish.name);
    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-4">
      <SpotlightCard
        theme="dark"
        spotlightColor="rgba(255, 255, 255, 0.08)"
        className="rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl p-6 sm:p-10 lg:p-14"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT: 3D Product Interactive Canvas (7 cols on lg) */}
          <div className="lg:col-span-7 relative flex flex-col items-center">
            {/* Soft Ambient Radial Halo behind 3D object */}
            <div className="absolute inset-0 max-w-md mx-auto aspect-square bg-gradient-to-tr from-amber-500/10 via-neutral-800/20 to-neutral-700/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* 3D Canvas */}
            <div className="w-full h-80 sm:h-96 lg:h-[460px] relative">
              <Product3DViewer
                finishColor={selectedFinish.hex}
                autoRotate={autoRotate}
                interactive={true}
                className="w-full h-full"
              />
            </div>

            {/* Finish Swatches & 3D Mode Toggle Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 w-full max-w-md px-2 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 mr-1">
                  Finish:
                </span>
                {product.colors &&
                  product.colors.map((color) => {
                    const isSelected = selectedFinish.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedFinish(color)}
                        className={`group relative flex items-center p-1 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-white ring-1 ring-white/40'
                            : 'border-transparent hover:border-neutral-700'
                        }`}
                        title={color.name}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-neutral-700 shadow-inner flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                      </button>
                    );
                  })}
              </div>

              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                {autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              </button>
            </div>
          </div>

          {/* RIGHT: Editorial Product Details & Purchase Actions (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono tracking-wider text-stone-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Signature 3D Interactive Showcase</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
                {product.name}
              </h2>
              <p className="text-sm font-mono text-stone-400 uppercase tracking-widest">
                {product.shortDescriptor}
              </p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-white">{product.rating}</span>
              <span className="text-stone-400">({product.reviews} collector reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-stone-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded">
                Save 23%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Micro Feature Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-stone-400 shrink-0" />
                <span>40mm Beryllium Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-stone-400 shrink-0" />
                <span>42-Hour Fast Charge</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0" />
                <span>2-Year Global Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Hybrid Active Noise Cancelling</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                isLoading={isAdding}
                icon={ShoppingBag}
                className="bg-white text-neutral-950 hover:bg-stone-200 border-none flex-1 group shadow-lg"
              >
                <span>Add to Bag • {selectedFinish.name}</span>
              </Button>

              <Link to={`/product/${product.id}`} className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  className="border-neutral-700 text-white hover:bg-neutral-900 group"
                >
                  <span>Explore Product</span>
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </section>
  );
};
