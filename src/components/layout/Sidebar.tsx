'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { removeToken } from '@/lib/api';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/expenses', label: 'Expenses', icon: '💸' },
  { href: '/report', label: "Edda's Report", icon: '📋' },
  { href: '/chat', label: 'Ask Edda', icon: '💬' }
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-edward-navy2
                   border border-white/10 rounded-lg p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="text-edward-amber text-xl">☰</span>
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-40
          bg-edward-navy border-r border-white/5
          flex flex-col
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <span className="text-edward-amber font-bold text-xl tracking-tight">
            🎯 Ed&apos;s Ledger
          </span>
          <p className="text-edward-muted text-xs mt-1">
            Bounty hunting your budget
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all text-sm font-medium
                  ${
                    active
                      ? 'bg-edward-amber text-edward-navy'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full bg-edward-amber flex items-center
                           justify-center text-edward-navy font-bold text-sm"
            >
              {user?.name?.[0]?.toUpperCase() ?? 'E'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-edward-muted truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-edward-muted
                       hover:text-edward-coral transition-colors py-1"
          >
            → Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
