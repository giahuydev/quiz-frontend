'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { sessionService } from '@/services/session.service';
import type { ExamSession } from '@/types/exam';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    sessionService.getAll()
      .then((r) => setSessions(r.data))
      .finally(() => setLoading(false));
  }, []);

  const getStatus = (s: ExamSession) => {
    const now = Date.now();
    const start = new Date(s.start_time).getTime();
    const end   = new Date(s.end_time).getTime();
    if (now < start) return { label: 'Sắp diễn ra', variant: 'secondary' as const };
    if (now < end)   return { label: 'Đang diễn ra', variant: 'default'   as const };
    return              { label: 'Đã kết thúc',  variant: 'secondary' as const };
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Kỳ thi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{sessions.length} kỳ thi</p>
        </div>
        <Link href="/teacher/sessions/new">
          <Button size="sm">Tạo kỳ thi</Button>
        </Link>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Mã phòng', 'Giờ bắt đầu', 'Giờ kết thúc', 'Trạng thái', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => {
                const status = getStatus(s);
                return (
                  <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{s.access_code}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{new Date(s.start_time).toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(s.end_time).toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/teacher/sessions/${s.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs h-7">Xem</Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Chưa có kỳ thi nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}