import React from 'react';
import prisma from '@/lib/prisma';
import NotificationsClient from './NotificationsClient';

export const revalidate = 0;

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const serialized = notifications.map((n) => ({
    id: n.id,
    recipientType: n.recipientType,
    recipientId: n.recipientId,
    channel: n.channel,
    title: n.title,
    body: n.body,
    status: n.status,
    sentAt: n.sentAt ? n.sentAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  }));

  return <NotificationsClient initialNotifications={serialized} />;
}

