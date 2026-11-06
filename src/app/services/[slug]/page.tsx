import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Clock,
  ShieldCheck,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  });

  if (!service) {
    return { title: 'Service Not Found' };
  }

  return {
    title: `${service.name} | Mister Ceramic Studio`,
    description: service.headline || service.description.slice(0, 150),
    openGraph: {
      title: `${service.name} | Mister Ceramic Studio, Kottarakkara`,
      description: service.description.slice(0, 150),
      images: service.coverImage ? [service.coverImage] : [],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      packages: {
        orderBy: { sortOrder: 'asc' },
      },
      projects: {
        where: { isPublished: true },
        take: 3,
      },
    },
  });

  if (!service) {
    notFound();
  }

  // Parse JSON fields safely
  let benefits: string[] = [];
  let processSteps: { step: number; title: string; description: string }[] = [];
  let suitableVehicles: string[] = [];

  try {
    if (service.benefitsJson) benefits = JSON.parse(service.benefitsJson);
    if (service.applicationProcessJson) processSteps = JSON.parse(service.applicationProcessJson);
    if (service.suitableVehiclesJson) suitableVehicles = JSON.parse(service.suitableVehiclesJson);
  } catch (e) {
    // Fallback if parsing fails
  }

  return (
    <div className="bg-brand-dark min-h-screen pt-28 pb-24 text-zinc-100">
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <Link href="/services" className="hover:text-white transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-brand-gold font-medium">{service.name}</span>
        </nav>
      </div>

      {/* Hero Section of Service */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cardElevated border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em]">
              <span>{service.category.name}</span>
              <span>•</span>
              <span>{service.vehicleType}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {service.name}
            </h1>

            {service.headline && (
              <p className="text-lg text-brand-goldLight font-medium leading-relaxed">
                {service.headline}
              </p>
            )}

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {service.description}
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-brand-border text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-gold" />
                <span>Duration: ~{service.defaultDurationHours} hrs</span>
              </div>
              {service.startingPrice && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-gold" />
                  <span>Starting from {formatCurrency(service.startingPrice)}</span>
                </div>
              )}
              {service.warrantyInfo && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  <span>Studio Warranty Applicable</span>
                </div>
              )}
            </div>

            {/* CTA Book This Service */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={`/book?service=${service.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-black bg-gradient-to-r from-brand-goldLight via-brand-gold to-brand-goldMuted hover:from-white hover:to-brand-gold shadow-gold transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Service</span>
              </Link>
              <a
                href={`https://wa.me/919207209105?text=${encodeURIComponent(`Hi Mister Ceramic, I'd like more details on ${service.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-zinc-200 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors"
              >
                <span>WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          {/* Cover Image */}
          <div className="lg:col-span-5">
            <div className="relative h-[380px] sm:h-[450px] w-full rounded-2xl overflow-hidden border border-brand-border shadow-2xl bg-zinc-900">
              {service.coverImage && (
                <Image
                  src={service.coverImage}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  priority
                  className="object-cover object-center"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Section: Benefits & Suitable Vehicles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Key Benefits */}
          <div className="lg:col-span-8 bg-brand-card rounded-2xl border border-brand-border p-8 shadow-darkCard">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-gold" />
              <span>Core Benefits & Defenses</span>
            </h2>

            {benefits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-cardElevated/60 border border-brand-borderSubtle"
                  >
                    <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-300 leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">Detailed benefits available on inspection.</p>
            )}
          </div>

          {/* Suitable Vehicles & Warranty Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Suitable Vehicles */}
            <div className="bg-brand-card rounded-2xl border border-brand-border p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Recommended For
              </h3>
              {suitableVehicles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {suitableVehicles.map((v, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-cardElevated border border-brand-border text-zinc-300"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400">Suitable for passenger cars and superbikes.</p>
              )}
            </div>

            {/* Warranty Info Box */}
            {service.warrantyInfo && (
              <div className="bg-brand-cardElevated/80 rounded-2xl border border-brand-gold/30 p-6">
                <div className="flex items-center gap-2 text-brand-gold mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-sm font-bold text-white">Warranty & Assurance</h3>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {service.warrantyInfo}
                </p>
                <div className="mt-3 text-[11px] text-zinc-500">
                  Note: All warranties require adherence to studio aftercare guidelines.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section: Application Process */}
        {processSteps.length > 0 && (
          <div className="bg-brand-darker rounded-2xl border border-brand-border p-8 lg:p-12">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                The Protocol
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Step-by-Step Application Workflow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step) => (
                <div
                  key={step.step}
                  className="relative rounded-xl bg-brand-card border border-brand-border p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-3xl font-extrabold font-display text-zinc-700">
                      0{step.step}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-3">{step.title}</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Available Packages */}
        {service.packages.length > 0 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                Configured Packages
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Choose Your Treatment Package
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.packages.map((pkg) => {
                let features: string[] = [];
                try {
                  if (pkg.featuresJson) features = JSON.parse(pkg.featuresJson);
                } catch (e) {
                  features = [];
                }

                return (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl bg-brand-card border p-8 flex flex-col justify-between transition-all duration-300 relative ${
                      pkg.isPopular
                        ? 'border-brand-gold shadow-gold'
                        : 'border-brand-border hover:border-brand-borderSubtle'
                    }`}
                  >
                    {pkg.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-gold text-black shadow-md">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-white">{pkg.name}</h3>

                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-white">
                          {pkg.price ? formatCurrency(pkg.price) : 'On Consultation'}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-zinc-400 flex items-center gap-3">
                        {pkg.durationHours && <span>Est. {pkg.durationHours} hrs</span>}
                        {pkg.warrantyMonths && (
                          <span>• {pkg.warrantyMonths / 12} Years Studio Warranty</span>
                        )}
                      </div>

                      {features.length > 0 && (
                        <ul className="mt-6 space-y-2.5 border-t border-brand-borderSubtle pt-6">
                          {features.map((feat, i) => (
                            <li key={i} className="text-xs text-zinc-300 flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-8 pt-4">
                      <Link
                        href={`/book?service=${service.slug}&package=${pkg.id}`}
                        className={`w-full py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-colors inline-block ${
                          pkg.isPopular
                            ? 'bg-brand-gold text-black hover:bg-brand-goldLight'
                            : 'bg-brand-cardElevated text-zinc-200 border border-brand-border hover:bg-zinc-800'
                        }`}
                      >
                        Select This Package
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section: Related Completed Projects */}
        {service.projects.length > 0 && (
          <div className="pt-12 border-t border-brand-border">
            <h2 className="text-2xl font-bold text-white mb-8">
              Completed Projects Using This Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {service.projects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/work#${proj.slug}`}
                  className="group rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 overflow-hidden shadow-darkCard"
                >
                  <div className="relative h-44 w-full bg-zinc-900">
                    {proj.afterImageUrl && (
                      <Image
                        src={proj.afterImageUrl}
                        alt={proj.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 350px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-gold transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {proj.vehicleBrand} {proj.vehicleModel}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

