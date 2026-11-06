import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, phone } = body;

    if (!reference || !phone) {
      return NextResponse.json(
        { error: 'Booking reference and registered phone number are required.' },
        { status: 400 }
      );
    }

    const cleanRef = reference.trim();
    // Normalize phone: extract last 10 digits to be resilient to country code differences
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    const last10Digits = cleanDigits.slice(-10);

    const booking = await prisma.booking.findUnique({
      where: { reference: cleanRef },
      include: {
        customer: true,
        vehicle: true,
        service: true,
        package: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            status: true,
            note: true,
            createdAt: true,
          },
        },
        progressUpdates: {
          where: { isVisibleToCustomer: true },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            stage: true,
            title: true,
            description: true,
            photosJson: true,
            createdAt: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'No booking found matching this reference number.' },
        { status: 404 }
      );
    }

    // Security Verification: Match phone number
    const customerPhoneDigits = booking.customer.phone.replace(/[^0-9]/g, '').slice(-10);
    if (customerPhoneDigits !== last10Digits) {
      return NextResponse.json(
        {
          error:
            'Security verification failed: The registered phone number does not match this booking reference.',
        },
        { status: 403 }
      );
    }

    // Mask phone number for privacy
    const maskedPhone = booking.customer.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');

    // Return sanitized customer tracking details (internal admin notes strictly excluded)
    return NextResponse.json({
      success: true,
      booking: {
        reference: booking.reference,
        customerName: booking.customer.name,
        customerPhone: maskedPhone,
        vehicle: {
          type: booking.vehicle.type,
          brand: booking.vehicle.brand,
          model: booking.vehicle.model,
          registrationNumber: booking.vehicle.registrationNumber,
          color: booking.vehicle.color,
        },
        service: {
          name: booking.service.name,
          category: booking.service.categoryId,
        },
        package: booking.package
          ? {
              name: booking.package.name,
              warrantyMonths: booking.package.warrantyMonths,
            }
          : null,
        status: booking.status,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        estimatedDeliveryDate: booking.estimatedDeliveryDate,
        customerNotes: booking.customerNotes,
        createdAt: booking.createdAt,
        statusHistory: booking.statusHistory,
        progressUpdates: booking.progressUpdates.map((pu) => {
          let photos: string[] = [];
          try {
            if (pu.photosJson) photos = JSON.parse(pu.photosJson);
          } catch (e) {
            photos = [];
          }
          return {
            ...pu,
            photos,
          };
        }),
      },
    });
  } catch (error) {
    console.error('Tracking API Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve vehicle tracking status.' }, { status: 500 });
  }
}

