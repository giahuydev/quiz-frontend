export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
export const WS_URL  = process.env.NEXT_PUBLIC_WS_URL  ?? 'http://localhost:3001';

export const ENDPOINTS = {
  AUTH: {
    LOGIN:    '/auth/login',
    REGISTER: '/auth/register',
    ME:       '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  QUESTION_SETS: {
    BASE: '/question-sets',
    BY_ID: (id: number) => `/question-sets/${id}`,
  },
  CLASSES: {
    BASE:          '/classes',
    JOINED:        '/classes/joined',
    JOIN:          '/classes/join',
    BY_ID:         (id: number) => `/classes/${id}`,
    MEMBERS:       (id: number) => `/classes/${id}/members`,
    MEMBER:        (id: number, sid: number) => `/classes/${id}/members/${sid}`,
    ANNOUNCEMENTS: (id: number) => `/classes/${id}/announcements`,
  },
  QUESTIONS: {
    BASE:   '/questions',
    BY_ID:  (id: number) => `/questions/${id}`,
    IMPORT: '/questions/import',
  },
  EXAMS: {
    BASE:  '/exams',
    BY_ID: (id: number) => `/exams/${id}`,
  },
  SESSIONS: {
    BASE:          '/sessions',
    JOIN:          '/sessions/join',
    BY_ID:         (id: number) => `/sessions/${id}`,
    WAITING:       (id: number) => `/sessions/${id}/waiting`,
    START_ATTEMPT: (id: number) => `/sessions/${id}/start-attempt`,
    RESULTS:       (id: number) => `/sessions/${id}/results`,
  },
  RESULTS: {
    BY_ID:  (id: number) => `/results/${id}`,
    SUBMIT: (id: number) => `/results/${id}/submit`,
    REVIEW: (id: number) => `/results/${id}/review`,
  },
};