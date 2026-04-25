// File: quiz-frontend/app/(dashboard)/teacher/classes/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { classService } from '@/services/class.service';
import type { Class } from '@/types/class';
import { ClassTable } from '@/components/teacher/ClassTable';
import { CreateClassDialog } from '@/components/teacher/CreateClassDialog';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const r = await classService.getAll();
      setClasses(r.data);
    } catch {
      // API not ready
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Lớp học của tôi</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Quản lý danh sách và sinh viên</p>
        </div>
        <CreateClassDialog onCreated={fetchClasses} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <ClassTable classes={classes} />
      )}
    </div>
  );
}
