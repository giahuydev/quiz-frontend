'use client';

import { usePathname } from 'next/navigation';

const titles: Record<string, string> = {
  '/teacher/dashboard': 'Dashboard',
  '/teacher/classes':   'Lớp học',
  '/teacher/questions': 'Câu hỏi',
  '/teacher/exams':     'Đề thi',
  '/teacher/sessions':  'Kỳ thi',
};

export default function Header() {
  const pathname = usePathname();
  const title = Object.entries(titles).find(([path]) => pathname === path || pathname.startsWith(path + '/'))?.[1] || 'Hệ thống';
  
  return (
    <header className="h-10 bg-white border-b border-gray-100 flex items-center px-4 sticky top-0 z-10">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h2>
    </header>
  );
}
