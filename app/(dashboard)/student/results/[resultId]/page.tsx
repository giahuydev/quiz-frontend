'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const mockResult = {
  score: 8.0, correct: 32, total: 40, violations: 1, time_used: '45 phút',
};

const mockReview = [
  { id: 1, content: 'HTML là viết tắt của?', chosen: 'A', correct: 'A', is_correct: true,  options: [{ key: 'A', text: 'Hyper Text Markup Language' }, { key: 'B', text: 'High Text Machine Language' }, { key: 'C', text: 'Hyper Tabular' }, { key: 'D', text: 'Home Tool' }] },
  { id: 2, content: 'CSS dùng để làm gì?',   chosen: 'A', correct: 'B', is_correct: false, options: [{ key: 'A', text: 'Xử lý logic' }, { key: 'B', text: 'Định dạng giao diện' }, { key: 'C', text: 'Kết nối database' }, { key: 'D', text: 'Quản lý server' }] },
];

export default function ResultPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Điểm số</p>
        <p className="text-5xl font-bold text-gray-900">{mockResult.score.toFixed(1)}</p>
        <p className="text-sm text-gray-500 mt-1">/ 10</p>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          {[
            { v: `${mockResult.correct}/${mockResult.total}`, l: 'Câu đúng' },
            { v: mockResult.violations, l: 'Vi phạm' },
            { v: mockResult.time_used, l: 'Thời gian' },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-lg font-semibold text-gray-900">{s.v}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-3">Xem lại bài làm</h2>
        <div className="space-y-3">
          {mockReview.map((q, i) => (
            <div key={q.id} className={['bg-white border rounded-lg px-4 py-4', q.is_correct ? 'border-gray-200' : 'border-red-200'].join(' ')}>
              <div className="flex items-start gap-2 mb-3">
                <span className={['text-xs font-medium px-2 py-0.5 rounded flex-shrink-0', q.is_correct ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600'].join(' ')}>
                  {q.is_correct ? 'Đúng' : 'Sai'}
                </span>
                <p className="text-sm font-medium text-gray-900">{i + 1}. {q.content}</p>
              </div>

              <div className="space-y-1.5 pl-2">
                {q.options.map((opt) => {
                  const isChosen  = opt.key === q.chosen;
                  const isCorrect = opt.key === q.correct;
                  return (
                    <div key={opt.key} className={['flex items-center gap-2 text-xs px-3 py-2 rounded', isCorrect ? 'bg-gray-100 text-gray-900 font-medium' : isChosen ? 'bg-red-50 text-red-600' : 'text-gray-500'].join(' ')}>
                      <span className="font-medium w-4">{opt.key}.</span>
                      <span>{opt.text}</span>
                      {isCorrect && <span className="ml-auto text-gray-500">✓ Đúng</span>}
                      {isChosen && !isCorrect && <span className="ml-auto text-red-400">✗ Đã chọn</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href="/student/home"><Button variant="outline" size="sm">Về trang chủ</Button></Link>
      </div>
    </div>
  );
}