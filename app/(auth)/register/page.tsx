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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STUDENT' },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    setError(''); setLoading(true);
    try {
      await authRegister(data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-4"><CardTitle className="text-lg font-semibold">Tạo tài khoản</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Vai trò</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['TEACHER', 'STUDENT'] as Role[]).map((r) => (
                <button key={r} type="button" onClick={() => setValue('role', r)}
                  className={['py-2.5 px-3 rounded border text-sm font-medium transition-colors', role === r ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'].join(' ')}>
                  {r === 'TEACHER' ? 'Giảng viên' : 'Sinh viên'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Họ và tên</Label>
            <Input id="name" placeholder="Nguyễn Văn A" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="example@email.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" type="password" placeholder="Tối thiểu 6 ký tự" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}</Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center pt-0">
        <p className="text-sm text-gray-500">Đã có tài khoản? <Link href="/login" className="text-gray-900 font-medium underline underline-offset-2">Đăng nhập</Link></p>
      </CardFooter>
    </Card>
  );
}