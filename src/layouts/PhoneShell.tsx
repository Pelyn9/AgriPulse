import type { ReactNode } from 'react';
import { SyncProgressDialog } from '../components/SyncProgressDialog';
import { SyncPromptModal } from '../components/SyncPromptModal';
import { ToastViewport } from '../components/ToastViewport';
import { UpdateDialog } from '../components/UpdateDialog';

interface PhoneShellProps {
  children: ReactNode;
}

export function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#bbf7d0,transparent_34%),linear-gradient(135deg,#eef8f0,#d3e7d9_46%,#b8d6c2)] p-0 text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,#14532d,transparent_34%),linear-gradient(135deg,#06140d,#0b2417_52%,#102018)] md:grid md:place-items-center md:p-6">
      <div className="relative h-screen h-mobile-dvh w-full overflow-hidden bg-field-50 shadow-2xl shadow-field-950/20 dark:bg-[#07140e] md:h-[min(920px,calc(100vh-2rem))] md:max-w-[430px] md:rounded-[2.2rem] md:ring-1 md:ring-white/40 dark:md:ring-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_6%,rgba(34,197,94,.22),transparent_24%),radial-gradient(circle_at_94%_10%,rgba(245,158,11,.16),transparent_24%)] dark:bg-[radial-gradient(circle_at_15%_6%,rgba(34,197,94,.16),transparent_24%),radial-gradient(circle_at_94%_10%,rgba(245,158,11,.12),transparent_24%)]" />
        <div className="relative flex h-full flex-col">{children}</div>
        <SyncPromptModal />
        <SyncProgressDialog />
        <UpdateDialog />
        <ToastViewport />
      </div>
    </div>
  );
}
