import type { ScanRecord } from '../types';

const headers = [
  'id',
  'created_at',
  'prediction',
  'confidence',
  'fertilizer',
  'application_rate',
  'mode',
  'synced',
];

export function scansToCsv(scans: ScanRecord[]) {
  const rows = scans.map((scan) =>
    [
      scan.id,
      scan.createdAt,
      scan.prediction,
      `${scan.confidence}%`,
      scan.fertilizer,
      scan.applicationRate,
      scan.mode,
      scan.synced ? 'yes' : 'no',
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(','),
  );

  return [headers.join(','), ...rows].join('\n');
}

export function downloadTextFile(filename: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
