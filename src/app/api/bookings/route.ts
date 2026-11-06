import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      vehicleType, // "CAR" | "BIKE"
      brand,
      model,
      registrationNumber,
      color,
      serviceId,
      packageId,
      preferredDate, // YYYY-MM-DD
      preferredTime,
      customerName,
      customerPhone,
      customerEmail,
      customerNotes,
      photoUrls, // optional array of uploaded photos
    } = body;

    // Validate required fields
    if (!vehicleType || !brand || !model || !serviceId || !preferredDate || !preferredTime || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Please provide all required vehicle, service, appointment, and customer details.' },
        { status: 400 }
      );
    }

    // 1. Conflict Prevention & Capacity Check
    // Get max daily slots setting
    const maxSlotsSetting = await prisma.businessSetting.findUnique({
      where: { key: 'MAX_DAILY_SLOTS' },
    });
    const maxDailySlots = maxSlotsSetting ? parseInt(maxSlotsSetting.value, 10) : 4;

    // Check confirmed or in-progress bookings for that date
    const existingConfirmedCount = await prisma.booking.count({
      where: {
        preferredDate,
        status: {
          in: ['Booking Confirmed', 'Vehicle Received', 'Initial Inspection', 'Service in Progress'],
        },
      },
    });

    if (existingConfirmedCount >= maxDailySlots) {
      return NextResponse.json(
        {
          error: `Intake capacity for ${preferredDate} is fully committed. Please select another convenient date or contact studio reception directly.`,
        },
        { status: 409 }
      );
    }

    // Check selected service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      return NextResponse.json({ error: 'Selected service not found.' }, { status: 404 });
    }

    let packageData = null;
    let estimatedPrice = service.startingPrice;
    if (packageId) {
      packageData = await prisma.servicePackage.findUnique({
        where: { id: packageId },
      });
      if (packageData && packageData.price) {
        estimatedPrice = packageData.price;
      }
    }

    // 2. Customer Record (Upsert by phone)
    const normalizedPhone = customerPhone.trim();
    let customer = await prisma.customer.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName.trim(),
          phone: normalizedPhone,
          email: customerEmail?.trim() || null,
        },
      });
    } else {
      // Update name/email if provided
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customerName.trim(),
          email: customerEmail?.trim() || customer.email,
        },
      });
    }

    // 3. Vehicle Record
    const vehicle = await prisma.vehicle.create({
      data: {
        customerId: customer.id,
        type: vehicleType,
        brand: brand.trim(),
        model: model.trim(),
        registrationNumber: registrationNumber?.trim() || null,
        color: color?.trim() || null,
        photosJson: photoUrls && photoUrls.length > 0 ? JSON.stringify(photoUrls) : null,
      },
    });

    // 4. Generate Unique Booking Reference
    const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `MC-${datePrefix}-${randomSuffix}`;

    // 5. Create Booking
    const booking = await prisma.booking.create({
      data: {
        reference,
        customerId: customer.id,
        vehicleId: vehicle.id,
        serviceId: service.id,
        packageId: packageData ? packageData.id : null,
        preferredDate,
        preferredTime,
        status: 'Booking Received',
        totalEstimatedPrice: estimatedPrice,
        customerNotes: customerNotes?.trim() || null,
      },
    });

    // 6. Record Initial Status History
    await prisma.bookingStatusHistory.create({
      data: {
        bookingId: booking.id,
        status: 'Booking Received',
        note: 'Appointment request received online. Awaiting workshop manager review.',
      },
    });

    // 7. Internal Notification for Admin
    await prisma.notification.create({
      data: {
        recipientType: 'ADMIN',
        recipientId: 'WORKSHOP_LEAD',
        channel: 'INTERNAL',
        title: `New Booking Request: ${reference}`,
        body: `${customerName} booked ${service.name} for ${brand} ${model} on ${preferredDate} at ${preferredTime}.`,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        reference: booking.reference,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        status: booking.status,
        customerName: customer.name,
        customerPhone: customer.phone,
        vehicle: `${vehicle.brand} ${vehicle.model}`,
        serviceName: service.name,
        packageName: packageData?.name || null,
        estimatedPrice,
      },
    });
  } catch (error) {
    console.error('Booking Creation Error:', error);
    return NextResponse.json({ error: 'Failed to process appointment booking.' }, { status: 500 });
  }
}
