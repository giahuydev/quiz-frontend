import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/api';
import type { ExamSession } from '@/types/exam';

export const sessionService = {
  getAll:       ()                                    => api.get<ExamSession[]>(ENDPOINTS.SESSIONS.BASE),
  create:       (data: Partial<ExamSession>)          => api.post<ExamSession>(ENDPOINTS.SESSIONS.BASE, data),
  getById:      (id: number)                          => api.get<ExamSession>(ENDPOINTS.SESSIONS.BY_ID(id)),
  join:         (data: { access_code: string })       => api.post(ENDPOINTS.SESSIONS.JOIN, data),
  getWaiting:   (id: number)                          => api.get(ENDPOINTS.SESSIONS.WAITING(id)),
  startAttempt: (id: number)                          => api.post(ENDPOINTS.SESSIONS.START_ATTEMPT(id)),
  getResults:   (id: number)                          => api.get(ENDPOINTS.SESSIONS.RESULTS(id)),
};