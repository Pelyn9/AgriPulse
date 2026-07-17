import { Filter, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { HistoryCard } from '../components/HistoryCard';
import { PageHeader } from '../components/PageHeader';
import { useAppStore } from '../store/appStore';
import { useScanStore } from '../store/scanStore';
import { cn } from '../utils/cn';

type FilterKey = 'all' | 'healthy' | 'deficient' | 'pending';

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'healthy', label: 'Healthy' },
  { key: 'deficient', label: 'Deficient' },
  { key: 'pending', label: 'Pending' },
];

export function HistoryPage() {
  const scans = useScanStore((state) => state.scans);
  const removeScan = useScanStore((state) => state.removeScan);
  const addToast = useAppStore((state) => state.addToast);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const matchesQuery = `${scan.prediction} ${scan.fertilizer} ${scan.mode}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'healthy' && scan.prediction === 'Healthy') ||
        (filter === 'deficient' && scan.prediction !== 'Healthy') ||
        (filter === 'pending' && !scan.synced);

      return matchesQuery && matchesFilter;
    });
  }, [filter, query, scans]);

  return (
    <div className="space-y-5">
      <PageHeader title="History" eyebrow="Local scan records" />

      <div className="rounded-2xl border border-white/70 bg-white/90 p-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
        <label className="flex min-h-12 items-center gap-2 rounded-xl bg-slate-100 px-3 dark:bg-white/10">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search scans"
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
          />
        </label>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto">
          <Filter className="h-4 w-4 shrink-0 text-slate-400" />
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                'min-h-9 shrink-0 rounded-full px-3 text-xs font-black transition',
                filter === item.key
                  ? 'bg-field-700 text-white dark:bg-field-300 dark:text-field-950'
                  : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredScans.map((scan) => (
          <HistoryCard key={scan.id} scan={scan} onDelete={setDeleteId} />
        ))}
        {filteredScans.length === 0 && (
          <div className="rounded-2xl border border-dashed border-field-300 p-8 text-center dark:border-field-700">
            <Trash2 className="mx-auto h-8 w-8 text-field-600 dark:text-field-300" />
            <p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300">No scans found.</p>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={Boolean(deleteId)}
        title="Delete scan?"
        description="This removes the local scan record from this device."
        confirmLabel="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await removeScan(deleteId);
            addToast({ title: 'Scan deleted', tone: 'warning' });
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
