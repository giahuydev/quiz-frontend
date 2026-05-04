'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { StatsGrid } from '@/components/teacher/StatsGrid';
import { classService } from '@/services/class.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { sessionService } from '@/services/session.service';

export default function DashboardPage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    classes: 0,
    questions: 0,
    exams: 0,
    sessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([
      classService.getAll(),
      questionService.getAll(),
      examService.getAll(),
      sessionService.getAll(),
    ])
      .then((results) => {
        if (!mounted) return;

        const [classesRes, questionsRes, examsRes, sessionsRes] = results;

        setCounts({
          classes: classesRes.status === 'fulfilled' ? classesRes.value.data.length : 0,
          questions: questionsRes.status === 'fulfilled' ? questionsRes.value.data.length : 0,
          exams: examsRes.status === 'fulfilled' ? examsRes.value.data.length : 0,
          sessions: sessionsRes.status === 'fulfilled' ? sessionsRes.value.data.length : 0,
        });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Lớp học', value: loading ? '...' : counts.classes },
      { label: 'Câu hỏi', value: loading ? '...' : counts.questions },
      { label: 'Đề thi', value: loading ? '...' : counts.exams },
      { label: 'Kỳ thi', value: loading ? '...' : counts.sessions },
    ],
    [counts, loading],
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
          Xin chào, {user?.name}
        </h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Hệ thống quản lý trực tuyến</p>
      </div>

      <StatsGrid stats={stats} />
    </div>
  );
}
