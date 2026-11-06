'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Phone, MapPin, Clock, Globe } from 'lucide-react';

interface Props {
  initialSettings: { key: string; value: string; description: string | null }[];
}

export default function SettingsClient({ initialSettings }: Props) {
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialSettings.forEach((s) => {
      map[s.key] = s.value;
    });
    return map;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (key: string, val: string) => {
    setSettingsMap((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = Object.entries(settingsMap).map(([key, value]) => ({
        key,
        value,
      }));

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage('Website settings and business information updated successfully!');
      } else {
        setMessage('Failed to update business settings.');
      }
    } catch (err) {
      setMessage('Error connecting to backend.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Website & Business Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage public business credentials, address, telephone numbers, working hours, and capacity limits.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-8 space-y-6 shadow-darkCard">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-brand-borderSubtle pb-3">
            Core Business Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">Business Name</label>
              <input
                type="text"
                value={settingsMap['BUSINESS_NAME'] || 'Mister Ceramic'}
                onChange={(e) => handleChange('BUSINESS_NAME', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">Primary Phone Number</label>
              <input
                type="text"
                value={settingsMap['PHONE'] || '+91 92072 09105'}
                onChange={(e) => handleChange('PHONE', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">WhatsApp Contact (without +)</label>
              <input
                type="text"
                value={settingsMap['WHATSAPP'] || '+919207209105'}
                onChange={(e) => handleChange('WHATSAPP', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">Support Email</label>
              <input
                type="email"
                value={settingsMap['EMAIL'] || 'care@misterceramic.com'}
                onChange={(e) => handleChange('EMAIL', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1.5">Workshop Physical Address</label>
              <input
                type="text"
                value={settingsMap['ADDRESS'] || 'Chegamanadu, Kottarakkara, Kollam, Kerala, India - 691506'}
                onChange={(e) => handleChange('ADDRESS', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1.5">Official Google Maps Link</label>
              <input
                type="text"
                value={settingsMap['MAPS_URL'] || 'https://www.google.com/maps/place/mister+ceramic/data=!4m2!3m1!1s0x3b0675fb65d87319:0x41a9e67271dc0506'}
                onChange={(e) => handleChange('MAPS_URL', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1.5">Operating Schedule</label>
              <input
                type="text"
                value={settingsMap['WORKING_HOURS'] || 'Monday - Saturday: 9:00 AM - 7:00 PM | Sunday: By Appointment'}
                onChange={(e) => handleChange('WORKING_HOURS', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">
                Max Daily Intake Capacity (Slots for Conflict Prevention)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settingsMap['MAX_DAILY_SLOTS'] || '4'}
                onChange={(e) => handleChange('MAX_DAILY_SLOTS', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Prevents double-booking when workshop intake bays reach capacity.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2 shadow-gold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
