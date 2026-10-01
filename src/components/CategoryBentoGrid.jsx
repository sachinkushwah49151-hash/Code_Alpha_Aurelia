import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export const CategoryBentoGrid = () => {
  // Use first 6 core categories for the Bento layout
  const bentoCategories = CATEGORIES.slice(0, 6);

  // Bento layout configuration per item index
  const bentoSpans = [
    'md:col-span-2 md:row-span-2 h-80 sm:h-96 md:h-[440px]', // 1. Electronics (Large Hero Tile)
    'md:col-span-1 md:row-span-1 h-64 sm:h-72 md:h-[210px]', // 2. Audio
    'md:col-span-1 md:row-span-2 h-80 sm:h-96 md:h-[440px]', // 3. Fashion (Tall Portrait Tile)
    'md:col-span-1 md:row-span-1 h-64 sm:h-72 md:h-[210px]', // 4. Accessories
    'md:col-span-2 md:row-span-1 h-64 sm:h-72 md:h-[210px]', // 5. Home (Wide Tile)
    'md:col-span-1 md:row-span-1 h-64 sm:h-72 md:h-[210px]', // 6. Lifestyle
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {bentoCategories.map((category, index) => {
        const spanClass = bentoSpans[index] || 'h-72';

        return (
          <Link
            key={category.id}
            to={`/shop?category=${category.id}`}
            className={`group relative rounded-2xl overflow-hidden block bg-neutral-900 border border-stone-200/60 shadow-sm ${spanClass}`}
          >
            {/* Background Image with Zoom */}
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-95"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
              {/* Top Item Count Pill */}
              <div className="self-end">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
                  {category.itemCount}
                </span>
              </div>

              {/* Bottom Details with smooth hover translation */}
              <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                <p className="text-[10px] sm:text-xs font-medium text-stone-300 uppercase tracking-widest mb-1">
                  Collection
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
                    {category.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md group-hover:bg-[#c5a880] group-hover:text-neutral-950 transition-all duration-300 shadow-sm">
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
                {category.tagline && (
                  <p className="text-xs text-stone-300 mt-1 line-clamp-1 opacity-90 font-light">
                    {category.tagline}
                  </p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
