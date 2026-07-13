import { markScanSynced } from '../offline/database';
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
