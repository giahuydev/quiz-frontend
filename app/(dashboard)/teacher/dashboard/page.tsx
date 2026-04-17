'use client';

import { useAuth } from '@/hooks/useAuth';
import { StatsGrid } from '@/components/teacher/StatsGrid';

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = [
    { label: 'Lớp học',  value: '0' },
    { label: 'Câu hỏi', value: '0' },
    { label: 'Đề thi',  value: '0' },
    { label: 'Kỳ thi',  value: '0' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
          Xin chào, {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Dưới đây là tổng quan về hoạt động giảng dạy của bạn</p>
      </div>

      <StatsGrid stats={stats} />

      <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center shadow-sm">
        <div className="max-w-xs mx-auto space-y-2">
          <p className="text-sm font-medium text-gray-600">Dữ liệu phân tích đang được cập nhật</p>
          <p className="text-xs text-gray-400">Các biểu đồ và báo cáo chi tiết sẽ hiển thị tại đây sau khi bạn có dữ liệu kỳ thi.</p>
        </div>
      </div>
    </div>
  );
}
