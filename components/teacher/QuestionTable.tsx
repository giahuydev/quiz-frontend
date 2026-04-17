'use client';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Question } from '@/types/exam';

interface QuestionTableProps {
  questions: Question[];
}

export function QuestionTable({ questions }: QuestionTableProps) {
  if (questions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-12 text-center text-sm text-gray-400">
        Không tìm thấy câu hỏi nào
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Nội dung câu hỏi</th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider w-32 text-center">Đáp án đúng</th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-4 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="max-w-xl">
                    <p className="text-gray-900 font-semibold line-clamp-2">{q.content}</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-[11px] text-gray-500">
                      <div className="flex gap-1"><span className="font-bold text-primary">A:</span> {q.option_a}</div>
                      <div className="flex gap-1"><span className="font-bold text-primary">B:</span> {q.option_b}</div>
                      <div className="flex gap-1"><span className="font-bold text-primary">C:</span> {q.option_c}</div>
                      <div className="flex gap-1"><span className="font-bold text-primary">D:</span> {q.option_d}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-lg font-bold text-sm border border-green-200 shadow-sm">
                    {q.correct_answer}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs">
                  {formatDate(q.created_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
