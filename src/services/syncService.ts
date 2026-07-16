import { getScansByIds, markScanSynced, saveScans } from '../offline/database';
import { scanImageBucket, supabase } from '../supabase/client';
import type { ScanRecord, UserSession } from '../types';

export type SyncCallback = (uploaded: number, total: number) => void;

export async function uploadPendingScans(scans: ScanRecord[], user: UserSession, onProgress: SyncCallback) {
  const total = scans.length;

  for (let index = 0; index < scans.length; index += 1) {
    const scan = scans[index];

    if (supabase && user.provider !== 'mock') {
      const imagePath = await uploadScanImage(scan, user);
      const { error } = await supabase.from('scans').upsert({
        id: scan.id,
        user_id: user.id,
        image: imagePath,
        prediction: scan.prediction,
        confidence: scan.confidence,
        fertilizer: scan.fertilizer,
        application_rate: scan.applicationRate,
        symptoms: scan.symptoms,
        mode: scan.mode,
        synced: true,
        created_at: scan.createdAt,
      });

      if (error) {
        throw error;
      }
    } else {
      await new Promise((resolve) => window.setTimeout(resolve, 360));
    }

    await markScanSynced(scan.id);
    onProgress(index + 1, total);
  }
}

async function uploadScanImage(scan: ScanRecord, user: UserSession) {
  if (!supabase || !scan.image.startsWith('data:')) {
    return scan.image;
  }

  const blob = dataUrlToBlob(scan.image);
  const extension = blob.type.includes('jpeg') ? 'jpg' : blob.type.includes('svg') ? 'svg' : 'png';
  const path = `${user.id}/${scan.id}.${extension}`;
  const { error } = await supabase.storage.from(scanImageBucket).upload(path, blob, {
    cacheControl: '31536000',
    contentType: blob.type,
    upsert: true,
  });

  if (error) {
    throw error;
  }

  return path;
}

function dataUrlToBlob(dataUrl: string) {
  const [metadata, payload] = dataUrl.split(',');
  const mime = metadata.match(/data:(.*?);/)?.[1] ?? 'image/png';
  const binary = window.atob(payload);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mime });
}

export async function downloadScans(user: UserSession): Promise<number> {
  if (!supabase || user.provider === 'mock') {
    return 0;
  }

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return 0;
  }

  const cloudScans: ScanRecord[] = [];

  for (const row of data) {
    let image = row.image ?? '';

    if (image && !image.startsWith('data:')) {
      image = await downloadScanImage(image, user) ?? '';
    }

    cloudScans.push({
      id: row.id,
      image,
      prediction: row.prediction ?? 'Unknown',
      confidence: row.confidence ?? 0,
      fertilizer: row.fertilizer ?? '',
      applicationRate: row.application_rate ?? '',
      symptoms: row.symptoms ?? [],
      summary: row.summary ?? '',
      recoveryTips: row.recoveryTips ?? [],
      description: row.description ?? '',
      causes: row.causes ?? [],
      treatment: row.treatment ?? '',
      prevention: row.prevention ?? [],
      mode: row.mode ?? 'Online',
      synced: true,
      createdAt: row.created_at,
    });
  }

  const existingScans = await getScansByIds(cloudScans.map((s) => s.id));
  const existingIds = new Set(existingScans.map((s) => s.id));
  const newScans = cloudScans.filter((s) => !existingIds.has(s.id));

  if (newScans.length > 0) {
    await saveScans(newScans);
  }

  return newScans.length;
}

async function downloadScanImage(path: string, user: UserSession): Promise<string | null> {
  if (!supabase || user.provider === 'mock') {
    return null;
  }

  const { data, error } = await supabase.storage.from(scanImageBucket).download(path);
  if (error || !data) {
    return null;
  }

  return blobToDataUrl(data);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
