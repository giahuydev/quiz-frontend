'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCountdown } from '@/lib/utils';

const START_TIME = new Date(Date.now() + 2 * 60 * 1000);

export default function WaitingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const seconds = useCountdown(START_TIME, () => router.push(`/exam/1`));

  const info = [
    { label: 'Phòng thi',     value: `#${params.sessionId}` },
    { label: 'Số câu hỏi',   value: '40 câu' },
    { label: 'Thời gian thi', value: '60 phút' },
    { label: 'Hình thức',     value: 'Trắc nghiệm' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Phòng chờ</h1>
          <p className="text-sm text-gray-500 mt-1">Kiểm tra giữa kỳ — Lập trình Web</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-8 py-8">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Kỳ thi bắt đầu sau</p>
          <div className="text-5xl font-bold text-gray-900 font-mono tabular-nums">{formatCountdown(seconds)}</div>
          <p className="text-xs text-gray-400 mt-3">Vui lòng giữ nguyên trang này</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg px-4 py-4 text-left space-y-2">
          {info.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-left">
          <p className="text-xs font-medium text-gray-700 mb-1">Lưu ý quan trọng:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            {['Không chuyển tab hoặc thu nhỏ trình duyệt', 'Bài thi sẽ tự động nộp khi hết giờ', 'Kết nối internet ổn định trước khi thi'].map(l => (
              <li key={l}>· {l}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}