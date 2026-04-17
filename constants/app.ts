export const APP_NAME = 'Quiz Online';

export const ROLE = {
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const;

export const EXAM_STATUS = {
  DRAFT:     'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export const RESULT_STATUS = {
  IN_PROGRESS:  'IN_PROGRESS',
  SUBMITTED:    'SUBMITTED',
  TIMEOUT:      'TIMEOUT',
  DISCONNECTED: 'DISCONNECTED',
} as const;

export const MAX_DISCONNECT_SECONDS = 120;