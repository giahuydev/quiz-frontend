// File: quiz-frontend/types/class.ts
export interface Class {
  id:         number;
  name:       string;
  class_code: string;
  teacher_id: number;
  created_at: string;
}

export interface ClassMember {
  student_id: number;
  name:       string;
  email:      string;
  joined_at:  string;
}

export interface Announcement {
  id:         number;
  class_id:   number;
  teacher_id: number;
  title:      string;
  content:    string;
  created_at: string;
}