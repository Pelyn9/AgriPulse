import type { LucideIcon } from 'lucide-react';

interface ReportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function ReportCard({ title, description, icon: Icon, onClick }: ReportCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-24 w-full items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 text-left shadow-soft backdrop-blur-xl transition active:scale-[0.99] dark:border-white/10 dark:bg-slate-950/75"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black text-slate-950 dark:text-white">{title}</span>
        <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{description}</span>
      </span>
    </button>
  );
}
