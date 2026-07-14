import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, RefreshCw, X, CheckCircle } from 'lucide-react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { useAppStore } from '../store/appStore';

interface ApkInstallerPlugin {
  downloadAndInstall(opts: { url: string; fileName: string }): Promise<void>;
  addListener(
    event: string,
    cb: (data: { progress?: number; status?: string }) => void,
  ): { remove: () => void };
}

const ApkInstaller = registerPlugin<ApkInstallerPlugin>('ApkInstaller');

export function UpdateDialog() {
  const open = useAppStore((state) => state.showUpdateDialog);
  const updateInfo = useAppStore((state) => state.updateInfo);
  const setShowUpdateDialog = useAppStore((state) => state.setShowUpdateDialog);
  const setUpdateInfo = useAppStore((state) => state.setUpdateInfo);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done' | 'error'>('idle');

  const dismiss = () => {
    setShowUpdateDialog(false);
    setUpdateInfo(null);
    setDownloading(false);
    setProgress(0);
    setStatus('idle');
  };

  const handleUpdate = async () => {
    if (!updateInfo?.apkUrl) return;
    if (Capacitor.isNativePlatform() === false) return;

    setDownloading(true);
    setStatus('downloading');
    setProgress(0);

    try {
      const listener = ApkInstaller.addListener('downloadProgress', (data) => {
        if (data.progress !== undefined) setProgress(data.progress);
        if (data.status === 'installed') setStatus('done');
      });

      await ApkInstaller.downloadAndInstall({
        url: updateInfo.apkUrl,
        fileName: `agripulse-v${updateInfo.version}.apk`,
      });

      listener.remove();
    } catch {
      setStatus('error');
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && updateInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-60 grid place-items-center bg-slate-950/45 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 18, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 18, scale: 0.96 }}
            className="w-full max-w-sm rounded-3xl border border-white/60 bg-white/95 p-5 shadow-glass dark:border-white/10 dark:bg-slate-950/95"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-200">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Update Available</h2>
            <p className="mt-1 text-sm font-bold text-green-600 dark:text-green-400">
              AgriPulse v{updateInfo.version}
            </p>
            {updateInfo.releaseNotes && (
              <p className="mt-2 max-h-24 overflow-y-auto text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                {updateInfo.releaseNotes}
              </p>
            )}

            {downloading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>
                    {status === 'downloading' && 'Downloading...'}
                    {status === 'done' && 'Update ready to install!'}
                    {status === 'error' && 'Download failed'}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <div className="mt-5 grid gap-2">
              {status === 'error' && (
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white"
                >
                  <Download className="h-4 w-4" />
                  Retry Download
                </button>
              )}
              {status !== 'error' && (
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={downloading}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 text-sm font-bold text-white disabled:opacity-50"
                >
                  {downloading ? (
                    <CheckCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloading ? 'Downloading...' : 'Update Now'}
                </button>
              )}
              <button
                type="button"
                onClick={dismiss}
                disabled={downloading}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 dark:border-white/10 dark:text-slate-200 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
