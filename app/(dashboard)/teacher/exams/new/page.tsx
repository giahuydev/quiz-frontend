'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { examService } from '@/services/exam.service';
import { questionService } from '@/services/question.service';
import { questionSetService } from '@/services/question-set.service';
import { Download } from 'lucide-react';
import type { Question, Exam } from '@/types/exam';
import type { QuestionSet } from '@/types/question-set';

export default function NewExamPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [mode, setMode] = useState<'manual' | 'excel'>('manual');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('60');
  const [selectedSetId, setSelectedSetId] = useState('');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  const [selected, setSelected] = useState<number[]>([]);
  const [excelPreview, setExcelPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const [qRes, sRes] = await Promise.all([
        questionService.getAll(),
        questionSetService.getAll(),
      ]);
      setQuestions(qRes.data);
      setQuestionSets(sRes.data);
      if (!selectedSetId && sRes.data.length > 0) {
        setSelectedSetId(String(sRes.data[0].id));
      }
    } catch {
      // API not ready
    } finally {
      setFetching(false);
    }
  }, [selectedSetId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredQuestions = useMemo(() => {
    if (!selectedSetId) return [];
    return questions.filter((q) => q.question_set_id === Number(selectedSetId));
  }, [questions, selectedSetId]);

  useEffect(() => {
    setSelected([]);
  }, [selectedSetId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const r = await questionService.import(formData);
      setExcelPreview(Array.isArray(r.data) ? r.data : []);
    } catch {
      alert('Lỗi import');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert('Nhập tên đề');
    if (!selectedSetId) return alert('Chọn bộ đề');

    const question_ids = mode === 'manual' ? selected : excelPreview.map((q) => q.id);
    if (question_ids.length === 0) return alert('Chọn ít nhất 1 câu hỏi');

    setLoading(true);
    try {
      const payload = {
        question_set_id: Number(selectedSetId),
        title,
        duration_minutes: parseInt(duration, 10),
        shuffle_questions: shuffleQuestions,
        shuffle_options: shuffleOptions,
        question_ids,
      };
      await examService.create(payload as Partial<Exam>);
      router.push('/teacher/exams');
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Lỗi khi lưu đề thi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl pb-10">
      <div className="border-b pb-4">
        <h1 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Tạo đề thi mới</h1>
      </div>

      <div className="border border-gray-100 rounded-md p-4 space-y-4 bg-white">
        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase text-gray-400">Thông tin chung</Label>
          <Input placeholder="Tên đề thi..." value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] text-gray-400 uppercase">Bộ đề</Label>
          <select
            value={selectedSetId}
            onChange={(e) => setSelectedSetId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">-- Chọn bộ đề --</option>
            {questionSets.map((set) => (
              <option key={set.id} value={set.id}>{set.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] text-gray-400 uppercase">Thời gian (phút)</Label>
          <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>

        <div className="pt-2 space-y-2 border-t border-gray-50">
          <Label className="text-[10px] font-bold uppercase text-gray-400">Tùy chọn</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} className="w-3.5 h-3.5 border-gray-300 rounded text-primary" />
              <span className="text-[11px] text-gray-600">Xáo trộn câu hỏi</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={shuffleOptions} onChange={(e) => setShuffleOptions(e.target.checked)} className="w-3.5 h-3.5 border-gray-300 rounded text-primary" />
              <span className="text-[11px] text-gray-600">Xáo trộn đáp án</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border border-gray-100 rounded-md p-4 space-y-4 bg-white">
        <div className="flex gap-4 border-b text-[10px] font-bold uppercase tracking-widest">
          {['manual', 'excel'].map((m) => (
            <button key={m} onClick={() => setMode(m as any)} className={`pb-2 ${mode === m ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}>
              {m === 'manual' ? 'Ngân hàng' : 'Excel'}
            </button>
          ))}
        </div>

        {mode === 'manual' ? (
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {fetching ? <div className="py-4 text-center"><Spinner /></div> : (
              filteredQuestions.length === 0 ? <p className="text-[10px] text-gray-400 p-2 italic text-center">Không có câu hỏi trong bộ đề đã chọn</p> :
                filteredQuestions.map((q) => (
                  <label key={q.id} className="flex items-center gap-3 p-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 cursor-pointer">
                    <input type="checkbox" checked={selected.includes(q.id)} onChange={() => setSelected(s => s.includes(q.id) ? s.filter(id => id !== q.id) : [...s, q.id])} className="w-3.5 h-3.5 border-gray-300" />
                    <span className="text-[11px] text-gray-600 truncate">{q.content}</span>
                  </label>
                ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div onClick={() => !uploading && fileRef.current?.click()} className="border border-dashed border-gray-100 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <input ref={fileRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileChange} />
              {uploading ? <Spinner /> : <p className="text-[10px] text-gray-400 font-bold uppercase">Nhấn để chọn file Excel</p>}
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
              <p className="text-[10px] text-gray-500 italic">Dùng file mẫu để tránh lỗi cấu hình.</p>
              <a href="/templates/import_questions_template.xlsx" download="Mau_Nhap_De_Thi.xlsx" className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">
                <Download className="w-3 h-3" /> TẢI FILE MẪU
              </a>
            </div>

            {excelPreview.length > 0 && (
              <div className="text-[10px] text-gray-400 font-mono bg-gray-50 p-2 border rounded">
                Đã nhận {excelPreview.length} câu hỏi từ file.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/teacher/exams')}>Huỷ bỏ</Button>
        <Button size="sm" className="flex-1" onClick={handleSave} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu đề thi'}</Button>
      </div>
    </div>
  );
}
