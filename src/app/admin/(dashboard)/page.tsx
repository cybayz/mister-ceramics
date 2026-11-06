import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  AlertCircle,
  Eye,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';
import { STATUS_COLORS, ServiceStatus } from '@/lib/constants';

export const revalidate = 0; // Dynamic data

export default async function AdminDashboardPage() {
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    vehiclesInWorkshop,
    readyForDelivery,
    recentBookings,
    recentProjects,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'Booking Received' } }),
    prisma.booking.count({ where: { status: 'Booking Confirmed' } }),
    prisma.booking.count({
      where: {
        status: {
          in: [
            'Vehicle Received',
            'Initial Inspection',
            'Preparation and Cleaning',
            'Service in Progress',
            'Quality Inspection',
          ],
        },
      },
    }),
    prisma.booking.count({ where: { status: 'Ready for Delivery' } }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        vehicle: true,
        service: true,
      },
    }),
    prisma.project.findMany({
      take: 4,
      orderBy: { completedAt: 'desc' },
      include: {
        category: true,
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
            Chegamanadu Studio Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Studio Workshop Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors"
          >
            Manage All Bookings
          </Link>
        </div>
      </div>

      {/* METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Total Bookings
          </span>
          <div className="text-2xl font-extrabold text-white mt-2">{totalBookings}</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Studio registry</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-amber-500/30 bg-amber-500/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Pending Requests
          </span>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">{pendingBookings}</div>
          <span className="text-[11px] text-amber-300/70 mt-1 block">Needs confirmation</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-blue-500/30 bg-blue-500/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Confirmed Slots
          </span>
          <div className="text-2xl font-extrabold text-blue-400 mt-2">{confirmedBookings}</div>
          <span className="text-[11px] text-blue-300/70 mt-1 block">Awaiting drop-off</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-yellow-500/40 bg-yellow-500/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
            In Workshop Bays
          </span>
          <div className="text-2xl font-extrabold text-yellow-400 mt-2">{vehiclesInWorkshop}</div>
          <span className="text-[11px] text-yellow-300/70 mt-1 block">Under active service</span>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-emerald-500/30 bg-emerald-500/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Ready for Delivery
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">{readyForDelivery}</div>
          <span className="text-[11px] text-emerald-300/70 mt-1 block">Inspection passed</span>
        </div>
      </div>

      {/* RECENT BOOKINGS & WORKSHOP QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-8 rounded-2xl bg-brand-card border border-brand-border p-6 shadow-darkCard">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Recent Studio Appointments
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs text-brand-gold hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-zinc-500 border-b border-brand-borderSubtle">
                <tr>
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-borderSubtle">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-brand-cardElevated/50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-white">{b.reference}</td>
                    <td className="py-3.5">
                      <div className="font-semibold text-zinc-200">{b.customer.name}</div>
                      <div className="text-[10px] text-zinc-500">{b.customer.phone}</div>
                    </td>
                    <td className="py-3.5 text-zinc-300">
                      {b.vehicle.brand} {b.vehicle.model}
                    </td>
                    <td className="py-3.5 text-zinc-400">{b.service.name}</td>
                    <td className="py-3.5">
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
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/bookings?focus=${b.id}`}
                        className="px-2.5 py-1 rounded bg-brand-cardElevated border border-brand-border hover:border-brand-gold text-[11px] font-semibold text-brand-gold transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Completed Projects */}
        <div className="lg:col-span-4 rounded-2xl bg-brand-card border border-brand-border p-6 shadow-darkCard space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Recent Studio Deliveries
            </h2>
            <Link
              href="/admin/gallery"
              className="text-xs text-brand-gold hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-xl bg-brand-cardElevated border border-brand-borderSubtle flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {proj.vehicleBrand} {proj.vehicleModel} ({proj.vehicleType})
                  </p>
                  <span className="text-[10px] text-brand-gold/80 block mt-1 font-medium">
                    {proj.category.name}
                  </span>
                </div>
                {proj.completedAt && (
                  <span className="text-[10px] text-zinc-500 shrink-0">
                    {formatDate(proj.completedAt)}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/admin/gallery"
              className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-zinc-200 bg-brand-cardElevated hover:bg-zinc-800 border border-brand-border transition-colors block"
            >
              Upload New Project Photos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

