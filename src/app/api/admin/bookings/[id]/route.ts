import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, note, estimatedDeliveryDate, adminNotes, preferredDate, preferredTime } = body;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (estimatedDeliveryDate !== undefined) updateData.estimatedDeliveryDate = estimatedDeliveryDate;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (preferredDate !== undefined) updateData.preferredDate = preferredDate;
    if (preferredTime !== undefined) updateData.preferredTime = preferredTime;

    const statusChanged = status && status !== existingBooking.status;
    if (statusChanged) {
      updateData.status = status;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    // If status changed or status note provided, record in history!
    if (statusChanged || note) {
      await prisma.bookingStatusHistory.create({
        data: {
          bookingId: id,
          status: status || existingBooking.status,
          note: note || `Status updated to ${status} by ${user.name}`,
          changedByUserId: user.userId,
        },
      });
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error('Admin Booking Update Error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

