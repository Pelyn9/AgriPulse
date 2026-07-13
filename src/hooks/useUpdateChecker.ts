import { useEffect, useRef } from 'react';
import { APP_VERSION } from '../config/version';
import { useAppStore } from '../store/appStore';
import { checkForUpdate } from '../services/updateService';

export function useUpdateChecker() {
  const isOnline = useAppStore((state) => state.isOnline);
  const setUpdateInfo = useAppStore((state) => state.setUpdateInfo);
  const setShowUpdateDialog = useAppStore((state) => state.setShowUpdateDialog);
  const checked = useRef(false);

  useEffect(() => {
    if (!isOnline || checked.current) return;
    checked.current = true;

    const timer = setTimeout(async () => {
      const result = await checkForUpdate(APP_VERSION);
      if (result.available && result.version && result.apkUrl) {
        setUpdateInfo({
          version: result.version,
          apkUrl: result.apkUrl,
          releaseNotes: result.releaseNotes || '',
        });
        setShowUpdateDialog(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isOnline, setUpdateInfo, setShowUpdateDialog]);
}
