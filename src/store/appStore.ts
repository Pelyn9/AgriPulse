import { create } from 'zustand';
import { defaultSettings, getSettings, saveSettings } from '../offline/database';
import type { AppSettings, SyncProgress, ToastMessage, UserSession } from '../types';
import { createId } from '../utils/id';

interface AppState {
  isOnline: boolean;
  settings: AppSettings;
  user: UserSession | null;
  showSyncPrompt: boolean;
  syncProgress: SyncProgress;
  toasts: ToastMessage[];
  initializeSettings: () => Promise<void>;
  setOnline: (isOnline: boolean) => void;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  setUser: (user: UserSession | null) => void;
  setSyncPrompt: (show: boolean) => void;
  setSyncProgress: (progress: SyncProgress) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
  settings: defaultSettings,
  user: null,
  showSyncPrompt: false,
  syncProgress: {
    status: 'idle',
    uploaded: 0,
    total: 0,
  },
  toasts: [],
  initializeSettings: async () => {
    const settings = await getSettings();
    set({ settings });
  },
  setOnline: (isOnline) => set({ isOnline }),
  updateSettings: async (settingsPatch) => {
    const next = { ...get().settings, ...settingsPatch };
    await saveSettings(next);
    set({ settings: next });
  },
  setUser: (user) => set({ user }),
  setSyncPrompt: (showSyncPrompt) => set({ showSyncPrompt }),
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
}));
