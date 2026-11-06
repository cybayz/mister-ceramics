'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  CheckCircle2,
  Clock,
  Car,
  Calendar,
  AlertCircle,
  Shield,
  Layers,
  ChevronRight,
  MessageCircle,
  Eye,
  Camera,
  Check,
} from 'lucide-react';
import { SERVICE_STATUSES, STATUS_COLORS, ServiceStatus } from '@/lib/constants';
import { formatDate, formatDateTime } from '@/lib/utils';

interface TrackedBooking {
  reference: string;
  customerName: string;
  customerPhone: string;
  vehicle: {
    type: string;
    brand: string;
    model: string;
    registrationNumber: string | null;
    color: string | null;
  };
  service: {
    name: string;
    category: string;
  };
  package: {
    name: string;
    warrantyMonths: number | null;
  } | null;
  status: string;
  preferredDate: string;
  preferredTime: string;
  estimatedDeliveryDate: string | null;
  customerNotes: string | null;
  createdAt: string;
  statusHistory: {
    id: string;
    status: string;
    note: string | null;
    createdAt: string;
  }[];
  progressUpdates: {
    id: string;
    stage: string;
    title: string;
    description: string;
    photos: string[];
    createdAt: string;
  }[];
}

export default function TrackingClient() {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get('ref') || '';
  const urlPhone = searchParams.get('phone') || '';

  const [reference, setReference] = useState(urlRef);
  const [phone, setPhone] = useState(urlPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<TrackedBooking | null>(null);

  const fetchTracking = async (refVal: string, phoneVal: string) => {
    if (!refVal || !phoneVal) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: refVal, phone: phoneVal }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBooking(data.booking);
      } else {
        setError(data.error || 'Failed to locate vehicle tracking record.');
        setBooking(null);
      }
    } catch (err) {
      setError('Network communication error. Please try again.');
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search if query params present
  useEffect(() => {
    if (urlRef && urlPhone) {
      fetchTracking(urlRef, urlPhone);
    }
  }, [urlRef, urlPhone]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(reference, phone);
  };

  // Compute status index for timeline progression
  const currentStatusIndex = booking
    ? SERVICE_STATUSES.indexOf(booking.status as ServiceStatus)
    : -1;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Verification Card */}
      <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-8 shadow-darkCard mb-10">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Booking Reference Code *
              </label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. MC-202611-0101"
                className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold uppercase tracking-wider font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Registered Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9207209105"
                className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-[11px] text-zinc-500">
              * Secure client verification: Only matching telephone numbers can access workshop photographs.
            </span>
            <button
              type="submit"
              disabled={isLoading || !reference.trim() || !phone.trim()}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-gold"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Verifying...' : 'Track Vehicle'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* TRACKING REPORT DETAILS */}
      {booking && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Status Header Banner */}
          <div className="rounded-2xl bg-brand-card border border-brand-gold/40 p-6 sm:p-8 shadow-gold relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono font-bold tracking-wider text-brand-gold">
                    {booking.reference}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      STATUS_COLORS[booking.status as ServiceStatus]?.bg || 'bg-brand-cardElevated'
                    } ${STATUS_COLORS[booking.status as ServiceStatus]?.text || 'text-white'} ${
                      STATUS_COLORS[booking.status as ServiceStatus]?.border || 'border-brand-border'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {booking.vehicle.brand} {booking.vehicle.model}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Registered Owner: <strong className="text-zinc-200">{booking.customerName}</strong> ({booking.customerPhone})
                </p>
              </div>

              {/* Delivery ETA pill */}
              <div className="p-4 rounded-xl bg-brand-cardElevated border border-brand-border text-right sm:text-center shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                  Estimated Studio Release
                </span>
                <span className="text-sm font-bold text-brand-goldLight block mt-0.5">
                  {booking.estimatedDeliveryDate ? formatDate(booking.estimatedDeliveryDate) : 'Under Evaluation'}
                </span>
              </div>
            </div>

            {/* Vehicle Metadata Summary */}
            <div className="mt-6 pt-6 border-t border-brand-borderSubtle grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Service</span>
                <span className="font-semibold text-white">{booking.service.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Package</span>
                <span className="font-semibold text-brand-gold">
                  {booking.package?.name || 'Standard Treatment'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Intake Date</span>
                <span className="font-semibold text-white">{formatDate(booking.preferredDate)}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Registration</span>
                <span className="font-semibold text-white">
                  {booking.vehicle.registrationNumber || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* 10-STAGE PROGRESS TIMELINE */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-8 shadow-darkCard">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Studio Progress Timeline</span>
            </h3>

            {/* Horizontal / Vertical Stepper */}
            <div className="relative pl-6 sm:pl-8 border-l border-brand-border space-y-8">
              {SERVICE_STATUSES.filter((s) => s !== 'Cancelled').map((statusName, idx) => {
                const isPast = currentStatusIndex > idx;
                const isCurrent = currentStatusIndex === idx;
                const isFuture = currentStatusIndex < idx;

                // Find matching status history note if recorded
                const historyRecord = booking.statusHistory.find((h) => h.status === statusName);

                return (
                  <div key={statusName} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                        isPast
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : isCurrent
                          ? 'bg-brand-gold text-black border-brand-goldLight ring-4 ring-brand-gold/20 animate-pulse'
                          : 'bg-brand-cardElevated text-zinc-600 border-brand-border'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    {/* Step Content */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4
                          className={`text-sm font-bold tracking-wide ${
                            isCurrent
                              ? 'text-brand-gold'
                              : isPast
                              ? 'text-white'
                              : 'text-zinc-500'
                          }`}
                        >
                          {statusName}
                        </h4>
                        {historyRecord && (
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {formatDateTime(historyRecord.createdAt)}
                          </span>
                        )}
                      </div>

                      {historyRecord?.note && (
                        <p className="text-xs text-zinc-300 mt-1 bg-brand-cardElevated/70 p-3 rounded-lg border border-brand-borderSubtle">
                          {historyRecord.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WORKSHOP PROGRESS UPDATES & PHOTOGRAPHS */}
          {booking.progressUpdates.length > 0 && (
            <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-8 shadow-darkCard">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold mb-6 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span>Workshop Floor Updates & Photos</span>
              </h3>

              <div className="space-y-8">
                {booking.progressUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="p-6 rounded-xl bg-brand-cardElevated border border-brand-border space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                          Stage: {update.stage}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">{update.title}</h4>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {formatDateTime(update.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {update.description}
                    </p>

                    {/* Photo Grid */}
                    {update.photos && update.photos.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                        {update.photos.map((photoUrl, i) => (
                          <div
                            key={i}
                            className="relative h-44 rounded-lg overflow-hidden border border-brand-border group cursor-pointer"
                          >
                            <Image
                              src={photoUrl}
                              alt={update.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 300px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct WhatsApp Contact Regarding Vehicle */}
          <div className="p-6 rounded-xl bg-brand-cardElevated border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-white">Need an Update or Have a Question?</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Chat directly with our Chegamanadu studio workshop floor regarding booking {booking.reference}.
              </p>
            </div>
            <a
              href={`https://wa.me/919207209105?text=${encodeURIComponent(
                `Hello Mister Ceramic Studio, I am following up on my vehicle (${booking.vehicle.brand} ${booking.vehicle.model}), Reference: ${booking.reference}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Workshop on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
