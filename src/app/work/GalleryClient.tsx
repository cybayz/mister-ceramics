'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Filter,
  Calendar,
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Car,
} from 'lucide-react';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import { formatDate } from '@/lib/utils';

export interface ProjectWithImages {
  id: string;
  slug: string;
  title: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  clientName: string | null;
  description: string;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  completedAt: Date | null;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  service: {
    id: string;
    slug: string;
    name: string;
  } | null;
  images: {
    id: string;
    imageUrl: string;
    caption: string | null;
  }[];
}

interface GalleryClientProps {
  projects: ProjectWithImages[];
}

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Projects' },
  { id: 'ppf', label: 'PPF' },
  { id: 'borophene', label: 'Borophene Coating' },
  { id: 'ceramic', label: 'Ceramic Coating' },
  { id: 'graphene', label: 'Graphene Coating' },
  { id: 'sunfilm', label: 'Sunfilm' },
  { id: 'car-detailing', label: 'Car Detailing' },
  { id: 'bike-detailing', label: 'Bike Detailing' },
  { id: 'car-painting', label: 'Car Painting' },
  { id: 'bike-painting', label: 'Bike Painting' },
  { id: 'restoration', label: 'Restoration' },
];

export default function GalleryClient({ projects }: GalleryClientProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeProject, setActiveProject] = useState<ProjectWithImages | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Filter projects based on slug, title or category
  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === 'all') return true;
    const searchTarget = `${p.title} ${p.category.slug} ${p.service?.slug || ''} ${p.description}`.toLowerCase();

    if (selectedFilter === 'ppf') return searchTarget.includes('ppf') || searchTarget.includes('paint protection film');
    if (selectedFilter === 'borophene') return searchTarget.includes('borophene');
    if (selectedFilter === 'ceramic') return searchTarget.includes('ceramic');
    if (selectedFilter === 'graphene') return searchTarget.includes('graphene');
    if (selectedFilter === 'sunfilm') return searchTarget.includes('sunfilm') || searchTarget.includes('tint');
    if (selectedFilter === 'car-detailing') return p.vehicleType === 'CAR' && searchTarget.includes('detail');
    if (selectedFilter === 'bike-detailing') return p.vehicleType === 'BIKE' && (searchTarget.includes('detail') || searchTarget.includes('ceramic'));
    if (selectedFilter === 'car-painting') return p.vehicleType === 'CAR' && searchTarget.includes('paint');
    if (selectedFilter === 'bike-painting') return p.vehicleType === 'BIKE' && searchTarget.includes('paint');
    if (selectedFilter === 'restoration') return searchTarget.includes('restoration') || searchTarget.includes('polish');

    return true;
  });

  return (
    <div>
      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar mb-12">
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive
                  ? 'bg-brand-gold text-black shadow-gold font-bold'
                  : 'bg-brand-cardElevated text-zinc-300 hover:text-white hover:bg-zinc-800 border border-brand-border'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Featured Before & After Banner Transformation */}
      {filteredProjects.length > 0 && filteredProjects[0].beforeImageUrl && filteredProjects[0].afterImageUrl && (
        <div className="mb-20 rounded-2xl bg-brand-card border border-brand-border p-6 lg:p-8 shadow-darkCard">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Featured Transformation
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {filteredProjects[0].title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {filteredProjects[0].vehicleBrand} {filteredProjects[0].vehicleModel} · {filteredProjects[0].service?.name || 'Studio Care'}
              </p>
            </div>
            {filteredProjects[0].service && (
              <Link
                href={`/book?service=${filteredProjects[0].service.slug}`}
                className="self-start lg:self-center px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors"
              >
                Book This Service
              </Link>
            )}
          </div>

          <BeforeAfterSlider
            beforeImage={filteredProjects[0].beforeImageUrl}
            afterImage={filteredProjects[0].afterImageUrl}
            beforeLabel="BEFORE RESTORATION"
            afterLabel="COMPLETED FINISH"
            aspectRatio="aspect-[16/9]"
          />
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            id={project.slug}
            className="group rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/50 overflow-hidden shadow-darkCard transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Media Thumbnail */}
              <div className="relative h-60 w-full bg-zinc-900 overflow-hidden cursor-pointer" onClick={() => setActiveProject(project)}>
                {project.afterImageUrl ? (
                  <Image
                    src={project.afterImageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600">
                    <Car className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-black/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-brand-gold border border-brand-gold/30 backdrop-blur-md">
                    {project.vehicleBrand} {project.vehicleModel}
                  </span>
                </div>

                {project.beforeImageUrl && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-1 rounded text-[10px] font-semibold bg-brand-gold text-black shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Before/After Available
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6">
                <h3
                  onClick={() => setActiveProject(project)}
                  className="text-base font-bold text-white group-hover:text-brand-goldLight transition-colors cursor-pointer"
                >
                  {project.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-4 pt-3 border-t border-brand-borderSubtle flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{project.service?.name || project.category.name}</span>
                  {project.completedAt && (
                    <span>{formatDate(project.completedAt)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveProject(project)}
                className="flex-1 py-2.5 px-3 rounded-lg text-center text-xs font-semibold text-zinc-200 bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border transition-colors flex items-center justify-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5 text-brand-gold" />
                <span>View Project Case</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-brand-border">
          <p className="text-sm text-zinc-400">No projects currently listed in this category.</p>
          <button
            onClick={() => setSelectedFilter('all')}
            className="mt-4 px-4 py-2 rounded-lg bg-brand-gold text-black text-xs font-bold uppercase tracking-wider"
          >
            Show All Projects
          </button>
        </div>
      )}

      {/* PROJECT DETAIL MODAL / LIGHTBOX */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveProject(null)}
          />

          <div className="relative w-full max-w-4xl max-h-[90vh] bg-brand-dark border border-brand-border rounded-2xl shadow-2xl overflow-y-auto z-10 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border p-6 flex items-start justify-between z-20">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                  {activeProject.vehicleBrand} {activeProject.vehicleModel} • {activeProject.vehicleType}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {activeProject.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Before / After Slider if both images present */}
              {activeProject.beforeImageUrl && activeProject.afterImageUrl ? (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Interactive Transformation Slider
                  </h4>
                  <BeforeAfterSlider
                    beforeImage={activeProject.beforeImageUrl}
                    afterImage={activeProject.afterImageUrl}
                    beforeLabel="BEFORE RESTORATION"
                    afterLabel="AFTER STUDIO FINISH"
                    aspectRatio="aspect-[16/10]"
                  />
                </div>
              ) : activeProject.afterImageUrl ? (
                <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden border border-brand-border">
                  <Image
                    src={activeProject.afterImageUrl}
                    alt={activeProject.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Project Case Notes & Scope of Work
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {activeProject.description}
                </p>
              </div>

              {/* Project gallery photos if any */}
              {activeProject.images && activeProject.images.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Additional Inspection Photographs
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeProject.images.map((img) => (
                      <div
                        key={img.id}
                        className="group relative h-52 rounded-xl overflow-hidden border border-brand-border cursor-pointer"
                        onClick={() => setLightboxImage(img.imageUrl)}
                      >
                        <Image
                          src={img.imageUrl}
                          alt={img.caption || activeProject.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {img.caption && (
                          <div className="absolute inset-x-0 bottom-0 bg-black/75 p-2 text-[11px] text-zinc-300 backdrop-blur-sm">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-400">
                  Interested in similar treatment for your vehicle?
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {activeProject.service && (
                    <Link
                      href={`/book?service=${activeProject.service.slug}`}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors text-center"
                    >
                      Book This Service
                    </Link>
                  )}
                  <a
                    href={`https://wa.me/919207209105?text=${encodeURIComponent(`Hi Mister Ceramic, I saw project ${activeProject.title} and want to inquire about my vehicle.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-semibold text-zinc-200 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors text-center"
                  >
                    WhatsApp Inquire
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Fullscreen Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-[80vh]">
            <Image
              src={lightboxImage}
              alt="High resolution detailing photograph"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

