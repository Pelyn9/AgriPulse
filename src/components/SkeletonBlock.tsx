import { cn } from '../utils/cn';

interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <div className={cn('skeleton-shimmer rounded-2xl bg-slate-200/80 dark:bg-white/10', className)} />;
}
