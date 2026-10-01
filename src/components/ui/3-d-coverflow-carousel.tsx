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

    // Horizontal swipe threshold: 40px and more horizontal than vertical
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
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
      className={`relative w-full py-16 sm:py-24 bg-[#faf8f5] overflow-hidden border-y border-stone-200/80 select-none ${className}`}
      aria-label="3D Coverflow Featured Collection Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Soft Studio Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(197, 168, 128, 0.12) 0%, rgba(250, 248, 245, 0.6) 65%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b38a4a]" />
              <span className="text-xs font-mono font-medium tracking-[0.25em] uppercase text-[#b38a4a]">
                {eyebrow}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-neutral-950">
              {title.includes('Collection') ? (
                <>
                  {title.replace('Collection', '')}
                  <span className="font-semibold">Collection</span>
                </>
              ) : (
                title
              )}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-normal mt-2 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Desktop Navigation Controls Header */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium text-stone-500 tracking-widest hidden sm:inline-block mr-2">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>

            <button
              onClick={() => {
                markUserInteraction();
                handlePrev();
              }}
              className="w-11 h-11 rounded-full border border-stone-200/90 bg-white/90 hover:bg-stone-50 active:scale-95 text-neutral-800 hover:text-neutral-950 hover:border-[#b38a4a]/50 transition-all flex items-center justify-center shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a]"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700" />
            </button>

            <button
              onClick={() => {
                markUserInteraction();
                handleNext();
              }}
              className="w-11 h-11 rounded-full border border-stone-200/90 bg-white/90 hover:bg-stone-50 active:scale-95 text-neutral-800 hover:text-neutral-950 hover:border-[#b38a4a]/50 transition-all flex items-center justify-center shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a]"
              aria-label="Next product"
            >
              <ChevronRight className="w-5 h-5 text-neutral-700" />
            </button>
          </div>
        </div>

        {/* 3D Coverflow Stage */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[470px] sm:h-[520px] lg:h-[550px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a]/30 rounded-3xl"
          style={{
            perspective: '1200px',
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

            // Dynamic 3D Transform values
            let transformStyle = '';
            let zIndex = 10;
            let opacity = 0.25;
            let filter = 'blur(1.5px)';

            if (prefersReducedMotion) {
              // Reduced motion: flat 2D arrangement
              const shiftX = diff * 70;
              transformStyle = `translateX(${shiftX}%) scale(${isCenter ? 1 : 0.88})`;
              opacity = isCenter ? 1 : 0.45;
              zIndex = isCenter ? 30 : 20 - Math.abs(diff);
              filter = 'none';
            } else if (isCenter) {
              transformStyle = 'translateX(0%) translateZ(40px) rotateY(0deg) scale(1)';
              zIndex = 30;
              opacity = 1;
              filter = 'none';
            } else if (diff === 1) {
              // Immediate Right
              transformStyle = 'translateX(62%) translateZ(-130px) rotateY(-34deg) scale(0.85)';
              zIndex = 20;
              opacity = 0.65;
              filter = 'blur(0.5px)';
            } else if (diff === -1) {
              // Immediate Left
              transformStyle = 'translateX(-62%) translateZ(-130px) rotateY(34deg) scale(0.85)';
              zIndex = 20;
              opacity = 0.65;
              filter = 'blur(0.5px)';
            } else if (diff === 2) {
              // Far Right
              transformStyle = 'translateX(118%) translateZ(-280px) rotateY(-48deg) scale(0.70)';
              zIndex = 10;
              opacity = 0.28;
              filter = 'blur(1.8px)';
            } else if (diff === -2) {
              // Far Left
              transformStyle = 'translateX(-118%) translateZ(-280px) rotateY(48deg) scale(0.70)';
              zIndex = 10;
              opacity = 0.28;
              filter = 'blur(1.8px)';
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
                className={`absolute w-[290px] sm:w-[330px] lg:w-[360px] cursor-pointer will-change-transform ${
                  isCenter ? 'cursor-default' : 'hover:opacity-85'
                }`}
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                  filter,
                  transition: prefersReducedMotion
                    ? 'transform 300ms ease, opacity 300ms ease'
                    : 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), filter 650ms ease, box-shadow 650ms ease',
                }}
              >
                {/* Product Card Container */}
                <div
                  className={`relative rounded-3xl bg-white border overflow-hidden transition-all duration-300 ${
                    isCenter
                      ? 'border-[#b38a4a]/40 shadow-2xl shadow-stone-900/12 ring-1 ring-[#b38a4a]/20'
                      : 'border-stone-200/80 shadow-md shadow-stone-900/5'
                  }`}
                >
                  {/* Top Image Stage */}
                  <div className="relative aspect-[4/3.3] w-full bg-[#f6f4f0] overflow-hidden flex items-center justify-center p-6 border-b border-stone-100">
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-mono font-medium tracking-[0.18em] uppercase text-[#b38a4a] border border-stone-200/60 shadow-sm backdrop-blur-sm">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Rating pill */}
                    {product.rating && (
                      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-xs font-medium text-neutral-800 border border-stone-200/60 shadow-sm backdrop-blur-sm">
                        <Star className="w-3 h-3 fill-[#c5a880] text-[#c5a880]" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transform transition-transform duration-700 ease-out group-hover:scale-105 select-none pointer-events-none"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </div>

                  {/* Card Content Information */}
                  <div className="p-5 sm:p-6 space-y-3 bg-white">
                    <div>
                      <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-stone-500 font-semibold mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-lg sm:text-xl font-medium text-neutral-900 tracking-tight leading-snug line-clamp-1">
                        {product.name}
                      </h3>
                      {product.shortDescriptor && (
                        <p className="text-xs text-neutral-500 font-normal line-clamp-1 mt-0.5">
                          {product.shortDescriptor}
                        </p>
                      )}
                    </div>

                    {/* Price and CTA Button */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-neutral-400 block -mb-0.5">Price</span>
                        <span className="text-base sm:text-lg font-semibold text-neutral-950 tracking-tight">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {isCenter ? (
                        <Link
                          to={`/product/${product.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-medium tracking-wide transition-all shadow-sm hover:shadow group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a]"
                          aria-label={`View details for ${product.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <span>View Product</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-[#c5a880]" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToSlide(idx);
                          }}
                          className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
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

        {/* Bottom Pagination Dots & Mobile Nav */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Subtle helper hint */}
          <p className="text-xs text-stone-400 font-normal hidden sm:block">
            Use arrow keys or swipe to navigate the collection
          </p>

          {/* Interactive Pagination Dots */}
          <div
            className="flex items-center gap-2"
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
                  className={`h-2 transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a4a] ${
                    isActive
                      ? 'w-8 bg-[#b38a4a]'
                      : 'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              );
            })}
          </div>

          {/* Direct Shop Link */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-[#b38a4a] transition-colors group"
          >
            <span>View All Archive</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-[#b38a4a]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ThreeDCoverflowCarousel;
