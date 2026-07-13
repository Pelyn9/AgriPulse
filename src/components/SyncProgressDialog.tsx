import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CloudUpload } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function SyncProgressDialog() {
  const progress = useAppStore((state) => state.syncProgress);
  const setSyncProgress = useAppStore((state) => state.setSyncProgress);
  const open = progress.status === 'uploading' || progress.status === 'complete';
  const ratio = progress.total > 0 ? Math.round((progress.uploaded / progress.total) * 100) : 100;

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
            initial={{ y: 14, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 14, scale: 0.96 }}
            className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-glass dark:bg-slate-950"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-200">
              {progress.status === 'complete' ? <CheckCircle2 className="h-6 w-6" /> : <CloudUpload className="h-6 w-6" />}
            </div>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">
              {progress.status === 'complete' ? 'Complete' : 'Uploading...'}
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {progress.message ?? `${progress.uploaded} of ${progress.total} scans`}
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-field-100 dark:bg-field-950">
              <motion.div
                className="h-full rounded-full bg-field-600 dark:bg-field-300"
                initial={{ width: 0 }}
                animate={{ width: `${ratio}%` }}
              />
            </div>
            {progress.status === 'complete' && (
              <button
                type="button"
                onClick={() => setSyncProgress({ status: 'idle', uploaded: 0, total: 0 })}
                className="mt-5 min-h-12 w-full rounded-2xl bg-field-700 px-4 text-sm font-bold text-white dark:bg-field-300 dark:text-field-950"
              >
                Continue to Dashboard
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
