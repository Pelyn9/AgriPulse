import { useEffect } from 'react';
import { PhoneShell } from './layouts/PhoneShell';
import { AppRoutes } from './routes/AppRoutes';
import { useConnectionStatus } from './hooks/useConnectionStatus';
import { useSync } from './hooks/useSync';
import { useTheme } from './hooks/useTheme';
import { useAppStore } from './store/appStore';
import { useScanStore } from './store/scanStore';

export default function App() {
  const initializeSettings = useAppStore((state) => state.initializeSettings);
  const isOnline = useAppStore((state) => state.isOnline);
  const user = useAppStore((state) => state.user);
  const syncProgress = useAppStore((state) => state.syncProgress.status);
  const loadScans = useScanStore((state) => state.loadScans);
  const sync = useSync();

  useConnectionStatus();
  useTheme();

  useEffect(() => {
    initializeSettings();
    loadScans();
  }, [initializeSettings, loadScans]);

  useEffect(() => {
    if (isOnline && user && syncProgress === 'idle') {
      sync();
    }
  }, [isOnline, sync, syncProgress, user]);

  return (
    <PhoneShell>
      <AppRoutes />
    </PhoneShell>
  );
}
