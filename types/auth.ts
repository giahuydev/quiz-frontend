// File: quiz-frontend/types/auth.ts
export type Role = 'TEACHER' | 'STUDENT';

export interface User {
  id:    number;
  name:  string;
  email: string;
  role:  Role;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface RegisterPayload {
  name:     string;
  email:    string;
  password: string;
  role:     Role;
}

export interface AuthResponse {
  access_token: string;
  user:         User;
}