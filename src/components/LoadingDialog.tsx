import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Brain, Cpu, FlaskConical, Leaf, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const stages: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Cpu, label: 'Initializing AI neural network...' },
  { icon: Atom, label: 'Extracting leaf features...' },
  { icon: Brain, label: 'Running deep learning model...' },
  { icon: Sparkles, label: 'Classifying nutrient condition...' },
  { icon: FlaskConical, label: 'Generating recommendations...' },
];

interface LoadingDialogProps {
  open: boolean;
  stage?: number;
}

export function LoadingDialog({ open, stage = 0 }: LoadingDialogProps) {
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
            initial={{ scale: 0.96, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 10 }}
            className="w-full max-w-xs rounded-3xl border border-white/50 bg-white/95 p-6 text-center shadow-glass dark:border-white/10 dark:bg-slate-950/95"
          >
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-field-500 to-harvest-500">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">AI Analysis</h2>
            <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
              Powered by machine learning
            </p>
            <div className="mt-5 space-y-2 text-left">
              {stages.map((s, i) => {
                const Icon = s.icon;
                const active = i === stage;
                const done = i < stage;
                return (
                  <div key={s.label} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${active ? 'bg-field-100 text-field-800 dark:bg-field-500/15 dark:text-field-200' : done ? 'text-field-600 dark:text-field-400' : 'text-slate-300 dark:text-slate-600'}`}>
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? 'animate-pulse' : ''}`} />
                    <span>{done ? '✓ ' : ''}{s.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-field-100 dark:bg-field-950">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-field-500 to-harvest-500"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
