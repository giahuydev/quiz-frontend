// File: quiz-frontend/components/teacher/StatsGrid.tsx
'use client';

export function StatsGrid({ stats }: { stats: { label: string; value: string | number }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase">{s.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
