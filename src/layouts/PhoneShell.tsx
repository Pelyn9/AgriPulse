import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { SyncProgressDialog } from '../components/SyncProgressDialog';
import { SyncPromptModal } from '../components/SyncPromptModal';
import { ToastViewport } from '../components/ToastViewport';
import { UpdateDialog } from '../components/UpdateDialog';
import { WhatsNewDialog } from '../components/WhatsNewDialog';
import { useAppStore } from '../store/appStore';

interface PhoneShellProps {
  children: ReactNode;
}

export function PhoneShell({ children }: PhoneShellProps) {
  const swUpdateAvailable = useAppStore((state) => state.swUpdateAvailable);
  const showWhatsNew = useAppStore((state) => state.showWhatsNew);
  const whatsNewReviewMode = useAppStore((state) => state.whatsNewReviewMode);
  const setShowWhatsNew = useAppStore((state) => state.setShowWhatsNew);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#bbf7d0,transparent_34%),linear-gradient(135deg,#eef8f0,#d3e7d9_46%,#b8d6c2)] p-0 text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,#14532d,transparent_34%),linear-gradient(135deg,#06140d,#0b2417_52%,#102018)] md:grid md:place-items-center md:p-6">
      <div className="relative h-screen h-mobile-dvh w-full overflow-hidden bg-field-50 shadow-2xl shadow-field-950/20 dark:bg-[#07140e] md:h-[min(920px,calc(100vh-2rem))] md:max-w-[430px] md:rounded-[2.2rem] md:ring-1 md:ring-white/40 dark:md:ring-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_6%,rgba(34,197,94,.22),transparent_24%),radial-gradient(circle_at_94%_10%,rgba(245,158,11,.16),transparent_24%)] dark:bg-[radial-gradient(circle_at_15%_6%,rgba(34,197,94,.16),transparent_24%),radial-gradient(circle_at_94%_10%,rgba(245,158,11,.12),transparent_24%)]" />
        <div className="relative flex h-full flex-col">
          {swUpdateAvailable && (
            <button
              onClick={() => window.location.reload()}
              className="sticky top-0 z-50 flex min-h-11 items-center justify-center gap-2 bg-field-700 text-xs font-black text-white dark:bg-field-300 dark:text-field-950"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              New version available — Tap to update
            </button>
          )}
          {children}
        </div>
        <SyncPromptModal />
        <SyncProgressDialog />
        <UpdateDialog />
        <WhatsNewDialog open={showWhatsNew} onDismiss={() => setShowWhatsNew(false)} reviewMode={whatsNewReviewMode} />
        <ToastViewport />
      </div>
    </div>
  );
}
