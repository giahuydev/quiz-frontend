'use client';

interface StatItem {
  label: string;
  value: string | number;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div 
          key={s.label} 
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
