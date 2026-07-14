import { useEffect } from 'react';
import { PhoneShell } from './layouts/PhoneShell';
import { AppRoutes } from './routes/AppRoutes';
import { useConnectionStatus } from './hooks/useConnectionStatus';
import { useSync } from './hooks/useSync';
import { useTheme } from './hooks/useTheme';
import { useUpdateChecker } from './hooks/useUpdateChecker';
import { useAppStore } from './store/appStore';
import { useScanStore } from './store/scanStore';
import { APP_VERSION } from './config/version';

const SEEN_VERSION_KEY = 'agripulse_seen_version';

export default function App() {
  const initializeSettings = useAppStore((state) => state.initializeSettings);
  const isOnline = useAppStore((state) => state.isOnline);
  const user = useAppStore((state) => state.user);
  const cloudBackup = useAppStore((state) => state.settings.cloudBackup);
  const syncProgress = useAppStore((state) => state.syncProgress.status);
  const setShowWhatsNew = useAppStore((state) => state.setShowWhatsNew);
  const loadScans = useScanStore((state) => state.loadScans);
  const sync = useSync();

  useConnectionStatus();
  useTheme();
  useUpdateChecker();

  useEffect(() => {
    initializeSettings();
    loadScans();
  }, [initializeSettings, loadScans]);

  useEffect(() => {
    const seen = localStorage.getItem(SEEN_VERSION_KEY);
    if (seen !== APP_VERSION) {
      setShowWhatsNew(true, false);
      localStorage.setItem(SEEN_VERSION_KEY, APP_VERSION);
    }
  }, [setShowWhatsNew]);

  useEffect(() => {
    if (isOnline && user && cloudBackup && syncProgress === 'idle') {
      sync();
    }
  }, [isOnline, cloudBackup, sync, syncProgress, user]);

  return (
    <PhoneShell>
      <AppRoutes />
    </PhoneShell>
  );
}
