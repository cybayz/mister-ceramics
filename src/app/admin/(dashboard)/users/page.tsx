import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import UsersClient from './UsersClient';

export const revalidate = 0;

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'ADMIN') {
    redirect('/admin');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return <UsersClient initialUsers={serialized} />;
}

