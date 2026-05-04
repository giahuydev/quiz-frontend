'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { examService } from '@/services/exam.service';
import type { Exam } from '@/types/exam';

export default function ExamDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    examService.getById(id)
      .then((res) => setExam(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Không tìm thấy đề thi.</p>
        <Link href="/teacher/exams">
          <Button variant="outline" size="sm">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết đề thi</h1>
          <p className="text-sm text-gray-500 mt-1">{exam.title}</p>
        </div>
        <Link href="/teacher/exams">
          <Button variant="outline" size="sm">Quay lại</Button>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-4 grid gap-2 text-sm">
        <p><span className="text-gray-500">Thời gian:</span> {exam.duration_minutes} phút</p>
        <p>
          <span className="text-gray-500">Trạng thái:</span>{' '}
          <Badge variant={exam.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px] rounded-sm">
            {exam.status === 'PUBLISHED' ? 'Xong' : 'Nháp'}
          </Badge>
        </p>
        <p><span className="text-gray-500">Xáo trộn câu hỏi:</span> {exam.shuffle_questions ? 'Có' : 'Không'}</p>
        <p><span className="text-gray-500">Xáo trộn đáp án:</span> {exam.shuffle_options ? 'Có' : 'Không'}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Danh sách câu hỏi ({exam.questions?.length ?? 0})</h2>
        </div>

        {!exam.questions || exam.questions.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">Đề thi chưa có câu hỏi.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {exam.questions.map((q, index) => (
              <div key={q.id} className="p-4 space-y-2">
                <p className="text-sm font-medium text-gray-900">Câu {index + 1}: {q.content}</p>
                <div className="grid gap-1 text-sm text-gray-700">
                  <p>A. {q.option_a}</p>
                  <p>B. {q.option_b}</p>
                  <p>C. {q.option_c}</p>
                  <p>D. {q.option_d}</p>
                </div>
                <p className="text-xs text-green-700">Đáp án đúng: {q.correct_answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
