'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { sessionService } from '@/services/session.service';
import type { ExamSession } from '@/types/exam';
import { SessionTable } from '@/components/teacher/SessionTable';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionService.getAll()
      .then((r) => setSessions(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Kỳ thi (Sessions)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng cộng có <span className="font-semibold text-primary">{sessions.length}</span> phiên thi đã được tạo
          </p>
        </div>
        <Link href="/teacher/sessions/new">
          <Button size="sm" className="shadow-sm">
            Tạo kỳ thi mới
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <SessionTable sessions={sessions} />
      )}
    </div>
  );
}
