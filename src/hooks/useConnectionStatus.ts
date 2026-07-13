import { useEffect } from 'react';
import { Network } from '@capacitor/network';
import { getPendingScans } from '../offline/database';
import { useAppStore } from '../store/appStore';

export function useConnectionStatus() {
  const setOnline = useAppStore((state) => state.setOnline);
  const setSyncPrompt = useAppStore((state) => state.setSyncPrompt);

  useEffect(() => {
    let cancelled = false;

    const handleOnline = async () => {
      setOnline(true);
      const pending = await getPendingScans();
      if (pending.length > 0) {
        setSyncPrompt(true);
      }
    };

    const handleOffline = () => {
      setOnline(false);
      setSyncPrompt(false);
    };

    Network.addListener('networkStatusChange', (status) => {
      if (cancelled) return;
      if (status.connected) {
        handleOnline();
      } else {
        handleOffline();
      }
    });

    Network.getStatus().then((status) => {
      if (cancelled) return;
      if (status.connected) {
        handleOnline();
      } else {
        handleOffline();
      }
    });

    return () => {
      cancelled = true;
      Network.removeAllListeners();
    };
  }, [setOnline, setSyncPrompt]);
}
