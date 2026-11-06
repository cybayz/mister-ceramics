import React from 'react';
import prisma from '@/lib/prisma';
import ServicesClient, { AdminServiceItem } from './ServicesClient';

export const revalidate = 0;

export default async function AdminServicesPage() {
  const [services, categories] = await Promise.all([
    prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
        packages: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            price: true,
            durationHours: true,
            isPopular: true,
          },
        },
      },
    }),
    prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  const serialized: AdminServiceItem[] = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    vehicleType: s.vehicleType,
    categoryId: s.categoryId,
    headline: s.headline,
    description: s.description,
    coverImage: s.coverImage,
    defaultDurationHours: s.defaultDurationHours,
    startingPrice: s.startingPrice,
    warrantyInfo: s.warrantyInfo,
    isFeatured: s.isFeatured,
    isActive: s.isActive,
    category: s.category,
    packages: s.packages,
  }));

  return <ServicesClient initialServices={serialized} categories={categories} />;
}

