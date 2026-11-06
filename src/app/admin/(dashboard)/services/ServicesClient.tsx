'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Upload,
  X,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface AdminServiceItem {
  id: string;
  slug: string;
  name: string;
  vehicleType: string;
  categoryId: string;
  headline: string | null;
  description: string;
  coverImage: string | null;
  defaultDurationHours: number;
  startingPrice: number | null;
  warrantyInfo: string | null;
  isFeatured: boolean;
  isActive: boolean;
  category: {
    id: string;
    name: string;
  };
  packages: {
    id: string;
    name: string;
    price: number | null;
    durationHours: number | null;
    isPopular: boolean;
  }[];
}

interface Props {
  initialServices: AdminServiceItem[];
  categories: { id: string; name: string }[];
}

export default function ServicesClient({ initialServices, categories }: Props) {
  const [services, setServices] = useState<AdminServiceItem[]>(initialServices);
  const [editingService, setEditingService] = useState<AdminServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [vehicleType, setVehicleType] = useState('BOTH');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [defaultDurationHours, setDefaultDurationHours] = useState('4.0');
  const [startingPrice, setStartingPrice] = useState('');
  const [warrantyInfo, setWarrantyInfo] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingService(null);
    setName('');
    setSlug('');
    setCategoryId(categories[0]?.id || '');
    setVehicleType('BOTH');
    setHeadline('');
    setDescription('');
    setCoverImage('');
    setDefaultDurationHours('4.0');
    setStartingPrice('');
    setWarrantyInfo('');
    setIsFeatured(false);
    setIsActive(true);
  };

  const openEditModal = (service: AdminServiceItem) => {
    setEditingService(service);
    setIsCreating(false);
    setName(service.name);
    setSlug(service.slug);
    setCategoryId(service.categoryId);
    setVehicleType(service.vehicleType);
    setHeadline(service.headline || '');
    setDescription(service.description);
    setCoverImage(service.coverImage || '');
    setDefaultDurationHours(String(service.defaultDurationHours));
    setStartingPrice(service.startingPrice ? String(service.startingPrice) : '');
    setWarrantyInfo(service.warrantyInfo || '');
    setIsFeatured(service.isFeatured);
    setIsActive(service.isActive);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingImage(true);

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
        setCoverImage(data.url);
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        categoryId,
        vehicleType,
        headline,
        description,
        coverImage,
        defaultDurationHours,
        startingPrice,
        warrantyInfo,
        isFeatured,
        isActive,
      };

      if (isCreating) {
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          const selectedCat = categories.find((c) => c.id === categoryId);
          setServices((prev) => [
            {
              ...data.service,
              category: { id: categoryId, name: selectedCat?.name || '' },
              packages: [],
            },
            ...prev,
          ]);
          setIsCreating(false);
        } else {
          alert(data.error || 'Failed to create service');
        }
      } else if (editingService) {
        const res = await fetch(`/api/admin/services/${editingService.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          const selectedCat = categories.find((c) => c.id === categoryId);
          setServices((prev) =>
            prev.map((s) =>
              s.id === editingService.id
                ? {
                    ...s,
                    ...data.service,
                    category: { id: categoryId, name: selectedCat?.name || s.category.name },
                  }
                : s
            )
          );
          setEditingService(null);
        } else {
          alert(data.error || 'Failed to update service');
        }
      }
    } catch (err) {
      alert('Server error saving service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate or delete this service?')) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert('Failed to delete service');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Services Catalogue Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure detailing treatments, prices, durations, descriptions, and verified warranties.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2 shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/40 p-6 flex flex-col justify-between shadow-darkCard transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-cardElevated border border-brand-border text-brand-gold">
                  {service.category.name}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    service.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{service.name}</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {service.headline || service.description}
              </p>

              <div className="mt-4 pt-3 border-t border-brand-borderSubtle flex items-center justify-between text-xs text-zinc-400">
                <span>Duration: ~{service.defaultDurationHours} hrs</span>
                <span className="font-semibold text-zinc-200">
                  {service.startingPrice ? formatCurrency(service.startingPrice) : 'On Consultation'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-brand-borderSubtle flex items-center justify-between gap-2">
              <button
                onClick={() => openEditModal(service)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-cardElevated border border-brand-border hover:border-brand-gold text-zinc-200 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-brand-gold" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                title="Delete or Deactivate"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingService) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsCreating(false);
              setEditingService(null);
            }}
          />

          <div className="relative w-full max-w-2xl max-h-[92vh] bg-brand-dark border border-brand-border rounded-2xl shadow-2xl overflow-y-auto z-10 flex flex-col">
            <div className="sticky top-0 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border p-6 flex items-center justify-between z-20">
              <h3 className="text-base font-bold text-white">
                {isCreating ? 'Create New Service' : `Edit: ${editingService?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingService(null);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Borophene Coating"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. borophene-coating"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Vehicle Classification</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  >
                    <option value="BOTH">Both (Car & Bike)</option>
                    <option value="CAR">Car Only</option>
                    <option value="BIKE">Bike Only</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Headline / Subtitle</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Atomically engineered 2D lattice for extreme thermal defense"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={defaultDurationHours}
                    onChange={(e) => setDefaultDurationHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    placeholder="e.g. 24000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Warranty Information</label>
                  <input
                    type="text"
                    value={warrantyInfo}
                    onChange={(e) => setWarrantyInfo(e.target.value)}
                    placeholder="e.g. 3 to 5 Year Studio Warranty with scheduled checks"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Cover Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImage}
                      onChange={handleImageUpload}
                      id="service-cover-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="service-cover-upload"
                      className="px-4 py-2 rounded-lg bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border font-semibold text-zinc-300 cursor-pointer flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="Or enter URL directly"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded bg-brand-cardElevated border-brand-border text-brand-gold"
                    />
                    <span>Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded bg-brand-cardElevated border-brand-border text-brand-gold"
                    />
                    <span>Active in Catalogue</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-borderSubtle flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

