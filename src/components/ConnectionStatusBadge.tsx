import { Wifi, WifiOff } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn } from '../utils/cn';

interface ConnectionStatusBadgeProps {
  compact?: boolean;
  className?: string;
}

export function ConnectionStatusBadge({ compact = false, className }: ConnectionStatusBadgeProps) {
  const isOnline = useAppStore((state) => state.isOnline);
  const Icon = isOnline ? Wifi : WifiOff;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold',
        isOnline
          ? 'border-field-500/25 bg-field-100 text-field-800 dark:border-field-400/20 dark:bg-field-900/50 dark:text-field-100'
          : 'border-harvest-500/30 bg-harvest-100 text-harvest-700 dark:border-harvest-400/25 dark:bg-harvest-500/15 dark:text-harvest-100',
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {compact ? (isOnline ? 'Online' : 'Offline') : isOnline ? 'Online Mode' : 'Offline Mode'}
    </div>
  );
}
