'use client';

import { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { classService } from '@/services/class.service';
import type { Class } from '@/types/class';
import { ClassList } from '@/components/student/ClassList';
import { JoinClassDialog } from '@/components/student/JoinClassDialog';

export default function StudentHomePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    try {
      const r = await classService.getJoined();
      setClasses(r.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
            Lớp học của tôi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bạn đang tham gia <span className="font-semibold text-primary">{classes.length}</span> lớp học
          </p>
        </div>
        <JoinClassDialog onJoined={fetchClasses} />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Spinner />
          <p className="text-sm text-gray-400 animate-pulse">Đang tải danh sách lớp học...</p>
        </div>
      ) : (
        <ClassList classes={classes} />
      )}
    </div>
  );
}
