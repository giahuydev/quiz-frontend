'use client';

import { usePathname } from 'next/navigation';

const titles: Record<string, string> = {
  '/teacher/dashboard': 'Tổng quan',
  '/teacher/classes':   'Quản lý lớp học',
  '/teacher/questions': 'Ngân hàng câu hỏi',
  '/teacher/exams':     'Quản lý đề thi',
  '/teacher/sessions':  'Kỳ thi',
};

function getTitle(pathname: string): string {
  for (const [path, title] of Object.entries(titles)) {
    if (pathname === path || pathname.startsWith(path + '/')) return title;
  }
  return 'Quiz Online';
}

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-20">
      <h2 className="text-sm font-semibold text-gray-800">{getTitle(pathname)}</h2>
    </header>
  );
}