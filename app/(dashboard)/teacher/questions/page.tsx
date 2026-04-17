'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { questionService } from '@/services/question.service';
import { formatDate } from '@/lib/utils';
import { UploadCloud, AlertCircle } from 'lucide-react';
import type { Question } from '@/types/exam';

// 1. Định nghĩa Zod Schema cho Validation
const questionSchema = z.object({
  content: z.string().min(5, 'Nội dung câu hỏi phải có ít nhất 5 ký tự'),
  option_a: z.string().min(1, 'Vui lòng nhập đáp án A'),
  option_b: z.string().min(1, 'Vui lòng nhập đáp án B'),
  option_c: z.string().min(1, 'Vui lòng nhập đáp án C'),
  option_d: z.string().min(1, 'Vui lòng nhập đáp án D'),
  correct_answer: z.enum(['A', 'B', 'C', 'D']),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [open,      setOpen]      = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<'manual' | 'excel'>('manual');

  // 2. Sử dụng React Hook Form
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    watch,
    formState: { errors } 
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: { correct_answer: 'A' }
  });

  const selectedAnswer = watch('correct_answer');

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    setLoading(true);
    questionService.getAll()
      .then((r) => setQuestions(r.data))
      .catch(() => {}) // Im lặng khi API chưa sẵn sàng
      .finally(() => setLoading(false));
  };

  const onSubmit = async (data: QuestionFormData) => {
    setSubmitting(true);
    try {
      const r = await questionService.create(data);
      setQuestions([r.data, ...questions]);
      reset(); // Xoá sạch form sau khi thành công
      setOpen(false);
      alert('Tạo câu hỏi thành công!');
    } catch {
      alert('Tạo câu hỏi thất bại (Vui lòng kiểm tra API)');
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
      // 3. Gọi trực tiếp API thay vì dùng setTimeout giả lập
      await questionService.import(formData);
      alert('Import thành công!');
      fetchQuestions();
      setOpen(false);
    } catch (err) {
      alert('Import thất bại (API Import chưa sẵn sàng)');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const filtered = questions.filter(q => 
    q.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Ngân hàng câu hỏi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{questions.length} câu hỏi</p>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Tìm kiếm..." 
            className="w-48 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) reset(); }}>
            <DialogTrigger asChild>
              <Button size="sm">Thêm câu hỏi</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm câu hỏi mới</DialogTitle>
              </DialogHeader>

              <div className="flex gap-4 border-b border-gray-200 mt-2">
                {['manual', 'excel'].map((m) => (
                  <button 
                    key={m} 
                    onClick={() => setMode(m as any)} 
                    className={[
                      'pb-2 text-sm border-b-2 -mb-px transition-colors', 
                      mode === m ? 'border-gray-900 text-gray-900 font-medium' : 'border-transparent text-gray-500'
                    ].join(' ')}
                  >
                    {m === 'manual' ? 'Nhập thủ công' : 'Import Excel'}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                {mode === 'manual' ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className={errors.content ? 'text-red-500' : ''}>Nội dung câu hỏi</Label>
                      <textarea 
                        rows={3} 
                        {...register('content')}
                        className={[
                          "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1",
                          errors.content ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-ring"
                        ].join(' ')} 
                        placeholder="Nhập câu hỏi..."
                      />
                      {errors.content && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.content.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {(['a', 'b', 'c', 'd'] as const).map(opt => (
                        <div key={opt} className="space-y-1.5">
                          <Label className={errors[`option_${opt}`] ? 'text-red-500' : ''}>Lựa chọn {opt.toUpperCase()}</Label>
                          <Input 
                            type="text"
                            {...register(`option_${opt}`)}
                            placeholder={`Nhập đáp án (chữ hoặc số)...`}
                            className={errors[`option_${opt}`] ? "border-red-500 focus-visible:ring-red-500" : ""}
                          />
                          {errors[`option_${opt}`] && (
                            <p className="text-[11px] text-red-500">{errors[`option_${opt}`]?.message}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Đáp án đúng</Label>
                      <div className="flex gap-2">
                        {(['A', 'B', 'C', 'D'] as const).map(ans => (
                          <Button
                            key={ans}
                            type="button"
                            variant={selectedAnswer === ans ? 'default' : 'outline'}
                            className="w-12 h-10"
                            onClick={() => setValue('correct_answer', ans)}
                          >
                            {ans}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Huỷ</Button>
                      <Button size="sm" type="submit" disabled={submitting}>
                        {submitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
                        {submitting ? 'Đang lưu...' : 'Lưu câu hỏi'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div 
                      onClick={() => !uploading && fileRef.current?.click()} 
                      className={[
                        "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-gray-400 transition-colors",
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      ].join(' ')}
                    >
                      <input ref={fileRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileChange} />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                          <Spinner className="h-8 w-8" />
                          <p className="text-sm text-gray-600">Đang tải lên và xử lý...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud className="w-10 h-10 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">Nhấn để upload file Excel</p>
                          <p className="text-xs text-gray-500">Hỗ trợ định dạng .xlsx, .xls</p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Đóng</Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 font-medium text-gray-500">Nội dung</th>
                  <th className="px-4 py-3 font-medium text-gray-500 w-24">Đáp án</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Ngày tạo</th>
                  <th className="px-4 py-3 font-medium text-gray-500 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="max-w-md">
                        <p className="text-gray-900 font-medium line-clamp-2">{q.content}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                          <span>A: {q.option_a}</span>
                          <span>B: {q.option_b}</span>
                          <span>C: {q.option_c}</span>
                          <span>D: {q.option_d}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-green-50 text-green-700 rounded-full font-bold text-xs border border-green-100">
                        {q.correct_answer}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(q.created_at)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Edit</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-400">
                      Không tìm thấy câu hỏi nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}