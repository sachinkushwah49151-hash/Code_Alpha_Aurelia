import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { Button } from './Button';

export const FeaturedProductShowcase = ({ product }) => {
  const { addToCart } = useCart();
  const cardRef = useRef(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0]?.name || 'Matte Obsidian'
  );
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleQuickAdd = () => {
    setIsAdding(true);
    addToCart(product, 1, selectedColor);
    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <section className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-[#faf8f5] via-stone-100/60 to-[#faf8f5] overflow-hidden border-y border-stone-200/80">
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200/90 text-stone-700 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#b38a4a]" />
            <span>Featured Spotlight</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light text-neutral-950 tracking-tight">
            The <span className="font-semibold text-neutral-900">Aurelia Air X1</span> Experience
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Bespoke acoustic architecture calibrated for undisturbed creative flow.
          </p>
        </div>

        {/* 3D Interactive Stage */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative max-w-4xl mx-auto rounded-3xl bg-white/80 backdrop-blur-xl border border-stone-200/90 shadow-2xl p-6 sm:p-12 transition-all duration-300 ease-out"
          style={{
            perspective: '1200px',
          }}
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Left Column: 3D Floating Product Layer (7 cols) */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              {/* Radial Halo Glow */}
              <div
                className="absolute inset-0 bg-gradient-radial from-[#c5a880]/20 to-transparent rounded-full filter blur-xl transform transition-transform duration-300"
                style={{ transform: 'translateZ(10px)' }}
              />

              {/* Floating Product Image with Depth */}
              <div
                className="relative aspect-square w-full max-w-sm sm:max-w-md mx-auto transform transition-all duration-500"
                style={{
                  transform: isHovered ? 'translateZ(60px) scale(1.05)' : 'translateZ(30px) scale(1)',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] select-none"
                />

                {/* Floating 3D Depth Spec Tags */}
                <div
                  className="absolute top-6 left-2 sm:-left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-lg text-[11px] font-semibold text-neutral-800 flex items-center gap-1.5 transition-transform duration-500"
                  style={{
                    transform: isHovered ? 'translateZ(90px) translateY(-5px)' : 'translateZ(40px)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                  <span>40mm Beryllium Drivers</span>
                </div>

                <div
                  className="absolute bottom-6 right-2 sm:-right-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-lg text-[11px] font-semibold text-neutral-800 flex items-center gap-1.5 transition-transform duration-500"
                  style={{
                    transform: isHovered ? 'translateZ(90px) translateY(5px)' : 'translateZ(40px)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>42-Hour Hybrid ANC</span>
                </div>
              </div>

              {/* Dynamic Floating Floor Shadow */}
              <div
                className="absolute -bottom-4 inset-x-12 h-6 bg-neutral-950/15 rounded-full blur-md transform transition-all duration-300"
                style={{
                  transform: isHovered ? 'scale(1.1) opacity(0.8)' : 'scale(1) opacity(0.5)',
                }}
              />
            </div>

            {/* Right Column: Information, Swatches & CTA (5 cols) */}
            <div
              className="lg:col-span-5 space-y-6"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">
                    {product.rating} (142 reviews)
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-light text-neutral-950 tracking-tight leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1.5 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-4 border-b border-stone-100">
                <span className="text-3xl font-bold text-neutral-950">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b38a4a] bg-[#fbf7f0] border border-[#ecd5b3] px-2 py-0.5 rounded">
                  In Stock • Dispatch in 24h
                </span>
              </div>

              {/* Finish Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Finish: <span className="font-normal text-stone-500">{selectedColor}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`group relative flex items-center p-1 rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                              : 'border-transparent hover:border-stone-300'
                          }`}
                          title={color.name}
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-stone-300 shadow-inner flex items-center justify-center"
                            style={{ backgroundColor: color.hex }}
                          >
                            {isSelected && (
                              <Check
                                className={`w-3 h-3 ${
                                  ['#ffffff', '#ded6c9', '#f0ece1'].includes(color.hex.toLowerCase())
                                    ? 'text-neutral-900'
                                    : 'text-white'
                                }`}
                              />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleQuickAdd}
                  isLoading={isAdding}
                  className="flex-1 shadow-md hover:shadow-lg"
                  icon={ShoppingBag}
                >
                  Quick Add to Bag
                </Button>
                <Link to={`/product/${product.id}`} className="flex-1">
                  <Button variant="outline" size="lg" fullWidth className="group">
                    <span>Explore Product</span>
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
