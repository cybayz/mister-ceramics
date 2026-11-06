import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);
    const body = await req.json();
    const {
      title,
      slug,
      categoryId,
      serviceId,
      vehicleType,
      vehicleBrand,
      vehicleModel,
      clientName,
      description,
      beforeImageUrl,
      afterImageUrl,
      isFeatured,
      isPublished,
      images, // array of { imageUrl, caption }
    } = body;

    if (!title || !categoryId || !vehicleBrand || !vehicleModel || !description) {
      return NextResponse.json(
        { error: 'Title, category, vehicle brand, model, and description are required.' },
        { status: 400 }
      );
    }

    const cleanSlug =
      slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const project = await prisma.project.create({
      data: {
        title,
        slug: `${cleanSlug}-${Date.now().toString().slice(-4)}`,
        categoryId,
        serviceId: serviceId || null,
        vehicleType: vehicleType || 'CAR',
        vehicleBrand,
        vehicleModel,
        clientName: clientName || null,
        description,
        beforeImageUrl: beforeImageUrl || null,
        afterImageUrl: afterImageUrl || null,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        completedAt: new Date(),
      },
    });

    if (images && images.length > 0) {
      for (const [idx, img] of images.entries()) {
        await prisma.projectImage.create({
          data: {
            projectId: project.id,
            imageUrl: typeof img === 'string' ? img : img.imageUrl,
            caption: typeof img === 'object' ? img.caption : null,
            sortOrder: idx + 1,
          },
        });
      }
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Project Create Error:', error);
    return NextResponse.json({ error: 'Failed to create gallery project' }, { status: 500 });
  }
}

