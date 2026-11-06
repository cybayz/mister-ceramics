import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Image as ImageIcon,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  Shield,
  Eye,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import Logo from '@/components/ui/Logo';
import AdminHeader from './AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If not authenticated and not on login page, redirect to login
  // Note: /admin/login handles itself without this layout if we check path, but in layout we check user
  if (!user) {
    // If user is accessing /admin/login, layout shouldn't block
    // Next.js nested routes inherit layout. If user is null, we redirect to /admin/login
    // We check via middleware or redirect here
    redirect('/admin/login');
  }

  const isAdmin = user.role === 'ADMIN';

  const NAV_ITEMS = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Bookings & Intake', href: '/admin/bookings', icon: Calendar },
    { label: 'Services Catalogue', href: '/admin/services', icon: Layers },
    { label: 'Project Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Eye },
    { label: 'Website Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
    { label: 'Staff & Roles', href: '/admin/users', icon: Users, adminOnly: true },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-brand-darker flex text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark border-r border-brand-border flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Brand Logo header */}
          <div className="p-6 border-b border-brand-border flex items-center justify-between">
            <Logo variant="compact" isLink={false} />
          </div>

          {/* User Profile Pill */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-brand-cardElevated border border-brand-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold font-bold text-xs shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold">
                {user.role} ACCESS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-brand-cardElevated transition-colors"
                >
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-brand-border space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-brand-cardElevated transition-colors"
          >
            <span>Live Public Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <AdminHeader user={user} isSidebarBottom={true} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-brand-dark/95 border-b border-brand-border px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Studio Management Platform
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <div className="h-4 w-[1px] bg-brand-border" />
            <AdminHeader user={user} isSidebarBottom={false} />
          </div>
        </header>

        {/* Inner Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-brand-darker">
          {children}
        </main>
      </div>
    </div>
  );
}
