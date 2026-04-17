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
import type { Role } from '@/types/auth';

const schema = z.object({
  name:     z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  email:    z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  role:     z.enum(['TEACHER', 'STUDENT']),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STUDENT' },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    setError(''); setLoading(true);
    try { await authRegister(data); } 
    catch (e: any) { setError(e?.response?.data?.message ?? 'Đăng ký thất bại'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-sm border border-gray-200 rounded-md bg-white p-6">
      <h1 className="text-lg font-bold text-center mb-6 text-gray-900 uppercase tracking-tight">Tạo tài khoản</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-gray-400 uppercase">Vai trò</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['TEACHER', 'STUDENT'] as Role[]).map((r) => (
              <button key={r} type="button" onClick={() => setValue('role', r)}
                className={`py-1.5 rounded-md border text-xs font-bold transition-all ${role === r ? 'bg-primary text-white border-primary' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}>
                {r === 'TEACHER' ? 'Giáo viên' : 'Sinh viên'}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-gray-400 uppercase">Họ và tên</Label>
          <Input placeholder="Nguyễn Văn A" {...register('name')} />
          {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-gray-400 uppercase">Email</Label>
          <Input type="email" placeholder="email@example.com" {...register('email')} />
          {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-gray-400 uppercase">Mật khẩu</Label>
          <Input type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
        </div>
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? '...' : 'Tạo tài khoản'}</Button>
      </form>
      <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
        Đã có tài khoản? <Link href="/login" className="font-bold text-gray-900">Đăng nhập</Link>
      </div>
    </div>
  );
}
