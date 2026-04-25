// File: quiz-frontend/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';

const schema = z.object({
  email:    z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(''); setLoading(true);
    try { await login(data); } 
    catch (e: any) { setError(e?.response?.data?.message ?? 'Lỗi đăng nhập'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-sm border border-gray-200 rounded-md bg-white p-6">
      <h1 className="text-lg font-bold text-center mb-6 text-gray-900">Đăng nhập</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label>Email</Label>
          <Input type="email" placeholder="email@example.com" {...register('email')} />
          {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Mật khẩu</Label>
          <Input type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
        </div>
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? '...' : 'Đăng nhập'}</Button>
      </form>
      <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
        Chưa có tài khoản? <Link href="/register" className="font-bold text-gray-900">Đăng ký</Link>
      </div>
    </div>
  );
}
