// File: quiz-frontend/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Users, HelpCircle, FileText, Calendar, LogOut, UserCircle } from 'lucide-react';

const navItems = [
  { label: 'Tổng quan', href: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Lớp học',   href: '/teacher/classes',   icon: Users },
  { label: 'Câu hỏi',   href: '/teacher/questions', icon: HelpCircle },
  { label: 'Đề thi',     href: '/teacher/exams',     icon: FileText },
  { label: 'Kỳ thi',     href: '/teacher/sessions',  icon: Calendar },
  { label: 'Tài khoản', href: '/teacher/profile',   icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-48 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="px-4 py-4 border-b">
        <span className="font-bold text-gray-900 text-xs uppercase tracking-tight">Quiz System</span>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${active ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t">
        <div className="px-3 py-2 mb-2">
          <p className="text-[10px] font-bold text-gray-900 truncate uppercase">{user?.name}</p>
          <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-red-500 hover:bg-red-50">
          <LogOut className="w-3.5 h-3.5" /> Thoát
        </button>
      </div>
    </aside>
  );
}
