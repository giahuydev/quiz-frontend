'use client';

import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { classService } from '@/services/class.service';
import type { Class } from '@/types/class';
import { ClassTable } from '@/components/teacher/ClassTable';
import { CreateClassDialog } from '@/components/teacher/CreateClassDialog';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classService.getAll()
      .then((r) => setClasses(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleClassCreated = (newClass: Class) => {
    setClasses((prev) => [...prev, newClass]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý lớp học</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bạn đang có <span className="font-semibold text-primary">{classes.length}</span> lớp học đang hoạt động
          </p>
        </div>
        <CreateClassDialog onCreated={handleClassCreated} />
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
