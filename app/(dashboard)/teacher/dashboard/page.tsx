'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = [
    { label: 'Lớp học',  value: '—' },
    { label: 'Câu hỏi', value: '—' },
    { label: 'Đề thi',  value: '—' },
    { label: 'Kỳ thi',  value: '—' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Xin chào, {user?.name}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tổng quan hệ thống</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-400">
        Dữ liệu sẽ hiển thị sau khi kết nối API
      </div>
    </div>
  );
}