'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { questionService } from '@/services/question.service';
import { UploadCloud, AlertCircle } from 'lucide-react';

const questionSchema = z.object({
  content: z.string().min(5, 'Nội dung câu hỏi phải có ít nhất 5 ký tự'),
  option_a: z.string().min(1, 'Vui lòng nhập đáp án A'),
  option_b: z.string().min(1, 'Vui lòng nhập đáp án B'),
  option_c: z.string().min(1, 'Vui lòng nhập đáp án C'),
  option_d: z.string().min(1, 'Vui lòng nhập đáp án D'),
  correct_answer: z.enum(['A', 'B', 'C', 'D']),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface AddQuestionDialogProps {
  onSuccess: () => void;
}

export function AddQuestionDialog({ onSuccess }: AddQuestionDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'manual' | 'excel'>('manual');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: { correct_answer: 'A' }
  });

  const selectedAnswer = watch('correct_answer');

  const onSubmit = async (data: QuestionFormData) => {
    setSubmitting(true);
    try {
      await questionService.create(data);
      reset();
      setOpen(false);
      onSuccess();
    } catch {
      alert('Tạo câu hỏi thất bại');
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
    } catch {
      alert('Import thất bại');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="shadow-sm">Thêm câu hỏi mới</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Quản lý câu hỏi</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 border-b border-gray-100 mt-2">
          {['manual', 'excel'].map((m) => (
            <button 
              key={m} 
              onClick={() => setMode(m as any)} 
              className={[
                'pb-3 text-sm font-semibold transition-all border-b-2 -mb-px', 
                mode === m ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
              ].join(' ')}
            >
              {m === 'manual' ? 'Nhập thủ công' : 'Import từ Excel'}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {mode === 'manual' ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label className={errors.content ? 'text-red-500 font-bold' : 'font-semibold'}>Nội dung câu hỏi</Label>
                <textarea 
                  rows={3} 
                  {...register('content')}
                  className={[
                    "w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all",
                    errors.content ? "border-red-300 focus:ring-red-100 bg-red-50/30" : "border-gray-200 focus:ring-primary/20 focus:border-primary"
                  ].join(' ')} 
                  placeholder="Ví dụ: Thủ đô của Việt Nam là gì?"
                />
                {errors.content && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium"><AlertCircle className="w-3 h-3"/> {errors.content.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(['a', 'b', 'c', 'd'] as const).map(opt => (
                  <div key={opt} className="space-y-2">
                    <Label className={errors[`option_${opt}`] ? 'text-red-500 font-bold' : 'font-semibold text-gray-600'}>
                      Lựa chọn {opt.toUpperCase()}
                    </Label>
                    <Input 
                      {...register(`option_${opt}`)}
                      placeholder={`Đáp án ${opt.toUpperCase()}...`}
                      className={[
                        "rounded-lg h-10 focus-visible:ring-primary/20",
                        errors[`option_${opt}`] ? "border-red-300 bg-red-50/30" : "border-gray-200"
                      ].join(' ')}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-gray-700 text-sm">Đáp án đúng nhất</Label>
                <div className="flex gap-3">
                  {(['A', 'B', 'C', 'D'] as const).map(ans => (
                    <Button
                      key={ans}
                      type="button"
                      variant={selectedAnswer === ans ? 'default' : 'outline'}
                      className={[
                        "w-14 h-11 text-base font-bold transition-all shadow-sm",
                        selectedAnswer === ans ? "" : "text-gray-500 border-gray-200"
                      ].join(' ')}
                      onClick={() => setValue('correct_answer', ans)}
                    >
                      {ans}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-gray-500 font-medium">Huỷ bỏ</Button>
                <Button size="sm" type="submit" disabled={submitting} className="px-8">
                  {submitting ? <Spinner className="mr-2 h-4 w-4 text-white" /> : null}
                  {submitting ? 'Đang lưu...' : 'Lưu câu hỏi'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div 
                onClick={() => !uploading && fileRef.current?.click()} 
                className={[
                  "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
                  uploading ? "bg-gray-50 opacity-50 cursor-not-allowed" : "hover:bg-gray-50 hover:border-gray-400 border-gray-200"
                ].join(' ')}
              >
                <input ref={fileRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileChange} />
                {uploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-10 w-10 text-primary" />
                    <p className="text-sm font-semibold text-gray-600">Đang phân tích dữ liệu Excel...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                      <UploadCloud className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-base font-bold text-gray-900">Nhấn để tải file lên</p>
                    <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">Hỗ trợ các định dạng .xlsx, .xls theo mẫu quy định</p>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <p className="text-[11px] text-gray-500 italic">Mẹo: Bạn có thể tải file mẫu Excel tại đây</p>
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-gray-500 font-medium">Đóng</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
