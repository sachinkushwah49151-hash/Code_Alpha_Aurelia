import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-stone-200 text-neutral-600 mt-20">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 focus:outline-none"
            >
              <span className="font-bold text-xl tracking-[0.28em] uppercase text-neutral-950 font-serif-or-sans">
                AURELIA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
            </Link>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm leading-relaxed font-normal">
              &ldquo;Curated for the way you live.&rdquo;
            </p>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed font-light">
              Meticulously engineered spatial acoustic hardware, ambient circadian illumination,
              heavyweight organic textiles, and hand-burnished leather essentials.
            </p>

            {/* Socials */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-neutral-500 hover:text-neutral-950 hover:border-neutral-900 transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter/X"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-neutral-500 hover:text-neutral-950 hover:border-neutral-900 transition-colors"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-neutral-500 hover:text-neutral-950 hover:border-neutral-900 transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-neutral-500 hover:text-neutral-950 hover:border-neutral-900 transition-colors"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop" className="hover:text-neutral-950 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electronics" className="hover:text-neutral-950 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/shop?category=audio" className="hover:text-neutral-950 transition-colors">
                  Spatial Audio
                </Link>
              </li>
              <li>
                <Link to="/shop?category=fashion" className="hover:text-neutral-950 transition-colors">
                  Fashion & Tailoring
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home" className="hover:text-neutral-950 transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=newest" className="hover:text-neutral-950 transition-colors flex items-center gap-1">
                  New Releases <span className="text-[10px] text-[#b38a4a] font-semibold">• Fresh</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Concierge
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/orders" className="hover:text-neutral-950 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <a href="#trust-section" className="hover:text-neutral-950 transition-colors">
                  Shipping & Dispatch
                </a>
              </li>
              <li>
                <a href="#trust-section" className="hover:text-neutral-950 transition-colors">
                  30-Day Returns & Trial
                </a>
              </li>
              <li>
                <a href="mailto:concierge@studio-aurelia.co" className="hover:text-neutral-950 transition-colors flex items-center gap-1">
                  Contact Concierge <ArrowUpRight className="w-3 h-3 text-stone-400" />
                </a>
              </li>
              <li>
                <Link to="/profile" className="hover:text-neutral-950 transition-colors">
                  Account Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Studio
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/#editorial-story" className="hover:text-neutral-950 transition-colors">
                  Our Philosophy
                </a>
              </li>
              <li>
                <a href="#materials" className="hover:text-neutral-950 transition-colors">
                  Material Honesties
                </a>
              </li>
              <li>
                <a href="#sustainability" className="hover:text-neutral-950 transition-colors">
                  Sustainability
                </a>
              </li>
            </ul>

            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pt-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#privacy" className="hover:text-neutral-950 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-neutral-950 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-200/80 bg-[#faf8f5]/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span>&copy; {CURRENT_YEAR} AURELIA Store Inc. All rights reserved.</span>
            <span>•</span>
            <span>CodeAlpha Internship Project</span>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3 text-stone-400 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded border border-stone-200 bg-white">VISA</span>
            <span className="px-2 py-0.5 rounded border border-stone-200 bg-white">MASTERCARD</span>
            <span className="px-2 py-0.5 rounded border border-stone-200 bg-white">UPI</span>
            <span className="px-2 py-0.5 rounded border border-stone-200 bg-white">RUPAY</span>
            <span className="px-2 py-0.5 rounded border border-stone-200 bg-white">NET BANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
