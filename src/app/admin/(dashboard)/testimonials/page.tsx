import React from 'react';
import prisma from '@/lib/prisma';
import TestimonialsClient from './TestimonialsClient';

export const revalidate = 0;

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <TestimonialsClient initialTestimonials={testimonials} />;
}
