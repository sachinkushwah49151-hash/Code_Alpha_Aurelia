import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export interface CoverflowProduct {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  shortDescriptor?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  image: string;
}

export interface ThreeDCoverflowCarouselProps {
  items: CoverflowProduct[];
  initialIndex?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ThreeDCoverflowCarousel: React.FC<ThreeDCoverflowCarouselProps> = ({
  items,
  initialIndex = 0,
  autoplay = true,
  autoplayInterval = 5500,
  eyebrow = 'AURELIA EDIT',
  title = 'Explore the Collection',
  subtitle = 'Discover pieces designed to fit effortlessly into everyday life.',
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = items?.length || 0;

  // Listen for prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const markUserInteraction = useCallback(() => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    // Resume autoplay after 7 seconds of inactivity
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 7000);
  }, []);

  const goToSlide = (index: number) => {
    markUserInteraction();
    setActiveIndex((index + total) % total);
  };

  // Autoplay effect
  useEffect(() => {
    if (!autoplay || prefersReducedMotion || isHovered || isInteracting || total <= 1) {
      return;
    }

    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, prefersReducedMotion, isHovered, isInteracting, total, handleNext]);

  // Cleanup interaction timeout on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      markUserInteraction();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      markUserInteraction();
      handleNext();
    }
  };

  // Touch / Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - touchStartRef.current.x;
    const deltaY = endY - touchStartRef.current.y;

    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      markUserInteraction();
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartRef.current = null;
  };

  if (!items || items.length === 0) {
    return null;
  }

  // Calculate circular offset relative to activeIndex
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section
      className={`relative w-full py-10 sm:py-14 bg-[#faf8f5] overflow-hidden border-y border-stone-200/80 select-none ${className}`}
      aria-label="3D Coverflow Featured Collection Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Centered, Clean Editorial) */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs font-mono font-medium tracking-[0.28em] uppercase text-[#b38a4a] mb-1.5">
            {eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-neutral-950">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-normal mt-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Compact 3D Coverflow Stage (Height: 420-440px) */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[420px] sm:h-[440px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a]/30 rounded-2xl"
          style={{
            perspective: '1100px',
            transformStyle: 'preserve-3d',
          }}
          aria-roledescription="carousel"
          aria-label="Featured Collection 3D Carousel"
        >
          {items.map((product, idx) => {
            const diff = getOffset(idx);
            const isCenter = diff === 0;
            const isHidden = Math.abs(diff) > 2;

            if (isHidden) {
              return (
                <div
                  key={product.id}
                  className="absolute pointer-events-none opacity-0 invisible"
                  aria-hidden="true"
                />
              );
            }

            // Calibrated 3D Transform values (Center: 1.0/1.0, Adjacent: 0.85/0.75, Far: 0.70/0.45)
            let transformStyle = '';
            let zIndex = 10;
            let opacity = 0.45;

            if (prefersReducedMotion) {
              const shiftX = diff * 65;
              transformStyle = `translateX(${shiftX}%) scale(${isCenter ? 1 : 0.86})`;
              opacity = isCenter ? 1 : 0.6;
              zIndex = isCenter ? 30 : 20 - Math.abs(diff);
            } else if (isCenter) {
              transformStyle = 'translateX(0%) translateZ(40px) rotateY(0deg) scale(1)';
              zIndex = 30;
              opacity = 1;
            } else if (diff === 1) {
              // Immediate Right (Crisp, High Contrast, Visible)
              transformStyle = 'translateX(64%) translateZ(-90px) rotateY(-30deg) scale(0.85)';
              zIndex = 20;
              opacity = 0.75;
            } else if (diff === -1) {
              // Immediate Left (Crisp, High Contrast, Visible)
              transformStyle = 'translateX(-64%) translateZ(-90px) rotateY(30deg) scale(0.85)';
              zIndex = 20;
              opacity = 0.75;
            } else if (diff === 2) {
              // Far Right
              transformStyle = 'translateX(116%) translateZ(-190px) rotateY(-44deg) scale(0.70)';
              zIndex = 10;
              opacity = 0.45;
            } else if (diff === -2) {
              // Far Left
              transformStyle = 'translateX(-116%) translateZ(-190px) rotateY(44deg) scale(0.70)';
              zIndex = 10;
              opacity = 0.45;
            }

            return (
              <div
                key={product.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${product.name} (${idx + 1} of ${total})`}
                aria-hidden={!isCenter}
                onClick={() => {
                  if (!isCenter) {
                    goToSlide(idx);
                  }
                }}
                className={`absolute w-[285px] sm:w-[305px] lg:w-[315px] h-[410px] sm:h-[430px] cursor-pointer will-change-transform ${
                  isCenter ? 'cursor-default' : 'hover:opacity-95'
                }`}
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                  transition: prefersReducedMotion
                    ? 'transform 280ms ease, opacity 280ms ease'
                    : 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 600ms ease',
                }}
              >
                {/* Product Card Container */}
                <div
                  className={`relative w-full h-full rounded-2xl bg-white border flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                    isCenter
                      ? 'border-[#b38a4a]/45 shadow-xl shadow-stone-900/12 ring-1 ring-[#b38a4a]/20'
                      : 'border-stone-300 shadow-md shadow-stone-900/8'
                  }`}
                >
                  {/* Top Image Stage */}
                  <div className="relative h-[210px] sm:h-[225px] w-full bg-[#f8f6f2] overflow-hidden flex items-center justify-center p-4 border-b border-stone-200/70">
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-mono font-medium tracking-[0.16em] uppercase text-[#b38a4a] border border-stone-200/80 shadow-xs">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Rating pill */}
                    {product.rating && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 text-[11px] font-medium text-neutral-800 border border-stone-200/80 shadow-xs">
                        <Star className="w-3 h-3 fill-[#c5a880] text-[#c5a880]" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transform transition-transform duration-500 ease-out select-none pointer-events-none"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </div>

                  {/* Card Content Information */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-stone-500 font-semibold mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-base sm:text-lg font-medium text-neutral-900 tracking-tight leading-snug line-clamp-1">
                        {product.name}
                      </h3>
                      {product.shortDescriptor && (
                        <p className="text-xs text-neutral-500 font-normal line-clamp-1 mt-1">
                          {product.shortDescriptor}
                        </p>
                      )}
                    </div>

                    {/* Price and CTA Button */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                      <div>
                        <span className="text-[11px] text-neutral-400 block -mb-0.5">Price</span>
                        <span className="text-base sm:text-lg font-semibold text-neutral-950 tracking-tight">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {isCenter ? (
                        <Link
                          to={`/product/${product.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium tracking-wide transition-all shadow-xs group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a]"
                          aria-label={`View details for ${product.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <span>View Product</span>
                          <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform text-[#c5a880]" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToSlide(idx);
                          }}
                          className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors py-1 px-2.5 rounded-full bg-stone-100 hover:bg-stone-200"
                        >
                          Focus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact Navigation Controls Below Stage: [ ←  • • ━━━ • •  → ] */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => {
              markUserInteraction();
              handlePrev();
            }}
            className="w-9 h-9 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 active:scale-95 text-neutral-800 hover:border-[#b38a4a]/50 transition-all flex items-center justify-center shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a]"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-4 h-4 text-neutral-700" />
          </button>

          {/* Interactive Pagination Dots: • • ━━━ • • */}
          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label="Carousel pagination"
          >
            {items.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${idx + 1}: ${item.name}`}
                  onClick={() => goToSlide(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a] ${
                    isActive
                      ? 'w-7 bg-[#b38a4a]'
                      : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              );
            })}
          </div>

          <button
            onClick={() => {
              markUserInteraction();
              handleNext();
            }}
            className="w-9 h-9 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 active:scale-95 text-neutral-800 hover:border-[#b38a4a]/50 transition-all flex items-center justify-center shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a]"
            aria-label="Next product"
          >
            <ChevronRight className="w-4 h-4 text-neutral-700" />
          </button>
        </div>

        {/* View All Products Link */}
        <div className="mt-4 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:text-[#b38a4a] transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-[#b38a4a]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ThreeDCoverflowCarousel;
