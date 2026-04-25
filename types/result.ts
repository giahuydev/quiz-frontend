// File: quiz-frontend/types/result.ts
export interface ExamResult {
  id:                    number;
  session_id:            number;
  student_id:            number;
  score:                 number | null;
  tab_switch_count:      number;
  fullscreen_exit_count: number;
  disconnected_count:    number;
  started_at:            string;
  submitted_at:          string | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'TIMEOUT' | 'DISCONNECTED';
}

export interface ReviewItem {
  question_id:    number;
  content:        string;
  chosen_answer:  'A' | 'B' | 'C' | 'D' | null;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  is_correct:     boolean;
  options:        { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
}

export interface SubmitPayload {
  answers: { question_id: number; chosen_answer: 'A' | 'B' | 'C' | 'D' | null }[];
}