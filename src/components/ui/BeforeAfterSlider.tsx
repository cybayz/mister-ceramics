'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  aspectRatio?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE RESTORATION',
  afterLabel = 'AFTER CERAMIC FINISH',
  className = '',
  aspectRatio = 'aspect-[16/10]',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-xl border border-brand-border bg-brand-card shadow-darkCard cursor-ew-resize group ${aspectRatio} ${className}`}
      onMouseDown={(e) => handleStart(e.clientX)}
      onTouchStart={(e) => {
        if (e.touches && e.touches[0]) {
          handleStart(e.touches[0].clientX);
        }
      }}
      role="slider"
      aria-label="Before and after transformation comparison slider"
      aria-valuenow={sliderPosition}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* After Image (Full Background) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover object-center"
          priority
        />
        {/* Subtle dark gradient overlay at top & bottom for badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Before Image (Clipped seamlessly using pure CSS clipPath) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-black/75 text-zinc-300 border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {beforeLabel}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-black/75 text-brand-goldLight border border-brand-gold/30 backdrop-blur-md shadow-gold">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
          {afterLabel}
        </span>
      </div>

      {/* Divider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 z-30 pointer-events-none transition-shadow"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Vertical Line */}
        <div className="absolute inset-y-0 -left-[1px] w-[2px] bg-gradient-to-b from-brand-gold via-white to-brand-gold shadow-[0_0_12px_rgba(212,175,55,0.8)]" />

        {/* Center Drag Button */}
        <div className="absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-950 border-2 border-brand-gold shadow-gold flex items-center justify-center pointer-events-auto cursor-ew-resize transform group-hover:scale-105 transition-transform">
          <div className="flex items-center gap-1 text-brand-gold">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center z-20 pointer-events-none">
        <span className="text-[10px] tracking-widest uppercase font-medium text-white/80 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
          Drag slider to compare reflection & defect removal
        </span>
      </div>
    </div>
  );
}

