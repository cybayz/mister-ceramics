'use client';

import React, { useState } from 'react';
import { MessageCircle, Bell, Clock, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { getWhatsAppDirectUrl } from '@/lib/notifications';

interface NotificationItem {
  id: string;
  recipientType: string;
  recipientId: string | null;
  channel: string;
  title: string;
  body: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
}

interface Props {
  initialNotifications: NotificationItem[];
}

export default function NotificationsClient({ initialNotifications }: Props) {
  const [notifications] = useState<NotificationItem[]>(initialNotifications);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Customer Notifications & WhatsApp Dispatch</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Automated event triggers for bookings, confirmations, bay intake, floor progress, and vehicle delivery.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-brand-card border border-brand-border p-6 shadow-darkCard">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-xs text-zinc-300 mb-6">
          <Bell className="w-4 h-4 text-brand-gold shrink-0" />
          <span>
            <strong>Multi-Channel Architecture:</strong> Notifications are logged with generated WhatsApp templates. Staff can click &ldquo;Dispatch WhatsApp&rdquo; to send instantly from studio devices, or connect WhatsApp Cloud API credentials via environment variables for automated transmission.
          </span>
        </div>

        <div className="space-y-4">
          {notifications.map((n) => {
            const phone = n.recipientId || '';
            const whatsappUrl = phone ? getWhatsAppDirectUrl(phone, n.body) : null;

            return (
              <div
                key={n.id}
                className="p-5 rounded-xl bg-brand-cardElevated border border-brand-borderSubtle flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-brand-gold border border-brand-gold/30">
                      {n.channel}
                    </span>
                    <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  </div>

                  <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed font-sans bg-black/40 p-3 rounded-lg border border-brand-borderSubtle">
                    {n.body}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-zinc-500 pt-1">
                    <span>Recipient: <strong className="text-zinc-300">{n.recipientId || 'Internal Desk'}</strong></span>
                    <span>Triggered: {formatDateTime(n.createdAt)}</span>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center gap-2">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Dispatch WhatsApp</span>
                    </a>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                    {n.status}
                  </span>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No customer notifications currently recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
