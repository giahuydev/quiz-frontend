// File: quiz-frontend/components/teacher/SessionTable.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ExamSession } from '@/types/exam';

export function SessionTable({ sessions }: { sessions: ExamSession[] }) {
  const getStatus = (s: ExamSession) => {
    const now = Date.now();
    const start = new Date(s.start_time).getTime();
    const end = new Date(s.end_time).getTime();
    if (now < start) return { label: 'Sắp tới', variant: 'secondary' as const };
    if (now < end) return { label: 'Đang mở', variant: 'default' as const };
    return { label: 'Đã đóng', variant: 'secondary' as const };
  };

  if (sessions.length === 0) return <div className="border border-dashed rounded-md p-10 text-center text-[10px] text-gray-400 uppercase font-bold">Trống</div>;

  return (
    <div className="border border-gray-100 rounded-md overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr>
            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mã phòng</th>
            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chế độ</th>
            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thời gian</th>
            <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sessions.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50/30">
              <td className="px-4 py-4 font-mono text-xs font-bold text-primary">{s.access_code}</td>
              <td className="px-4 py-4">
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {s.mode || 'LIVE'}
                </span>
              </td>
              <td className="px-4 py-4 text-[10px] text-gray-500 font-medium">
                {new Date(s.start_time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
              </td>
              <td className="px-4 py-4">
                <Badge variant={getStatus(s).variant} className="text-[9px] rounded-sm px-1.5 py-0 uppercase">
                  {getStatus(s).label}
                </Badge>
              </td>
              <td className="px-4 py-4 text-right">
                <Link href={`/teacher/sessions/${s.id}`}>
                  <Button variant="outline" size="xs" className="h-7 px-3">Chi tiết</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
