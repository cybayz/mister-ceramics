'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Send,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleModel: '',
    serviceInterest: 'Ceramic Coating',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          vehicleModel: '',
          serviceInterest: 'Ceramic Coating',
          message: '',
        });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-dark min-h-screen pt-28 pb-24 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center sm:text-left mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cardElevated border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Chegamanadu, Kottarakkara</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connect With Mister Ceramic
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Have questions about paint protection film, ceramic coatings, or superbike detailing? Speak directly with our studio specialists or request a personalized consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Map Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-2xl bg-brand-card border border-brand-border p-8 space-y-6">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                Studio Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Workshop Location</h3>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      {BUSINESS_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Phone Support</h3>
                    <p className="text-xs text-zinc-300 mt-1">
                      <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="hover:text-brand-gold transition-colors">
                        {BUSINESS_INFO.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Studio Hours</h3>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      {BUSINESS_INFO.hours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Electronic Mail</h3>
                    <p className="text-xs text-zinc-300 mt-1">
                      {BUSINESS_INFO.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp and Map Buttons */}
              <div className="pt-4 border-t border-brand-borderSubtle flex flex-col sm:flex-row gap-3">
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-zinc-300 bg-brand-cardElevated border border-brand-border hover:bg-zinc-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-brand-gold" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Map Frame */}
            <div className="h-[280px] rounded-2xl overflow-hidden border border-brand-border shadow-xl relative">
              <iframe
                title="Mister Ceramic Studio Chegamanadu Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.229068065406!2d76.77259!3d9.00632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0675fb65d87319%3A0x41a9e67271dc0506!2smister%20ceramic!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter invert-[90%] hue-rotate-180 contrast-125"
              />
            </div>
          </div>

          {/* Contact Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-brand-card border border-brand-border p-8 sm:p-10 shadow-darkCard">
              <h2 className="text-xl font-bold text-white mb-2">Send Studio Message</h2>
              <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
                Fill in your details below and our service advisors will contact you shortly with accurate recommendations.
              </p>

              {status === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>
                    Thank you! Your enquiry has been received. Our studio team will get back to you shortly.
                  </span>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>An error occurred while submitting your inquiry. Please contact us directly via phone or WhatsApp.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Nair"
                      className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Vehicle Brand & Model *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      placeholder="e.g. BMW 3 Series or Ducati Panigale"
                      className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                    Primary Service of Interest
                  </label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold transition-colors"
                  >
                    <option value="Paint Protection Film (PPF)">Paint Protection Film (PPF)</option>
                    <option value="Borophene Coating">Borophene 10H Nanotech Coating</option>
                    <option value="Ceramic Coating">Ceramic Quartz 9H Coating</option>
                    <option value="Graphene Coating">Graphene Coating</option>
                    <option value="Sunfilm Installation">High Heat Rejection Sunfilm</option>
                    <option value="Paint Correction & Polishing">Paint Correction & Polishing</option>
                    <option value="Deep Interior Detailing">Deep Interior Detailing</option>
                    <option value="Car Painting & Restoration">Car Painting & Respray</option>
                    <option value="Bike Detailing & Ceramic">Superbike Detailing & Ceramic</option>
                    <option value="Other Consultation">Other Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                    Message or Specific Concerns
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the current condition of your vehicle, swirl marks, scratches, or expected timing..."
                    className="w-full px-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-black bg-gradient-to-r from-brand-goldLight via-brand-gold to-brand-goldMuted hover:from-white hover:to-brand-gold transition-all duration-300 shadow-gold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Enquiry...' : 'Submit Studio Enquiry'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

