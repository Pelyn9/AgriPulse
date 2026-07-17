import { useMemo } from 'react';
import { BarChart3, Database, FileSpreadsheet, FileText, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { AnimatedCard } from '../components/AnimatedCard';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { useAppStore } from '../store/appStore';
import { useScanStore } from '../store/scanStore';
import { scansToCsv, exportExcel, exportPdf, downloadTextFile } from '../utils/csv';

const CATEGORIES = [
  { label: 'Healthy', color: '#16a34a' },
  { label: 'Nitrogen Deficiency', color: '#3b82f6' },
  { label: 'Phosphorus Deficiency', color: '#a855f7' },
  { label: 'Potassium Deficiency', color: '#f59e0b' },
  { label: 'Brown Spot', color: '#f97316' },
  { label: 'Rice Blast', color: '#f43f5e' },
  { label: 'Bacterial Leaf Blight', color: '#ef4444' },
  { label: 'Rice Leaf Diseases', color: '#ec4899' },
];

const EXPORT_OPTIONS = [
  {
    key: 'csv' as const,
    label: 'CSV',
    desc: 'Comma-separated data',
    icon: FileText,
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'excel' as const,
    label: 'Excel',
    desc: 'Spreadsheet with details',
    icon: FileSpreadsheet,
    color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'pdf' as const,
    label: 'PDF',
    desc: 'Formatted report',
    icon: FileText,
    color: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
] as const;

function PieTooltipContent({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-white/10 dark:bg-slate-900">
      <p className="text-xs font-black text-slate-950 dark:text-white">{d.name}</p>
      <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {d.value} scan{d.value !== 1 ? 's' : ''} &middot; {d.percent}%
      </p>
    </div>
  );
}

function BarTooltipContent({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-white/10 dark:bg-slate-900">
      <p className="text-xs font-black text-slate-950 dark:text-white">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-field-600 dark:text-field-300">
        {payload[0].value} scan{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

function renderBarLabel(props: any) {
  const { x, y, width, value } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="currentColor"
      textAnchor="middle"
      fontSize={11}
      fontWeight={800}
      className="fill-slate-700 dark:fill-slate-200"
    >
      {value}
    </text>
  );
}

export function ReportsPage() {
  const scans = useScanStore((state) => state.scans);
  const addToast = useAppStore((state) => state.addToast);
  const healthy = scans.filter((scan) => scan.prediction === 'Healthy').length;
  const pending = scans.filter((scan) => !scan.synced).length;

  const pieData = useMemo(() => {
    const counts = CATEGORIES.map((cat) => ({
      name: cat.label,
      value: scans.filter((s) => s.prediction === cat.label).length,
      color: cat.color,
    })).filter((c) => c.value > 0);

    const total = scans.length || 1;
    return counts.map((c) => ({
      ...c,
      percent: Math.round((c.value / total) * 100),
    }));
  }, [scans]);

  const barData = useMemo(() => {
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts: Record<string, number> = {};

    scans.forEach((scan) => {
      const d = new Date(scan.createdAt);
      const key = `${monthOrder[d.getMonth()]} ${d.getFullYear()}`;
      counts[key] = (counts[key] ?? 0) + 1;
    });

    const entries = Object.entries(counts)
      .map(([month, count]) => {
        const [m, y] = month.split(' ');
        return { month, count, sortKey: Number(y) * 12 + monthOrder.indexOf(m) };
      })
      .sort((a, b) => a.sortKey - b.sortKey)
      .slice(-6);

    return entries.map(({ month, count }) => ({ month, scans: count }));
  }, [scans]);

  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    if (!scans.length) {
      addToast({ title: 'No data', description: 'No scans to export.', tone: 'warning' });
      return;
    }
    const ts = new Date().toISOString().slice(0, 10);
    if (type === 'csv') {
      downloadTextFile(`agripulse-report-${ts}.csv`, scansToCsv(scans), 'text/csv');
      addToast({ title: 'CSV exported', description: `${scans.length} scans saved.`, tone: 'success' });
    } else if (type === 'excel') {
      exportExcel(scans, `agripulse-report-${ts}.xlsx`);
      addToast({ title: 'Excel exported', description: `${scans.length} scans saved.`, tone: 'success' });
    } else {
      exportPdf(scans, `agripulse-report-${ts}.pdf`);
      addToast({ title: 'PDF exported', description: `${scans.length} scans saved.`, tone: 'success' });
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Reports" eyebrow="Field summaries" />

      <AnimatedCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">Export Data</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {scans.length} scan{scans.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <Database className="h-5 w-5 text-field-700 dark:text-field-300" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {EXPORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleExport(opt.key)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/70 bg-white/60 p-4 text-center shadow-sm backdrop-blur-xl transition active:scale-[0.97] dark:border-white/10 dark:bg-white/5"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${opt.color}`}>
                <opt.icon className={`h-5 w-5 ${opt.iconColor}`} />
              </span>
              <span className="text-xs font-black text-slate-950 dark:text-white">{opt.label}</span>
              <span className="text-[10px] font-semibold leading-tight text-slate-500 dark:text-slate-400">{opt.desc}</span>
            </button>
          ))}
        </div>
      </AnimatedCard>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-950 dark:text-white">Statistics</h2>
          <Database className="h-5 w-5 text-field-700 dark:text-field-300" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Total" value={scans.length} icon={Database} tone="green" />
          <StatCard label="Healthy" value={healthy} icon={PieIcon} tone="blue" />
          <StatCard label="Pending" value={pending} icon={BarChart3} tone="rose" />
        </div>
      </section>

      <AnimatedCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">By Category</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {scans.length > 0 ? `${scans.length} total scans` : 'No data yet'}
            </p>
          </div>
          <PieIcon className="h-5 w-5 text-field-700 dark:text-field-300" />
        </div>

        {pieData.length > 0 ? (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative h-52 w-52 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-950 dark:text-white">{scans.length}</span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">scans</span>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-2.5">
              {pieData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-xs font-black text-slate-700 dark:text-slate-200">{cat.name}</span>
                      <span className="shrink-0 text-xs font-black text-slate-950 dark:text-white">{cat.value}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-slate-400 dark:text-slate-500">{cat.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No scans yet</p>
          </div>
        )}
      </AnimatedCard>

      {barData.length > 0 && (
        <AnimatedCard>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">Monthly Scans</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Last {barData.length} month{barData.length !== 1 ? 's' : ''}
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-field-700 dark:text-field-300" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 4, left: -16, bottom: 0 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-white/10" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fontWeight: 700 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-slate-500 dark:fill-slate-400"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fontWeight: 700 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-slate-500 dark:fill-slate-400"
                />
                <Tooltip content={<BarTooltipContent />} cursor={{ fill: 'rgba(22, 163, 74, 0.08)' }} />
                <Bar dataKey="scans" fill="#16a34a" radius={[8, 8, 0, 0]} maxBarSize={48}>
                  <LabelList dataKey="scans" content={renderBarLabel} position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
      )}
    </div>
  );
}
