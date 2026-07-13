import type { ReactNode } from 'react';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  showStatus?: boolean;
}

export function PageHeader({ title, eyebrow, action, showStatus = true }: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-field-700 dark:text-field-300">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-black leading-tight text-slate-950 dark:text-white">{title}</h1>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">{action ?? (showStatus ? <ConnectionStatusBadge compact /> : null)}</div>
    </header>
  );
}
