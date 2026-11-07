'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Shield, Clock, Check, Sparkles, HelpCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface VehicleOption {
  id: string;
  label: string;
  category: 'CAR' | 'BIKE';
  multiplier: number;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: 'hatchback', label: 'Hatchback / Compact', category: 'CAR', multiplier: 0.85 },
  { id: 'sedan', label: 'Premium Sedan', category: 'CAR', multiplier: 1.0 },
  { id: 'mid-suv', label: 'Compact / Mid SUV', category: 'CAR', multiplier: 1.15 },
  { id: 'full-suv', label: 'Large SUV / MPV / Luxury 4x4', category: 'CAR', multiplier: 1.3 },
  { id: 'superbike', label: 'Motorcycle / Superbike', category: 'BIKE', multiplier: 0.45 },
];

interface PackageOption {
  id: string;
  name: string;
  vehicleType: 'CAR' | 'BIKE' | 'BOTH';
  basePrice: number;
  baseHours: number;
  warranty: string;
  highlights: string[];
}

const TREATMENT_OPTIONS: PackageOption[] = [
  {
    id: 'ceramic-9h',
    name: 'Ceramic Quartz 9H (Multi-Layer)',
    vehicleType: 'BOTH',
    basePrice: 18000,
    baseHours: 18,
    warranty: '3-Year Studio Warranty',
    highlights: ['Multi-Stage Paint Correction', 'High Hydrophobic Water Contact Angle', 'UV & Chemical Resistance'],
  },
  {
    id: 'borophene-10h',
    name: 'Borophene 10H Matrix Coating',
    vehicleType: 'CAR',
    basePrice: 32000,
    baseHours: 24,
    warranty: '5-Year Studio Warranty',
    highlights: ['Atomically Engineered 2D Lattice', 'Extreme Thermal & Scratch Defense', 'Shortwave Infrared Lamp Cured'],
  },
  {
    id: 'full-ppf',
    name: 'Full Body Self-Healing TPU PPF',
    vehicleType: 'CAR',
    basePrice: 95000,
    baseHours: 48,
    warranty: '7-Year Film Warranty',
    highlights: ['Instant Self-Healing with Heat', 'Gravel & Stone Chip Armor', 'Wrapped Edges on Panels'],
  },
  {
    id: 'paint-correction',
    name: 'Multi-Stage Surgical Paint Correction',
    vehicleType: 'BOTH',
    basePrice: 12000,
    baseHours: 12,
    warranty: 'Permanent Defect Elimination',
    highlights: ['95%+ Swirl & Scratch Eradication', 'Paint Depth Micron Gauge Auditing', 'High-Gloss Jeweler Refinement'],
  },
  {
    id: 'sunfilm',
    name: 'Nano-Ceramic Solar Heat Shield (Sunfilm)',
    vehicleType: 'CAR',
    basePrice: 14000,
    baseHours: 8,
    warranty: '5-Year Bubble & Peel Warranty',
    highlights: ['Blocks 99% UV & 90% Infrared Heat', 'Zero FASTag / Mobile Interference', 'Front Windshield High Clarity'],
  },
  {
    id: 'bike-ceramic',
    name: 'Superbike 9H Heat-Resistant Ceramic',
    vehicleType: 'BIKE',
    basePrice: 8500,
    baseHours: 8,
    warranty: '2-Year Studio Warranty',
    highlights: ['800°C Engine & Exhaust Protection', 'Tank & Cowl Deep Gloss Finish', 'Alloy Wheels & Swingarm Sealed'],
  },
];

export default function StudioCostCalculator() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('sedan');
  const [selectedTreatment, setSelectedTreatment] = useState<string>('borophene-10h');

  const vehicle = VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle) || VEHICLE_OPTIONS[1];

  // Filter treatments matching vehicle category
  const availableTreatments = TREATMENT_OPTIONS.filter(
    (t) => t.vehicleType === 'BOTH' || (vehicle.category === 'BIKE' ? t.vehicleType === 'BIKE' : t.vehicleType === 'CAR')
  );

  const activeTreatment =
    availableTreatments.find((t) => t.id === selectedTreatment) || availableTreatments[0];

  const estimatedPrice = Math.round(activeTreatment.basePrice * vehicle.multiplier);
  const estimatedHours = Math.round(activeTreatment.baseHours * (vehicle.category === 'BIKE' ? 1.0 : vehicle.multiplier * 0.95));

  return (
    <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-10 shadow-darkCard text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-brand-borderSubtle">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Studio Estimator</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Calculate Treatment Duration & Price
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Get an instant estimate for your vehicle category based on cleanroom bay duration and materials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Vehicle Size Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              1. Select Vehicle Size & Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {VEHICLE_OPTIONS.map((v) => {
                const isSelected = selectedVehicle === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVehicle(v.id);
                      // Auto-switch treatment if bike selected and car treatment was active
                      if (v.category === 'BIKE' && activeTreatment.vehicleType === 'CAR') {
                        setSelectedTreatment('bike-ceramic');
                      } else if (v.category === 'CAR' && activeTreatment.vehicleType === 'BIKE') {
                        setSelectedTreatment('ceramic-9h');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-gold/15 border-brand-gold text-white font-bold shadow-gold'
                        : 'bg-brand-cardElevated border-brand-border text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs">{v.label}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {v.category === 'CAR' ? '4-Wheeler' : '2-Wheeler'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Treatment Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              2. Select Protection or Detailing Service
            </label>
            <div className="space-y-2.5">
              {availableTreatments.map((t) => {
                const isSelected = activeTreatment.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTreatment(t.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-gold/15 border-brand-gold text-white shadow-gold'
                        : 'bg-brand-cardElevated border-brand-border text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{t.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-gold" />}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{t.warranty}</div>
                    </div>
                    <div className="text-xs font-semibold text-brand-goldLight">
                      ~{Math.round(t.basePrice * vehicle.multiplier / 1000)}k
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-5 rounded-2xl bg-brand-cardElevated border border-brand-border p-6 sm:p-8 space-y-6">
          <div className="border-b border-brand-borderSubtle pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Estimated Studio Investment
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-gold mt-1">
              {formatCurrency(estimatedPrice)}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-gold" />
              <span>Cleanroom Bay Time: ~{estimatedHours} Studio Hours</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Package Inclusions:
            </span>
            <ul className="space-y-2">
              {activeTreatment.highlights.map((h, i) => (
                <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
              <li className="text-xs text-zinc-300 flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                <span>{activeTreatment.warranty}</span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-brand-borderSubtle text-[11px] text-zinc-400">
            * Final quotation confirmed following digital paint depth analysis and surface inspection at Chegamanadu studio.
          </div>

          <div className="pt-2">
            <Link
              href={`/book?service=${activeTreatment.id === 'full-ppf' ? 'paint-protection-film-ppf' : activeTreatment.id === 'borophene-10h' ? 'borophene-coating' : 'ceramic-coating'}`}
              className="w-full py-3.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-brand-goldLight via-brand-gold to-brand-goldMuted hover:from-white hover:to-brand-gold transition-all shadow-gold block"
            >
              Reserve This Configuration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

