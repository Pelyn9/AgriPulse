import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Plus, Wrench, Bug } from 'lucide-react';
import { changelog } from '../config/changelog';

const sectionIcons: Record<string, typeof Sparkles> = {
  Added: Plus,
  Improved: Wrench,
  Fixed: Bug,
};

const sectionColors: Record<string, string> = {
  Added: 'bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-200',
  Improved: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
  Fixed: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200',
};

interface Props {
  open: boolean;
  onDismiss: () => void;
  reviewMode?: boolean;
}

export function WhatsNewDialog({ open, onDismiss, reviewMode = false }: Props) {
  const entry = changelog[0];
  const [page, setPage] = useState(0);

  if (reviewMode) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-end justify-center bg-slate-950/45 p-6 pb-24 backdrop-blur-sm"
            onClick={onDismiss}
          >
            <motion.div
              initial={{ y: 18, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 18, scale: 0.96 }}
              className="scrollbar-hide max-h-[60vh] w-full max-w-sm overflow-y-auto rounded-3xl border border-white/60 bg-white/95 p-5 shadow-glass dark:border-white/10 dark:bg-slate-950/95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-200">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">What's New</h2>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    v{entry.version} — {entry.date}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {entry.sections.map((section) => {
                  const Icon = sectionIcons[section.title] ?? Sparkles;
                  return (
                    <div key={section.title}>
                      <span className={`mb-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${sectionColors[section.title] ?? sectionColors.Added}`}>
                        <Icon className="h-3 w-3" />
                        {section.title}
                      </span>
                      <ul className="space-y-2 pl-1">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-field-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onDismiss}
                className="mt-5 flex min-h-11 w-full items-center justify-center rounded-2xl bg-field-700 px-4 text-sm font-bold text-white dark:bg-field-300 dark:text-field-950"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const section = entry.sections[page];
  const Icon = sectionIcons[section?.title] ?? Sparkles;
  const isLast = page === entry.sections.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[60] flex items-end justify-center bg-slate-950/45 p-6 pb-24 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 18, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 18, scale: 0.96 }}
            className="w-full max-w-sm rounded-3xl border border-white/60 bg-white/95 p-5 shadow-glass dark:border-white/10 dark:bg-slate-950/95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950 dark:text-white">What's New</h2>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  v{entry.version} — {entry.date}
                </p>
              </div>
            </div>

            <div className="mt-4 min-h-[140px]">
              <div className="mb-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${sectionColors[section.title] ?? sectionColors.Added}`}>
                  <Icon className="h-3 w-3" />
                  {section.title}
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  {page + 1}/{entry.sections.length}
                </span>
              </div>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-field-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {!isLast && (
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 dark:border-white/10 dark:text-slate-200"
                >
                  Next
                </button>
              )}
              <button
                type="button"
                onClick={onDismiss}
                className={`flex min-h-11 items-center justify-center rounded-2xl bg-field-700 px-4 text-sm font-bold text-white dark:bg-field-300 dark:text-field-950 ${isLast ? 'col-span-2' : ''}`}
              >
                {isLast ? "Got it!" : "Skip"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
