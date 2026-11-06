import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);
    const { id } = params;
    const body = await req.json();

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        categoryId: body.categoryId,
        serviceId: body.serviceId || null,
        vehicleType: body.vehicleType,
        vehicleBrand: body.vehicleBrand,
        vehicleModel: body.vehicleModel,
        clientName: body.clientName,
        description: body.description,
        beforeImageUrl: body.beforeImageUrl,
        afterImageUrl: body.afterImageUrl,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Project Update Error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);
    const { id } = params;

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Project Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

