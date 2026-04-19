'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { classService } from '@/services/class.service';
import { sessionService } from '@/services/session.service';
import { formatDate } from '@/lib/utils';
import type { Announcement } from '@/types/class';

export default function StudentClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [examOpen, setExamOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [examError, setExamError] = useState('');
  const [joining, setJoining] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const r = await classService.getAnnouncements(id);
      setAnnouncements(r.data);
    } catch {
      // API not ready
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const handleJoinExam = async () => {
    if (!accessCode.trim()) return;
    setJoining(true);
    setExamError('');
    try {
      const r = await sessionService.join({ access_code: accessCode.toUpperCase() });
      setExamOpen(false);
      router.push(`/waiting-room/${r.data.session_id}`);
    } catch (e: any) {
      setExamError(e?.response?.data?.message || 'Mã phòng thi không đúng');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Thông báo lớp học</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Cập nhật mới nhất từ giảng viên</p>
        </div>
        
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
      </div>

      {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="border border-gray-100 rounded-md p-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-gray-900 uppercase">{a.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{a.content}</p>
                </div>
                <span className="text-[9px] font-bold text-gray-300 whitespace-nowrap uppercase">{formatDate(a.created_at)}</span>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <div className="border border-dashed rounded-md p-10 text-center text-[10px] text-gray-400 uppercase font-bold italic">
              Lớp học chưa có thông báo nào
            </div>
          )}
        </div>
      )}
    </div>
  );
}
