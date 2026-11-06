'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Car,
  Bike,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Shield,
  Upload,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { BUSINESS_INFO } from '@/lib/constants';

interface ServiceWithPackages {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  vehicleType: string;
  headline: string | null;
  startingPrice: number | null;
  defaultDurationHours: number;
  packages: {
    id: string;
    name: string;
    price: number | null;
    durationHours: number | null;
    featuresJson: string | null;
    warrantyMonths: number | null;
    isPopular: boolean;
  }[];
}

interface CategoryWithServices {
  id: string;
  slug: string;
  name: string;
  vehicleType: string;
  services: ServiceWithPackages[];
}

interface BookingClientProps {
  categories: CategoryWithServices[];
}

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
];

export default function BookingClient({ categories }: BookingClientProps) {
  const searchParams = useSearchParams();
  const preselectedServiceSlug = searchParams.get('service');
  const preselectedPackageId = searchParams.get('package');

  // Multi-step State (1 to 7)
  const [step, setStep] = useState(1);

  // Step 1: Vehicle Type
  const [vehicleType, setVehicleType] = useState<'CAR' | 'BIKE'>('CAR');

  // Step 2: Vehicle Details
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [color, setColor] = useState('');

  // Step 3: Service Selection
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  // Step 4: Package Selection
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');

  // Step 5: Date and Time
  const todayStr = new Date().toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(todayStr);
  const [preferredTime, setPreferredTime] = useState('10:30 AM');

  // Step 6: Customer Details & Photos
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    reference: string;
    preferredDate: string;
    preferredTime: string;
    vehicle: string;
    serviceName: string;
    packageName: string | null;
    estimatedPrice: number | null;
  } | null>(null);

  // Auto-select if URL params passed
  useEffect(() => {
    if (preselectedServiceSlug) {
      for (const cat of categories) {
        const found = cat.services.find((s) => s.slug === preselectedServiceSlug);
        if (found) {
          setSelectedServiceId(found.id);
          if (found.vehicleType === 'BIKE') {
            setVehicleType('BIKE');
          } else if (found.vehicleType === 'CAR') {
            setVehicleType('CAR');
          }
          if (preselectedPackageId) {
            setSelectedPackageId(preselectedPackageId);
          }
          break;
        }
      }
    }
  }, [preselectedServiceSlug, preselectedPackageId, categories]);

  // Filtered Services based on vehicle type
  const availableServices = categories
    .flatMap((c) => c.services)
    .filter((s) => s.vehicleType === 'BOTH' || s.vehicleType === vehicleType);

  const selectedService = availableServices.find((s) => s.id === selectedServiceId);
  const selectedPackage = selectedService?.packages.find((p) => p.id === selectedPackageId);

  // Photo upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);

    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setUploadedPhotos((prev) => [...prev, data.url]);
      } else {
        alert(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      alert('Error uploading photo');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Booking
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = {
        vehicleType,
        brand,
        model,
        registrationNumber,
        color,
        serviceId: selectedServiceId,
        packageId: selectedPackageId || null,
        preferredDate,
        preferredTime,
        customerName,
        customerPhone,
        customerEmail,
        customerNotes,
        photoUrls: uploadedPhotos,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBookingConfirmation(data.booking);
      } else {
        setSubmissionError(data.error || 'Failed to submit appointment request.');
      }
    } catch (err) {
      setSubmissionError('Network error while processing booking. Please try again or WhatsApp us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If Booking Confirmed, show Confirmation Screen
  if (bookingConfirmation) {
    const whatsappText = encodeURIComponent(
      `Hello Mister Ceramic Studio, I have booked an appointment for my ${bookingConfirmation.vehicle}. Booking Reference: ${bookingConfirmation.reference}. Preferred Date: ${bookingConfirmation.preferredDate} at ${bookingConfirmation.preferredTime}.`
    );

    return (
      <div className="max-w-2xl mx-auto rounded-2xl bg-brand-card border border-brand-gold/40 p-8 sm:p-10 shadow-gold text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-gold">
          Appointment Request Received
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Reference: {bookingConfirmation.reference}
        </h2>

        <p className="text-zinc-300 text-xs sm:text-sm mt-3 leading-relaxed">
          Your booking has been registered in the Mister Ceramic studio system. Our workshop manager will review bay availability and confirm your appointment shortly.
        </p>

        {/* Summary Card */}
        <div className="mt-8 p-6 rounded-xl bg-brand-cardElevated border border-brand-border text-left space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-brand-borderSubtle">
            <span className="text-zinc-400">Vehicle:</span>
            <span className="font-semibold text-white">{bookingConfirmation.vehicle}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-brand-borderSubtle">
            <span className="text-zinc-400">Service:</span>
            <span className="font-semibold text-white">{bookingConfirmation.serviceName}</span>
          </div>
          {bookingConfirmation.packageName && (
            <div className="flex justify-between py-1 border-b border-brand-borderSubtle">
              <span className="text-zinc-400">Package:</span>
              <span className="font-semibold text-brand-gold">{bookingConfirmation.packageName}</span>
            </div>
          )}
          <div className="flex justify-between py-1 border-b border-brand-borderSubtle">
            <span className="text-zinc-400">Scheduled Date & Time:</span>
            <span className="font-semibold text-white">
              {bookingConfirmation.preferredDate} at {bookingConfirmation.preferredTime}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-zinc-400">Estimated Total:</span>
            <span className="font-bold text-base text-brand-gold">
              {formatCurrency(bookingConfirmation.estimatedPrice)}
            </span>
          </div>
        </div>

        {/* Next Actions */}
        <div className="mt-8 space-y-3">
          <a
            href={`https://wa.me/919207209105?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notify Studio on WhatsApp</span>
          </a>

          <Link
            href={`/track?ref=${bookingConfirmation.reference}&phone=${customerPhone}`}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-200 bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border transition-colors"
          >
            <span>Go to Live Vehicle Tracking</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Stepper Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-borderSubtle w-full z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-gold transition-all duration-300 z-0"
            style={{ width: `${((step - 1) / 6) * 100}%` }}
          />

          {[
            { num: 1, label: 'Vehicle' },
            { num: 2, label: 'Model' },
            { num: 3, label: 'Service' },
            { num: 4, label: 'Package' },
            { num: 5, label: 'Schedule' },
            { num: 6, label: 'Details' },
            { num: 7, label: 'Review' },
          ].map((s) => (
            <div
              key={s.num}
              className={`relative z-10 flex flex-col items-center cursor-pointer ${
                step >= s.num ? 'text-brand-gold' : 'text-zinc-500'
              }`}
              onClick={() => {
                if (s.num < step) setStep(s.num);
              }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-brand-gold text-black shadow-gold ring-4 ring-brand-gold/20'
                    : step > s.num
                    ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/40'
                    : 'bg-brand-cardElevated text-zinc-500 border border-brand-border'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className="hidden sm:block text-[10px] font-semibold tracking-wider uppercase mt-1.5">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP CONTAINER */}
      <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-10 shadow-darkCard">
        {submissionError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{submissionError}</span>
          </div>
        )}

        {/* STEP 1: VEHICLE TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Step 1 of 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Select Your Vehicle Classification
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Choose whether you are bringing in a four-wheeler or motorcycle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <button
                type="button"
                onClick={() => setVehicleType('CAR')}
                className={`p-8 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-4 ${
                  vehicleType === 'CAR'
                    ? 'border-brand-gold bg-brand-gold/10 shadow-gold'
                    : 'border-brand-border bg-brand-cardElevated hover:border-zinc-700'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    vehicleType === 'CAR' ? 'bg-brand-gold text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Car className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Car / SUV / Luxury Vehicle</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Sedans, Hatchbacks, Compact SUVs, Off-Roaders & Exotics
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVehicleType('BIKE')}
                className={`p-8 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-4 ${
                  vehicleType === 'BIKE'
                    ? 'border-brand-gold bg-brand-gold/10 shadow-gold'
                    : 'border-brand-border bg-brand-cardElevated hover:border-zinc-700'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    vehicleType === 'BIKE' ? 'bg-brand-gold text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Bike className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Motorcycle / Superbike</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Cruisers, Superbikes, Adventure Tourers & Vintage Classics
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2"
              >
                <span>Continue to Vehicle Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: VEHICLE DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Step 2 of 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Enter Vehicle Specifications
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Provide brand, model, and optional registration details for intake preparation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Vehicle Brand / Make *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={vehicleType === 'CAR' ? 'e.g. BMW, Porsche, Mercedes, Toyota' : 'e.g. Ducati, Royal Enfield, Kawasaki'}
                  className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Model & Variant *
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={vehicleType === 'CAR' ? 'e.g. 330i M Sport or Fortuner 4x4' : 'e.g. Panigale V4 or Continental GT 650'}
                  className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Registration Number (Optional)
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. KL-24-S-1234 or New Delivery"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Vehicle Colour / Paint Finish (Optional)
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Metallic Black, Guards Red, Matte Grey"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!brand.trim() || !model.trim()}
                onClick={() => setStep(3)}
                className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span>Continue to Select Service</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT SERVICE */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Step 3 of 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Select Your Required Detailing Service
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Showing services engineered for {vehicleType === 'CAR' ? 'Cars' : 'Bikes'}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
              {availableServices.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setSelectedPackageId(''); // reset package when service changes
                    }}
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-brand-gold bg-brand-gold/10 shadow-gold'
                        : 'border-brand-border bg-brand-cardElevated hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-white">{service.name}</h3>
                        {isSelected && <Check className="w-4 h-4 text-brand-gold shrink-0" />}
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                        {service.headline || 'Professional treatment by studio technicians.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-brand-borderSubtle flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Est. {service.defaultDurationHours} hrs</span>
                      <span className="font-semibold text-zinc-200">
                        {service.startingPrice ? `From ${formatCurrency(service.startingPrice)}` : 'Consultation'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!selectedServiceId}
                onClick={() => setStep(4)}
                className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span>Continue to Packages</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SELECT PACKAGE */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Step 4 of 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Choose Specific Package
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Selected: <strong className="text-white">{selectedService?.name}</strong>. Choose a package or proceed with custom evaluation.
              </p>
            </div>

            {selectedService?.packages && selectedService.packages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {selectedService.packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  let features: string[] = [];
                  try {
                    if (pkg.featuresJson) features = JSON.parse(pkg.featuresJson);
                  } catch (e) {
                    features = [];
                  }

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-6 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-gold bg-brand-gold/10 shadow-gold'
                          : 'border-brand-border bg-brand-cardElevated hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-bold text-white">{pkg.name}</h3>
                          {isSelected && <Check className="w-4 h-4 text-brand-gold shrink-0" />}
                        </div>

                        <div className="text-lg font-bold text-brand-gold mt-2">
                          {pkg.price ? formatCurrency(pkg.price) : 'On Consultation'}
                        </div>

                        <div className="text-[11px] text-zinc-400 mt-1">
                          {pkg.durationHours && <span>Est. {pkg.durationHours} hrs</span>}
                          {pkg.warrantyMonths && (
                            <span> • {pkg.warrantyMonths / 12} Yrs Warranty</span>
                          )}
                        </div>

                        {features.length > 0 && (
                          <ul className="mt-4 space-y-1.5 border-t border-brand-borderSubtle pt-3">
                            {features.map((f, i) => (
                              <li key={i} className="text-[11px] text-zinc-300 flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-brand-cardElevated border border-brand-border text-center">
                <p className="text-xs text-zinc-300">
                  This service is tailored specifically upon vehicle inspection. Our workshop technician will provide an exact quote upon intake.
                </p>
              </div>
            )}

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2"
              >
                <span>Continue to Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PREFERRED DATE & TIME */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Step 5 of 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Select Preferred Date & Drop-Off Time
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Working Hours: Monday to Saturday 9:00 AM – 7:00 PM. Studio bays are reserved per vehicle to ensure zero rushed work.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Intake Date *
                </label>
                <input
                  type="date"
                  min={todayStr}
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
                <p className="text-[11px] text-zinc-500 mt-2">
                  * Bay reservations are confirmed following studio capacity audit.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Preferred Intake Time Slot *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = preferredTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setPreferredTime(slot)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-brand-gold text-black border-brand-gold font-bold shadow-gold'
                            : 'bg-brand-cardElevated text-zinc-300 border-brand-border hover:border-zinc-700'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!preferredDate || !preferredTime}
                onClick={() => setStep(6)}
                className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span>Continue to Customer Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: CUSTOMER DETAILS & PHOTO UPLOAD */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Step 6 of 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Enter Your Contact Information
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                We use your phone number for live status tracking and WhatsApp progress reports.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Phone Number (Active on WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 92072 09105"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. anand@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Special Instructions or Specific Paint Concerns
                </label>
                <textarea
                  rows={3}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Deep scratch on driver side door, please focus on bonnet swirl marks..."
                  className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>

              {/* Upload vehicle photographs (optional) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Upload Current Vehicle Condition Photographs (Optional)
                </label>
                <div className="border border-dashed border-brand-border rounded-xl p-6 text-center bg-brand-cardElevated/50 hover:bg-brand-cardElevated transition-colors">
                  <Upload className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                  <p className="text-xs text-zinc-300">
                    {isUploading ? 'Uploading photograph...' : 'Click to upload vehicle photo'}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">JPEG, PNG, or WebP up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="vehicle-photo-upload"
                  />
                  <label
                    htmlFor="vehicle-photo-upload"
                    className="mt-3 inline-block px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-200 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
                  >
                    Select File
                  </label>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {uploadedPhotos.map((url, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-brand-border">
                        <Image src={url} alt="Vehicle preview" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!customerName.trim() || !customerPhone.trim()}
                onClick={() => setStep(7)}
                className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span>Review & Submit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW & SUBMIT */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Step 7 of 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Review Your Appointment Details
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Please verify your details before submitting your studio intake request.
              </p>
            </div>

            {/* Review Breakdown Table */}
            <div className="rounded-xl bg-brand-cardElevated border border-brand-border p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-brand-borderSubtle">
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Vehicle</span>
                  <span className="font-bold text-white text-sm">
                    {brand} {model} ({vehicleType})
                  </span>
                  {registrationNumber && (
                    <span className="text-zinc-400 block mt-0.5">Reg: {registrationNumber}</span>
                  )}
                  {color && <span className="text-zinc-400 block">Colour: {color}</span>}
                </div>

                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Service & Package</span>
                  <span className="font-bold text-brand-gold text-sm">
                    {selectedService?.name}
                  </span>
                  {selectedPackage && (
                    <span className="text-zinc-300 block mt-0.5 font-medium">
                      {selectedPackage.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-brand-borderSubtle">
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Schedule</span>
                  <span className="font-semibold text-white">
                    {preferredDate} at {preferredTime}
                  </span>
                  <span className="text-zinc-400 block mt-0.5">
                    Est. Duration: ~{selectedPackage?.durationHours || selectedService?.defaultDurationHours} hrs
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">Client Contact</span>
                  <span className="font-semibold text-white">{customerName}</span>
                  <span className="text-zinc-400 block mt-0.5">{customerPhone}</span>
                  {customerEmail && <span className="text-zinc-400 block">{customerEmail}</span>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Estimated Total
                </span>
                <span className="text-xl font-extrabold text-brand-gold">
                  {formatCurrency(selectedPackage?.price || selectedService?.startingPrice)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-xs text-zinc-300 leading-relaxed">
              <strong>Studio Note:</strong> Submitting this booking reserves a workshop intake request. You will receive a unique tracking reference code immediately, and our studio lead will confirm slot availability with you.
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(6)}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-black bg-gradient-to-r from-brand-goldLight via-brand-gold to-brand-goldMuted hover:from-white hover:to-brand-gold shadow-gold hover:shadow-goldGlow transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming Appointment...' : 'Submit Studio Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
