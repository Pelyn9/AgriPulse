import { ChevronDown, ChevronUp, Cloud, FileText, FlaskConical, Leaf, Shield, Sprout, Target, Trash2, WifiOff } from 'lucide-react';
import { useState } from 'react';
import type { ScanRecord } from '../types';
import { formatScanDate } from '../utils/date';
import { cn } from '../utils/cn';

interface HistoryCardProps {
  scan: ScanRecord;
  onDelete?: (id: string) => void;
}

export function HistoryCard({ scan, onDelete }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const healthy = scan.prediction === 'Healthy';

  return (
    <article className="rounded-2xl border border-white/70 bg-white/90 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <img src={scan.image} alt={scan.prediction} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-slate-950 dark:text-white">{scan.prediction}</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{formatScanDate(scan.createdAt)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {onDelete && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); onDelete(scan.id); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onDelete(scan.id); } }}
                  className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                  aria-label="Delete scan"
                >
                  <Trash2 className="h-4 w-4" />
                </span>
              )}
              {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-black',
                healthy
                  ? 'bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100'
                  : 'bg-harvest-100 text-harvest-700 dark:bg-harvest-500/15 dark:text-harvest-100',
              )}
            >
              {scan.confidence}% Confidence
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-200">
              {scan.mode === 'Online' ? <Cloud className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {scan.mode}
            </span>
            {!scan.synced && (
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-black text-rose-700 dark:bg-rose-500/15 dark:text-rose-100">
                Pending Sync
              </span>
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-slate-100 px-3 pb-4 pt-3 dark:border-white/10">

          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
            <div className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
              <FileText className="h-4 w-4 text-slate-400" />
              What is this?
            </div>
            <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-300">{scan.description}</p>
          </div>

          {scan.causes && scan.causes.length > 0 && (
            <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/5">
              <div className="mb-1.5 flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Possible Causes
              </div>
              <ul className="space-y-1">
                {scan.causes.map((cause) => (
                  <li key={cause} className="flex items-start gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/5">
            <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
              <Leaf className="h-4 w-4 text-field-700 dark:text-field-300" />
              Symptoms
            </div>
            <div className="flex flex-wrap gap-2">
              {scan.symptoms.map((symptom) => (
                <span key={symptom} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-200">
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-field-700 p-3 text-white dark:bg-field-800">
            <div className="flex items-center gap-2 text-sm font-black">
              <FlaskConical className="h-4 w-4" />
              Treatment
            </div>
            <p className="mt-1.5 text-xs leading-6 font-semibold text-white/90">{scan.treatment}</p>
            <p className="mt-1.5 text-xs font-black">Recommended: {scan.fertilizer}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-white/75">Rate: {scan.applicationRate}</p>
          </div>

          {scan.prevention && scan.prevention.length > 0 && (
            <div className="rounded-2xl bg-sky-50 p-3 dark:bg-sky-500/10">
              <div className="mb-1.5 flex items-center gap-2 text-sm font-black text-sky-800 dark:text-sky-200">
                <Shield className="h-4 w-4" />
                Prevention
              </div>
              <ul className="space-y-1">
                {scan.prevention.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-5 text-sky-700 dark:text-sky-300/80">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {scan.recoveryTips && scan.recoveryTips.length > 0 && (
            <div className="rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
              <div className="mb-1.5 flex items-center gap-2 text-sm font-black text-emerald-800 dark:text-emerald-200">
                <Sprout className="h-4 w-4" />
                Recovery Tips
              </div>
              <ul className="space-y-1.5">
                {scan.recoveryTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs leading-5 text-emerald-700 dark:text-emerald-300/80">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{scan.summary}</p>
        </div>
      )}
    </article>
  );
}
