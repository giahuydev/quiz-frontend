// File: quiz-frontend/app/(dashboard)/teacher/layout.tsx
'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header  from '@/components/layout/Header';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}