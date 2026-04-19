'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCountdown } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { resultService } from '@/services/result.service';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = Number(params.resultId);
  
  const [questions, setQuestions] = useState<any[]>([]); 
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [submitting, setSubmitting] = useState(false);
  const [endTime, setEndTime] = useState<Date>(new Date());

  const seconds = useCountdown(endTime, () => handleSubmit());

  useEffect(() => {
    resultService.getById(resultId)
      .then((r) => {
        const data = r.data;
        setQuestions(data.questions || []);
        setEndTime(new Date(data.end_time || Date.now() + 60 * 60 * 1000));
        const saved: Record<number, string> = {};
        data.questions?.forEach((q: any) => {
          if (q.student_answer) saved[q.id] = q.student_answer;
        });
        setAnswers(saved);
      })
      .finally(() => setLoading(false));

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') console.log('Vi phạm: Chuyển tab');
    };
    const handleFullscreen = () => {
      if (!document.fullscreenElement) setOverlay(true);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('fullscreenchange', handleFullscreen);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, [resultId]);

  const handleSelectAnswer = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await resultService.submit(resultId);
      router.push(`/student/results/${resultId}`);
    } catch {
      alert('Lỗi khi nộp bài');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  if (questions.length === 0) return <div className="h-screen flex items-center justify-center text-xs text-gray-400">Không có dữ liệu đề thi</div>;

  const currentQ = questions[current];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans select-none text-gray-900">
      {overlay && (
        <div className="fixed inset-0 bg-gray-900/95 z-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-xs space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Cảnh báo vi phạm</h2>
            <p className="text-[11px] text-gray-300 leading-relaxed uppercase">Bạn đã thoát khỏi chế độ thi. Vui lòng quay lại toàn màn hình để tiếp tục.</p>
            <Button size="sm" className="w-full" onClick={() => { document.documentElement.requestFullscreen().catch(() => {}); setOverlay(false); }}>
              Quay lại toàn màn hình
            </Button>
          </div>
        </div>
      )}

      <div className="border-b border-gray-100 px-6 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Exam Session #{resultId}</div>
        <div className={`font-mono text-xl font-bold tabular-nums tracking-tighter ${seconds < 300 ? 'text-red-600' : 'text-gray-900'}`}>
          {formatCountdown(seconds)}
        </div>
        <Button size="xs" variant="outline" className="font-bold uppercase text-[9px] border-gray-300" onClick={() => confirm('Nộp bài?') && handleSubmit()}>
          Nộp bài
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-xl mx-auto space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest border-b-2 border-primary pb-1">Câu hỏi {current + 1}</span>
              <p className="text-sm font-bold text-gray-900 leading-relaxed uppercase tracking-tight">{currentQ.content}</p>
            </div>

            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map((key) => {
                const optText = currentQ[`option_${key.toLowerCase()}`];
                const selected = answers[currentQ.id] === key;
                return (
                  <button key={key} onClick={() => handleSelectAnswer(currentQ.id, key)}
                    className={`w-full flex items-start gap-4 px-4 py-4 rounded border text-xs text-left transition-all ${selected ? 'border-primary bg-primary text-white shadow-sm' : 'border-gray-100 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${selected ? 'border-white text-white' : 'border-gray-200 text-gray-400'}`}>
                      {key}
                    </span>
                    <span className="font-semibold pt-0.5">{optText}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-50">
              <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-gray-600" onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}>Trước</Button>
              <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-gray-600" onClick={() => setCurrent(p => Math.min(questions.length - 1, p + 1))} disabled={current === questions.length - 1}>Tiếp theo</Button>
            </div>
          </div>
        </div>

        <div className="w-48 border-l border-gray-100 p-4 hidden lg:block overflow-y-auto bg-gray-50/30">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4 font-mono">Danh sách câu hỏi</p>
          <div className="grid grid-cols-4 gap-1.5">
            {questions.map((q, i) => {
              const isDone = !!answers[q.id];
              const isActive = i === current;
              
              return (
                <button key={q.id} onClick={() => setCurrent(i)}
                  className={`w-9 h-9 rounded text-[10px] font-bold transition-all border relative
                    ${isActive ? 'border-primary ring-1 ring-primary/20 bg-white text-primary scale-110 z-10' : 
                      isDone ? 'bg-primary/10 border-transparent text-primary' : 
                      'bg-white border-gray-200 text-gray-500 hover:border-gray-400'}
                  `}
                >
                  {i + 1}
                  {isDone && !isActive && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-[9px] font-bold uppercase">
              <span className="text-gray-600 font-mono">Tiến độ làm bài</span>
              <span className="text-primary font-mono">{Object.keys(answers).length}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all duration-500" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
