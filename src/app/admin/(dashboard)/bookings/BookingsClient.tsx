'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Car,
  Phone,
  User,
  Shield,
  Upload,
  Plus,
  X,
  MessageCircle,
  Eye,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { SERVICE_STATUSES, STATUS_COLORS, ServiceStatus } from '@/lib/constants';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

export interface AdminBookingItem {
  id: string;
  reference: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  totalEstimatedPrice: number | null;
  estimatedDeliveryDate: string | null;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
  };
  vehicle: {
    id: string;
    type: string;
    brand: string;
    model: string;
    registrationNumber: string | null;
    color: string | null;
  };
  service: {
    id: string;
    name: string;
  };
  package: {
    id: string;
    name: string;
  } | null;
  statusHistory: {
    id: string;
    status: string;
    note: string | null;
    createdAt: string;
    user: {
      name: string;
    } | null;
  }[];
  progressUpdates: {
    id: string;
    stage: string;
    title: string;
    description: string;
    photosJson: string | null;
    isVisibleToCustomer: boolean;
    createdAt: string;
  }[];
}

interface Props {
  initialBookings: AdminBookingItem[];
  servicesList: { id: string; name: string }[];
}

export default function BookingsClient({ initialBookings, servicesList }: Props) {
  const [bookings, setBookings] = useState<AdminBookingItem[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  // Selected Booking Modal
  const [activeBooking, setActiveBooking] = useState<AdminBookingItem | null>(null);

  // Status Update state
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('');

  // Progress Update state
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [progStage, setProgStage] = useState('Initial Inspection');
  const [progTitle, setProgTitle] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [progVisible, setProgVisible] = useState(true);
  const [progPhotos, setProgPhotos] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const searchTarget = `${b.reference} ${b.customer.name} ${b.customer.phone} ${b.vehicle.brand} ${b.vehicle.model} ${b.vehicle.registrationNumber || ''}`.toLowerCase();
    const matchesSearch = searchQuery === '' || searchTarget.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || b.service.id === serviceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  const openManageModal = (booking: AdminBookingItem) => {
    setActiveBooking(booking);
    setNewStatus(booking.status);
    setStatusNote('');
    setEstimatedDelivery(booking.estimatedDeliveryDate || '');
    setInternalNotes(booking.adminNotes || '');
    setRescheduleDate(booking.preferredDate);
    setRescheduleTime(booking.preferredTime);
    setShowProgressForm(false);
    setActionMessage(null);
  };

  const handleUpdateBooking = async () => {
    if (!activeBooking) return;
    setIsSaving(true);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/bookings/${activeBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote || undefined,
          estimatedDeliveryDate: estimatedDelivery || null,
          adminNotes: internalNotes,
          preferredDate: rescheduleDate,
          preferredTime: rescheduleTime,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage('Booking updated successfully!');
        // Update local state
        setBookings((prev) =>
          prev.map((item) =>
            item.id === activeBooking.id
              ? {
                  ...item,
                  status: newStatus,
                  estimatedDeliveryDate: estimatedDelivery || null,
                  adminNotes: internalNotes,
                  preferredDate: rescheduleDate,
                  preferredTime: rescheduleTime,
                }
              : item
          )
        );
      } else {
        setActionMessage(data.error || 'Failed to update booking.');
      }
    } catch (e) {
      setActionMessage('Failed to connect to server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/bookings/${activeBooking.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: progStage,
          title: progTitle,
          description: progDesc,
          photos: progPhotos,
          isVisibleToCustomer: progVisible,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Append to local active booking progress updates
        const updatedBooking = {
          ...activeBooking,
          progressUpdates: [...activeBooking.progressUpdates, data.progressUpdate],
        };
        setActiveBooking(updatedBooking);
        setBookings((prev) =>
          prev.map((b) => (b.id === activeBooking.id ? updatedBooking : b))
        );
        setShowProgressForm(false);
        setProgTitle('');
        setProgDesc('');
        setProgPhotos([]);
        setActionMessage('Progress update recorded successfully.');
      }
    } catch (err) {
      alert('Error recording progress update.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingPhoto(true);

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
        setProgPhotos((prev) => [...prev, data.url]);
      } else {
        alert('Photo upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Booking & Intake Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review appointments, manage bay intake, update vehicle statuses, and log workshop updates.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference, customer name, phone, or vehicle model..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
          >
            <option value="ALL">All Statuses</option>
            {SERVICE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Service Filter */}
        <div className="w-full md:w-auto">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
          >
            <option value="ALL">All Services</option>
            {servicesList.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {srv.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-darkCard">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-cardElevated text-[10px] uppercase tracking-wider text-zinc-500 border-b border-brand-border">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Service & Package</th>
                <th className="p-4">Appointment Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderSubtle">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-brand-cardElevated/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-gold">{b.reference}</td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{b.customer.name}</div>
                    <div className="text-[11px] text-zinc-400">{b.customer.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-zinc-200 font-medium">
                      {b.vehicle.brand} {b.vehicle.model}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {b.vehicle.registrationNumber || 'No plate'} • {b.vehicle.type}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-zinc-300 font-medium">{b.service.name}</div>
                    {b.package && (
                      <div className="text-[10px] text-brand-goldLight">{b.package.name}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-zinc-200">{formatDate(b.preferredDate)}</div>
                    <div className="text-[10px] text-zinc-500">{b.preferredTime}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        STATUS_COLORS[b.status as ServiceStatus]?.bg || 'bg-brand-cardElevated'
                      } ${STATUS_COLORS[b.status as ServiceStatus]?.text || 'text-white'} ${
                        STATUS_COLORS[b.status as ServiceStatus]?.border || 'border-brand-border'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openManageModal(b)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-gold text-black hover:bg-brand-goldLight transition-colors"
                    >
                      Inspect / Edit
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No bookings found matching current query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL / EDIT MODAL */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveBooking(null)}
          />

          <div className="relative w-full max-w-4xl max-h-[92vh] bg-brand-dark border border-brand-border rounded-2xl shadow-2xl overflow-y-auto z-10 flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border p-6 flex items-center justify-between z-20">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                  Booking Console
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeBooking.reference} – {activeBooking.vehicle.brand} {activeBooking.vehicle.model}
                </h3>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {actionMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  {actionMessage}
                </div>
              )}

              {/* Customer & Vehicle Info Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-brand-cardElevated border border-brand-border text-xs">
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Customer</span>
                  <div className="font-bold text-white mt-0.5">{activeBooking.customer.name}</div>
                  <div className="text-zinc-400">{activeBooking.customer.phone}</div>
                  {activeBooking.customer.email && (
                    <div className="text-zinc-500">{activeBooking.customer.email}</div>
                  )}
                </div>

                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Vehicle</span>
                  <div className="font-bold text-white mt-0.5">
                    {activeBooking.vehicle.brand} {activeBooking.vehicle.model}
                  </div>
                  <div className="text-zinc-400">
                    Reg: {activeBooking.vehicle.registrationNumber || 'N/A'} • Colour: {activeBooking.vehicle.color || 'N/A'}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Service Request</span>
                  <div className="font-bold text-brand-gold mt-0.5">{activeBooking.service.name}</div>
                  {activeBooking.package && (
                    <div className="text-zinc-300 font-medium">{activeBooking.package.name}</div>
                  )}
                  <div className="text-zinc-400 mt-1">
                    Est. {formatCurrency(activeBooking.totalEstimatedPrice)}
                  </div>
                </div>
              </div>

              {activeBooking.customerNotes && (
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-brand-border text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">
                    Customer Special Notes:
                  </span>
                  <p className="text-zinc-300 mt-1 italic">&ldquo;{activeBooking.customerNotes}&rdquo;</p>
                </div>
              )}

              {/* ACTION SECTION 1: Status Change & Reschedule */}
              <div className="p-6 rounded-xl bg-brand-card border border-brand-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Update Service Status & Bay Schedule
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Current Vehicle Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    >
                      {SERVICE_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Status Change Reason / Log Note (Recorded in History)
                    </label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Paint inspection completed, clear coat thickness 135 microns"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Expected Studio Delivery Date
                    </label>
                    <input
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Appointment Date
                      </label>
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Drop-Off Time
                      </label>
                      <input
                        type="text"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Internal Workshop Notes (Private: Strictly Hidden from Customer)
                    </label>
                    <textarea
                      rows={2}
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="e.g. Assigned to Lead Detailer Sunil. Customer has high expectations on door edges."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdateBooking}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors"
                  >
                    {isSaving ? 'Updating...' : 'Save Changes & Record History'}
                  </button>
                </div>
              </div>

              {/* ACTION SECTION 2: Add Progress Update & Photos */}
              <div className="p-6 rounded-xl bg-brand-card border border-brand-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-brand-gold" />
                    <span>Workshop Progress Updates & Floor Photos</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowProgressForm(!showProgressForm)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border text-zinc-200 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{showProgressForm ? 'Cancel' : 'Post New Update'}</span>
                  </button>
                </div>

                {showProgressForm && (
                  <form onSubmit={handleAddProgress} className="space-y-4 pt-3 border-t border-brand-borderSubtle">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Progress Stage *
                        </label>
                        <select
                          value={progStage}
                          onChange={(e) => setProgStage(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                        >
                          <option value="Initial Inspection">Initial Inspection</option>
                          <option value="Decontamination & Foam Wash">Decontamination & Foam Wash</option>
                          <option value="Multi-Stage Paint Correction">Multi-Stage Paint Correction</option>
                          <option value="Coating / Film Application">Coating / Film Application</option>
                          <option value="Infrared Heat Curing">Infrared Heat Curing</option>
                          <option value="Final Quality Inspection">Final Quality Inspection</option>
                          <option value="Ready for Handover">Ready for Handover</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Update Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={progTitle}
                          onChange={(e) => setProgTitle(e.target.value)}
                          placeholder="e.g. Stage 2 Jeweler Polishing Underway"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Description for Customer
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={progDesc}
                          onChange={(e) => setProgDesc(e.target.value)}
                          placeholder="Explain the work completed so customer sees exact progress..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold resize-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Upload Workshop Progress Photo
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingPhoto}
                            onChange={handlePhotoUpload}
                            id="admin-prog-upload"
                            className="hidden"
                          />
                          <label
                            htmlFor="admin-prog-upload"
                            className="px-4 py-2 rounded-lg bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border text-xs font-semibold text-zinc-300 cursor-pointer flex items-center gap-2"
                          >
                            <Upload className="w-3.5 h-3.5 text-brand-gold" />
                            <span>{isUploadingPhoto ? 'Uploading...' : 'Choose Photo'}</span>
                          </label>
                          {progPhotos.length > 0 && (
                            <span className="text-xs text-brand-gold">{progPhotos.length} photo(s) attached</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={progVisible}
                          onChange={(e) => setProgVisible(e.target.checked)}
                          className="rounded bg-brand-cardElevated border-brand-border text-brand-gold focus:ring-0"
                        />
                        <span>Visible to customer in live tracking portal</span>
                      </label>
                      <button
                        type="submit"
                        disabled={isSaving || !progTitle || !progDesc}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors disabled:opacity-50"
                      >
                        Publish Update
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Existing Updates */}
                {activeBooking.progressUpdates.length > 0 && (
                  <div className="space-y-3 pt-3">
                    {activeBooking.progressUpdates.map((upd) => (
                      <div key={upd.id} className="p-3.5 rounded-lg bg-brand-cardElevated border border-brand-borderSubtle text-xs space-y-1">
                        <div className="flex justify-between font-semibold text-white">
                          <span>{upd.title} ({upd.stage})</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{formatDateTime(upd.createdAt)}</span>
                        </div>
                        <p className="text-zinc-300">{upd.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Audit Trail */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Historical Status Audit Trail
                </h4>
                <div className="space-y-2">
                  {activeBooking.statusHistory.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-lg bg-brand-cardElevated border border-brand-borderSubtle text-xs flex items-start justify-between gap-4"
                    >
                      <div>
                        <span className="font-semibold text-brand-gold">{h.status}</span>
                        {h.note && <p className="text-zinc-300 mt-0.5">{h.note}</p>}
                        {h.user && (
                          <span className="text-[10px] text-zinc-500 block mt-1">Logged by: {h.user.name}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                        {formatDateTime(h.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

