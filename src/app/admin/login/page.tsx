'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@misterceramic.com');
  const [password, setPassword] = useState('Admin@MisterCeramic2026');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Authentication rejected.');
      }
    } catch (err) {
      setError('Connection failure. Please check network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-brand-card border border-brand-border p-8 sm:p-10 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo isLink={false} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">
            Studio Management Portal
          </span>
          <h1 className="text-xl font-bold text-white mt-1">Authorized Access Only</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sign in with your studio director or staff credentials.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@misterceramic.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-black bg-gradient-to-r from-brand-goldLight via-brand-gold to-brand-goldMuted hover:from-white hover:to-brand-gold shadow-gold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Verifying Session...' : 'Sign In to Studio Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo credentials hint for testing */}
        <div className="mt-8 pt-6 border-t border-brand-borderSubtle text-[11px] text-zinc-500 space-y-1">
          <div className="font-semibold text-zinc-400">Pre-Configured Accounts:</div>
          <div>Admin: <code className="text-brand-gold">admin@misterceramic.com</code> / <code className="text-zinc-300">Admin@MisterCeramic2026</code></div>
          <div>Staff: <code className="text-zinc-400">staff@misterceramic.com</code> / <code className="text-zinc-300">Staff@MisterCeramic2026</code></div>
        </div>
      </div>
    </div>
  );
}

