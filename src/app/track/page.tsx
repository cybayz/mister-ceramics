import React, { Suspense } from 'react';
import TrackingClient from './TrackingClient';
import type { Metadata } from 'next';
import { Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Track Your Vehicle | Mister Ceramic Studio Tracking',
  description:
    'Live vehicle service tracking for Mister Ceramic customers. Inspect progress milestones, paint correction stages, and studio delivery readiness.',
};

export default function TrackPage() {
  return (
    <div className="bg-brand-dark min-h-screen pt-28 pb-24 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cardElevated border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            <Eye className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Live Vehicle Service Tracking
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Enter your booking reference code and registered phone number to view chronological workshop updates, inspection logs, and photos of your vehicle in our cleanroom bay.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-zinc-500 text-xs">Loading tracking console...</div>}>
          <TrackingClient />
        </Suspense>
      </div>
    </div>
  );
}
