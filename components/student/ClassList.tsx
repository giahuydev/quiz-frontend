'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Class } from '@/types/class';

export function ClassList({ classes }: { classes: Class[] }) {
  if (classes.length === 0) {
    return (
      <div className="border border-dashed border-gray-200 rounded-md p-10 text-center">
        <p className="text-sm text-gray-500">Chưa có lớp học nào.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {classes.map((c) => (
        <div key={c.id} className="border border-gray-200 rounded-md p-4 flex items-center justify-between bg-white">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900">{c.name}</h3>
            <p className="text-xs text-gray-500">Ngày tham gia: {formatDate(c.created_at)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-tight">{c.class_code}</span>
            <Link href={`/student/classes/${c.id}`}>
              <Button variant="outline" size="sm" className="h-7 text-xs px-3">Vào lớp</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
