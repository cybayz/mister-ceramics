import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Flame,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  Clock,
  Star,
  Eye,
  ChevronRight,
  Sun,
  Award,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import StudioCostCalculator from '@/components/ui/StudioCostCalculator';
import KeralaFAQ from '@/components/ui/KeralaFAQ';
import { BUSINESS_INFO } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  // Fetch featured services, categories, projects, and testimonials from database
  const [categories, featuredServices, featuredProjects, testimonials] = await Promise.all([
    prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        services: {
          where: { isActive: true },
          take: 4,
          select: { id: true, name: true, slug: true, vehicleType: true },
        },
      },
    }),
    prisma.service.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
      include: {
        category: true,
        packages: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    }),
    prisma.project.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { completedAt: 'desc' },
      take: 4,
      include: {
        images: true,
      },
    }),
    prisma.testimonial.findMany({
      where: { isPublished: true, isFeatured: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Primary featured project with before & after image
  const primaryTransformation =
    featuredProjects.find((p) => p.beforeImageUrl && p.afterImageUrl) || featuredProjects[0];

  return (
    <div className="relative bg-brand-dark overflow-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Cinematic Backdrop Image with High Aesthetic Grading (Pure automotive studio finish - NO ships or boats) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/transformations/mercedes-amg-after.jpg"
            alt="Mister Ceramic Studio luxury automotive ceramic coating and precision finish"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center transform scale-105 filter brightness-[0.38] contrast-[1.15]"
          />
          {/* Radial Sheen and Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/40 to-brand-dark/90" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left py-12">
          <div className="max-w-3xl">
            {/* Top Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cardElevated/90 border border-brand-gold/30 backdrop-blur-md mb-6 shadow-gold animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-brand-goldLight">
                Chegamanadu · Kottarakkara · Kerala
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
              Beyond Shine.{' '}
              <span className="block text-gold-gradient font-display drop-shadow-lg">
                Beyond Protection.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-zinc-300 font-normal leading-relaxed mb-10 max-w-2xl drop-shadow-sm">
              Precision detailing. Advanced protection. Exceptional finishes. Experience professional care for your car and bike with surgical paint correction, self-healing TPU PPF, and atomic Borophene coatings.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 justify-center sm:justify-start">
              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-black bg-gradient-to-r from-brand-goldLight via-brand-gold to-brand-goldMuted hover:from-white hover:to-brand-gold transition-all duration-300 shadow-gold hover:shadow-goldGlow transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-white bg-brand-cardElevated/80 hover:bg-brand-cardElevated border border-brand-border hover:border-brand-gold/50 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span>Book an Appointment</span>
              </Link>
            </div>

            {/* Micro Highlights Pill Row */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>Certified Cleanroom Bay</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span>Microscopic Defect Removal</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-gold" />
                <span>Transparent Live Vehicle Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION & AUTHENTIC STUDIO SHOWCASE */}
      <section className="py-20 bg-brand-darker border-y border-brand-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                The Mister Ceramic Standard
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Where Automotive Detailing Meets Surgical Craftsmanship
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
              <p>
                Located in Chegamanadu, Kottarakkara, <strong>Mister Ceramic</strong> was established to redefine automotive enhancement in Kerala. Detailing is neither a routine car wash nor a quick wax polish — it is the surgical science of paint correction, chemical surface preparation, and the application of aerospace-grade coatings.
              </p>
              <p className="text-zinc-400 text-sm">
                From luxury sedans and family SUVs to high-performance superbikes, our dust-controlled studio combines computerized paint depth measuring, multi-stage machine compounding, and infrared thermal curing to deliver deep optical clarity, extreme hydrophobic beading, and lasting protection against harsh tropical UV and monsoonal elements.
              </p>
            </div>
          </div>

          {/* Authentic Studio Facility Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-brand-borderSubtle">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-brand-border group shadow-2xl">
              <Image
                src="/images/mister-ceramic-studio.jpg"
                alt="Mister Ceramic Studio storefront in Chegamanadu, Kottarakkara"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                  Official Facility
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  Mister Ceramic Studio – Chegamanadu, Kottarakkara
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Enclosed glass cleanroom bays equipped with specialized geometric inspection LED lighting.
                </p>
              </div>
            </div>

            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-brand-border group shadow-2xl">
              <Image
                src="/images/studio-interior.jpg"
                alt="Inside Mister Ceramic cleanroom detailing bay with BMW and Kia Seltos"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                  Active Cleanroom Bays
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  Dust-Controlled Inspection & Coating Bays
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Climate-controlled application for self-healing TPU PPF wraps and multi-layer Borophene infusion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN SERVICE CATEGORIES */}
      <section className="py-24 bg-brand-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
              Specialized Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Our Core Disciplines
            </h2>
            <p className="text-zinc-400 text-sm mt-3">
              Tailored protection and restoration workflows engineered specifically for car and bike owners across Kottarakkara and Kollam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="group relative rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/50 p-8 transition-all duration-300 flex flex-col justify-between shadow-darkCard hover:shadow-gold"
              >
                <div>
                  {/* Category Index & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-display text-zinc-700 group-hover:text-brand-gold transition-colors">
                      0{idx + 1}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                      {idx === 0 ? (
                        <ShieldCheck className="w-6 h-6" />
                      ) : idx === 1 ? (
                        <Sparkles className="w-6 h-6" />
                      ) : (
                        <Flame className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-brand-goldLight transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Included Services list snippet */}
                  <div className="mt-6 pt-6 border-t border-brand-borderSubtle">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                      Popular Services:
                    </span>
                    <ul className="mt-2 space-y-1.5">
                      {cat.services.map((srv) => (
                        <li key={srv.id} className="text-xs text-zinc-300 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-brand-gold" />
                          <Link href={`/services/${srv.slug}`} className="hover:text-white transition-colors">
                            {srv.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={`/services#${cat.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors"
                  >
                    <span>View Category Catalogue</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED SERVICES SHOWCASE */}
      <section className="py-24 bg-brand-darker border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                Engineered Performance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Featured Protection Services
              </h2>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl">
                Precision applications designed for maximum durability, heat deflection, and unmatched gloss clarity.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors"
            >
              <span>Explore Complete Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="group rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-darkCard"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                    {service.coverImage && (
                      <Image
                        src={service.coverImage}
                        alt={service.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-brand-gold border border-brand-gold/30 backdrop-blur-md">
                        {service.vehicleType === 'BOTH' ? 'Car & Bike' : service.vehicleType}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-goldLight transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                      {service.headline || service.description}
                    </p>

                    {/* Metadata / Duration */}
                    <div className="mt-4 pt-4 border-t border-brand-borderSubtle flex items-center justify-between text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-gold" />
                        <span>Approx. {service.defaultDurationHours} hrs</span>
                      </div>
                      <div className="font-semibold text-zinc-200">
                        {service.startingPrice ? `From ${formatCurrency(service.startingPrice)}` : 'On Consultation'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 flex items-center justify-between gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex-1 py-2.5 px-3 rounded-lg text-center text-xs font-semibold text-zinc-200 bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BEFORE-AND-AFTER TRANSFORMATION SLIDER (MAJOR FEATURE) */}
      {primaryTransformation && (
        <section className="py-24 bg-brand-dark relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                The Visible Difference
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Defect Correction & Mirror Clarity
              </h2>
              <p className="text-zinc-400 text-sm mt-3">
                Experience real transformations completed inside our Chegamanadu studio. Slide the divider to see the contrast between swirled, oxidised panels and our diamond-like ceramic finish.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <BeforeAfterSlider
                beforeImage={primaryTransformation.beforeImageUrl || '/images/transformations/mercedes-amg-before.jpg'}
                afterImage={primaryTransformation.afterImageUrl || '/images/transformations/mercedes-amg-after.jpg'}
                beforeLabel="BEFORE CORRECTION (SWIRLS & HAZE)"
                afterLabel="AFTER CERAMIC MIRROR FINISH"
                aspectRatio="aspect-[16/10]"
              />

              <div className="mt-8 p-6 rounded-xl bg-brand-cardElevated/60 border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {primaryTransformation.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {primaryTransformation.vehicleBrand} {primaryTransformation.vehicleModel} · Treated with precision machine correction and hydrophobic seal.
                  </p>
                </div>
                <Link
                  href="/work"
                  className="shrink-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors"
                >
                  <span>Explore Gallery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE MISTER CERAMIC */}
      <section className="py-24 bg-brand-darker border-y border-brand-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
              Studio Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Why Discerning Owners Choose Mister Ceramic
            </h2>
            <p className="text-zinc-400 text-sm mt-3">
              We reject rapid mass-volume car washes in favor of meticulous, high-grade craftsmanship tailored to protect your automotive investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="rounded-xl bg-brand-card p-6 border border-brand-border hover:border-brand-gold/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Cleanroom Studio Environment</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                PPF installation and coating curing are conducted in an enclosed, dust-minimized bay with specialized lighting to prevent air-particle entrapment.
              </p>
            </div>

            <div className="rounded-xl bg-brand-card p-6 border border-brand-border hover:border-brand-gold/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Non-Destructive Polish</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Digital paint depth gauges measure microns across each panel before any machine touches your car, safeguarding clear coat integrity.
              </p>
            </div>

            <div className="rounded-xl bg-brand-card p-6 border border-brand-border hover:border-brand-gold/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold mb-4">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Infrared Curing Lamps</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Shortwave IR baking accelerates cross-linking density in ceramic and borophene coatings, ensuring maximum hardness before road exposure.
              </p>
            </div>

            <div className="rounded-xl bg-brand-card p-6 border border-brand-border hover:border-brand-gold/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Live Progress Tracking</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Monitor your vehicle&apos;s step-by-step progress online with photos and milestone updates directly from our workshop floor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURED COMPLETED PROJECTS */}
      <section className="py-24 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                Mastery on Display
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Recent Studio Deliveries
              </h2>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl">
                Real customer cars and motorcycles transformed and protected at Mister Ceramic in Kottarakkara.
              </p>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/40 overflow-hidden shadow-darkCard transition-all duration-300"
              >
                <div className="relative h-64 sm:h-72 w-full bg-zinc-900 overflow-hidden">
                  {project.afterImageUrl && (
                    <Image
                      src={project.afterImageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-brand-gold border border-brand-gold/30 backdrop-blur-md">
                      {project.vehicleBrand} {project.vehicleModel}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-goldLight transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-brand-borderSubtle flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Client: {project.clientName || 'Private Owner'}
                    </span>
                    <Link
                      href={`/work#${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-white transition-colors"
                    >
                      <span>Explore Case</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VERIFIED CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-brand-darker border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
              Customer Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Feedback from Enthusiasts & Drivers
            </h2>
            <p className="text-zinc-400 text-sm mt-3">
              Read verified reviews from clients across Kottarakkara, Kollam, and Kerala who entrusted their vehicles to our studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-xl bg-brand-card border border-brand-border p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-brand-gold mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    &ldquo;{t.reviewText}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-borderSubtle flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-cardElevated border border-brand-border flex items-center justify-center text-xs font-bold text-brand-gold">
                    {t.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.customerName}</h4>
                    <p className="text-[10px] text-zinc-500">{t.vehicleInfo}</p>
                    <p className="text-[10px] text-brand-gold/80 font-medium">{t.serviceName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8.5 INTERACTIVE STUDIO COST & DURATION ESTIMATOR */}
      <StudioCostCalculator />

      {/* 8.6 KERALA CLIMATE DETAILING FAQ */}
      <KeralaFAQ />

      {/* 9. APPOINTMENT BOOKING CTA */}
      <section className="py-20 bg-gradient-to-b from-brand-dark to-brand-card relative overflow-hidden border-y border-brand-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold mb-6">
            <Calendar className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Experience the Mister Ceramic Finish?
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Reserve your studio bay online in a few clicks. Select your car or bike, pick your preferred protection service, and choose your convenient intake date.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-black bg-gradient-to-r from-brand-goldLight via-brand-gold to-brand-goldMuted hover:from-white hover:to-brand-gold shadow-gold hover:shadow-goldGlow transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Appointment</span>
            </Link>

            <Link
              href="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border transition-all duration-300"
            >
              <Eye className="w-4 h-4 text-brand-gold" />
              <span>Track Existing Vehicle</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. LOCATION & CONTACT HIGHLIGHT */}
      <section className="py-20 bg-brand-darker relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                  Visit Our Studio
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
                  Chegamanadu, Kottarakkara
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  Conveniently situated in Chegamanadu, Kottarakkara, our facility welcomes vehicle owners from Kollam, Adoor, Kundara, and surrounding districts.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Studio Address</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">{BUSINESS_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Telephone</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">{BUSINESS_INFO.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Operating Hours</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">{BUSINESS_INFO.hours}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-4">
                <a
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-200 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors"
                >
                  <span>Enquiry Form</span>
                </Link>
              </div>
            </div>

            {/* Google Map Embedded Frame */}
            <div className="lg:col-span-7 h-[380px] rounded-2xl overflow-hidden border border-brand-border shadow-2xl relative">
              <iframe
                title="Mister Ceramic Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.229068065406!2d76.77259!3d9.00632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0675fb65d87319%3A0x41a9e67271dc0506!2smister%20ceramic!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter invert-[90%] hue-rotate-180 contrast-125"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

