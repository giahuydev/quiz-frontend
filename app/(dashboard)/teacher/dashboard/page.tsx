'use client';

import { useAuth } from '@/hooks/useAuth';
import { StatsGrid } from '@/components/teacher/StatsGrid';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Sau này bạn sẽ gọi API để lấy các con số thực tế tại đây
  // Ví dụ: const { data: stats } = useSWR('/api/teacher/stats', fetcher);
  
  const stats = [
    { label: 'Lớp học', value: 0 },
    { label: 'Câu hỏi', value: 0 },
    { label: 'Đề thi',  value: 0 },
    { label: 'Kỳ thi',  value: 0 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
          Xin chào, {user?.name}
        </h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Hệ thống quản lý trực tuyến</p>
      </div>

      <StatsGrid stats={stats} />

      <div className="border border-dashed border-gray-100 rounded-md p-12 text-center bg-white">
        <div className="max-w-xs mx-auto space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Dữ liệu phân tích</p>
          <p className="text-xs text-gray-300">Biểu đồ thống kê sẽ hiển thị sau khi có dữ liệu từ API.</p>
        </div>
      </div>
    </div>
  );
}
