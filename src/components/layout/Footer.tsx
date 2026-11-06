import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, Mail, Shield, ExternalLink, Lock } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-darker border-t border-brand-border text-zinc-400 text-sm">
      {/* Top Banner / Trust bar */}
      <div className="border-b border-brand-borderSubtle bg-brand-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">Cleanroom Installation</h4>
                <p className="text-xs text-zinc-500">Dust-free studio bays & shortwave IR curing lamps</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">Certified Nano Technology</h4>
                <p className="text-xs text-zinc-500">Borophene, Graphene & 9H Ceramic formulas</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">Live Vehicle Tracking</h4>
                <p className="text-xs text-zinc-500">Transparent progress photos from intake to delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm pt-2">
              Mister Ceramic is Chegamanadu, Kottarakkara&apos;s premier automotive detailing, paint protection, and restoration studio. Dedicated to master craftsmanship, defect-free optical correction, and cutting-edge surface defense for cars and motorcycles.
            </p>
            <div className="pt-2">
              <a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-goldLight transition-colors font-medium"
              >
                <span>Find us on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-brand-gold transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-brand-gold transition-colors">
                  Project Gallery & Transformations
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-brand-gold transition-colors">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-brand-gold transition-colors">
                  Track Your Vehicle
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-gold transition-colors">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                  Contact & Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Premium Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Key Specialities</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services#car-protection" className="hover:text-brand-gold transition-colors">
                  Paint Protection Film (PPF)
                </Link>
              </li>
              <li>
                <Link href="/services#car-protection" className="hover:text-brand-gold transition-colors">
                  Borophene 10H Coating
                </Link>
              </li>
              <li>
                <Link href="/services#car-protection" className="hover:text-brand-gold transition-colors">
                  9H Quartz Ceramic Coating
                </Link>
              </li>
              <li>
                <Link href="/services#car-detailing-restoration" className="hover:text-brand-gold transition-colors">
                  Multi-Stage Paint Correction
                </Link>
              </li>
              <li>
                <Link href="/services#car-protection" className="hover:text-brand-gold transition-colors">
                  Ceramic Sunfilm Installation
                </Link>
              </li>
              <li>
                <Link href="/services#bike-services" className="hover:text-brand-gold transition-colors">
                  Superbike Detailing & Ceramic
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Studio Contact</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="hover:text-white transition-colors">
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.hours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{BUSINESS_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Local SEO tags pill cloud */}
        <div className="mt-12 pt-8 border-t border-brand-borderSubtle">
          <p className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wider font-semibold">
            Automotive Detailing Services in Kerala:
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500">
            <span>Car detailing in Kottarakkara</span> •
            <span>PPF installation in Kottarakkara</span> •
            <span>Ceramic coating in Kollam</span> •
            <span>Borophene coating in Kollam</span> •
            <span>Bike detailing in Kollam</span> •
            <span>Car painting in Kottarakkara</span> •
            <span>Sunfilm installation Chegamanadu</span> •
            <span>Superbike detailing Kerala</span>
          </div>
        </div>

        {/* Bottom copyright & Admin Portal Link */}
        <div className="mt-8 pt-6 border-t border-brand-borderSubtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {currentYear} {BUSINESS_INFO.name}. All rights reserved. Precision Detailing & Nanotech Studio.
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-brand-gold transition-colors text-[11px]"
            >
              <Lock className="w-3 h-3" />
              <span>Studio Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
