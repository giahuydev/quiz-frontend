'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { FileText, UploadCloud } from 'lucide-react';

const mockQuestions = [
  { id: 1, content: 'HTML là viết tắt của?', correct_answer: 'A' },
  { id: 2, content: 'CSS dùng để làm gì?', correct_answer: 'B' },
  { id: 3, content: 'JavaScript là ngôn ngữ gì?', correct_answer: 'C' },
];

export default function NewExamPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'manual' | 'excel'>('manual');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('60');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [excelPreview, setExcelPreview] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setExcelPreview([{ id: 10, content: '[Excel] Câu hỏi từ file ' + file.name, correct_answer: 'A' }]);
      setUploading(false);
    }, 1000);
  };

  const handleCreate = () => {
    if (!title.trim()) return alert('Vui lòng nhập tên đề thi');
    const count = mode === 'manual' ? selected.length : excelPreview.length;
    if (count === 0) return alert('Vui lòng chọn hoặc upload câu hỏi');
    
    alert(`Tạo đề thi "${title}" thành công với ${count} câu hỏi!\n- Xáo trộn câu hỏi: ${shuffleQuestions ? 'Có' : 'Không'}\n- Xáo trộn đáp án: ${shuffleOptions ? 'Có' : 'Không'}`);
    router.push('/teacher/exams');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Tạo đề thi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Điền thông tin và chọn câu hỏi</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
        <div className="space-y-1.5"><Label>Tên đề thi</Label><Input placeholder="VD: Kiểm tra giữa kỳ" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="space-y-1.5"><Label>Thời gian làm bài (phút)</Label><Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-32" /></div>
        
        <div className="space-y-2 pt-2 border-t border-gray-50">
          <Label>Cấu hình</Label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
              <span className="text-sm text-gray-700">Xáo trộn thứ tự câu hỏi</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={shuffleOptions} onChange={(e) => setShuffleOptions(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
              <span className="text-sm text-gray-700">Xáo trộn thứ tự đáp án</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
        <div className="flex gap-4 border-b border-gray-200">
          {['manual', 'excel'].map((m) => (
            <button key={m} onClick={() => setMode(m as any)} className={['pb-2 text-sm border-b-2 -mb-px', mode === m ? 'border-gray-900 text-gray-900 font-medium' : 'border-transparent text-gray-500'].join(' ')}>
              {m === 'manual' ? 'Chọn từ ngân hàng' : 'Import từ Excel'}
            </button>
          ))}
        </div>

        {mode === 'manual' ? (
          <div className="space-y-2">
            {mockQuestions.map((q, i) => (
              <label key={q.id} className={['flex items-center gap-3 p-3 rounded-lg border cursor-pointer', selected.includes(q.id) ? 'border-gray-900 bg-gray-50' : 'border-gray-200'].join(' ')}>
                <input type="checkbox" checked={selected.includes(q.id)} onChange={() => setSelected(s => s.includes(q.id) ? s.filter(id => id !== q.id) : [...s, q.id])} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-900 flex-1">{i + 1}. {q.content}</span>
                <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{q.correct_answer}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
              <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
              {uploading ? <Spinner /> : (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">Nhấn để upload file Excel</p>
                </div>
              )}
            </div>
            {excelPreview.map((q, i) => (
              <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                <span className="text-sm text-gray-900 flex-1">{i + 1}. {q.content}</span>
                <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{q.correct_answer}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push('/teacher/exams')}>Huỷ</Button>
        <Button onClick={handleCreate}>Tạo đề thi</Button>
      </div>
    </div>
  );
}