import { create } from 'zustand';
import { defaultSettings, getSettings, saveSettings } from '../offline/database';
import type { AppSettings, SyncProgress, ToastMessage, UserSession } from '../types';
import { createId } from '../utils/id';

interface UpdateInfo {
  version: string;
  apkUrl: string;
  releaseNotes: string;
}

interface AppState {
  isOnline: boolean;
  isOfflineMode: boolean;
  settings: AppSettings;
  user: UserSession | null;
  showSyncPrompt: boolean;
  syncPromptDismissed: boolean;
  swUpdateAvailable: boolean;
  syncProgress: SyncProgress;
  toasts: ToastMessage[];
  updateInfo: UpdateInfo | null;
  showUpdateDialog: boolean;
  updateProgress: number;
  showWhatsNew: boolean;
  whatsNewReviewMode: boolean;
  initializeSettings: () => Promise<void>;
  setOnline: (isOnline: boolean) => void;
  setOfflineMode: (offline: boolean) => void;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  setUser: (user: UserSession | null) => void;
  setSyncPrompt: (show: boolean) => void;
  setSwUpdateAvailable: (available: boolean) => void;
  setSyncProgress: (progress: SyncProgress) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  setUpdateInfo: (info: UpdateInfo | null) => void;
  setShowUpdateDialog: (show: boolean) => void;
  setUpdateProgress: (progress: number) => void;
  setShowWhatsNew: (show: boolean, reviewMode?: boolean) => void;
}

const USER_STORAGE_KEY = 'agripulse_user';

function loadPersistedUser(): UserSession | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  isOnline: true,
  isOfflineMode: false,
  settings: defaultSettings,
  user: loadPersistedUser(),
  showSyncPrompt: false,
  syncPromptDismissed: false,
  swUpdateAvailable: false,
  syncProgress: {
    status: 'idle',
    uploaded: 0,
    total: 0,
  },
  toasts: [],
  updateInfo: null,
  showUpdateDialog: false,
  updateProgress: -1,
  showWhatsNew: false,
  whatsNewReviewMode: false,
  initializeSettings: async () => {
    const settings = await getSettings();
    set({ settings });
  },
  setOnline: (isOnline) => set({ isOnline }),
  setOfflineMode: (isOfflineMode) => set({ isOfflineMode }),
  updateSettings: async (settingsPatch) => {
    const next = { ...get().settings, ...settingsPatch };
    await saveSettings(next);
    set({ settings: next });
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    set({ user, isOfflineMode: user ? false : true });
    if (!user) {
      const next = { ...get().settings, cloudBackup: false };
      saveSettings(next);
      set({ settings: next });
    }
  },
  setSyncPrompt: (showSyncPrompt) => set({ showSyncPrompt, syncPromptDismissed: showSyncPrompt ? false : true }),
  setSwUpdateAvailable: (swUpdateAvailable) => set({ swUpdateAvailable }),
  setSyncProgress: (syncProgress) => set({ syncProgress }),
  addToast: (toast) => {
    const id = createId('toast');
    set((state) => ({
      toasts: [...state.toasts, { id, ...toast }],
    }));

    window.setTimeout(() => get().removeToast(id), 4200);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  setUpdateInfo: (updateInfo) => set({ updateInfo }),
  setShowUpdateDialog: (showUpdateDialog) => set({ showUpdateDialog }),
  setUpdateProgress: (updateProgress) => set({ updateProgress }),
  setShowWhatsNew: (show, reviewMode = false) => set({ showWhatsNew: show, whatsNewReviewMode: reviewMode }),
}));
