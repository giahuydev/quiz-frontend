'use client';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Question } from '@/types/exam';

export function QuestionTable({ questions }: { questions: Question[] }) {
  if (questions.length === 0) return <div className="border border-dashed rounded-md p-12 text-center text-xs text-gray-400">Không có câu hỏi nào</div>;

  return (
    <div className="border border-gray-100 rounded-md overflow-hidden bg-white">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr>
            <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nội dung câu hỏi</th>
            <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center w-16">Đáp án</th>
            <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-32">Ngày tạo</th>
            <th className="px-2 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {questions.map((q) => (
            <tr key={q.id} className="hover:bg-gray-50/30">
              <td className="px-4 py-4">
                <p className="text-gray-900 font-medium leading-snug">{q.content}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[10px] text-gray-400">
                  <span className="truncate"><b className="text-primary/60">A.</b> {q.option_a}</span>
                  <span className="truncate"><b className="text-primary/60">B.</b> {q.option_b}</span>
                  <span className="truncate"><b className="text-primary/60">C.</b> {q.option_c}</span>
                  <span className="truncate"><b className="text-primary/60">D.</b> {q.option_d}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">{q.correct_answer}</span>
              </td>
              <td className="px-4 py-4 text-[10px] text-gray-400 whitespace-nowrap">
                {formatDate(q.created_at)}
              </td>
              <td className="px-2 py-4 text-right">
                <Button variant="ghost" size="xs" className="h-6 w-6">...</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
