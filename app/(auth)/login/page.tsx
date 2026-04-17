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

const schema = z.object({
  email:    z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(''); setLoading(true);
    try {
      await login(data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-center">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="example@email.com" {...register('email')} className="h-10" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} className="h-10" />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</p>}
          <Button type="submit" className="w-full h-10" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-gray-50 pt-4">
        <p className="text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-gray-900 font-semibold hover:underline underline-offset-4">
            Đăng ký ngay
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}