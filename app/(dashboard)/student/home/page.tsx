'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { classService } from '@/services/class.service';
import { formatDate } from '@/lib/utils';
import type { Class } from '@/types/class';

export default function StudentHomePage() {
  const [classes,    setClasses]    = useState<Class[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [open,       setOpen]       = useState(false);
  const [code,       setCode]       = useState('');
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    classService.getJoined()
      .then((r) => setClasses(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async () => {
    if (!code.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      await classService.join({ class_code: code.toUpperCase() });
      const r = await classService.getJoined();
      setClasses(r.data);
      setCode('');
      setOpen(false);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Mã lớp không hợp lệ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Lớp học của tôi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{classes.length} lớp</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); setError(''); }}>
          <DialogTrigger asChild>
            <Button size="sm">Tham gia lớp</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Tham gia lớp học</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Mã lớp</Label>
                <Input placeholder="VD: LTW001" value={code}
                  onChange={(e) => { setCode(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoin()} />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Huỷ</Button>
                <Button size="sm" onClick={handleJoin} disabled={submitting}>
                  {submitting ? 'Đang tham gia...' : 'Tham gia'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <Spinner /> : (
        <div className="grid gap-3">
          {classes.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-lg px-4 py-4 flex items-center justify-between hover:border-gray-300 transition-colors">
              <div>
                <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Tham gia: {formatDate(c.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{c.class_code}</span>
                <Link href={`/student/classes/${c.id}`}>
                  <Button variant="outline" size="sm" className="text-xs h-7">Vào lớp</Button>
                </Link>
              </div>
            </div>
          ))}
          {classes.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-12 text-center text-sm text-gray-400">
              Chưa có lớp nào. Nhấn "Tham gia lớp" và nhập mã từ giảng viên
            </div>
          )}
        </div>
      )}
    </div>
  );
}