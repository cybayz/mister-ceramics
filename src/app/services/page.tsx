import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Shield, Check, ArrowRight, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services Catalogue | Paint Protection Film, Ceramic & Borophene Coating',
  description:
    'Explore professional car and motorcycle detailing services at Mister Ceramic, Chegamanadu, Kottarakkara. PPF, Borophene 10H, Graphene, 9H Ceramic, Paint Correction, Sunfilm, and Respraying.',
};

export const revalidate = 60;

export default async function ServicesPage() {
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          packages: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  return (
    <div className="bg-brand-dark min-h-screen pt-28 pb-24">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cardElevated border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Precision Detailing & Protection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Master Service Catalogue
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
          Comprehensive paint protection films, atomic ceramic & borophene coatings, and surgical restoration protocols for cars and motorcycles in Kottarakkara, Kerala.
        </p>

        {/* Category Jump Anchor Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-8 pt-4 border-t border-brand-border">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mr-2">
            Categories:
          </span>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.slug}`}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-cardElevated hover:bg-brand-gold/20 text-zinc-300 hover:text-brand-gold border border-brand-border transition-colors"
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {categories.map((category) => (
          <section key={category.id} id={category.slug} className="scroll-mt-32">
            {/* Category Title Header */}
            <div className="border-b border-brand-border pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                  {category.vehicleType === 'BOTH' ? 'Car & Motorcycle' : category.vehicleType} Care
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.services.map((service) => {
                let benefitsList: string[] = [];
                try {
                  if (service.benefitsJson) {
                    benefitsList = JSON.parse(service.benefitsJson).slice(0, 3);
                  }
                } catch (e) {
                  benefitsList = [];
                }

                return (
                  <div
                    key={service.id}
                    className="group rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/50 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-darkCard hover:shadow-gold"
                  >
                    <div>
                      {/* Service Cover Image */}
                      <div className="relative h-52 w-full bg-zinc-900 overflow-hidden">
                        {service.coverImage && (
                          <Image
                            src={service.coverImage}
                            alt={service.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-brand-gold border border-brand-gold/30 backdrop-blur-md">
                            {service.vehicleType}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-white group-hover:text-brand-goldLight transition-colors">
                          {service.name}
                        </h3>

                        <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                          {service.headline || service.description}
                        </p>

                        {/* Benefits snippets */}
                        {benefitsList.length > 0 && (
                          <ul className="mt-4 space-y-1.5 border-t border-brand-borderSubtle pt-3">
                            {benefitsList.map((benefit, i) => (
                              <li key={i} className="text-[11px] text-zinc-300 flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Duration & Price */}
                        <div className="mt-4 pt-3 border-t border-brand-borderSubtle flex items-center justify-between text-xs text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-gold" />
                            <span>{service.defaultDurationHours} hrs</span>
                          </div>
                          <div className="font-semibold text-zinc-200">
                            {service.startingPrice
                              ? `From ${formatCurrency(service.startingPrice)}`
                              : 'Consultation'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 pt-0 flex items-center justify-between gap-3">
                      <Link
                        href={`/services/${service.slug}`}
                        className="flex-1 py-2.5 px-3 rounded-lg text-center text-xs font-semibold text-zinc-200 bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border transition-colors"
                      >
                        Details & Packages
                      </Link>
                      <Link
                        href={`/book?service=${service.slug}`}
                        className="py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
