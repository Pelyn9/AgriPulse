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
