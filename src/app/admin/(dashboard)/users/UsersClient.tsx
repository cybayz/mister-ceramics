'use client';

import React, { useState } from 'react';
import { Users, Plus, Shield, Check, X, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface UserItem {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Props {
  initialUsers: UserItem[];
}

export default function UsersClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('STAFF');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone, role }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUsers([data.user, ...users]);
        setShowAddModal(false);
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setRole('STAFF');
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Staff & Access Permissions</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage authorized studio directors (ADMIN) and detail technicians (STAFF).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-goldLight transition-colors flex items-center gap-2 shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-darkCard">
        <table className="w-full text-left text-xs">
          <thead className="bg-brand-cardElevated text-[10px] uppercase tracking-wider text-zinc-500 border-b border-brand-border">
            <tr>
              <th className="p-4">Staff Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-borderSubtle">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-brand-cardElevated/40 transition-colors">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-cardElevated border border-brand-border flex items-center justify-center text-brand-gold font-bold text-xs">
                    {u.name.charAt(0)}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="p-4 text-zinc-300 font-mono text-[11px]">{u.email}</td>
                <td className="p-4 text-zinc-400">{u.phone || 'N/A'}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'ADMIN'
                        ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </td>
                <td className="p-4 text-zinc-500">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-brand-dark border border-brand-border rounded-2xl p-6 sm:p-8 z-10">
            <h3 className="text-base font-bold text-white mb-4">Add Staff Member</h3>
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunil Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Staff Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sunil@misterceramic.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'ADMIN' | 'STAFF')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-cardElevated border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                >
                  <option value="STAFF">STAFF (Booking, Intake & Updates only)</option>
                  <option value="ADMIN">ADMIN (Full studio & content permissions)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-brand-gold text-black font-bold uppercase tracking-wider"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
