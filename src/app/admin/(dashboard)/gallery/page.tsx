import React from 'react';
import prisma from '@/lib/prisma';
import GalleryAdminClient, { AdminProjectItem } from './GalleryAdminClient';

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const [projects, categories, services] = await Promise.all([
    prisma.project.findMany({
      orderBy: { completedAt: 'desc' },
      include: {
        category: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const serialized: AdminProjectItem[] = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    vehicleType: p.vehicleType,
    vehicleBrand: p.vehicleBrand,
    vehicleModel: p.vehicleModel,
    clientName: p.clientName,
    description: p.description,
    beforeImageUrl: p.beforeImageUrl,
    afterImageUrl: p.afterImageUrl,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    completedAt: p.completedAt ? p.completedAt.toISOString() : null,
    category: p.category,
    service: p.service,
    images: p.images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      caption: img.caption,
    })),
  }));

  return (
    <GalleryAdminClient
      initialProjects={serialized}
      categories={categories}
      services={services}
    />
  );
}
