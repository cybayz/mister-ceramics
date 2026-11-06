'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Calendar, Menu, X, Shield, ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { BUSINESS_INFO } from '@/lib/constants';

const NAV_LINKS = [
  { name: 'Services', href: '/services' },
  { name: 'Our Work', href: '/work' },
  { name: 'About Us', href: '/about' },
  { name: 'Track Vehicle', href: '/track' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Monitor scroll for header background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-brand-dark/95 backdrop-blur-md border-b border-brand-border py-3.5 shadow-2xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Logo />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-200 py-1 ${
                      isActive ? 'text-brand-gold' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action CTAs */}
            <div className="hidden lg:flex items-center gap-5">
              {/* Phone quick call */}
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-brand-goldLight transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shadow-sm">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>{BUSINESS_INFO.phone}</span>
              </a>

              {/* Book Appointment CTA */}
              <Link
                href="/book"
                className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-brand-goldLight via-brand-gold to-brand-goldMuted hover:from-white hover:to-brand-gold shadow-gold hover:shadow-goldGlow transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </Link>
            </div>

            {/* Mobile Menu Trigger & Book Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-black bg-brand-gold shadow-sm"
              >
                Book
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-brand-cardElevated border border-brand-border text-zinc-300 hover:text-white focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-brand-dark border-l border-brand-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-brand-border">
                <Logo variant="compact" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col gap-2 mt-6">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold tracking-wider uppercase transition-colors ${
                        isActive
                          ? 'bg-brand-cardElevated text-brand-gold border border-brand-gold/30'
                          : 'text-zinc-300 hover:bg-brand-card hover:text-white'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-500" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom info & CTAs */}
            <div className="pt-6 border-t border-brand-border space-y-4">
              <Link
                href="/book"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-brand-goldLight to-brand-gold shadow-gold"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-semibold text-zinc-200 bg-brand-cardElevated border border-brand-border"
              >
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>Call {BUSINESS_INFO.phone}</span>
              </a>

              <div className="text-[11px] text-center text-zinc-500 leading-tight">
                Chegamanadu, Kottarakkara, Kollam, Kerala
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

