import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/api';
import type { QuestionSet } from '@/types/question-set';

export const questionSetService = {
  getAll: () => api.get<QuestionSet[]>(ENDPOINTS.QUESTION_SETS.BASE),
  getById: (id: number) => api.get<QuestionSet>(ENDPOINTS.QUESTION_SETS.BY_ID(id)),
  create: (data: { name: string }) => api.post<QuestionSet>(ENDPOINTS.QUESTION_SETS.BASE, data),
};