'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Class } from '@/types/class';

interface ClassListProps {
  classes: Class[];
}

export function ClassList({ classes }: ClassListProps) {
  if (classes.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-xl px-4 py-16 text-center shadow-sm">
        <p className="text-sm text-gray-500 font-medium">Bạn chưa tham gia lớp học nào.</p>
        <p className="text-xs text-gray-400 mt-1">Hãy nhấn "Tham gia lớp" và nhập mã từ giảng viên của bạn.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      {classes.map((c) => (
        <div 
          key={c.id} 
          className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
        >
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{c.name}</h3>
            <p className="text-xs text-gray-500">
              Tham gia ngày: <span className="font-medium">{formatDate(c.created_at)}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="font-mono text-[10px] bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200 font-bold uppercase">
              {c.class_code}
            </span>
            <Link href={`/student/classes/${c.id}`}>
              <Button variant="outline" size="sm" className="text-xs h-8 px-4 rounded-lg hover:bg-primary hover:text-white transition-all">
                Vào lớp
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
