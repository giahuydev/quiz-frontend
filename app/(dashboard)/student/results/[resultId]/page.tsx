// File: quiz-frontend/app/(dashboard)/student/results/[resultId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { resultService } from '@/services/result.service';

export default function ResultPage() {
  const params = useParams();
  const resultId = Number(params.resultId);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API review kết quả thi
    resultService.getById(resultId)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [resultId]);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!data) return <div className="text-center py-20 text-xs text-gray-400">Không có kết quả</div>;

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-10">
      {/* Thẻ điểm tối giản */}
      <div className="border border-gray-100 rounded-md p-8 text-center bg-white">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kết quả bài thi</p>
        <div className="text-6xl font-bold text-primary tracking-tighter">{(data.score || 0).toFixed(1)}</div>
        
        <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-gray-50">
          <div>
            <p className="text-xs font-bold text-gray-900">{data.correct_answers || 0}/{data.total_questions || 0}</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Câu đúng</p>
          </div>
          <div>
            <p className="text-xs font-bold text-red-500">{data.violations_count || 0}</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Vi phạm</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">{data.duration_seconds ? Math.floor(data.duration_seconds/60) : 0}m</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Thời gian</p>
          </div>
        </div>
      </div>

      {/* Xem lại chi tiết */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chi tiết bài làm</h2>
        <div className="space-y-3">
          {(data.questions || []).map((q: any, i: number) => {
            const isCorrect = q.student_answer === q.correct_answer;
            return (
              <div key={q.id} className={`border rounded-md p-4 bg-white ${isCorrect ? 'border-gray-100' : 'border-red-100'}`}>
                <div className="flex gap-3 mb-4">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${isCorrect ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-500'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                  <p className="text-[11px] font-bold text-gray-900 uppercase">Câu {i + 1}: {q.content}</p>
                </div>

                <div className="grid grid-cols-1 gap-1.5 pl-2">
                  {['A', 'B', 'C', 'D'].map(key => {
                    const optText = q[`option_${key.toLowerCase()}`];
                    const isChosen = q.student_answer === key;
                    const isCorrectKey = q.correct_answer === key;
                    
                    return (
                      <div key={key} className={`text-[10px] px-3 py-1.5 rounded flex items-center gap-2 ${isCorrectKey ? 'bg-green-50 text-green-700 font-bold' : isChosen ? 'bg-red-50 text-red-600' : 'text-gray-400'}`}>
                        <span className="w-4">{key}.</span>
                        <span className="flex-1">{optText}</span>
                        {isCorrectKey && <span>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Link href="/student/home">
          <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase">Về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
}
