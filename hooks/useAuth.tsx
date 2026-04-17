'use client';

import {
  createContext, useContext, useEffect,
  useState, useCallback, type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { saveToken, getToken, removeToken } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import type { User, LoginPayload, RegisterPayload } from '@/types/auth';

interface AuthCtx {
  user:     User | null;
  loading:  boolean;
  login:    (p: LoginPayload)    => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout:   () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    authService.me()
      .then((r) => setUser(r.data))
      .catch(() => removeToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (p: LoginPayload) => {
    const r = await authService.login(p);
    saveToken(r.data.access_token);
    setUser(r.data.user);
    router.push(r.data.user.role === 'TEACHER' ? '/teacher/dashboard' : '/student/home');
  }, [router]);

  const register = useCallback(async (p: RegisterPayload) => {
    const r = await authService.register(p);
    saveToken(r.data.access_token);
    setUser(r.data.user);
    router.push(r.data.user.role === 'TEACHER' ? '/teacher/dashboard' : '/student/home');
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

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}