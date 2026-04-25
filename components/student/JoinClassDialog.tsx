// File: quiz-frontend/components/student/JoinClassDialog.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { classService } from '@/services/class.service';

export function JoinClassDialog({ onJoined }: { onJoined: () => void }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) return;
    setSubmitting(true);
    try {
      await classService.join({ class_code: code.toUpperCase() });
      setOpen(false);
      onJoined();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Mã lỗi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Tham gia lớp</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs rounded-md">
        <DialogHeader><DialogTitle>Tham gia lớp học</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>Mã lớp</Label>
            <Input placeholder="Nhập mã..." value={code} className="uppercase font-mono" onChange={(e) => setCode(e.target.value)} />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button size="sm" onClick={handleJoin} disabled={submitting}>{submitting ? '...' : 'Tham gia'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
