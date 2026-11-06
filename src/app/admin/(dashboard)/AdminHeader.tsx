'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { SessionPayload } from '@/lib/auth';

interface AdminHeaderProps {
  user: SessionPayload;
  isSidebarBottom?: boolean;
}

export default function AdminHeader({ user, isSidebarBottom = false }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  if (isSidebarBottom) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
      >
        <span>End Studio Session</span>
        <LogOut className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-brand-cardElevated transition-colors text-xs flex items-center gap-1.5"
      title="Log out"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Sign Out</span>
    </button>
  );
}
