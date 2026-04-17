'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { questionService } from '@/services/question.service';
import { Spinner } from '@/components/ui/spinner';

export function AddQuestionDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'manual' | 'excel'>('manual');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm({ 
    defaultValues: { correct_answer: 'A' } 
  });

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await questionService.create(data);
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
    } catch {
      alert('Lỗi import');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) reset(); }}>
      <DialogTrigger asChild><Button size="sm">Thêm câu hỏi</Button></DialogTrigger>
      <DialogContent className="max-w-xl rounded-md border">
        <DialogHeader><DialogTitle>Câu hỏi mới</DialogTitle></DialogHeader>
        <div className="flex gap-4 border-b text-sm">
          <button onClick={() => setMode('manual')} className={`pb-2 ${mode === 'manual' ? 'border-b-2 border-primary font-bold' : 'text-gray-400'}`}>Thủ công</button>
          <button onClick={() => setMode('excel')} className={`pb-2 ${mode === 'excel' ? 'border-b-2 border-primary font-bold' : 'text-gray-400'}`}>Excel</button>
        </div>
        <div className="pt-4">
          {mode === 'manual' ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label>Nội dung</Label>
                <textarea {...register('content')} rows={3} className="w-full border rounded-md p-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['a', 'b', 'c', 'd'].map(opt => (
                  <Input key={opt} {...register(`option_${opt}` as any)} placeholder={`Đáp án ${opt.toUpperCase()}`} className="h-9" />
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Đáp án đúng</Label>
                <div className="flex gap-2">
                  {['A', 'B', 'C', 'D'].map(ans => (
                    <Button key={ans} type="button" variant={watch('correct_answer') === ans ? 'default' : 'outline'} size="sm" className="w-10" onClick={() => setValue('correct_answer' as any, ans)}>{ans}</Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Huỷ</Button>
                <Button size="sm" type="submit" disabled={submitting}>{submitting ? '...' : 'Lưu'}</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div 
                onClick={() => !uploading && fileRef.current?.click()} 
                className="p-10 border-2 border-dashed rounded-md text-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input ref={fileRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileChange} />
                {uploading ? <Spinner /> : <p className="text-sm text-gray-500">Nhấn để chọn file Excel (.xlsx)</p>}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Đóng</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
