import React from 'react';
import prisma from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await prisma.businessSetting.findMany({
    orderBy: { key: 'asc' },
  });

  return <SettingsClient initialSettings={settings} />;
}

