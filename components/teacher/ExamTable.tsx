'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Exam } from '@/types/exam';

interface ExamTableProps {
  exams: Exam[];
}

export function ExamTable({ exams }: ExamTableProps) {
  if (exams.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-8 text-center text-sm text-gray-400">
        Chưa có đề thi nào
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {['Tên đề thi', 'Thời gian', 'Trạng thái', ''].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {exams.map((e, i) => (
            <tr key={e.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{e.title}</td>
              <td className="px-4 py-3 text-gray-600">{e.duration_minutes} phút</td>
              <td className="px-4 py-3">
                <Badge 
                  variant={e.status === 'PUBLISHED' ? 'default' : 'secondary'} 
                  className="text-[10px] px-2 py-0"
                >
                  {e.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Nháp'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" className="text-xs h-7">Xem</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
