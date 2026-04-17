import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/api';
import type { Question } from '@/types/exam';

export const questionService = {
  getAll: ()                                         => api.get<Question[]>(ENDPOINTS.QUESTIONS.BASE),
  create: (data: Omit<Question, 'id' | 'created_at'>) => api.post<Question>(ENDPOINTS.QUESTIONS.BASE, data),
  update: (id: number, data: Partial<Question>)      => api.put<Question>(ENDPOINTS.QUESTIONS.BY_ID(id), data),
  remove: (id: number)                               => api.delete(ENDPOINTS.QUESTIONS.BY_ID(id)),
  import: (file: FormData)                           => api.post(ENDPOINTS.QUESTIONS.IMPORT, file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};