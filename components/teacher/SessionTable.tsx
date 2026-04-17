'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ExamSession } from '@/types/exam';

interface SessionTableProps {
  sessions: ExamSession[];
}

export function SessionTable({ sessions }: SessionTableProps) {
  const getStatus = (s: ExamSession) => {
    const now = Date.now();
    const start = new Date(s.start_time).getTime();
    const end = new Date(s.end_time).getTime();
    if (now < start) return { label: 'Sắp diễn ra', variant: 'secondary' as const, color: 'text-amber-600 bg-amber-50 border-amber-100' };
    if (now < end) return { label: 'Đang diễn ra', variant: 'default' as const, color: 'text-green-600 bg-green-50 border-green-100' };
    return { label: 'Đã kết thúc', variant: 'secondary' as const, color: 'text-gray-500 bg-gray-50 border-gray-100' };
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-12 text-center text-sm text-gray-400">
        Chưa có kỳ thi nào diễn ra
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80">
            {['Mã phòng', 'Bắt đầu', 'Kết thúc', 'Trạng thái', ''].map((h) => (
              <th key={h} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sessions.map((s) => {
            const status = getStatus(s);
            return (
              <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-[11px] bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200 font-bold uppercase shadow-sm">
                    {s.access_code}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {new Date(s.start_time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {new Date(s.end_time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={status.variant} className={`text-[10px] px-2 py-0 border ${status.color}`}>
                    {status.label}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/teacher/sessions/${s.id}`}>
                    <Button variant="outline" size="sm" className="text-xs h-8 px-4 border-gray-200 hover:bg-primary hover:text-white transition-all">
                      Chi tiết
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
