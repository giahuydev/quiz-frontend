// File: quiz-frontend/lib/auth.ts
const TOKEN_KEY = 'quiz_token';

export interface TokenPayload {
  sub:   number;
  email: string;
  role:  'TEACHER' | 'STUDENT';
  exp:   number;
}

export const saveToken   = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const getToken    = ()          => localStorage.getItem(TOKEN_KEY);
export const removeToken = ()          => localStorage.removeItem(TOKEN_KEY);

export function decodeToken(token: string): TokenPayload | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const p = decodeToken(token);
  return !p || Date.now() >= p.exp * 1000;
}