import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  elevated?: boolean;
}

export function AnimatedCard({ className, elevated = true, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl border border-white/70 bg-white/90 p-4 text-slate-950 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75 dark:text-white',
        elevated && 'shadow-soft',
        className,
      )}
      {...props}
    />
  );
}
