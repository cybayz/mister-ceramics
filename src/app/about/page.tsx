import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Layers,
  Wrench,
  Sun,
  Eye,
  CheckCircle,
  Calendar,
  Phone,
  MapPin,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Mister Ceramic Detailing Studio, Kottarakkara',
  description:
    'Learn about Mister Ceramic, Chegamanadu, Kottarakkara. Our workshop philosophy, cleanroom facilities, infrared curing systems, and passion for automotive perfection.',
};

export default function AboutPage() {
  return (
    <div className="bg-brand-dark min-h-screen pt-28 pb-24 text-zinc-100">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cardElevated border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
          <Award className="w-3.5 h-3.5" />
          <span>Chegamanadu · Kottarakkara · Kerala</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Obsession with Perfection.{' '}
          <span className="text-gold-gradient block sm:inline">The Mister Ceramic Philosophy.</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-3xl leading-relaxed">
          Founded on the principle that genuine automotive detailing is an exact science and an art form. We provide owners with hospital-grade surface correction, aerospace nanotech coatings, and invisible self-healing armor.
        </p>
      </div>

      {/* Philosophy & Story Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
              Our Heritage & Vision
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Elevating Kerala&apos;s Automotive Detailing Standards
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <p>
                In tropical Kerala, vehicles face unprecedented environmental stressors: intense monsoon acid rain, severe humidity, road tar from ongoing highway developments, and harsh ultraviolet exposure. Conventional garage washes and silicone-based cosmetic polishes merely hide defects temporarily while damaging clear coats.
              </p>
              <p>
                At <strong>Mister Ceramic</strong>, Chegamanadu, Kottarakkara, we built a dedicated studio that combines modern equipment with patient, unhurried craftsmanship. We measure paint thickness in microns before compounding, eliminate 90%+ of swirl marks permanently, and seal surfaces with covalent-bonding 9H Ceramic and atomic Borophene matrices.
              </p>
              <p>
                Whether protecting a showroom-fresh Porsche 911 or Land Rover Defender, or restoring a classic Royal Enfield motorcycle, each vehicle receives our undivided dedication.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/book"
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors shadow-gold"
              >
                Book Studio Appointment
              </Link>
              <Link
                href="/services"
                className="px-6 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-[420px] rounded-2xl overflow-hidden border border-brand-border shadow-2xl bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85"
                alt="Mister Ceramic Studio Detailing Bay"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                  Controlled Bay Environment
                </span>
                <p className="text-xs text-white mt-1">
                  Enclosed, dust-filtered cleanroom for paint correction, film installation, and infrared baking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities & Equipment Highlights */}
      <div className="py-20 bg-brand-darker border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
              Studio Infrastructure
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
              Equipped for Precision
            </h2>
            <p className="text-zinc-400 text-sm mt-3">
              We invest in professional equipment to ensure reliable results on every single panel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-brand-card border border-brand-border p-8">
              <div className="w-12 h-12 rounded-xl bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cleanroom Application Bay</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Positive air pressure and high-efficiency filtration dramatically reduce airborne dust particles, ensuring bubble-free PPF wraps and glass-smooth coatings.
              </p>
            </div>

            <div className="rounded-2xl bg-brand-card border border-brand-border p-8">
              <div className="w-12 h-12 rounded-xl bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold mb-6">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Shortwave Infrared Curing</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Industrial mobile IR heat lamps heat coatings from the substrate outward, producing rapid cross-linking and exceptional chemical resistance.
              </p>
            </div>

            <div className="rounded-2xl bg-brand-card border border-brand-border p-8">
              <div className="w-12 h-12 rounded-xl bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold mb-6">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Precision Polishers & Gauges</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Dual-action random orbital polishers paired with digital ultrasonic paint depth meters guarantee scratch removal without burning through clear coats.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commitment to Quality Checklist */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
            Our Quality Guarantee
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            The Mister Ceramic Promise
          </h2>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            'No silicone fillers or cover-up glazes — only true optical paint correction',
            'Surgical multi-point paint thickness audits before any machine compounding',
            'Full edge-wrapped PPF installation where design allows for invisible seams',
            'Real-time customer tracking: access photographic progress updates online',
            'Certified genuine formulas sourced directly from accredited global manufacturers',
            'Complimentary warranty maintenance wash audits on all eligible coating packages',
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl bg-brand-card border border-brand-border"
            >
              <CheckCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <span className="text-xs text-zinc-300 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
