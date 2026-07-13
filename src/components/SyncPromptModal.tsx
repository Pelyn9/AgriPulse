import { AnimatePresence, motion } from 'framer-motion';
import { CloudUpload, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

export function SyncPromptModal() {
  const navigate = useNavigate();
  const open = useAppStore((state) => state.showSyncPrompt);
  const setSyncPrompt = useAppStore((state) => state.setSyncPrompt);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 grid place-items-center bg-slate-950/45 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 18, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 18, scale: 0.96 }}
            className="w-full max-w-sm rounded-3xl border border-white/60 bg-white/95 p-5 shadow-glass dark:border-white/10 dark:bg-slate-950/95"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-200">
              <CloudUpload className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Internet Connection Detected</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              You currently have local scan data. Sync when you are ready, or keep working offline.
            </p>
            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={() => {
                  setSyncPrompt(false);
                  navigate('/login');
                }}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-field-700 px-4 text-sm font-bold text-white dark:bg-field-300 dark:text-field-950"
              >
                <CloudUpload className="h-4 w-4" />
                Login & Sync
              </button>
              <button
                type="button"
                onClick={() => setSyncPrompt(false)}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 dark:border-white/10 dark:text-slate-200"
              >
                <Leaf className="h-4 w-4" />
                Continue Offline
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
