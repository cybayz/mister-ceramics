import React from 'react';
import prisma from '@/lib/prisma';
import BookingClient from './BookingClient';
import type { Metadata } from 'next';
import { Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Book an Appointment | Premium Automotive Detailing',
  description:
    'Book your car or motorcycle detailing, PPF wrap, or Ceramic coating appointment online at Mister Ceramic, Chegamanadu, Kottarakkara.',
};

export const revalidate = 0; // Dynamic for live booking availability

export default async function BookPage() {
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
    <div className="bg-brand-dark min-h-screen pt-28 pb-24 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cardElevated border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>Studio Intake System</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Reserve Studio Appointment
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Reserve cleanroom bay time for your vehicle. No advance account creation required — receive an instant tracking reference code.
          </p>
        </div>

        <BookingClient categories={categories} />
      </div>
    </div>
  );
}
