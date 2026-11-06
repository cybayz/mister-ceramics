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
      {/* Official Mister Ceramic Emblem (Car + Bike Fusion Emblem) */}
      <div className="relative flex items-center justify-center shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-zinc-950 border border-brand-gold/40 shadow-gold group-hover:border-brand-gold transition-colors duration-300 overflow-hidden p-1">
        <svg
          viewBox="0 0 100 65"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Yellow Sports Car Silhouette */}
          <path
            d="M 10 38 Q 15 22 30 18 L 42 16 Q 50 15 58 16 L 70 18 Q 85 22 90 38 L 94 44 Q 92 48 88 48 L 82 48 L 80 54 L 68 54 L 68 48 L 32 48 L 32 54 L 20 54 L 18 48 L 12 48 Q 8 48 6 44 Z"
            fill="#FACC15"
            stroke="#000"
            strokeWidth="1.5"
          />
          {/* Car Mirrors */}
          <ellipse cx="14" cy="28" rx="4" ry="2.5" fill="#FACC15" />
          <ellipse cx="86" cy="28" rx="4" ry="2.5" fill="#FACC15" />
          
          {/* Car Headlights */}
          <path d="M 16 38 Q 24 36 28 41 Q 20 42 16 38 Z" fill="#18181B" />
          <path d="M 84 38 Q 76 36 72 41 Q 80 42 84 38 Z" fill="#18181B" />

          {/* White Motorcycle Cowl / Fairing in Center */}
          <path
            d="M 50 14 Q 40 16 38 24 Q 37 32 42 42 L 47 48 L 53 48 L 58 42 Q 63 32 62 24 Q 60 16 50 14 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="1.2"
          />
          {/* Bike Mirrors */}
          <ellipse cx="36" cy="20" rx="3.5" ry="2" fill="#FFFFFF" stroke="#18181B" strokeWidth="0.8" />
          <ellipse cx="64" cy="20" rx="3.5" ry="2" fill="#FFFFFF" stroke="#18181B" strokeWidth="0.8" />
          {/* Bike Windshield / Visor */}
          <path d="M 44 22 Q 50 18 56 22 L 54 28 Q 50 26 46 28 Z" fill="#18181B" />
          {/* Bike Headlight cluster */}
          <polygon points="47,32 50,37 53,32" fill="#FACC15" />
          {/* Bike Front Fork */}
          <rect x="48.5" y="48" width="3" height="10" fill="#FACC15" />
        </svg>

        {/* Gloss corner highlight */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-bl from-white/30 to-transparent pointer-events-none" />
      </div>

      {/* Brand Typography matching official signboard */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-base sm:text-lg font-black uppercase tracking-[0.14em] text-white font-sans drop-shadow-md">
            Mister
          </span>
          <span className="text-base sm:text-lg font-black uppercase tracking-[0.14em] text-[#FACC15] font-sans drop-shadow-md">
            Ceramic
          </span>
        </div>
        
        {variant !== 'compact' && (
          <div className="mt-1 flex items-center">
            <span className="inline-block px-1.5 py-0.5 rounded-[4px] text-[8.5px] font-black uppercase tracking-[0.16em] bg-[#FACC15] text-black shadow-sm leading-tight">
              Car and Bike Detailing
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-400 font-medium ml-1.5 hidden sm:inline">
              · Kottarakkara
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="inline-flex focus:outline-none focus:ring-1 focus:ring-brand-gold rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
