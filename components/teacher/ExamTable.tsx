'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Exam } from '@/types/exam';

export function ExamTable({ exams }: { exams: Exam[] }) {
  if (exams.length === 0) return <div className="border rounded-md p-8 text-center text-sm text-gray-400">Trống</div>;

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Tên đề', 'Thời gian', 'Trạng thái', ''].map(h => (
              <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {exams.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{e.title}</td>
              <td className="px-4 py-3 text-gray-500">{e.duration_minutes} phút</td>
              <td className="px-4 py-3">
                <Badge variant={e.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px] rounded-sm">
                  {e.status === 'PUBLISHED' ? 'Xong' : 'Nháp'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" className="h-7 text-xs">Xem</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
