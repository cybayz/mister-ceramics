import React from 'react';
import prisma from '@/lib/prisma';
import GalleryClient from './GalleryClient';
import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Work & Gallery | Before-and-After Detailing Portfolio',
  description:
    'Explore completed automotive transformations at Mister Ceramic, Kottarakkara. Before & after interactive comparison, ceramic coating reflections, self-healing TPU PPF, and superbike detailing.',
};

export const revalidate = 60;

export default async function WorkPage() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { completedAt: 'desc' },
    include: {
      category: {
        select: { id: true, slug: true, name: true },
      },
      service: {
        select: { id: true, slug: true, name: true },
      },
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return (
    <div className="bg-brand-dark min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center sm:text-left mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cardElevated border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our Work & Transformations
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Real customer vehicles, authentic transformations. Compare paint corrections with our interactive slider, explore wrapped edges on supercars, and inspect mirror gloss finishes delivered at Chegamanadu, Kottarakkara.
          </p>
        </div>

        {/* Gallery interactive component */}
        <GalleryClient projects={projects} />
      </div>
    </div>
  );
}
