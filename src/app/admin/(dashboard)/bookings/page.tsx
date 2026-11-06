import React from 'react';
import prisma from '@/lib/prisma';
import BookingsClient, { AdminBookingItem } from './BookingsClient';

export const revalidate = 0; // Dynamic live data

export default async function AdminBookingsPage() {
  const [bookings, services] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        vehicle: true,
        service: true,
        package: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        progressUpdates: {
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const serializedBookings: AdminBookingItem[] = bookings.map((b) => ({
    id: b.id,
    reference: b.reference,
    preferredDate: b.preferredDate,
    preferredTime: b.preferredTime,
    status: b.status,
    totalEstimatedPrice: b.totalEstimatedPrice,
    estimatedDeliveryDate: b.estimatedDeliveryDate,
    customerNotes: b.customerNotes,
    adminNotes: b.adminNotes,
    createdAt: b.createdAt.toISOString(),
    customer: {
      id: b.customer.id,
      name: b.customer.name,
      phone: b.customer.phone,
      email: b.customer.email,
    },
    vehicle: {
      id: b.vehicle.id,
      type: b.vehicle.type,
      brand: b.vehicle.brand,
      model: b.vehicle.model,
      registrationNumber: b.vehicle.registrationNumber,
      color: b.vehicle.color,
    },
    service: {
      id: b.service.id,
      name: b.service.name,
    },
    package: b.package
      ? {
          id: b.package.id,
          name: b.package.name,
        }
      : null,
    statusHistory: b.statusHistory.map((sh) => ({
      id: sh.id,
      status: sh.status,
      note: sh.note,
      createdAt: sh.createdAt.toISOString(),
      user: sh.user ? { name: sh.user.name } : null,
    })),
    progressUpdates: b.progressUpdates.map((pu) => ({
      id: pu.id,
      stage: pu.stage,
      title: pu.title,
      description: pu.description,
      photosJson: pu.photosJson,
      isVisibleToCustomer: pu.isVisibleToCustomer,
      createdAt: pu.createdAt.toISOString(),
    })),
  }));

  return <BookingsClient initialBookings={serializedBookings} servicesList={services} />;
}
