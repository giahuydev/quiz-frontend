'use client';

import { useState, useEffect } from 'react';
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
  const params  = useParams();
  const router  = useRouter();
  const id      = Number(params.id);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [open,          setOpen]          = useState(false);
  const [code,          setCode]          = useState('');
  const [error,         setError]         = useState('');
  const [submitting,    setSubmitting]    = useState(false);

  useEffect(() => {
    classService.getAnnouncements(id)
      .then((r) => setAnnouncements(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoinExam = async () => {
    if (!code.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      const r = await sessionService.join({ access_code: code.toUpperCase() });
      setOpen(false);
      router.push(`/waiting-room/${r.data.session_id}`);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Mã không hợp lệ hoặc chưa đến giờ mở phòng chờ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Thông báo lớp học</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); setError(''); }}>
          <DialogTrigger asChild>
            <Button size="sm">Vào phòng thi</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Nhập mã phòng thi</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Access code</Label>
                <Input placeholder="VD: EXAM123" value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinExam()} />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <p className="text-xs text-gray-400">Nhập mã từ thông báo của giảng viên</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Huỷ</Button>
                <Button size="sm" onClick={handleJoinExam} disabled={submitting}>
                  {submitting ? 'Đang vào...' : 'Vào phòng chờ'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-lg px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{a.title}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{a.content}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(a.created_at)}</span>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-8 text-center text-sm text-gray-400">
              Chưa có thông báo nào
            </div>
          )}
        </div>
      )}
    </div>
  );
}