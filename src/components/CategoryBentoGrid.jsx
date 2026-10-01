import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/products';

export const CategoryBentoGrid = () => {
  const electronics = CATEGORIES.find((c) => c.id === 'electronics');
  const fashion = CATEGORIES.find((c) => c.id === 'fashion');
  const home = CATEGORIES.find((c) => c.id === 'home');
  const accessories = CATEGORIES.find((c) => c.id === 'accessories');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
      {/* 1. Large Electronics Block (8 cols on desktop) */}
      {electronics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="md:col-span-7 lg:col-span-8 group relative h-80 sm:h-96 rounded-2xl overflow-hidden block bg-neutral-950 border border-stone-200/60 shadow-sm"
        >
          <Link to={`/shop?category=${electronics.id}`} className="block w-full h-full">
            <img
              src={electronics.image}
              alt={electronics.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104 group-hover:brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/15">
                  Flagship Hardware
                </span>
                <span className="text-xs text-stone-300 font-medium">{electronics.itemCount}</span>
              </div>

              <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-1">
                  Collection 01
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                      {electronics.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 mt-1 font-light max-w-md">
                      {electronics.tagline}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-neutral-950 transition-all duration-300 shrink-0 ml-4">
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* 2. Accessories Block (4 cols on desktop) */}
      {accessories && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-5 lg:col-span-4 group relative h-80 sm:h-96 rounded-2xl overflow-hidden block bg-neutral-950 border border-stone-200/60 shadow-sm"
        >
          <Link to={`/shop?category=${accessories.id}`} className="block w-full h-full">
            <img
              src={accessories.image}
              alt={accessories.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104 group-hover:brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/15">
                  Essentials
                </span>
                <span className="text-xs text-stone-300 font-medium">{accessories.itemCount}</span>
              </div>

              <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-1">
                  Collection 02
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white">
                      {accessories.name}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 font-light line-clamp-1">
                      {accessories.tagline}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-neutral-950 transition-all duration-300 shrink-0 ml-3">
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* 3. Home Living Block (4 cols on desktop) */}
      {home && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-5 lg:col-span-4 group relative h-80 sm:h-96 rounded-2xl overflow-hidden block bg-neutral-950 border border-stone-200/60 shadow-sm"
        >
          <Link to={`/shop?category=${home.id}`} className="block w-full h-full">
            <img
              src={home.image}
              alt={home.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104 group-hover:brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/15">
                  Spaces
                </span>
                <span className="text-xs text-stone-300 font-medium">{home.itemCount}</span>
              </div>

              <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-1">
                  Collection 03
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white">
                      {home.name}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 font-light line-clamp-1">
                      {home.tagline}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-neutral-950 transition-all duration-300 shrink-0 ml-3">
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* 4. Large Fashion Block (8 cols on desktop) */}
      {fashion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-7 lg:col-span-8 group relative h-80 sm:h-96 rounded-2xl overflow-hidden block bg-neutral-950 border border-stone-200/60 shadow-sm"
        >
          <Link to={`/shop?category=${fashion.id}`} className="block w-full h-full">
            <img
              src={fashion.image}
              alt={fashion.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104 group-hover:brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/15">
                  Organic Tailoring
                </span>
                <span className="text-xs text-stone-300 font-medium">{fashion.itemCount}</span>
              </div>

              <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-1">
                  Collection 04
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                      {fashion.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 mt-1 font-light max-w-md">
                      {fashion.tagline}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-neutral-950 transition-all duration-300 shrink-0 ml-4">
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
};
