'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  HelpCircle, 
  FileText, 
  Calendar, 
  LogOut 
} from 'lucide-react';

const navItems = [
  { label: 'Tổng quan', href: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Lớp học',   href: '/teacher/classes',   icon: Users },
  { label: 'Câu hỏi',   href: '/teacher/questions', icon: HelpCircle },
  { label: 'Đề thi',     href: '/teacher/exams',     icon: FileText },
  { label: 'Kỳ thi',     href: '/teacher/sessions',  icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-30">
      <div className="px-4 py-4 border-b border-gray-100">
        <span className="font-semibold text-gray-900 text-sm">Quiz Online</span>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors',
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ].join(' ')}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-gray-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-medium text-gray-900 truncate">{user?.name}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}