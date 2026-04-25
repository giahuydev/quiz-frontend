// File: quiz-frontend/app/(dashboard)/teacher/sessions/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';

const mockExams = [
  { id: 1, title: 'Kiểm tra giữa kỳ - Lập trình Web', duration_minutes: 60 },
  { id: 2, title: 'Kiểm tra cuối kỳ - CSDL',          duration_minutes: 90 },
];

const mockClasses = [
  { id: 1, name: 'Lập trình Web',  class_code: 'LTW001' },
  { id: 2, name: 'Cơ sở dữ liệu', class_code: 'CSDB02' },
];

export default function NewSessionPage() {
  const router = useRouter();

  const [examId,           setExamId]           = useState('');
  const [classId,          setClassId]          = useState('');
  const [waitingStartTime, setWaitingStartTime] = useState('');
  const [startTime,        setStartTime]        = useState('');
  const [endTime,          setEndTime]          = useState('');
  const [mode,             setMode]             = useState<'LIVE'|'ASSIGNED'>('LIVE');
  const [error,            setError]            = useState('');

  const selectedExam = mockExams.find((e) => e.id === Number(examId));

  const validate = (): string => {
    if (!examId)           return 'Vui lòng chọn đề thi';
    if (!classId)          return 'Vui lòng chọn lớp';
    if (!waitingStartTime) return 'Vui lòng nhập giờ mở phòng chờ';
    if (!startTime)        return 'Vui lòng nhập giờ bắt đầu thi';
    if (!endTime)          return 'Vui lòng nhập giờ kết thúc';

    const wst = new Date(waitingStartTime);
    const st  = new Date(startTime);
    const et  = new Date(endTime);

    if (wst >= st)  return 'Giờ mở phòng chờ phải trước giờ bắt đầu thi';
    if (st >= et)   return 'Giờ bắt đầu phải trước giờ kết thúc';

    if (selectedExam) {
      const sessionMinutes = (et.getTime() - st.getTime()) / 60000;
      if (selectedExam.duration_minutes > sessionMinutes) {
        return `Khung giờ phòng thi (${sessionMinutes} phút) ngắn hơn thời gian làm bài (${selectedExam.duration_minutes} phút)`;
      }
    }

    return '';
  };

  const handleCreate = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    // TODO: gọi sessionService.create(...)
    alert('Tạo kỳ thi thành công!');
    router.push('/teacher/sessions');
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Tạo kỳ thi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Chọn đề thi, lớp và đặt lịch giờ</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg px-5 py-5 space-y-4">

        {/* Chọn đề thi */}
        <div className="space-y-1.5">
          <Label>Đề thi</Label>
          <select
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">-- Chọn đề thi --</option>
            {mockExams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.duration_minutes} phút)
              </option>
            ))}
          </select>
        </div>

        {/* Chọn lớp */}
        <div className="space-y-1.5">
          <Label>Lớp học</Label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">-- Chọn lớp --</option>
            {mockClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.class_code})
              </option>
            ))}
          </select>
        </div>

        {/* Hình thức */}
        <div className="space-y-1.5">
          <Label>Hình thức</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['LIVE', 'ASSIGNED'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={[
                  'py-2.5 px-3 rounded border text-sm font-medium transition-colors',
                  mode === m
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
                ].join(' ')}
              >
                {m === 'LIVE' ? 'Thi trực tiếp' : 'Giao bài (có deadline)'}
              </button>
            ))}
          </div>
        </div>

        {/* Lịch giờ */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Giờ mở phòng chờ</Label>
            <Input
              type="datetime-local"
              value={waitingStartTime}
              onChange={(e) => setWaitingStartTime(e.target.value)}
            />
            <p className="text-xs text-gray-400">
              Sinh viên có thể vào phòng chờ từ thời điểm này
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Giờ bắt đầu thi</Label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <p className="text-xs text-gray-400">
              Sau thời điểm này sinh viên không được vào thêm
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Giờ kết thúc</Label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <p className="text-xs text-gray-400">
              Tất cả bài thi tự động nộp lúc này
            </p>
          </div>
        </div>

        {/* Hiển thị thông tin tóm tắt */}
        {examId && classId && startTime && endTime && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 space-y-1">
            <p className="text-xs font-medium text-gray-700">Tóm tắt kỳ thi</p>
            <p className="text-xs text-gray-500">
              Đề: {mockExams.find((e) => e.id === Number(examId))?.title}
            </p>
            <p className="text-xs text-gray-500">
              Lớp: {mockClasses.find((c) => c.id === Number(classId))?.name}
            </p>
            <p className="text-xs text-gray-500">
              Thời gian làm bài: {selectedExam?.duration_minutes} phút
            </p>
          </div>
        )}

        {/* Lỗi validate */}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push('/teacher/sessions')}>
          Huỷ
        </Button>
        <Button onClick={handleCreate}>Tạo kỳ thi</Button>
      </div>
    </div>
  );
}