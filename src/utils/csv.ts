import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ScanRecord } from '../types';

const headers = [
  'ID',
  'Date',
  'Prediction',
  'Confidence',
  'Fertilizer',
  'Application Rate',
  'Mode',
  'Synced',
];

function scansToRows(scans: ScanRecord[]) {
  return scans.map((scan) => [
    scan.id,
    new Date(scan.createdAt).toLocaleDateString(),
    scan.prediction,
    `${scan.confidence}%`,
    scan.fertilizer,
    scan.applicationRate,
    scan.mode,
    scan.synced ? 'Yes' : 'No',
  ]);
}

export function scansToCsv(scans: ScanRecord[]) {
  const rows = scansToRows(scans);
  return [headers.join(','), ...rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
}

export function exportExcel(scans: ScanRecord[], filename: string) {
  const data = scans.map((scan) => ({
    'ID': scan.id,
    'Date': new Date(scan.createdAt).toLocaleDateString(),
    'Prediction': scan.prediction,
    'Confidence': `${scan.confidence}%`,
    'Fertilizer': scan.fertilizer,
    'Application Rate': scan.applicationRate,
    'Mode': scan.mode,
    'Synced': scan.synced ? 'Yes' : 'No',
    'Symptoms': scan.symptoms?.join(', ') ?? '',
    'Causes': scan.causes?.join(', ') ?? '',
    'Treatment': scan.treatment ?? '',
    'Prevention': scan.prevention?.join(', ') ?? '',
    'Recovery Tips': scan.recoveryTips?.join(', ') ?? '',
    'Description': scan.description ?? '',
    'Summary': scan.summary ?? '',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  const colWidths = headers.map((h) => ({ wch: Math.max(h.length + 2, 14) }));
  colWidths.push({ wch: 30 }, { wch: 30 }, { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 40 }, { wch: 40 });
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Scan Report');
  XLSX.writeFile(wb, filename);
}

export function exportPdf(scans: ScanRecord[], filename: string, title = 'AgriPulse Scan Report') {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text(`Generated: ${new Date().toLocaleDateString()}  |  Total scans: ${scans.length}`, 14, 28);

  autoTable(doc, {
    startY: 34,
    head: [headers],
    body: scansToRows(scans),
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 30, 30],
      lineColor: [200, 200, 200],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' },
      );
    },
  });

  doc.save(filename);
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
