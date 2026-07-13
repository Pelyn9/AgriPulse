import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

interface QuickActionButtonProps {
  to: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
}

export function QuickActionButton({ to, label, icon: Icon, primary = false }: QuickActionButtonProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center text-xs font-bold transition active:scale-[0.98]',
        primary
          ? 'border-field-700 bg-field-700 text-white shadow-lg shadow-field-900/25 dark:border-field-300 dark:bg-field-300 dark:text-field-950'
          : 'border-slate-200 bg-white/80 text-slate-700 hover:border-field-300 hover:text-field-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-field-300/40',
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}
