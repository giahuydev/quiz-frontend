'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { sessionService } from '@/services/session.service';

interface StudentResult {
  id: number;
  name: string;
  email: string;
  score: number | null;
  correct: number;
  total: number;
  tab_switch_count: number;
  fullscreen_exit_count: number;
  disconnected_count: number;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'TIMEOUT' | 'DISCONNECTED';
  submitted_at: string | null;
}

const statusConfig = {
  IN_PROGRESS: { label: 'Dang thi', variant: 'secondary' as const },
  SUBMITTED: { label: 'Da nop', variant: 'default' as const },
  TIMEOUT: { label: 'Het gio', variant: 'secondary' as const },
  DISCONNECTED: { label: 'Mat ket noi', variant: 'destructive' as const },
};

export default function SessionDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionService
      .getResults(id)
      .then((r) => setResults(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  const scored = results.filter((r) => r.score !== null);
  const avgScore = scored.length > 0 ? scored.reduce((sum, r) => sum + (r.score ?? 0), 0) / scored.length : 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Ket qua ky thi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Theo doi tien do va ket qua</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Da nop bai', value: `${results.filter((r) => r.status !== 'IN_PROGRESS').length}/${results.length}` },
          { label: 'Diem trung binh', value: avgScore > 0 ? avgScore.toFixed(1) : '-' },
          { label: 'Dang thi', value: results.filter((r) => r.status === 'IN_PROGRESS').length },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg px-4 py-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Sinh vien', 'Diem', 'Dung', 'Vi pham', 'Trang thai', 'Nop luc'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{r.score !== null ? r.score.toFixed(1) : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.score !== null ? `${r.correct}/${r.total}` : '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 text-xs flex-wrap">
                      {r.tab_switch_count > 0 && (
                        <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded">Tab x{r.tab_switch_count}</span>
                      )}
                      {r.fullscreen_exit_count > 0 && (
                        <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded">FS x{r.fullscreen_exit_count}</span>
                      )}
                      {r.disconnected_count > 0 && (
                        <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded">DC x{r.disconnected_count}</span>
                      )}
                      {!r.tab_switch_count && !r.fullscreen_exit_count && !r.disconnected_count && (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[r.status].variant} className="text-xs">
                      {statusConfig[r.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {r.submitted_at ? new Date(r.submitted_at).toLocaleTimeString('vi-VN') : '-'}
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                    Chua co sinh vien nao thi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
