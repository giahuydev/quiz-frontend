'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { questionService } from '@/services/question.service';
import { Spinner } from '@/components/ui/spinner';
import { Download } from 'lucide-react';
import type { QuestionSet } from '@/types/question-set';

export function AddQuestionDialog({
  onSuccess,
  questionSets,
}: {
  onSuccess: () => void;
  questionSets: QuestionSet[];
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'manual' | 'excel'>('manual');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      correct_answer: 'A',
      question_set_id: questionSets[0]?.id?.toString() ?? '',
    },
  });

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await questionService.create({
        question_set_id: data.question_set_id ? Number(data.question_set_id) : undefined,
        content: data.content,
        option_a: data.option_a,
        option_b: data.option_b,
        option_c: data.option_c,
        option_d: data.option_d,
        correct_answer: data.correct_answer,
      });
      reset();
      setOpen(false);
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      await questionService.import(formData);
      onSuccess();
      setOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'File không đúng định dạng hoặc lỗi server');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset(); }}>
      <DialogTrigger asChild><Button size="sm">Thêm câu hỏi</Button></DialogTrigger>
      <DialogContent className="max-w-xl rounded-md border">
        <DialogHeader><DialogTitle className="text-sm font-bold uppercase tracking-tight">Câu hỏi mới</DialogTitle></DialogHeader>

        <div className="flex gap-4 border-b text-[10px] font-bold uppercase tracking-widest">
          <button onClick={() => setMode('manual')} className={`pb-2 ${mode === 'manual' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}>Thủ công</button>
          <button onClick={() => setMode('excel')} className={`pb-2 ${mode === 'excel' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}>Nhập Excel</button>
        </div>

        <div className="pt-4">
          {mode === 'manual' ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-400 font-bold uppercase">Bộ đề</Label>
                <select
                  {...register('question_set_id')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Không gán bộ đề</option>
                  {questionSets.map((set) => (
                    <option key={set.id} value={set.id}>{set.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-400 font-bold uppercase">Nội dung câu hỏi</Label>
                <textarea {...register('content' as any)} rows={3} className="w-full border rounded-md p-2 text-xs focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['a', 'b', 'c', 'd'].map(opt => (
                  <Input key={opt} {...register(`option_${opt}` as any)} placeholder={`Đáp án ${opt.toUpperCase()}`} className="h-9 text-xs" />
                ))}
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-400 font-bold uppercase">Đáp án đúng</Label>
                <div className="flex gap-2">
                  {['A', 'B', 'C', 'D'].map(ans => (
                    <Button key={ans} type="button" variant={watch('correct_answer') === ans ? 'default' : 'outline'} size="sm" className="w-10 text-xs" onClick={() => setValue('correct_answer' as any, ans)}>{ans}</Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setOpen(false)}>Huỷ</Button>
                <Button size="sm" type="submit" className="text-xs px-6" disabled={submitting}>{submitting ? '...' : 'Lưu'}</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div
                onClick={() => !uploading && fileRef.current?.click()}
                className="p-12 border-2 border-dashed border-gray-100 rounded-md text-center cursor-pointer hover:bg-gray-50"
              >
                <input ref={fileRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileChange} />
                {uploading ? <Spinner /> : <p className="text-[10px] text-gray-400 font-bold uppercase">Chọn file Excel (.xlsx)</p>}
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <p className="text-[10px] text-gray-500 italic">Vui lòng sử dụng file mẫu để tránh lỗi.</p>
                <a href="/templates/import_questions_template.xlsx" download="Mau_Nhap_Cau_Hoi.xlsx" className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">
                  <Download className="w-3 h-3" /> TẢI FILE MẪU
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
