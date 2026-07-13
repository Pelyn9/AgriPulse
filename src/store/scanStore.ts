import { create } from 'zustand';
import {
  clearScans,
  deleteScan,
  getPendingScans,
  listScans,
  saveScan,
} from '../offline/database';
import type { ScanRecord } from '../types';

interface ScanState {
  scans: ScanRecord[];
  loading: boolean;
  loadScans: () => Promise<void>;
  addScan: (scan: ScanRecord) => Promise<void>;
  removeScan: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshPendingCount: () => Promise<number>;
}

export const useScanStore = create<ScanState>((set, get) => ({
  scans: [],
  loading: true,
  loadScans: async () => {
    set({ loading: true });
    const scans = await listScans();
    set({ scans, loading: false });
  },
  addScan: async (scan) => {
    await saveScan(scan);
    set((state) => ({ scans: [scan, ...state.scans] }));
  },
  removeScan: async (id) => {
    await deleteScan(id);
    set((state) => ({ scans: state.scans.filter((scan) => scan.id !== id) }));
  },
  clearAll: async () => {
    await clearScans();
    set({ scans: [] });
  },
  refreshPendingCount: async () => {
    const pending = await getPendingScans();
    await get().loadScans();
    return pending.length;
  },
}));
