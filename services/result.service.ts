// File: quiz-frontend/services/result.service.ts
import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/api';
import type { SubmitPayload } from '@/types/result';

export const resultService = {
  getById: (id: number)                    => api.get(ENDPOINTS.RESULTS.BY_ID(id)),
  submit:  (id: number, data: SubmitPayload) => api.post(ENDPOINTS.RESULTS.SUBMIT(id), data),
  review:  (id: number)                    => api.get(ENDPOINTS.RESULTS.REVIEW(id)),
};