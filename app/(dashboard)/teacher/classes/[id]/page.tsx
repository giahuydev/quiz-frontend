'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { classService } from '@/services/class.service';
import { formatDate } from '@/lib/utils';
import { Users, Megaphone } from 'lucide-react';

export default function TeacherClassDetailPage() {
  const params = useParams();
  const classId = Number(params.id);
  
  const [tab, setTab] = useState<'announcements' | 'members'>('announcements');
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [classInfo, setClassInfo] = useState<any>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [classRes, annRes, memberRes] = await Promise.all([
        classService.getById(classId),
        classService.getAnnouncements(classId),
        classService.getMembers(classId)
      ]);
      setClassInfo(classRes.data);
      setAnnouncements(annRes.data);
      setMembers(memberRes.data);
    } catch {
      // API not ready
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePostAnnouncement = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    try {
      await classService.createAnnouncement(classId, { title: newTitle, content: newContent });
      setNewTitle(''); setNewContent('');
      const res = await classService.getAnnouncements(classId);
      setAnnouncements(res.data);
    } catch {
      alert('Lỗi khi đăng thông báo');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="border-b pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{classInfo?.name || 'Chi tiết lớp học'}</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Mã lớp: <span className="text-primary">{classInfo?.class_code}</span></p>
        </div>
      </div>

      <div className="flex gap-4 border-b text-[10px] font-bold uppercase tracking-widest">
        <button onClick={() => setTab('announcements')} className={`pb-2 flex items-center gap-1.5 ${tab === 'announcements' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}>
          <Megaphone className="w-3 h-3" /> Thông báo
        </button>
        <button onClick={() => setTab('members')} className={`pb-2 flex items-center gap-1.5 ${tab === 'members' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}>
          <Users className="w-3 h-3" /> Sinh viên ({members.length})
        </button>
      </div>

      {tab === 'announcements' ? (
        <div className="space-y-6">
          <div className="border border-gray-100 rounded-md p-4 bg-gray-50/30 space-y-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase font-bold">Tiêu đề thông báo</Label>
              <Input placeholder="..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase font-bold">Nội dung</Label>
              <textarea 
                className="w-full border border-gray-200 rounded-md p-2 text-xs bg-white focus:outline-none focus:border-primary min-h-[80px]"
                placeholder="Nhập nội dung thông báo cho sinh viên..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" className="text-[10px] font-bold uppercase px-6" onClick={handlePostAnnouncement} disabled={submitting}>
                {submitting ? '...' : 'Đăng thông báo'}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="border border-gray-100 rounded-md p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xs font-bold text-gray-900 uppercase">{a.title}</h3>
                  <span className="text-[9px] text-gray-300 font-bold">{formatDate(a.created_at)}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-gray-100 rounded-md overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Họ và tên</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/30">
                  <td className="px-4 py-3 text-xs font-bold text-gray-700">{m.student?.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{m.student?.email}</td>
                  <td className="px-4 py-3 text-right">
                    <Button className="text-red-400 hover:text-red-600 uppercase font-bold text-[9px]"
                        onClick={async () => {
                          if (!confirm(`Xoá ${m.student?.name} khỏi lớp?`)) return;
                          try {
                            await classService.removeMember(classId, m.student_id);
                            setMembers(members.filter((x) => x.student_id !== m.student_id));
                          } catch {
                            alert('Xoá thất bại');
                          }
                        }}
                      >
                        Xoá
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
