// File: quiz-frontend/components/teacher/ClassTable.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Class } from '@/types/class';

export function ClassTable({ classes }: { classes: Class[] }) {
  if (classes.length === 0) return <div className="border rounded-md p-8 text-center text-sm text-gray-400">Trống</div>;

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Tên lớp', 'Mã lớp', 'Ngày tạo', ''].map(h => (
              <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {classes.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.class_code}</td>
              <td className="px-4 py-3 text-gray-500">{formatDate(c.created_at)}</td>
              <td className="px-4 py-3 text-right">
                <Link href={`/teacher/classes/${c.id}`}>
                  <Button variant="outline" size="sm" className="h-7 text-xs">Quản lý</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
