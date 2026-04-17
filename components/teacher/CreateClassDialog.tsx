'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { classService } from '@/services/class.service';

interface CreateClassDialogProps {
  onCreated: (newClass: any) => void;
}

export function CreateClassDialog({ onCreated }: CreateClassDialogProps) {
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
    } catch {
      alert('Tạo lớp thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="shadow-sm">Tạo lớp mới</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tạo lớp học mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="class-name" className="text-sm font-semibold text-gray-700">Tên lớp học</Label>
            <Input 
              id="class-name"
              placeholder="VD: Lập trình Web" 
              value={name}
              className="focus-visible:ring-primary/20"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()} 
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-gray-500">
              Huỷ
            </Button>
            <Button 
              size="sm" 
              onClick={handleCreate} 
              disabled={submitting || !name.trim()}
              className="px-6"
            >
              {submitting ? 'Đang tạo...' : 'Tạo lớp'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
