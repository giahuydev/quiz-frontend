'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { classService } from '@/services/class.service';

interface JoinClassDialogProps {
  onJoined: () => void;
}

export function JoinClassDialog({ onJoined }: JoinClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      await classService.join({ class_code: code.toUpperCase() });
      setCode('');
      setOpen(false);
      onJoined();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Mã lớp không hợp lệ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); setError(''); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="shadow-sm">
          Tham gia lớp học
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Tham gia lớp mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="class-code" className="text-sm font-semibold text-gray-700">Mã lớp học</Label>
            <Input 
              id="class-code"
              placeholder="VD: LTW001" 
              value={code}
              className="uppercase font-mono tracking-widest focus-visible:ring-primary/20"
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()} 
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-gray-500">
              Huỷ bỏ
            </Button>
            <Button 
              size="sm" 
              onClick={handleJoin} 
              disabled={submitting || !code.trim()}
              className="px-6"
            >
              {submitting ? 'Đang xử lý...' : 'Tham gia'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
