// File: quiz-frontend/components/teacher/QuestionTable.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { questionService } from '@/services/question.service';
import type { Question } from '@/types/exam';

export function QuestionTable({
  questions,
  onRefresh,
}: {
  questions: Question[];
  onRefresh: () => void;
}) {
  const [openMenu,   setOpenMenu]   = useState<number | null>(null);
  const [editQ,      setEditQ]      = useState<Question | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm();

  const openEdit = (q: Question) => {
    setEditQ(q);
    reset({
      content:        q.content,
      option_a:       q.option_a,
      option_b:       q.option_b,
      option_c:       q.option_c,
      option_d:       q.option_d,
      correct_answer: q.correct_answer,
    });
    setOpenMenu(null);
  };

  const handleEdit = async (data: any) => {
    if (!editQ) return;
    setSubmitting(true);
    try {
      await questionService.update(editQ.id, data);
      setEditQ(null);
      onRefresh();
    } catch {
      alert('Cập nhật thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (q: Question) => {
    if (!confirm(`Xoá câu hỏi: "${q.content}"?`)) return;
    try {
      await questionService.remove(q.id);
      onRefresh();
    } catch {
      alert('Xoá thất bại');
    }
  };

  if (questions.length === 0)
    return (
      <div className="border border-dashed rounded-md p-12 text-center text-xs text-gray-400">
        Không có câu hỏi nào
      </div>
    );

  return (
    <>
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
                  <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                    {q.correct_answer}
                  </span>
                </td>
                <td className="px-4 py-4 text-[10px] text-gray-400 whitespace-nowrap">
                  {formatDate(q.created_at)}
                </td>
                <td className="px-2 py-4 text-right relative">
                  <Button
                    variant="ghost" size="xs" className="h-6 w-6"
                    onClick={() => setOpenMenu(openMenu === q.id ? null : q.id)}
                  >
                    ...
                  </Button>
                  {openMenu === q.id && (
                    <div className="absolute right-6 top-8 z-20 bg-white border border-gray-100 rounded-md shadow-sm text-[10px] font-bold uppercase w-20 overflow-hidden">
                      <button
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 text-gray-600"
                        onClick={() => openEdit(q)}
                      >
                        Sửa
                      </button>
                      <button
                        className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-500"
                        onClick={() => { setOpenMenu(null); handleDelete(q); }}
                      >
                        Xoá
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog sửa câu hỏi */}
      <Dialog open={!!editQ} onOpenChange={(v) => { if (!v) setEditQ(null); }}>
        <DialogContent className="max-w-xl rounded-md border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-tight">Sửa câu hỏi</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 font-bold uppercase">Nội dung câu hỏi</Label>
              <textarea
                {...register('content')}
                rows={3}
                className="w-full border rounded-md p-2 text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['a', 'b', 'c', 'd'].map((opt) => (
                <div key={opt} className="space-y-1">
                  <Label className="text-[10px] text-gray-400 font-bold uppercase">Đáp án {opt.toUpperCase()}</Label>
                  <Input
                    {...register(`option_${opt}` as any)}
                    placeholder={`Đáp án ${opt.toUpperCase()}`}
                    className="h-9 text-xs"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 font-bold uppercase">Đáp án đúng</Label>
              <div className="flex gap-2">
                {['A', 'B', 'C', 'D'].map((ans) => (
                  <Button
                    key={ans} type="button" size="sm" className="w-10 text-xs"
                    variant={watch('correct_answer') === ans ? 'default' : 'outline'}
                    onClick={() => setValue('correct_answer', ans)}
                  >
                    {ans}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button variant="ghost" size="sm" className="text-xs" type="button" onClick={() => setEditQ(null)}>Huỷ</Button>
              <Button size="sm" type="submit" className="text-xs px-6" disabled={submitting}>
                {submitting ? '...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}