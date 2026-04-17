'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/student/home" className="font-semibold text-gray-900 text-sm">
            Quiz Online
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}