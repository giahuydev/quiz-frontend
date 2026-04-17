'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Class } from '@/types/class';

interface ClassTableProps {
  classes: Class[];
}

export function ClassTable({ classes }: ClassTableProps) {
  if (classes.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-12 text-center text-sm text-gray-400">
        Chưa có lớp học nào. Hãy nhấn "Tạo lớp mới" để bắt đầu.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80">
            {['Tên lớp', 'Mã lớp', 'Ngày tạo', ''].map((h) => (
              <th key={h} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {classes.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50/80 transition-colors group">
              <td className="px-6 py-4 font-semibold text-gray-900">{c.name}</td>
              <td className="px-6 py-4">
                <span className="font-mono text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md border border-gray-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                  {c.class_code}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{formatDate(c.created_at)}</td>
              <td className="px-6 py-4 text-right">
                <Link href={`/teacher/classes/${c.id}`}>
                  <Button variant="outline" size="sm" className="text-xs h-8 px-4 border-gray-200 hover:bg-primary hover:text-white transition-all">
                    Quản lý
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
