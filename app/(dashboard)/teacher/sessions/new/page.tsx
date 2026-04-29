'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sessionService } from '@/services/session.service';
import { examService } from '@/services/exam.service';
import { classService } from '@/services/class.service';
import type { Exam } from '@/types/exam';
import type { Class } from '@/types/class';

export default function NewSessionPage() {
  const router = useRouter();

  const [examId, setExamId] = useState('');
  const [classId, setClassId] = useState('');
  const [waitingStartTime, setWaitingStartTime] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [mode, setMode] = useState<'LIVE' | 'ASSIGNED'>('LIVE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    Promise.all([examService.getAll(), classService.getAll()])
      .then(([e, c]) => {
        setExams(e.data);
        setClasses(c.data);
      })
      .catch(() => {
        // handled by UI
      });
  }, []);

  const selectedExam = useMemo(
    () => exams.find((e) => e.id === Number(examId)),
    [exams, examId],
  );

  const validate = (): string => {
    if (!examId) return 'Vui lòng chọn đề thi';
    if (!classId) return 'Vui lòng chọn lớp';
    if (!waitingStartTime) return 'Vui lòng nhập giờ mở phòng chờ';
    if (!startTime) return 'Vui lòng nhập giờ bắt đầu thi';
    if (!endTime) return 'Vui lòng nhập giờ kết thúc';

    const wst = new Date(waitingStartTime);
    const st = new Date(startTime);
    const et = new Date(endTime);

    if (wst >= st) return 'Giờ mở phòng chờ phải trước giờ bắt đầu thi';
    if (st >= et) return 'Giờ bắt đầu phải trước giờ kết thúc';

    if (selectedExam) {
      const sessionMinutes = (et.getTime() - st.getTime()) / 60000;
      if (selectedExam.duration_minutes > sessionMinutes) {
        return `Khung giờ phòng thi (${sessionMinutes} phút) ngắn hơn thời gian làm bài (${selectedExam.duration_minutes} phút)`;
      }
    }

    return '';
  };

  const handleCreate = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await sessionService.create({
        exam_id: Number(examId),
        class_id: Number(classId),
        mode,
        waiting_start_time: new Date(waitingStartTime).toISOString(),
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });
      router.push('/teacher/sessions');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Tạo kỳ thi thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Tạo kỳ thi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Chọn đề thi, lớp và đặt lịch giờ</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg px-5 py-5 space-y-4">
        <div className="space-y-1.5">
          <Label>Đề thi</Label>
          <select value={examId} onChange={(e) => setExamId(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="">-- Chọn đề thi --</option>
            {exams.map((e) => (
              <option key={e.id} value={e.id}>{e.title} ({e.duration_minutes} phút)</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Lớp học</Label>
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="">-- Chọn lớp --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.class_code})</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Hình thức</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['LIVE', 'ASSIGNED'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={[
                'py-2.5 px-3 rounded border text-sm font-medium transition-colors',
                mode === m ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
              ].join(' ')}>
                {m === 'LIVE' ? 'Thi trực tiếp' : 'Giao bài (có deadline)'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Giờ mở phòng chờ</Label>
            <Input type="datetime-local" value={waitingStartTime} onChange={(e) => setWaitingStartTime(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Giờ bắt đầu thi</Label>
            <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Giờ kết thúc</Label>
            <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push('/teacher/sessions')}>Huỷ</Button>
        <Button onClick={handleCreate} disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo kỳ thi'}</Button>
      </div>
    </div>
  );
}
