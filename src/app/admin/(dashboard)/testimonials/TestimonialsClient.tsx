'use client';

import React, { useState } from 'react';
import { Star, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface TestimonialItem {
  id: string;
  customerName: string;
  vehicleInfo: string;
  serviceName: string;
  rating: number;
  reviewText: string;
  isFeatured: boolean;
  isPublished: boolean;
}

interface Props {
  initialTestimonials: TestimonialItem[];
}

export default function TestimonialsClient({ initialTestimonials }: Props) {
  const [items, setItems] = useState<TestimonialItem[]>(initialTestimonials);
  const [showAdd, setShowAdd] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [rating, setRating] = useState('5');
  const [reviewText, setReviewText] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          vehicleInfo,
          serviceName,
          rating,
          reviewText,
          isFeatured,
          isPublished: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems([data.testimonial, ...items]);
        setShowAdd(false);
        setCustomerName('');
        setVehicleInfo('');
        setServiceName('');
        setReviewText('');
      }
    } catch (e) {
      alert('Error saving testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter((t) => t.id !== id));
      }
    } catch (e) {
      alert('Error deleting');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Client Reviews & Testimonials</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Display verified reviews from vehicle owners across Kottarakkara and Kollam.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2 shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col justify-between shadow-darkCard"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-brand-gold">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                {t.isFeatured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-300 italic leading-relaxed">&ldquo;{t.reviewText}&rdquo;</p>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-borderSubtle flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{t.customerName}</h4>
                <p className="text-[10px] text-zinc-400">{t.vehicleInfo}</p>
                <p className="text-[10px] text-brand-gold font-medium">{t.serviceName}</p>
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md bg-brand-dark border border-brand-border rounded-2xl p-6 sm:p-8 z-10">
            <h3 className="text-base font-bold text-white mb-4">Add Client Testimonial</h3>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Dr. Anand K."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Vehicle Info *</label>
                <input
                  type="text"
                  required
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                  placeholder="e.g. BMW M3 Competition"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Service Delivered *</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Full Body TPU PPF"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Review Text *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Customer feedback..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-zinc-400">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-gold text-black font-bold uppercase tracking-wider"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
