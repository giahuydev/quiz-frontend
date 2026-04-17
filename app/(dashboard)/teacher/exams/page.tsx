'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { examService } from '@/services/exam.service';
import type { Exam } from '@/types/exam';
import { ExamTable } from '@/components/teacher/ExamTable';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService.getAll()
      .then((r) => setExams(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Đề thi</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các đề thi của bạn</p>
        </div>
        <Link href="/teacher/exams/new">
          <Button size="sm" className="shadow-sm">Tạo đề thi mới</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <ExamTable exams={exams} />
      )}
    </div>
  );
}
