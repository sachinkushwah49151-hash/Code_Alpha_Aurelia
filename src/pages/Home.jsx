import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { CategoryBentoGrid } from '../components/CategoryBentoGrid';
import { FeaturedShowcase } from '../components/FeaturedShowcase';
import { Hero3DCanvas } from '../components/3d/Hero3DCanvas';
import { SpotlightCard } from '../components/SpotlightCard';
import { Button } from '../components/Button';

export const Home = () => {
  useDocumentTitle('NOVA — Modern E-Commerce');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Products
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 4);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-24 lg:gap-32 overflow-hidden">
      {/* ========================================================
          1. SIGNATURE 3D HERO SECTION
      ======================================================== */}
      <section className="relative pt-6 sm:pt-10 lg:pt-16 overflow-hidden">
        {/* Subtle Ambient Radial Background Glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Actions (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6 sm:space-y-8 z-10"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100/90 border border-stone-200 text-neutral-800 text-xs font-semibold tracking-wide backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>The 2026 Architectural Essentials Collection</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-neutral-950 leading-[1.06]">
                Everything you want. <br />
                <span className="font-semibold text-neutral-900">Nothing you don&apos;t.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-xl font-normal leading-relaxed">
                NOVA curates meticulously engineered acoustic hardware, ambient circadian lighting,
                heavyweight organic textiles, and hand-finished leather essentials. Stripped of noise.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
                <Link to="/shop">
                  <Button variant="primary" size="lg" className="group shadow-md hover:shadow-xl">
                    <span>Shop Collection</span>
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/shop?sort=newest">
                  <Button variant="outline" size="lg">
                    Explore New Arrivals
                  </Button>
                </Link>
              </div>

              {/* Sub-hero Trust Metrics */}
              <div className="pt-6 sm:pt-8 border-t border-stone-200/80 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">100%</p>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Authentic Design</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">30-Day</p>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">At-Home Trial</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Zero</p>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Superfluous Noise</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Floating 3D Object with Mouse Parallax (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background subtle glowing frame */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-stone-200/50 to-stone-100/40 rounded-3xl transform -rotate-1 -z-10" />

                {/* 3D Hardware Canvas */}
                <div className="rounded-3xl border border-stone-200/80 bg-gradient-to-b from-white/80 to-stone-100/50 backdrop-blur-md shadow-2xl overflow-hidden">
                  <Hero3DCanvas />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. UPGRADED CATEGORY SECTION (Editorial Bento Grid)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4"
        >
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-stone-500">
              Curated Universes
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-950 mt-1">
              Explore by <span className="font-semibold">Category</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Bento Grid */}
        <CategoryBentoGrid />
      </section>

      {/* ========================================================
          3. FEATURED PRODUCTS GRID
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4"
        >
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-stone-500">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-950 mt-1">
              Featured <span className="font-semibold">right now</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ========================================================
          4. SECOND MAJOR 3D MOMENT: FEATURED 3D SHOWCASE
      ======================================================== */}
      <FeaturedShowcase />

      {/* ========================================================
          5. EDITORIAL PROMO SECTION (Spotlight Card)
      ======================================================== */}
      <section id="editorial-story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SpotlightCard
          theme="dark"
          spotlightColor="rgba(255, 255, 255, 0.07)"
          className="rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl p-8 sm:p-14 lg:p-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Large Editorial Lifestyle Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80"
                  alt="Designed for everyday life"
                  className="w-full h-full object-cover object-center transform hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-neutral-950/20" />
              </div>
            </div>

            {/* Right: Editorial Copy & Manifesto */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-medium tracking-[0.25em] uppercase text-stone-400">
                Our Design Manifesto
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
                Designed for everyday. <br />
                <span className="font-semibold text-stone-200">Built to endure for decades.</span>
              </h2>
              <p className="text-sm sm:text-base text-stone-400 font-light leading-relaxed max-w-lg">
                We reject fast consumption and unnecessary complexity. Every product bearing the NOVA
                mark begins with authentic materials—anodized billet aluminum, full-grain Tuscan
                vegetable leathers, Japanese beta-titanium, and extrafine merino wool.
              </p>
              <div className="pt-2">
                <Link to="/shop">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-neutral-950 hover:bg-stone-200 border-none group shadow-lg"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* ========================================================
          6. NEW ARRIVALS
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4"
        >
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-stone-500">
              Fresh Off The Line
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-950 mt-1">
              New <span className="font-semibold">Arrivals</span>
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            <span>View All New Releases</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ========================================================
          7. TRUST / SERVICE SECTION (Subtle & Elegant)
      ======================================================== */}
      <section id="trust-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 p-8 sm:p-12 rounded-3xl bg-white border border-stone-200/80 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-stone-100 text-neutral-900 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Complimentary Shipping</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-snug">
                Free expedited courier delivery on all orders above ₹4,999.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-stone-100 text-neutral-900 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Secure Payments</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-snug">
                Bank-grade 256-bit encryption for all cards, UPI, and net banking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-stone-100 text-neutral-900 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">30-Day Easy Returns</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-snug">
                Hassle-free doorstep pickup with zero return fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-stone-100 text-neutral-900 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Concierge Support</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-snug">
                Direct access to our dedicated team 7 days a week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. NEWSLETTER SECTION (Spotlight CTA Area)
      ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <SpotlightCard
          theme="light"
          spotlightColor="rgba(15, 23, 42, 0.04)"
          className="py-12 px-6 sm:px-12 rounded-3xl bg-stone-100/80 border border-stone-200/90 space-y-4"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Private Newsletter
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-950">
            Stay in <span className="font-semibold">the loop.</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
            Receive private release dates, limited batch drops, and 10% off your first acquisition.
          </p>

          {newsletterSubscribed ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You&apos;re on the list. Check your inbox for your welcome privilege code.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-xs"
              />
              <Button type="submit" variant="primary" size="md">
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-[10px] text-stone-400">
            We value your attention. Unsubscribe with one click anytime.
          </p>
        </SpotlightCard>
      </section>
    </div>
  );
};
