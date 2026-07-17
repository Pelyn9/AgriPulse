import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { getPendingScans } from '../offline/database';
import { useAppStore } from '../store/appStore';

const CHECK_INTERVAL = 8000;
const CONNECTIVITY_URL = 'https://httpbin.org/get';

async function checkInternet(): Promise<boolean> {
  if (!navigator.onLine) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(CONNECTIVITY_URL, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

export function useConnectionStatus() {
  const setOnline = useAppStore((state) => state.setOnline);
  const setSyncPrompt = useAppStore((state) => state.setSyncPrompt);
  const dismissed = useAppStore((state) => state.syncPromptDismissed);

  useEffect(() => {
    let cancelled = false;

    const handleOnlineStatus = async (online: boolean) => {
      if (cancelled) return;
      if (online) {
        setOnline(true);
        const pending = await getPendingScans();
        if (!cancelled && pending.length > 0 && !dismissed) {
          setSyncPrompt(true);
        }
      } else {
        setOnline(false);
        setSyncPrompt(false);
      }
    };

    if (Capacitor.isNativePlatform()) {
      const listener = Network.addListener('networkStatusChange', (status) => {
        if (!cancelled) handleOnlineStatus(status.connected);
      });

      Network.getStatus().then((status) => {
        if (!cancelled) handleOnlineStatus(status.connected);
      });

      return () => {
        cancelled = true;
        listener.then((l) => l.remove());
      };
    }

    const onBrowserOnline = () => checkInternet().then(handleOnlineStatus);
    const onBrowserOffline = () => handleOnlineStatus(false);

    window.addEventListener('online', onBrowserOnline);
    window.addEventListener('offline', onBrowserOffline);

    checkInternet().then(handleOnlineStatus);

    const interval = window.setInterval(() => {
      checkInternet().then((online) => {
        if (!cancelled) setOnline(online);
      });
    }, CHECK_INTERVAL);

    return () => {
      cancelled = true;
      window.removeEventListener('online', onBrowserOnline);
      window.removeEventListener('offline', onBrowserOffline);
      clearInterval(interval);
    };
  }, [setOnline, setSyncPrompt, dismissed]);
}
