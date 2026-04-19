'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCountdown, formatDate } from '@/lib/utils';
import { sessionService } from '@/services/session.service';
import { Spinner } from '@/components/ui/spinner';
import type { ExamSession } from '@/types/exam';

export default function WaitingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = Number(params.sessionId);
  
  const [session, setSession] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);

  const seconds = useCountdown(
    session ? new Date(session.start_time) : new Date(), 
    () => {
      router.push(`/exam/${sessionId}`);
    }
  );

  useEffect(() => {
    sessionService.getById(sessionId)
      .then((r) => setSession(r.data))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center text-xs text-gray-400 font-bold uppercase">Không tìm thấy phòng thi</div>;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div>
          <h1 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Waiting Room</h1>
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{session.exam?.title || 'Kỳ thi trực tuyến'}</h2>
        </div>

        <div className="border border-gray-100 rounded-md py-10 bg-gray-50/50">
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-4 tracking-widest">Kỳ thi bắt đầu sau</p>
          <div className="text-6xl font-bold text-primary font-mono tabular-nums tracking-tighter">
            {formatCountdown(seconds)}
          </div>
        </div>

        <div className="border border-gray-100 rounded-md p-4 text-left space-y-2">
          <div className="flex justify-between text-[10px] uppercase font-bold">
            <span className="text-gray-400 tracking-wider">Mã phòng</span>
            <span className="text-gray-900">{session.access_code}</span>
          </div>
          <div className="flex justify-between text-[10px] uppercase font-bold">
            <span className="text-gray-400 tracking-wider">Thời gian làm bài</span>
            <span className="text-gray-900">{session.duration_minutes} PHÚT</span>
          </div>
          <div className="flex justify-between text-[10px] uppercase font-bold">
            <span className="text-gray-400 tracking-wider">Ngày thi</span>
            <span className="text-gray-900">{formatDate(session.start_time)}</span>
          </div>
        </div>

        <div className="p-4 text-left border-l-2 border-red-500 bg-red-50/30">
          <p className="text-[10px] font-bold text-red-600 uppercase mb-1 tracking-widest">Quy định phòng thi</p>
          <ul className="text-[10px] text-red-500/80 space-y-1 font-bold uppercase leading-tight">
            <li>· Không được phép chuyển tab hoặc thoát màn hình.</li>
            <li>· Hệ thống sẽ tự động nộp bài nếu phát hiện gian lận.</li>
            <li>· Đảm bảo internet ổn định suốt quá trình thi.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
