import { useEffect, useRef } from 'react';
import type { LiveAnalysisResult, SpotBox } from '../services/mockAiService';

interface ScannerOverlayProps {
  analysis: LiveAnalysisResult | null;
  width: number;
  height: number;
}

const SPOT_COLORS: Record<string, string> = {
  brown: '#d97706',
  gray: '#94a3b8',
  yellow: '#eab308',
  reddish: '#ef4444',
};

const STATUS_TINT: Record<string, string> = {
  healthy: 'rgba(34,197,94,0.06)',
  deficient: 'rgba(168,85,247,0.08)',
  diseased: 'rgba(239,68,68,0.08)',
};

export function ScannerOverlay({ analysis, width, height }: ScannerOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scanY = 0;
    let scanDir = 1;
    let pulse = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      pulse += 0.04;

      // --- subtle grid ---
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 0.5;
      const gridSize = 32;
      for (let x = gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --- scanning line ---
      scanY += scanDir * 1.8;
      if (scanY > height || scanY < 0) scanDir *= -1;

      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, 'rgba(34,197,94,0)');
      scanGrad.addColorStop(0.5, 'rgba(34,197,94,0.35)');
      scanGrad.addColorStop(1, 'rgba(34,197,94,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, width, 40);

      ctx.strokeStyle = 'rgba(34,197,94,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // --- status tint ---
      if (analysis) {
        const tint = STATUS_TINT[analysis.status];
        if (tint) {
          ctx.fillStyle = tint;
          ctx.fillRect(0, 0, width, height);
        }
      }

      // --- corner brackets ---
      const inset = 28;
      const cornerLen = 36;
      const cornerW = 3;
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = cornerW;
      ctx.lineCap = 'round';

      // top-left
      ctx.beginPath();
      ctx.moveTo(inset, inset + cornerLen);
      ctx.lineTo(inset, inset);
      ctx.lineTo(inset + cornerLen, inset);
      ctx.stroke();
      // top-right
      ctx.beginPath();
      ctx.moveTo(width - inset - cornerLen, inset);
      ctx.lineTo(width - inset, inset);
      ctx.lineTo(width - inset, inset + cornerLen);
      ctx.stroke();
      // bottom-left
      ctx.beginPath();
      ctx.moveTo(inset, height - inset - cornerLen);
      ctx.lineTo(inset, height - inset);
      ctx.lineTo(inset + cornerLen, height - inset);
      ctx.stroke();
      // bottom-right
      ctx.beginPath();
      ctx.moveTo(width - inset - cornerLen, height - inset);
      ctx.lineTo(width - inset, height - inset);
      ctx.lineTo(width - inset, height - inset - cornerLen);
      ctx.stroke();

      // animated corner glow
      const glowAlpha = 0.3 + 0.2 * Math.sin(pulse * 3);
      ctx.strokeStyle = `rgba(34,197,94,${glowAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(inset, inset + 18);
      ctx.lineTo(inset, inset);
      ctx.lineTo(inset + 18, inset);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(width - inset - 18, inset);
      ctx.lineTo(width - inset, inset);
      ctx.lineTo(width - inset, inset + 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(inset, height - inset - 18);
      ctx.lineTo(inset, height - inset);
      ctx.lineTo(inset + 18, height - inset);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(width - inset - 18, height - inset);
      ctx.lineTo(width - inset, height - inset);
      ctx.lineTo(width - inset, height - inset - 18);
      ctx.stroke();

      // --- spot detection markers ---
      if (analysis && analysis.spots.length > 0) {
        drawSpotMarkers(ctx, analysis.spots, width, height, pulse);
      }

      // --- crosshair at center ---
      const cx = width / 2;
      const cy = height / 2;
      const chSize = 14;
      ctx.strokeStyle = `rgba(255,255,255,${0.3 + 0.15 * Math.sin(pulse * 2)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - chSize, cy);
      ctx.lineTo(cx + chSize, cy);
      ctx.moveTo(cx, cy - chSize);
      ctx.lineTo(cx, cy + chSize);
      ctx.stroke();

      // --- scan progress arcs at corners ---
      const arcRadius = 8;
      const arcProgress = (Math.sin(pulse * 2.5) + 1) / 2;
      ctx.strokeStyle = 'rgba(34,197,94,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(inset + 4, inset + 4, arcRadius, 0, Math.PI * 2 * arcProgress);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width - inset - 4, inset + 4, arcRadius, Math.PI * 0.5, Math.PI * 0.5 + Math.PI * 2 * arcProgress);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [analysis, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

function drawSpotMarkers(
  ctx: CanvasRenderingContext2D,
  spots: SpotBox[],
  w: number,
  h: number,
  pulse: number,
) {
  const maxMarkers = 12;
  const shown = spots.slice(0, maxMarkers);

  shown.forEach((spot, i) => {
    const sx = spot.x * w;
    const sy = spot.y * h;
    const sw = spot.w * w;
    const sh = spot.h * h;
    const color = SPOT_COLORS[spot.type] || '#f97316';
    const alpha = 0.6 + 0.3 * Math.sin(pulse * 3 + i);

    // --- bounding box ---
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = alpha;
    const bx = Math.max(2, sx - 4);
    const by = Math.max(2, sy - 4);
    const bw = Math.min(w - bx - 2, sw + 8);
    const bh = Math.min(h - by - 2, sh + 8);
    ctx.strokeRect(bx, by, bw, bh);

    // --- corner ticks on bounding box ---
    const tick = Math.min(8, bw * 0.3, bh * 0.3);
    ctx.lineWidth = 2.5;
    // top-left
    ctx.beginPath();
    ctx.moveTo(bx, by + tick);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + tick, by);
    ctx.stroke();
    // top-right
    ctx.beginPath();
    ctx.moveTo(bx + bw - tick, by);
    ctx.lineTo(bx + bw, by);
    ctx.lineTo(bx + bw, by + tick);
    ctx.stroke();
    // bottom-left
    ctx.beginPath();
    ctx.moveTo(bx, by + bh - tick);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx + tick, by + bh);
    ctx.stroke();
    // bottom-right
    ctx.beginPath();
    ctx.moveTo(bx + bw - tick, by + bh);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw, by + bh - tick);
    ctx.stroke();

    // --- pulsing ring around center of spot ---
    const pcx = sx + sw / 2;
    const pcy = sy + sh / 2;
    const ringR = 10 + 4 * Math.sin(pulse * 3 + i * 0.7);
    ctx.beginPath();
    ctx.arc(pcx, pcy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = alpha * 0.5;
    ctx.stroke();

    // --- inner dot ---
    ctx.beginPath();
    ctx.arc(pcx, pcy, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();

    // --- connecting line from dot to edge label ---
    const labelX = bx + bw + 8;
    const labelY = by + 4;
    if (labelX + 50 < w && labelY + 14 < h) {
      ctx.globalAlpha = alpha * 0.6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pcx, pcy);
      ctx.lineTo(labelX, labelY + 4);
      ctx.stroke();
      ctx.setLineDash([]);

      // type label
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.font = 'bold 8px system-ui, sans-serif';
      ctx.fillText(spot.type.toUpperCase(), labelX, labelY + 8);
    }

    ctx.globalAlpha = 1;
  });

  // --- connecting lines between spots (if >1) ---
  if (shown.length > 1) {
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 6]);
    for (let i = 0; i < Math.min(shown.length, 6); i++) {
      const next = (i + 1) % Math.min(shown.length, 6);
      const ax = (shown[i].x + shown[i].w / 2) * w;
      const ay = (shown[i].y + shown[i].h / 2) * h;
      const bx2 = (shown[next].x + shown[next].w / 2) * w;
      const by2 = (shown[next].y + shown[next].h / 2) * h;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx2, by2);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
}
