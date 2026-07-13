import type { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import { AnimatedCard } from './AnimatedCard';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'green' | 'amber' | 'blue' | 'rose';
}

const tones = {
  green: 'bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-200',
  amber: 'bg-harvest-100 text-harvest-700 dark:bg-harvest-500/15 dark:text-harvest-100',
  blue: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-100',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-100',
};

export function StatCard({ label, value, icon: Icon, tone = 'green' }: StatCardProps) {
  return (
    <AnimatedCard className="min-h-32 p-3" elevated={false}>
      <div className={cn('mb-4 flex h-10 w-10 items-center justify-center rounded-xl', tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-black text-slate-950 dark:text-white">{value}</div>
      <div className="mt-1 text-xs font-semibold leading-snug text-slate-500 dark:text-slate-400">{label}</div>
    </AnimatedCard>
  );
}
