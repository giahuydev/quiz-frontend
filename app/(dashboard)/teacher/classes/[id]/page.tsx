'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { classService } from '@/services/class.service';
import { formatDate } from '@/lib/utils';
import type { ClassMember, Announcement } from '@/types/class';

type Tab = 'announcements' | 'members';

export default function ClassDetailPage() {
  const params = useParams();
  const id     = Number(params.id);

  const [tab,           setTab]           = useState<Tab>('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [members,       setMembers]       = useState<ClassMember[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [open,          setOpen]          = useState(false);
  const [title,         setTitle]         = useState('');
  const [content,       setContent]       = useState('');
  const [submitting,    setSubmitting]    = useState(false);

  useEffect(() => {
    Promise.all([
      classService.getAnnouncements(id),
      classService.getMembers(id),
    ]).then(([annRes, memRes]) => {
      setAnnouncements(annRes.data);
      setMembers(memRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const r = await classService.createAnnouncement(id, { title, content });
      setAnnouncements([r.data, ...announcements]);
      setTitle(''); setContent(''); setOpen(false);
    } catch {
      alert('Đăng thông báo thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (studentId: number) => {
    if (!confirm('Xoá sinh viên này khỏi lớp?')) return;
    try {
      await classService.removeMember(id, studentId);
      setMembers(members.filter((m) => m.student_id !== studentId));
    } catch {
      alert('Xoá thất bại');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Chi tiết lớp</h1>
          <p className="text-sm text-gray-500 mt-0.5">{members.length} sinh viên</p>
        </div>
        {tab === 'announcements' && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm">Đăng thông báo</Button></DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Đăng thông báo</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label>Tiêu đề</Label>
                  <Input placeholder="VD: Lịch thi giữa kỳ" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Nội dung</Label>
                  <textarea rows={4} placeholder="Nhập nội dung..." value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Huỷ</Button>
                  <Button size="sm" onClick={handlePost} disabled={submitting}>{submitting ? 'Đang đăng...' : 'Đăng'}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-0 border-b border-gray-200">
        {[
          { key: 'announcements', label: 'Thông báo' },
          { key: 'members',       label: 'Thành viên' },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)}
            className={['px-4 py-2 text-sm transition-colors border-b-2 -mb-px',
              tab === t.key ? 'border-gray-900 text-gray-900 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700',
            ].join(' ')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'announcements' ? (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-lg px-4 py-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900 text-sm">{a.title}</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{a.content}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(a.created_at)}</span>
            </div>
          ))}
          {announcements.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-8 text-center text-sm text-gray-400">Chưa có thông báo nào</div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['#', 'Sinh viên', 'Ngày tham gia', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.student_id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(m.joined_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemoveMember(m.student_id)}>Xoá</Button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">Chưa có sinh viên nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}