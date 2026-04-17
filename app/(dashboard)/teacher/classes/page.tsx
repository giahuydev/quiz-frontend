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

export default function ClassesPage() {
  const [classes,  setClasses]  = useState<Class[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [open,     setOpen]     = useState(false);
  const [name,     setName]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    classService.getAll()
      .then((r) => setClasses(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const r = await classService.create({ name });
      setClasses([...classes, r.data]);
      setName('');
      setOpen(false);
    } catch {
      alert('Tạo lớp thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Lớp học</h1>
          <p className="text-sm text-gray-500 mt-0.5">{classes.length} lớp</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Tạo lớp mới</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Tạo lớp học</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Tên lớp</Label>
                <Input placeholder="VD: Lập trình Web" value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Huỷ</Button>
                <Button size="sm" onClick={handleCreate} disabled={submitting}>
                  {submitting ? 'Đang tạo...' : 'Tạo'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Tên lớp', 'Mã lớp', 'Ngày tạo', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{c.class_code}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(c.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/teacher/classes/${c.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs h-7">Xem</Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">Chưa có lớp học nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}