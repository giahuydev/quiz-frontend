export interface Question {
  id:             number;
  teacher_id?:    number;
  question_set_id?: number | null;
  content:        string;
  option_a:       string;
  option_b:       string;
  option_c:       string;
  option_d:       string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  created_at:     string;
}

export interface Exam {
  id:                number;
  teacher_id?:       number;
  question_set_id?:  number | null;
  title:             string;
  duration_minutes:  number;
  shuffle_questions: boolean;
  shuffle_options:   boolean;
  status:            'DRAFT' | 'PUBLISHED';
  created_at:        string;
  questions?:        Question[];
}

export interface ExamSession {
  id:                 number;
  exam_id:            number;
  class_id:           number;
  access_code:        string;
  mode:               'LIVE' | 'ASSIGNED';
  waiting_start_time: string;
  start_time:         string;
  end_time:           string;
  created_at:         string;
  exam?:              Exam;
  duration_minutes?:  number | null;
}

export interface ShuffledQuestion {
  id:      number;
  content: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
}
