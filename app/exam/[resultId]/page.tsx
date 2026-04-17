'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCountdown } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const mockQuestions = [
  { id: 1, content: 'HTML là viết tắt của?', options: [{ key: 'A', text: 'Hyper Text Markup Language' }, { key: 'B', text: 'High Text Machine Language' }, { key: 'C', text: 'Hyper Tabular Markup Language' }, { key: 'D', text: 'Home Tool Markup Language' }] },
  { id: 2, content: 'CSS dùng để làm gì?', options: [{ key: 'A', text: 'Xử lý logic' }, { key: 'B', text: 'Định dạng giao diện' }, { key: 'C', text: 'Kết nối database' }, { key: 'D', text: 'Quản lý server' }] },
  { id: 3, content: 'JavaScript là ngôn ngữ gì?', options: [{ key: 'A', text: 'Ngôn ngữ lập trình biên dịch' }, { key: 'B', text: 'Ngôn ngữ đánh dấu' }, { key: 'C', text: 'Ngôn ngữ kịch bản phía client' }, { key: 'D', text: 'Ngôn ngữ truy vấn' }] },
];

const END_TIME = new Date(Date.now() + 60 * 60 * 1000);

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const [current,  setCurrent]  = useState(0);
  const [answers,  setAnswers]  = useState<Record<number, string>>({});
  const [overlay,  setOverlay]  = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const violationRef = useRef(0);

  const seconds = useCountdown(END_TIME, () => handleSubmit());

  useEffect(() => {
    document.documentElement.requestFullscreen().catch(() => {});
    const handleVisibility = () => document.visibilityState === 'hidden' && (violationRef.current += 1);
    const handleFullscreen = () => !document.fullscreenElement && setOverlay(true);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    router.push(`/student/results/${params.resultId}`);
  };

  if (submitted) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {overlay && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-sm text-center space-y-4">
            <p className="text-lg font-semibold text-gray-900">Bạn đã thoát toàn màn hình</p>
            <p className="text-sm text-gray-500">Vui lòng quay lại toàn màn hình để tiếp tục làm bài.</p>
            <Button onClick={() => { document.documentElement.requestFullscreen().catch(() => {}); setOverlay(false); }}>Quay lại toàn màn hình</Button>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="text-sm font-medium text-gray-900">Kiểm tra giữa kỳ</div>
        <div className={['font-mono text-lg font-bold tabular-nums', seconds < 300 ? 'text-red-600' : 'text-gray-900'].join(' ')}>{formatCountdown(seconds)}</div>
        <Button size="sm" variant="outline" onClick={() => confirm(`Bạn đã trả lời ${Object.keys(answers).length}/${mockQuestions.length} câu. Xác nhận nộp bài?`) && handleSubmit()}>Nộp bài</Button>
      </div>

      <div className="flex flex-1">
        <div className="flex-1 px-8 py-6 max-w-2xl mx-auto">
          <p className="text-xs text-gray-400 mb-2">Câu {current + 1} / {mockQuestions.length}</p>
          <p className="text-base font-medium text-gray-900 mb-6">{mockQuestions[current].content}</p>
          <div className="space-y-3">
            {mockQuestions[current].options.map((opt) => {
              const selected = answers[mockQuestions[current].id] === opt.key;
              return (
                <button key={opt.key} onClick={() => setAnswers({...answers, [mockQuestions[current].id]: opt.key})}
                  className={['w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-colors',
                    selected ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-400 text-gray-700'].join(' ')}>
                  <span className={['w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium flex-shrink-0',
                    selected ? 'border-white text-white' : 'border-gray-300 text-gray-500'].join(' ')}>{opt.key}</span>
                  {opt.text}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-8">
            <Button variant="outline" size="sm" onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}>Câu trước</Button>
            <Button variant="outline" size="sm" onClick={() => setCurrent(p => Math.min(mockQuestions.length - 1, p + 1))} disabled={current === mockQuestions.length - 1}>Câu tiếp</Button>
          </div>
        </div>

        <div className="w-52 border-l border-gray-100 px-4 py-6 hidden md:block">
          <p className="text-xs font-medium text-gray-700 mb-1">Danh sách câu hỏi</p>
          <p className="text-xs text-gray-400 mb-4">{Object.keys(answers).length}/{mockQuestions.length} đã trả lời</p>
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {mockQuestions.map((q, i) => (
              <button key={q.id} onClick={() => setCurrent(i)}
                className={['w-7 h-7 rounded text-xs font-medium transition-colors relative',
                  i === current ? 'bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-1' :
                  answers[q.id] ? 'bg-gray-900 text-white opacity-60' : 'bg-white border border-gray-200 text-gray-400 hover:border-gray-400'].join(' ')}>
                {i + 1}
                {answers[q.id] && i !== current && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}