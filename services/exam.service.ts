import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/api';
import type { Exam } from '@/types/exam';

export const examService = {
  getAll:  ()                          => api.get<Exam[]>(ENDPOINTS.EXAMS.BASE),
  create:  (data: Partial<Exam>)       => api.post<Exam>(ENDPOINTS.EXAMS.BASE, data),
  getById: (id: number)                => api.get<Exam>(ENDPOINTS.EXAMS.BY_ID(id)),
  update:  (id: number, data: Partial<Exam>) => api.put<Exam>(ENDPOINTS.EXAMS.BY_ID(id), data),
  remove:  (id: number)                => api.delete(ENDPOINTS.EXAMS.BY_ID(id)),
};