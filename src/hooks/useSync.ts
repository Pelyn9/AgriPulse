import { useCallback } from 'react';
import { getPendingScans } from '../offline/database';
import { useAppStore } from '../store/appStore';
import { useScanStore } from '../store/scanStore';
import { uploadPendingScans } from '../services/syncService';
import type { UserSession } from '../types';

export function useSync() {
  const user = useAppStore((state) => state.user);
  const setSyncProgress = useAppStore((state) => state.setSyncProgress);
  const addToast = useAppStore((state) => state.addToast);
  const loadScans = useScanStore((state) => state.loadScans);

  return useCallback(async (sessionOverride?: UserSession) => {
    const activeUser = sessionOverride ?? useAppStore.getState().user ?? user;

    if (!activeUser) {
      return false;
    }

    const pending = await getPendingScans();

    if (pending.length === 0) {
      return true;
    }

    setSyncProgress({
      status: 'uploading',
      uploaded: 0,
      total: pending.length,
      message: 'Uploading local scans...',
    });

    try {
      await uploadPendingScans(pending, activeUser, (uploaded, total) => {
        setSyncProgress({
          status: uploaded === total ? 'complete' : 'uploading',
          uploaded,
          total,
          message: uploaded === total ? 'Complete' : `Uploading... ${uploaded} of ${total} scans`,
        });
      });
      await loadScans();
      addToast({ title: 'Sync complete', description: 'Local scans were marked as backed up.', tone: 'success' });
      return true;
    } catch (error) {
      setSyncProgress({
        status: 'error',
        uploaded: 0,
        total: pending.length,
        message: error instanceof Error ? error.message : 'Sync failed',
      });
      addToast({ title: 'Sync failed', description: 'Your local copies are still available.', tone: 'error' });
      return false;
    }
  }, [addToast, loadScans, setSyncProgress, user]);
}
