// File: quiz-frontend/components/teacher/CreateClassDialog.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { classService } from '@/services/class.service';

export function CreateClassDialog({ onCreated }: { onCreated: (c: any) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const r = await classService.create({ name });
      onCreated(r.data);
      setName('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm">Tạo lớp mới</Button></DialogTrigger>
      <DialogContent className="max-w-xs rounded-md">
        <DialogHeader><DialogTitle>Tạo lớp học</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>Tên lớp</Label>
            <Input placeholder="..." value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button size="sm" onClick={handleCreate} disabled={submitting}>Tạo</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
