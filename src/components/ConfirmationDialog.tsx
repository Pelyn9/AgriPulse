import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 grid place-items-center bg-slate-950/45 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 12, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, scale: 0.96 }}
            className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-glass dark:bg-slate-950"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">{description}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="min-h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 dark:border-white/10 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="min-h-12 rounded-2xl bg-rose-600 px-4 text-sm font-bold text-white"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
