'use client';

import React from 'react';
import { Printer, MapPin, Phone, Calendar, Clock, Shield, Sparkles } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { BUSINESS_INFO } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface DigitalIntakePassProps {
  reference: string;
  customerName: string;
  customerPhone: string;
  vehicle: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
}

export default function DigitalIntakePass({
  reference,
  customerName,
  customerPhone,
  vehicle,
  serviceName,
  preferredDate,
  preferredTime,
  status,
}: DigitalIntakePassProps) {
  const handlePrint = () => {
    window.print();
  };

  const trackingUrl = `https://misterceramic.com/track?ref=${reference}&phone=${customerPhone.replace(/[^0-9]/g, '').slice(-10)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingUrl)}&color=000000&bgcolor=FFFFFF`;

  return (
    <div className="rounded-2xl bg-zinc-950 border border-brand-gold/40 p-6 sm:p-8 shadow-2xl relative text-zinc-100 max-w-xl mx-auto">
      {/* Top Pass Brand Header */}
      <div className="flex items-start justify-between pb-6 border-b border-zinc-800">
        <div>
          <Logo variant="compact" isLink={false} />
          <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold">
            Official Studio Intake Pass
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Pass Reference</span>
          <span className="text-sm font-mono font-bold text-brand-gold">{reference}</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="py-6 space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Registered Vehicle</span>
            <span className="font-bold text-white text-sm">{vehicle}</span>
          </div>

          <div>
            <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Treatment Protocol</span>
            <span className="font-bold text-brand-gold text-sm">{serviceName}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
          <div>
            <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Scheduled Drop-Off</span>
            <span className="font-semibold text-white">
              {formatDate(preferredDate)} • {preferredTime}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Vehicle Owner</span>
            <span className="font-semibold text-white">{customerName}</span>
          </div>
        </div>

        {/* QR Code & Studio Verification Section */}
        <div className="pt-4 border-t border-zinc-900 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Scan for Live Floor Tracking
            </span>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Point phone camera to view ultrasonic paint depth readings & cleanroom progress photos.
            </p>
            <div className="text-[10px] text-zinc-600 font-mono pt-1">
              Chegamanadu, Kottarakkara • {BUSINESS_INFO.phone}
            </div>
          </div>

          <div className="w-20 h-20 bg-white p-1 rounded-xl shrink-0 border border-zinc-700 shadow-sm flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl} alt="QR Code for Tracking" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-[10px] text-zinc-500">
          Status: <strong className="text-brand-gold uppercase">{status}</strong>
        </span>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-brand-gold" />
          <span>Print / Save Pass</span>
        </button>
      </div>
    </div>
  );
}
