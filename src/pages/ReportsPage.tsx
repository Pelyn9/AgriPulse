import { BarChart3, Database, Download, FileSpreadsheet, FileText, PieChart } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';
import { PageHeader } from '../components/PageHeader';
import { ReportCard } from '../components/ReportCard';
import { StatCard } from '../components/StatCard';
import { useAppStore } from '../store/appStore';
import { useScanStore } from '../store/scanStore';
import { scansToCsv, downloadTextFile } from '../utils/csv';
import { formatMonthKey } from '../utils/date';

export function ReportsPage() {
  const scans = useScanStore((state) => state.scans);
  const addToast = useAppStore((state) => state.addToast);
  const healthy = scans.filter((scan) => scan.prediction === 'Healthy').length;
  const deficient = scans.length - healthy;
  const healthyPercent = scans.length ? Math.round((healthy / scans.length) * 100) : 0;
  const pending = scans.filter((scan) => !scan.synced).length;

  const monthly = scans.reduce<Record<string, number>>((acc, scan) => {
    const key = formatMonthKey(scan.createdAt);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const monthlyEntries = Object.entries(monthly).slice(0, 6);
  const chartEntries: Array<[string, number]> = monthlyEntries.length ? monthlyEntries : [['Now', 0]];
  const maxMonth = Math.max(1, ...monthlyEntries.map(([, value]) => value));

  const exportCsv = (filename: string) => {
    downloadTextFile(filename, scansToCsv(scans), 'text/csv');
    addToast({ title: 'Report exported', description: filename, tone: 'success' });
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Reports" eyebrow="Field summaries" />

      <div className="grid gap-3">
        <ReportCard title="Export CSV" description="Download scan history as comma-separated data." icon={Download} onClick={() => exportCsv('riceleaf-report.csv')} />
        <ReportCard title="Export Excel" description="Create a spreadsheet-compatible export." icon={FileSpreadsheet} onClick={() => exportCsv('riceleaf-report.xls')} />
        <ReportCard
          title="Export PDF"
          description="Open the browser print dialog for a PDF report."
          icon={FileText}
          onClick={() => {
            addToast({ title: 'Preparing PDF', description: 'Use Save as PDF in the print dialog.', tone: 'info' });
            window.setTimeout(() => window.print(), 250);
          }}
        />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-950 dark:text-white">Statistics</h2>
          <Database className="h-5 w-5 text-field-700 dark:text-field-300" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Total" value={scans.length} icon={Database} tone="green" />
          <StatCard label="Healthy" value={healthy} icon={PieChart} tone="blue" />
          <StatCard label="Pending" value={pending} icon={BarChart3} tone="rose" />
        </div>
      </section>

      <AnimatedCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">Healthy vs Deficient</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Pie Chart</p>
          </div>
          <PieChart className="h-5 w-5 text-field-700 dark:text-field-300" />
        </div>
        <div className="flex items-center gap-5">
          <div
            className="h-32 w-32 shrink-0 rounded-full shadow-inner"
            style={{
              background: scans.length
                ? `conic-gradient(#16a34a 0 ${healthyPercent}%, #f59e0b ${healthyPercent}% 100%)`
                : 'conic-gradient(#d1d5db 0 100%)',
            }}
          />
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-200">
                <span>Healthy</span>
                <span>{healthy}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-field-100 dark:bg-field-950">
                <div className="h-full rounded-full bg-field-600" style={{ width: `${healthyPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-200">
                <span>Deficient</span>
                <span>{deficient}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-harvest-100 dark:bg-harvest-500/15">
                <div className="h-full rounded-full bg-harvest-500" style={{ width: `${100 - healthyPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">Monthly Scans</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Bar Chart</p>
          </div>
          <BarChart3 className="h-5 w-5 text-field-700 dark:text-field-300" />
        </div>
        <div className="flex h-44 items-end gap-2">
          {chartEntries.map(([month, value]) => (
            <div key={month} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end rounded-xl bg-slate-100 p-1 dark:bg-white/10">
                <div
                  className="w-full rounded-lg bg-field-600 dark:bg-field-300"
                  style={{ height: `${Math.max(8, (value / maxMonth) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-black text-slate-500 dark:text-slate-400">{month}</span>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
}
