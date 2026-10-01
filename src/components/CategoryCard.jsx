import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/shop?category=${category.id}`}
      className="group relative h-72 sm:h-80 lg:h-96 rounded-2xl overflow-hidden block bg-neutral-900 shadow-sm border border-stone-200/50"
    >
      {/* Background Image with Zoom */}
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-95"
      />

      {/* Dark / Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

      {/* Category Content */}
      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
        {/* Top Product Count Pill */}
        <div className="self-end">
          <span className="text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
            {category.itemCount}
          </span>
        </div>

        {/* Bottom Details with hover animation */}
        <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
          <p className="text-xs font-medium text-stone-300 uppercase tracking-widest mb-1">
            Explore
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {category.name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-neutral-900 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
          {category.tagline && (
            <p className="text-xs text-stone-300 mt-1 line-clamp-1 opacity-90">
              {category.tagline}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
