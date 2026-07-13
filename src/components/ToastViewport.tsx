import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn } from '../utils/cn';

const toneMap = {
  success: {
    icon: CheckCircle2,
    className: 'border-field-200 bg-field-50 text-field-800 dark:border-field-400/20 dark:bg-field-950 dark:text-field-100',
  },
  warning: {
    icon: TriangleAlert,
    className: 'border-harvest-200 bg-harvest-50 text-harvest-700 dark:border-harvest-400/20 dark:bg-harvest-500/10 dark:text-harvest-100',
  },
  info: {
    icon: Info,
    className: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-100',
  },
  error: {
    icon: XCircle,
    className: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100',
  },
};

export function ToastViewport() {
  const toasts = useAppStore((state) => state.toasts);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 z-[60] flex flex-col gap-2 px-4">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const tone = toneMap[toast.tone ?? 'info'];
          const Icon = tone.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              className={cn('pointer-events-auto rounded-2xl border p-3 shadow-glass backdrop-blur-xl', tone.className)}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-black">{toast.title}</p>
                  {toast.description && <p className="mt-0.5 text-xs font-semibold opacity-75">{toast.description}</p>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
