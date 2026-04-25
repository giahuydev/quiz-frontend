// File: quiz-frontend/app/(dashboard)/student/home/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { classService } from '@/services/class.service';
import { sessionService } from '@/services/session.service';
import type { Class } from '@/types/class';
import { ClassList } from '@/components/student/ClassList';
import { JoinClassDialog } from '@/components/student/JoinClassDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function StudentHomePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [examOpen, setExamOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [examError, setExamError] = useState('');
  const [joining, setJoining] = useState(false);
  const router = useRouter();

  const fetchClasses = useCallback(async () => {
    try {
      const r = await classService.getJoined();
      setClasses(r.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleJoinExam = async () => {
    if (!accessCode.trim()) return;
    setJoining(true);
    setExamError('');
    try {
      const r = await sessionService.join({ access_code: accessCode.toUpperCase() });
      router.push(`/waiting-room/${r.data.session_id}`);
    } catch (e: any) {
      setExamError(e?.response?.data?.message || 'Mã phòng thi không đúng');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Trang chủ sinh viên</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Quản lý học tập và thi cử</p>
        </div>
        
        <div className="flex gap-2">
          {/* Nút Vào phòng thi nhanh */}
          <Dialog open={examOpen} onOpenChange={setExamOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase border-primary text-primary hover:bg-primary/5">Vào thi nhanh</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs rounded-md">
              <DialogHeader><DialogTitle className="text-xs font-bold uppercase">Nhập mã phòng thi</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase">Access Code</Label>
                  <Input placeholder="..." value={accessCode} className="uppercase font-mono" onChange={(e) => setAccessCode(e.target.value)} />
                  {examError && <p className="text-[10px] text-red-500 font-medium">{examError}</p>}
                </div>
                <Button size="sm" className="w-full" onClick={handleJoinExam} disabled={joining}>{joining ? '...' : 'VÀO PHÒNG CHỜ'}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <JoinClassDialog onJoined={fetchClasses} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lớp học của tôi ({classes.length})</h2>
          <ClassList classes={classes} />
        </div>
      )}
    </div>
  );
}
