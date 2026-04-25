// File: quiz-frontend/hooks/useAuth.tsx
'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { saveToken, getToken, removeToken } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import type { User, LoginPayload, RegisterPayload } from '@/types/auth';

interface AuthContextType {
  user:     User | null;
  loading:  boolean;
  login:    (data: LoginPayload)    => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout:   () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken(); // dùng lib/auth.ts — key 'quiz_token'
    if (!token) {
      setLoading(false);
      return;
    }

    authService.me()
      .then((res) => setUser(res.data))
      .catch(() => removeToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (data: LoginPayload) => {
    const res = await authService.login(data);
    saveToken(res.data.access_token); // lưu vào key 'quiz_token'
    setUser(res.data.user);
    router.push(res.data.user.role === 'TEACHER' ? '/teacher/dashboard' : '/student/home');
  }, [router]);

  const register = useCallback(async (data: RegisterPayload) => {
    const res = await authService.register(data);
    saveToken(res.data.access_token);
    setUser(res.data.user);
    router.push(res.data.user.role === 'TEACHER' ? '/teacher/dashboard' : '/student/home');
  }, [router]);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}