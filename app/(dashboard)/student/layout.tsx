// File: quiz-frontend/app/(dashboard)/student/layout.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/student/home" className="font-bold text-gray-900 text-xs uppercase tracking-tight">
            Quiz Online
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/student/profile"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-bold uppercase">
              {user?.name}
            </Link>
            <button onClick={logout}
              className="text-xs text-red-400 hover:text-red-600 transition-colors font-bold uppercase">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}