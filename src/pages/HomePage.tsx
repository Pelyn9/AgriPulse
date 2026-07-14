import { useEffect, useState } from 'react';
import { BarChart3, Clock3, CloudUpload, FileText, History, Leaf, Settings, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedCard } from '../components/AnimatedCard';
import { HistoryCard } from '../components/HistoryCard';
import { PageHeader } from '../components/PageHeader';
import { QuickActionButton } from '../components/QuickActionButton';
import { SkeletonBlock } from '../components/SkeletonBlock';
import { StatCard } from '../components/StatCard';
import { useAppStore } from '../store/appStore';
import { useScanStore } from '../store/scanStore';
import type { PredictionType } from '../types';
import { cn } from '../utils/cn';

const CATEGORY_COLORS: Record<string, string> = {
  Healthy: 'bg-green-500',
  'Nitrogen Deficiency': 'bg-blue-500',
  'Phosphorus Deficiency': 'bg-purple-500',
  'Potassium Deficiency': 'bg-amber-500',
  'Brown Spot': 'bg-orange-500',
  'Rice Blast': 'bg-rose-500',
  'Bacterial Leaf Blight': 'bg-red-500',
  'Rice Leaf Diseases': 'bg-pink-500',
};

export function HomePage() {
  const scans = useScanStore((state) => state.scans);
  const loading = useScanStore((state) => state.loading);
  const user = useAppStore((state) => state.user);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const totalScans = scans.length;
  const healthyLeaves = scans.filter((scan) => scan.prediction === 'Healthy').length;
  const deficiencies = totalScans - healthyLeaves;
  const pendingSync = scans.filter((scan) => !scan.synced).length;
  const recent = scans.slice(0, 3);

  const categoryCounts = Object.keys(CATEGORY_COLORS).map((cat) => ({
    label: cat,
    count: scans.filter((s) => s.prediction === cat).length,
  }));
  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  return (
    <div className="space-y-5">
      <PageHeader title={now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} eyebrow="RiceLeaf AI" />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-950 dark:text-white">Statistics</h2>
          <BarChart3 className="h-5 w-5 text-field-700 dark:text-field-300" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Scans" value={totalScans} icon={Clock3} tone="green" />
          <StatCard label="Healthy Leaves" value={healthyLeaves} icon={Leaf} tone="blue" />
          <StatCard label="Detected Deficiencies" value={deficiencies} icon={Sprout} tone="amber" />
          <StatCard label="Pending Sync" value={pendingSync} icon={CloudUpload} tone="rose" />
        </div>
      </section>

      {totalScans > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-black text-slate-950 dark:text-white">Categories</h2>
          </div>
          <AnimatedCard>
            <div className="space-y-3">
              {categoryCounts.filter((c) => c.count > 0).map((cat) => (
                <div key={cat.label}>
                  <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{cat.label}</span>
                    <span>{cat.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', CATEGORY_COLORS[cat.label] ?? 'bg-slate-400')}
                      style={{ width: `${(cat.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {categoryCounts.every((c) => c.count === 0) && (
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">No category data yet.</p>
              )}
            </div>
          </AnimatedCard>
        </section>
      )}

      <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-black text-slate-950 dark:text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <QuickActionButton to="/history" label="History" icon={History} />
            <QuickActionButton to="/reports" label="Reports" icon={FileText} />
            <QuickActionButton to="/settings" label="Settings" icon={Settings} />
          </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-950 dark:text-white">Recent Scan History</h2>
          <Link to="/history" className="text-xs font-black text-field-700 dark:text-field-300">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {loading && (
            <>
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-24" />
            </>
          )}
          {!loading && recent.map((scan) => <HistoryCard key={scan.id} scan={scan} />)}
          {!loading && recent.length === 0 && (
            <AnimatedCard className="text-center">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No scans yet.</p>
            </AnimatedCard>
          )}
        </div>
      </section>
    </div>
  );
}
