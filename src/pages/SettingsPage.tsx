import { Bell, BookOpen, Cloud, Database, FlaskConical, Info, Languages, Leaf, LogOut, Moon, RefreshCw, Sun, Trash2, User, Wheat, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { PageHeader } from '../components/PageHeader';
import { APP_VERSION } from '../config/version';
import { logout } from '../services/authService';
import { checkForUpdate } from '../services/updateService';
import { useAppStore } from '../store/appStore';
import { useScanStore } from '../store/scanStore';
import type { PredictionType, ThemePreference } from '../types';
import { cn } from '../utils/cn';

const themes: Array<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function SettingsPage() {
  const settings = useAppStore((state) => state.settings);
  const user = useAppStore((state) => state.user);
  const isOnline = useAppStore((state) => state.isOnline);
  const setUser = useAppStore((state) => state.setUser);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const addToast = useAppStore((state) => state.addToast);
  const scans = useScanStore((state) => state.scans);
  const clearAll = useScanStore((state) => state.clearAll);
  const [confirmClear, setConfirmClear] = useState(false);
  const setUpdateInfo = useAppStore((state) => state.setUpdateInfo);
  const setShowUpdateDialog = useAppStore((state) => state.setShowUpdateDialog);
  const navigate = useNavigate();

  const [updateState, setUpdateState] = useState<'checking' | 'up-to-date' | 'update-available'>('checking');
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  const checkUpdate = async () => {
    setUpdateState('checking');
    const result = await checkForUpdate(APP_VERSION);
    if (result.available) {
      setLatestVersion(result.version);
      setUpdateState('update-available');
    } else {
      setUpdateState('up-to-date');
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await checkForUpdate(APP_VERSION);
      if (!active) return;
      if (result.available) {
        setLatestVersion(result.version);
        setUpdateState('update-available');
      } else {
        setUpdateState('up-to-date');
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" eyebrow="Preferences" />

      {user && (
        <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-field-700 text-white dark:bg-field-300 dark:text-field-950">
              <User className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-black text-slate-950 dark:text-white">{user.name}</h2>
              <p className="mt-0.5 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
          <Sun className="h-4 w-4 text-field-700 dark:text-field-300" />
          Theme
        </div>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.value}
              type="button"
              onClick={() => updateSettings({ theme: theme.value })}
              className={cn(
                'min-h-11 rounded-2xl text-sm font-black transition',
                settings.theme === theme.value
                  ? 'bg-field-700 text-white dark:bg-field-300 dark:text-field-950'
                  : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
              )}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100">
            <RefreshCw className={cn('h-5 w-5', updateState === 'checking' && 'animate-spin')} />
          </span>
          <div className="flex-1">
            <h2 className="text-sm font-black text-slate-950 dark:text-white">App Update</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {updateState === 'checking' && 'Checking for updates...'}
              {updateState === 'up-to-date' && `App is up to date — v${APP_VERSION}`}
              {updateState === 'update-available' && `Update available — v${latestVersion}`}
            </p>
          </div>
          <button
            type="button"
            onClick={checkUpdate}
            disabled={updateState === 'checking'}
            className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300 disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', updateState === 'checking' && 'animate-spin')} />
            Refresh
          </button>
        </div>
        {updateState === 'update-available' && (
          <button
            type="button"
            onClick={async () => {
              const result = await checkForUpdate(APP_VERSION);
              if (result.available) {
                setUpdateInfo({ version: result.version!, apkUrl: result.apkUrl!, releaseNotes: result.releaseNotes || '' });
                setShowUpdateDialog(true);
              }
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-sm font-black text-white dark:bg-green-500"
          >
            <RefreshCw className="h-4 w-4" />
            Update Now
          </button>
        )}
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
        <label className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100">
              <Languages className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-black text-slate-950 dark:text-white">Language</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{settings.language}</span>
            </span>
          </span>
          <select
            value={settings.language}
            onChange={(event) => updateSettings({ language: event.target.value })}
            className="min-h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option>English</option>
            <option>Filipino</option>
            <option>Cebuano</option>
          </select>
        </label>
      </section>

      <section className="space-y-2 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
        <SettingToggle
          icon={Bell}
          title="Notifications"
          checked={settings.notifications}
          onChange={(value) => updateSettings({ notifications: value })}
        />
        <SettingToggle
          icon={Cloud}
          title="Cloud Backup"
          checked={settings.cloudBackup}
          onChange={(value) => {
            if (value && !isOnline) {
              addToast({ title: 'No internet connected', description: 'Cloud backup requires an internet connection.', tone: 'warning' });
              return;
            }
            if (value && !user) {
              navigate('/login?from=settings');
              return;
            }
            updateSettings({ cloudBackup: value });
          }}
        />
        {settings.cloudBackup && user && (
          <p className="pl-14 text-xs font-semibold text-field-700 dark:text-field-300">
            Syncing as {user.email}
          </p>
        )}
        {!user && (
          <p className="pl-14 text-xs font-semibold text-slate-400 dark:text-slate-500">
            Login to enable cloud sync
          </p>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100">
            <Database className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-950 dark:text-white">Offline Storage</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{scans.length} local scan records</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmClear(true)}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 dark:bg-rose-500/10 dark:text-rose-100"
        >
          <Trash2 className="h-4 w-4" />
          Clear Local Data
        </button>
      </section>

      <CategoryGuide />

      <section className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100">
            <Info className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-950 dark:text-white">About</h2>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
              RiceLeaf AI prototype for rice leaf nutrient detection and fertilizer recommendations.
            </p>
          </div>
        </div>
        {user && user.provider === 'email' && (
          <button
            type="button"
            onClick={async () => {
              await logout();
              await updateSettings({ cloudBackup: false });
              setUser(null);
              addToast({ title: 'Logged out', description: 'Switched to offline mode.', tone: 'info' });
            }}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-700 dark:border-white/10 dark:text-slate-200"
          >
            {settings.theme === 'dark' ? <Moon className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
            Logout
          </button>
        )}
      </section>

      <ConfirmationDialog
        open={confirmClear}
        title="Clear local data?"
        description="This deletes scan records stored on this device. Cloud copies are not affected."
        confirmLabel="Clear"
        onCancel={() => setConfirmClear(false)}
        onConfirm={async () => {
          await clearAll();
          setConfirmClear(false);
          addToast({ title: 'Local data cleared', tone: 'warning' });
        }}
      />
    </div>
  );
}

interface SettingToggleProps {
  icon: LucideIcon;
  title: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const categoryInfo: Record<PredictionType, {
  icon: LucideIcon;
  color: string;
  role: string;
  roleDetail: string;
  causes: string[];
  symptoms: string[];
  solution: string;
}> = {
  'Nitrogen Deficiency': {
    icon: Leaf,
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200',
    role: 'Nitrogen (N) — The Growth Builder',
    roleDetail: 'Nitrogen is the most critical nutrient for rice. It drives chlorophyll production, protein synthesis, and vegetative growth. A nitrogen-rich plant has tall, deep-green leaves and strong tillering.',
    causes: [
      'Low soil organic matter',
      'Leaching from heavy rainfall or over-irrigation',
      'Insufficient basal fertilizer application',
      'Sandy or highly permeable soils',
    ],
    symptoms: [
      'Pale green to yellow older leaves (starting from tips)',
      'Stunted growth with thin stems',
      'Reduced tillering (fewer stalks per hill)',
      'Overall pale canopy (field looks light green from afar)',
    ],
    solution: 'Apply urea (46-0-0) at 50 kg/ha in split doses. First dose at transplanting, second at mid-tillering, third at panicle initiation. Avoid over-application to prevent lodging and pest buildup.',
  },
  'Phosphorus Deficiency': {
    icon: Wheat,
    color: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-200',
    role: 'Phosphorus (P) — The Root & Energy Driver',
    roleDetail: 'Phosphorus fuels energy transfer (ATP), root development, and early seedling vigor. It is essential for flowering, grain formation, and improving the plant\'s resilience to cold and disease.',
    causes: [
      'Acidic or waterlogged soils that lock up phosphorus',
      'Low native soil phosphorus content',
      'Inadequate P fertilizer at planting',
      'Cold soil temperatures slowing root uptake',
    ],
    symptoms: [
      'Dark green leaves with purplish or reddish discoloration',
      'Delayed tillering and slow early growth',
      'Narrow, upright leaf blades',
      'Poor root system and reduced grain filling',
    ],
    solution: 'Apply DAP (18-46-0) at 40 kg/ha near the root zone during land preparation or early transplanting. Ensure adequate soil moisture for uptake. Consider phosphate-solubilizing biofertilizers.',
  },
  'Potassium Deficiency': {
    icon: FlaskConical,
    color: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-200',
    role: 'Potassium (K) — The Stress Shield',
    roleDetail: 'Potassium regulates water balance, enzyme activation, and photosynthesis. It strengthens stalks against lodging, improves grain quality, and boosts resistance to diseases, drought, and pests.',
    causes: [
      'Potassium depletion from continuous rice cropping',
      'Burning or scorching due to excessive N without K',
      'Light-textured soils with low K-fixing capacity',
      'Limited crop residue return (rice straw removal)',
    ],
    symptoms: [
      'Brown or scorched leaf tips and edges (starting on older leaves)',
      'Weak stems prone to lodging (plants fall over)',
      'Dark brown spots or rust-like lesions on leaf blades',
      'Uneven grain ripening and chalky kernels',
    ],
    solution: 'Apply Muriate of Potash (0-0-60) at 35 kg/ha. Split into two doses — half at basal, half at panicle initiation. Incorporate rice straw into soil to recycle potassium naturally.',
  },
  'Brown Spot': {
    icon: Wheat,
    color: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
    role: 'Brown Spot — Fungal Disease',
    roleDetail: 'Brown Spot is caused by the fungus Cochliobolus miyabeanus (Helminthosporium oryzae). It causes small circular brown spots with gray centers on leaves, reducing photosynthesis and grain yield.',
    causes: [
      'High humidity and warm temperatures (25-30°C)',
      'Nitrogen-deficient plants are more susceptible',
      'Continuous rice cropping without rotation',
      'Infected seeds or crop debris',
    ],
    symptoms: [
      'Small circular brown spots on leaves (0.5-2mm)',
      'Spots have gray center with brown border',
      'Spots coalesce in severe cases',
      'Affected leaves turn yellow and dry up',
    ],
    solution: 'Apply Mancozeb or copper-based fungicide at 2 g/L of water. Spray every 7-10 days for 2-3 applications. Remove and burn severely infected leaves. Use balanced fertilizer — avoid nitrogen deficiency.',
  },
  'Rice Blast': {
    icon: Wheat,
    color: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
    role: 'Rice Blast — Fungal Disease',
    roleDetail: 'Rice Blast is caused by the fungus Magnaporthe grisea (Pyricularia oryzae). It produces diamond-shaped lesions with gray centers and brown borders. One of the most destructive rice diseases worldwide.',
    causes: [
      'High humidity (90%+) and moderate temperatures (24-28°C)',
      'Excessive nitrogen fertilizer',
      'Dense planting reducing air circulation',
      'Dew and frequent rain on leaf surfaces',
    ],
    symptoms: [
      'Diamond-shaped lesions with gray center and brown border',
      'Lesions on leaves, stems, and panicles',
      'Neck blast causes panicle to dry and break',
      'Rapid spread in humid conditions',
    ],
    solution: 'Apply Tricyclazole or Azoxystrobin at 1.5 g/L of water at first sign. Spray every 7 days for 2-3 applications. Reduce nitrogen fertilizer during infection. Plant resistant varieties (NSIC Rc 152, Rc 160).',
  },
  'Bacterial Leaf Blight': {
    icon: Wheat,
    color: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
    role: 'Bacterial Leaf Blight — Bacterial Disease',
    roleDetail: 'Bacterial Leaf Blight (BLB) is caused by the bacterium Xanthomonas oryzae pv. oryzae. It starts as water-soaked lesions at leaf tips, turning into yellow-white streaks along veins. Can cause up to 50% yield loss.',
    causes: [
      'Wounds from wind, rain, or insect damage',
      'High humidity and temperature (28-34°C)',
      'Excessive nitrogen fertilizer',
      'Flooding and standing water in field',
    ],
    symptoms: [
      'Yellow to white streaks along leaf veins',
      'Water-soaked lesions starting from leaf tip',
      'Lesions expand and turn grayish-white',
      'Leaves dry up and die prematurely',
    ],
    solution: 'Apply Copper oxychloride or Copper hydroxide at 2 g/L of water. Spray every 7 days. Remove and burn infected leaves. Drain field partially. Use resistant varieties (NSIC Rc 192, Rc 216).',
  },
  'Rice Leaf Diseases': {
    icon: Wheat,
    color: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
    role: 'Rice Leaf Diseases — Pathogen Infections',
    roleDetail: 'Various fungal, bacterial, and viral pathogens can attack rice leaves, reducing photosynthetic area and grain yield. Common diseases include Bacterial Leaf Blight, Brown Spot, and Rice Blast.',
    causes: [
      'High humidity and prolonged leaf wetness',
      'Dense planting with poor air circulation',
      'Excessive nitrogen fertilizer making plants susceptible',
      'Infected seeds or crop debris from previous seasons',
    ],
    symptoms: [
      'Water-soaked lesions turning yellow or brown',
      'Irregular spots, blights, or smut on leaf blades',
      'Wilting, curling, or drying of leaf tips',
      'Rapid spread across the field during wet weather',
    ],
    solution: 'Use pathogen-specific treatments — copper-based bactericides for bacterial blight, fungicides (tricyclazole, propiconazole) for fungal diseases. Remove infected debris and practice crop rotation. Consult local agricultural extension for region-specific recommendations.',
  },
  Healthy: {
    icon: Leaf,
    color: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-200',
    role: 'Healthy Rice Plant — Optimal Condition',
    roleDetail: 'A healthy rice plant shows balanced nutrition, adequate water, and no visible stress. The leaves maintain a vibrant green color, stems are sturdy, and growth progresses normally through all stages from seedling to harvest.',
    causes: [
      'Balanced NPK fertilization based on soil test',
      'Proper water management (alternate wetting and drying)',
      'Good field sanitation and weed control',
      'Use of disease-free certified seeds',
    ],
    symptoms: [
      'Uniform green color across all leaves',
      'Strong, upright stems with normal tillering',
      'No spots, lesions, yellowing, or leaf deformities',
      'Consistent growth stage progression',
    ],
    solution: 'Continue with a maintenance fertilizer program based on regular soil testing. Monitor soil moisture and nutrient balance. Scout fields weekly for early signs of pest or disease outbreaks. Preventive care keeps yields high.',
  },
};

function CategoryGuide() {
  const [expanded, setExpanded] = useState<PredictionType | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const entries = Object.keys(categoryInfo) as PredictionType[];

  return (
    <section className="rounded-2xl border border-white/70 bg-white/90 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
      <button
        type="button"
        onClick={() => setShowGuide(!showGuide)}
        className="flex w-full items-center justify-between p-4"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100">
            <BookOpen className="h-5 w-5" />
          </span>
          <div className="text-left">
            <h2 className="text-sm font-black text-slate-950 dark:text-white">Nutrient & Disease Guide</h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Learn what each category means
            </p>
          </div>
        </span>
        <span className={cn('text-slate-400 transition', showGuide && 'rotate-180')}>
          ▼
        </span>
      </button>
      {showGuide && (
        <div className="space-y-3 px-4 pb-4">
          {entries.map((key) => {
            const info = categoryInfo[key];
            const isOpen = expanded === key;
            return (
              <div
                key={key}
                className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="flex w-full items-center justify-between p-3"
                >
                  <span className="flex items-center gap-2.5">
                    <span className={cn('grid h-8 w-8 place-items-center rounded-xl', info.color)}>
                      <info.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-black text-slate-950 dark:text-white">{key}</span>
                  </span>
                  <span className={cn('text-xs text-slate-400 transition', isOpen && 'rotate-180')}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-200/80 px-3 pb-3 pt-2 dark:border-white/10">
                    <div className={cn('mb-2 rounded-xl p-2.5', info.color)}>
                      <p className="text-xs font-black">{info.role}</p>
                      <p className="mt-1 text-xs leading-5 opacity-85">{info.roleDetail}</p>
                    </div>

                    <p className="mb-1 mt-2.5 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">Common Causes</p>
                    <ul className="space-y-0.5">
                      {info.causes.map((cause) => (
                        <li key={cause} className="flex items-start gap-1.5 text-xs leading-5 text-slate-600 dark:text-slate-400">
                          <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                          {cause}
                        </li>
                      ))}
                    </ul>

                    <p className="mb-1 mt-3 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">Symptoms</p>
                    <ul className="space-y-0.5">
                      {info.symptoms.map((symptom) => (
                        <li key={symptom} className="flex items-start gap-1.5 text-xs leading-5 text-slate-600 dark:text-slate-400">
                          <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                          {symptom}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 rounded-xl bg-field-50 p-2.5 dark:bg-field-500/10">
                      <p className="text-[11px] font-black uppercase tracking-wider text-field-800 dark:text-field-200">Recommendation</p>
                      <p className="mt-0.5 text-xs leading-5 text-field-700 dark:text-field-200/80">{info.solution}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SettingToggle({ icon: Icon, title, checked, onChange }: SettingToggleProps) {
  return (
    <label className="flex min-h-14 items-center justify-between gap-3">
      <span className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-black text-slate-950 dark:text-white">{title}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" />
      <span
        className={cn(
          'relative h-8 w-14 rounded-full p-1 transition',
          checked ? 'bg-field-700 dark:bg-field-300' : 'bg-slate-200 dark:bg-white/12',
        )}
      >
        <span
          className={cn(
            'block h-6 w-6 rounded-full bg-white shadow transition dark:bg-slate-950',
            checked && 'translate-x-6 dark:bg-field-950',
          )}
        />
      </span>
    </label>
  );
}
