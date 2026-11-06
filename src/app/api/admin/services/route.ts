import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);
    const body = await req.json();
    const {
      name,
      slug,
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
    } = body;

    if (!name || !slug || !categoryId || !description) {
      return NextResponse.json(
        { error: 'Name, slug, category, and description are required.' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        categoryId,
        vehicleType: vehicleType || 'BOTH',
        headline: headline || null,
        description,
        coverImage: coverImage || null,
        defaultDurationHours: parseFloat(defaultDurationHours) || 4.0,
        startingPrice: startingPrice ? parseFloat(startingPrice) : null,
        warrantyInfo: warrantyInfo || null,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error('Service Create Error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
