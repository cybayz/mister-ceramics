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

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...body,
        defaultDurationHours: body.defaultDurationHours ? parseFloat(body.defaultDurationHours) : undefined,
        startingPrice: body.startingPrice !== undefined ? (body.startingPrice ? parseFloat(body.startingPrice) : null) : undefined,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error('Service Update Error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(['ADMIN']);
    const { id } = params;

    // Check if bookings exist
    const bookingCount = await prisma.booking.count({ where: { serviceId: id } });
    if (bookingCount > 0) {
      // Soft-delete / deactivate instead to preserve booking history integrity
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, message: 'Service deactivated (bookings exist)' });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Service deleted permanently' });
  } catch (error) {
    console.error('Service Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
