// File: quiz-frontend/app/(dashboard)/teacher/questions/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { questionService } from '@/services/question.service';
import type { Question } from '@/types/exam';
import { QuestionTable } from '@/components/teacher/QuestionTable';
import { AddQuestionDialog } from '@/components/teacher/AddQuestionDialog';
import { Search } from 'lucide-react';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const r = await questionService.getAll();
      setQuestions(r.data);
    } catch {
      // API may not be ready
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const filtered = questions.filter(q => 
    q.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">Ngân hàng câu hỏi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng cộng có <span className="font-semibold text-primary">{questions.length}</span> câu hỏi trong hệ thống
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Tìm kiếm nội dung..." 
              className="pl-10 w-full sm:w-64 h-10 rounded-xl border-gray-200 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <AddQuestionDialog onSuccess={fetchQuestions} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Spinner />
          <p className="text-sm text-gray-400 animate-pulse">Đang tải ngân hàng câu hỏi...</p>
        </div>
      ) : (
        <QuestionTable questions={filtered} onRefresh={fetchQuestions} />
      )}
    </div>
  );
}
