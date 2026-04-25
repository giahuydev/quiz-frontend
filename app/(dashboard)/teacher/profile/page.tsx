// File: quiz-frontend/app/(dashboard)/teacher/profile/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  current_password: z.string().min(6, 'Tối thiểu 6 ký tự'),
  new_password: z.string().min(6, 'Tối thiểu 6 ký tự'),
  confirm_password: z.string().min(6, 'Tối thiểu 6 ký tự'),
}).refine(d => d.new_password === d.confirm_password, { message: 'Không khớp', path: ['confirm_password'] });

export default function ProfilePage() {
  const { user } = useAuth();
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    setMsg({ type: '', text: '' }); setLoading(true);
    try {
      await authService.changePassword({
        current_password: data.current_password,
        new_password:     data.new_password,
    });
      setMsg({ type: 's', text: 'Thành công' }); reset();
    } catch (e: any) {
      setMsg({ type: 'e', text: e?.response?.data?.message || 'Lỗi' });
    } finally { setLoading(false); }
  };

  const Label = ({ children }: { children: React.ReactNode }) => <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">{children}</p>;

  return (
    <div className="max-w-md space-y-6">
      <div className="p-4 border border-gray-100 rounded-md bg-white">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4">Hồ sơ giảng viên</h2>
        <div className="grid grid-cols-2 gap-4">
          {[['Họ tên', user?.name], ['Email', user?.email], ['Vai trò', 'Giảng viên']].map(([l, v]) => (
            <div key={l}><Label>{l}</Label><p className="text-xs font-bold text-gray-900">{v}</p></div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 border border-gray-100 rounded-md bg-white space-y-3">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4">Đổi mật khẩu</h2>
        {[
          { n: 'current_password', l: 'Mật khẩu cũ', p: '••••••••' },
          { n: 'new_password', l: 'Mật khẩu mới', p: 'Tối thiểu 6 ký tự' },
          { n: 'confirm_password', l: 'Xác nhận', p: 'Nhập lại mật khẩu' }
        ].map(f => (
          <div key={f.n}>
            <Label>{f.l}</Label>
            <Input type="password" placeholder={f.p} {...register(f.n as any)} className="h-8 text-xs" />
            {errors[f.n as keyof typeof errors] && <p className="text-[10px] text-red-500 mt-0.5">{(errors as any)[f.n].message}</p>}
          </div>
        ))}
        {msg.text && <p className={`text-[10px] p-2 rounded border ${msg.type === 's' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-500'}`}>{msg.text}</p>}
        <Button size="sm" className="w-full text-[10px] font-bold uppercase h-8" disabled={loading}>{loading ? '...' : 'Cập nhật'}</Button>
      </form>
    </div>
  );
}
