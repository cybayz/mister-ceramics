import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { stage, title, description, photos, isVisibleToCustomer } = await req.json();

    if (!stage || !title || !description) {
      return NextResponse.json(
        { error: 'Stage, title, and description are required for progress updates.' },
        { status: 400 }
      );
    }

    const progressUpdate = await prisma.serviceProgressUpdate.create({
      data: {
        bookingId: id,
        stage,
        title,
        description,
        photosJson: photos && photos.length > 0 ? JSON.stringify(photos) : null,
        isVisibleToCustomer: isVisibleToCustomer !== undefined ? isVisibleToCustomer : true,
      },
    });

    return NextResponse.json({ success: true, progressUpdate });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Failed to record progress update' }, { status: 500 });
  }
}

