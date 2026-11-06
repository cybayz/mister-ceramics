import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, vehicleModel, serviceInterest, message } = body;

    if (!name || !phone || !vehicleModel) {
      return NextResponse.json(
        { error: 'Name, phone, and vehicle model are required.' },
        { status: 400 }
      );
    }

    // Save as internal notification for administrator review
    await prisma.notification.create({
      data: {
        recipientType: 'ADMIN',
        recipientId: 'ADMIN_DESK',
        channel: 'INTERNAL',
        title: `New Studio Inquiry from ${name}`,
        body: `Vehicle: ${vehicleModel} | Phone: ${phone} | Email: ${email || 'N/A'} | Service: ${serviceInterest} | Message: ${message || 'No additional note'}`,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, message: 'Inquiry registered successfully.' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry.' }, { status: 500 });
  }
}

