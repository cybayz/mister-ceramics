import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light';
  isLink?: boolean;
}

export default function Logo({ className = '', variant = 'full', isLink = true }: LogoProps) {
  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Luxury Geometric Shield / Hex Emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-brand-cardElevated to-brand-card border border-brand-gold/40 shadow-gold group-hover:border-brand-gold transition-colors duration-300">
        <svg
          viewBox="0 0 40 40"
          className="w-6 h-6 text-brand-gold fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Diamond faceted shield silhouette */}
          <path
            d="M20 2L35 9V20C35 29 28.5 36.5 20 38C11.5 36.5 5 29 5 20V9L20 2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M20 7L30 12V19C30 25 25.5 30.5 20 32C14.5 30.5 10 25 10 19V12L20 7Z"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          {/* Stylized M & C letterform monogram */}
          <path
            d="M15 24V14L20 20L25 14V24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* Subtle corner light ping */}
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-brand-goldLight opacity-80" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg font-extrabold uppercase tracking-[0.22em] text-white font-sans">
            Mister
          </span>
          <span className="text-base sm:text-lg font-extrabold uppercase tracking-[0.22em] text-brand-gold font-sans drop-shadow-sm">
            Ceramic
          </span>
        </div>
        {variant !== 'compact' && (
          <span className="text-[9px] uppercase tracking-[0.28em] text-zinc-400 font-medium">
            Studio · Kottarakkara
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="inline-flex focus:outline-none focus:ring-1 focus:ring-brand-gold rounded">
        {content}
      </Link>
    );
  }

  return content;
}
