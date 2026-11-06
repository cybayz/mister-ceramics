import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);
    const body = await req.json();
    const { customerName, vehicleInfo, serviceName, rating, reviewText, isFeatured, isPublished } = body;

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName,
        vehicleInfo,
        serviceName,
        rating: parseInt(rating, 10) || 5,
        reviewText,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
