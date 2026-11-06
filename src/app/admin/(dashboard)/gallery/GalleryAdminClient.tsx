'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Upload,
  X,
  Sparkles,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface AdminProjectItem {
  id: string;
  slug: string;
  title: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  clientName: string | null;
  description: string;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  completedAt: string | null;
  category: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
  } | null;
  images: {
    id: string;
    imageUrl: string;
    caption: string | null;
  }[];
}

interface Props {
  initialProjects: AdminProjectItem[];
  categories: { id: string; name: string }[];
  services: { id: string; name: string }[];
}

export default function GalleryAdminClient({ initialProjects, categories, services }: Props) {
  const [projects, setProjects] = useState<AdminProjectItem[]>(initialProjects);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProjectItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [beforeImageUrl, setBeforeImageUrl] = useState('');
  const [afterImageUrl, setAfterImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [additionalImages, setAdditionalImages] = useState<{ imageUrl: string; caption: string }[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<'before' | 'after' | 'extra' | null>(null);

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingProject(null);
    setTitle('');
    setCategoryId(categories[0]?.id || '');
    setServiceId(services[0]?.id || '');
    setVehicleType('CAR');
    setVehicleBrand('');
    setVehicleModel('');
    setClientName('');
    setDescription('');
    setBeforeImageUrl('');
    setAfterImageUrl('');
    setIsFeatured(false);
    setIsPublished(true);
    setAdditionalImages([]);
  };

  const openEditModal = (proj: AdminProjectItem) => {
    setEditingProject(proj);
    setIsCreating(false);
    setTitle(proj.title);
    setCategoryId(proj.category.id);
    setServiceId(proj.service?.id || '');
    setVehicleType(proj.vehicleType);
    setVehicleBrand(proj.vehicleBrand);
    setVehicleModel(proj.vehicleModel);
    setClientName(proj.clientName || '');
    setDescription(proj.description);
    setBeforeImageUrl(proj.beforeImageUrl || '');
    setAfterImageUrl(proj.afterImageUrl || '');
    setIsFeatured(proj.isFeatured);
    setIsPublished(proj.isPublished);
    setAdditionalImages(proj.images ? proj.images.map(img => ({ imageUrl: img.imageUrl, caption: img.caption || '' })) : []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after' | 'extra') => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(target);

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
        if (target === 'before') setBeforeImageUrl(data.url);
        if (target === 'after') setAfterImageUrl(data.url);
        if (target === 'extra') {
          setAdditionalImages(prev => [...prev, { imageUrl: data.url, caption: '' }]);
        }
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        title,
        categoryId,
        serviceId: serviceId || null,
        vehicleType,
        vehicleBrand,
        vehicleModel,
        clientName,
        description,
        beforeImageUrl,
        afterImageUrl,
        isFeatured,
        isPublished,
        images: additionalImages,
      };

      if (isCreating) {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          const cat = categories.find(c => c.id === categoryId);
          const srv = services.find(s => s.id === serviceId);
          setProjects(prev => [
            {
              ...data.project,
              category: { id: categoryId, name: cat?.name || '' },
              service: srv ? { id: srv.id, name: srv.name } : null,
              images: additionalImages.map((img, i) => ({ id: `img-${i}`, imageUrl: img.imageUrl, caption: img.caption })),
            },
            ...prev,
          ]);
          setIsCreating(false);
        } else {
          alert(data.error || 'Failed to save project');
        }
      } else if (editingProject) {
        const res = await fetch(`/api/admin/projects/${editingProject.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          const cat = categories.find(c => c.id === categoryId);
          const srv = services.find(s => s.id === serviceId);
          setProjects(prev =>
            prev.map(p =>
              p.id === editingProject.id
                ? {
                    ...p,
                    ...data.project,
                    category: { id: categoryId, name: cat?.name || p.category.name },
                    service: srv ? { id: srv.id, name: srv.name } : null,
                  }
                : p
            )
          );
          setEditingProject(null);
        }
      }
    } catch (err) {
      alert('Error saving project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this completed project from the portfolio?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Project Gallery & Transformations</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage authentic customer delivery showcases, before-and-after sliders, and workshop photography.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2 shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/40 overflow-hidden flex flex-col justify-between shadow-darkCard"
          >
            <div>
              {/* Media Preview */}
              <div className="relative h-48 w-full bg-zinc-900">
                {proj.afterImageUrl ? (
                  <Image
                    src={proj.afterImageUrl}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/80 text-brand-gold border border-brand-gold/30">
                    {proj.vehicleBrand} {proj.vehicleModel}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      proj.isPublished ? 'bg-emerald-500/80 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {proj.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-sm font-bold text-white line-clamp-1">{proj.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="mt-4 pt-3 border-t border-brand-borderSubtle flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{proj.category.name}</span>
                  {proj.completedAt && <span>{formatDate(proj.completedAt)}</span>}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-brand-borderSubtle/50">
              <button
                onClick={() => openEditModal(proj)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-cardElevated border border-brand-border hover:border-brand-gold text-zinc-200 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-brand-gold" />
                <span>Edit Case</span>
              </button>
              <button
                onClick={() => handleDelete(proj.id)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsCreating(false);
              setEditingProject(null);
            }}
          />

          <div className="relative w-full max-w-3xl max-h-[92vh] bg-brand-dark border border-brand-border rounded-2xl shadow-2xl overflow-y-auto z-10 flex flex-col">
            <div className="sticky top-0 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border p-6 flex items-center justify-between z-20">
              <h3 className="text-base font-bold text-white">
                {isCreating ? 'Upload Completed Project Case' : `Edit Project: ${editingProject?.title}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingProject(null);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. BMW M3 Competition – Full Body TPU Self-Healing Armor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Vehicle Type *</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  >
                    <option value="CAR">Car</option>
                    <option value="BIKE">Motorcycle / Superbike</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Service Category *</label>
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
                  <label className="block text-zinc-300 font-semibold mb-1">Vehicle Brand *</label>
                  <input
                    type="text"
                    required
                    value={vehicleBrand}
                    onChange={(e) => setVehicleBrand(e.target.value)}
                    placeholder="e.g. Porsche, Ducati, BMW"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Vehicle Model *</label>
                  <input
                    type="text"
                    required
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. 911 Carrera GTS or Panigale V4 S"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Client Name (Optional)</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Rahul M."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Related Service</label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  >
                    <option value="">None / Custom</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Project Scope & Case Notes *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the initial condition, clear coat thickness, defect removal, and final coating applied..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold resize-none"
                  />
                </div>

                {/* Before Image */}
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Before Restoration Image (Optional for Slider)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading === 'before'}
                      onChange={(e) => handleUpload(e, 'before')}
                      id="before-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="before-upload"
                      className="px-3 py-2 rounded-lg bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border font-semibold text-zinc-300 cursor-pointer shrink-0"
                    >
                      {isUploading === 'before' ? 'Uploading...' : 'Choose File'}
                    </label>
                    <input
                      type="text"
                      value={beforeImageUrl}
                      onChange={(e) => setBeforeImageUrl(e.target.value)}
                      placeholder="Or enter URL"
                      className="w-full px-3 py-2 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                {/* After Image */}
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Completed Finish Image (Primary Cover) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading === 'after'}
                      onChange={(e) => handleUpload(e, 'after')}
                      id="after-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="after-upload"
                      className="px-3 py-2 rounded-lg bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border font-semibold text-zinc-300 cursor-pointer shrink-0"
                    >
                      {isUploading === 'after' ? 'Uploading...' : 'Choose File'}
                    </label>
                    <input
                      type="text"
                      required
                      value={afterImageUrl}
                      onChange={(e) => setAfterImageUrl(e.target.value)}
                      placeholder="Or enter URL"
                      className="w-full px-3 py-2 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
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
                    <span>Highlight on Homepage Slider</span>
                  </label>

                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="rounded bg-brand-cardElevated border-brand-border text-brand-gold"
                    />
                    <span>Publish in Public Gallery</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-borderSubtle flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProject(null);
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
                  {isSaving ? 'Saving...' : 'Save Project Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

