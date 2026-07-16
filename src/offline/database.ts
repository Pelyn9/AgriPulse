import Dexie, { type Table } from 'dexie';
import type { AppSettings, ScanRecord } from '../types';

interface SettingsRecord extends AppSettings {
  id: 'settings';
}

class RiceLeafDatabase extends Dexie {
  scans!: Table<ScanRecord, string>;
  settings!: Table<SettingsRecord, string>;

  constructor() {
    super('riceleaf-ai');
    this.version(1).stores({
      scans: 'id, createdAt, prediction, mode, synced',
      settings: 'id',
    });
  }
}

export const db = new RiceLeafDatabase();

export const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'English',
  notifications: true,
  cloudBackup: false,
};

export async function getSettings() {
  const settings = await db.settings.get('settings');
  return settings ?? defaultSettings;
}

export async function saveSettings(settings: AppSettings) {
  await db.settings.put({ id: 'settings', ...settings });
  return settings;
}

export async function listScans() {
  return db.scans.orderBy('createdAt').reverse().toArray();
}

export async function saveScan(scan: ScanRecord) {
  await db.scans.put(scan);
  return scan;
}

export async function deleteScan(id: string) {
  await db.scans.delete(id);
}

export async function clearScans() {
  await db.scans.clear();
}

export async function clearUnsyncedScans() {
  const unsynced = await db.scans.filter((scan) => !scan.synced).toArray();
  const ids = unsynced.map((s) => s.id);
  if (ids.length > 0) {
    await db.scans.bulkDelete(ids);
  }
}

export async function getScansByIds(ids: string[]): Promise<ScanRecord[]> {
  if (ids.length === 0) return [];
  return db.scans.where('id').anyOf(ids).toArray();
}

export async function saveScans(scans: ScanRecord[]) {
  await db.scans.bulkPut(scans);
}

export async function getPendingScans() {
  return db.scans.filter((scan) => !scan.synced).toArray();
}

export async function markScanSynced(id: string) {
  await db.scans.update(id, { synced: true });
}
