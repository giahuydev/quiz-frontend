'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { examService } from '@/services/exam.service';
import type { Exam } from '@/types/exam';

export default function ExamsPage() {
  const [exams,   setExams]   = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService.getAll()
      .then((r) => setExams(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Đề thi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{exams.length} đề thi</p>
        </div>
        <Link href="/teacher/exams/new">
          <Button size="sm">Tạo đề thi</Button>
        </Link>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Tên đề thi', 'Thời gian', 'Trạng thái', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exams.map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 font-medium text-gray-900">{e.title}</td>
                  <td className="px-4 py-3 text-gray-600">{e.duration_minutes} phút</td>
                  <td className="px-4 py-3">
                    <Badge variant={e.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-xs">
                      {e.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Nháp'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs h-7">Xem</Button>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">Chưa có đề thi nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}