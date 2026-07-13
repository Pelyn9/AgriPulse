import { Camera, ImagePlus, RefreshCw, ScanLine, Video, Bug, Heart, Activity, Leaf, AlertTriangle } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { ScannerOverlay } from './ScannerOverlay';
import type { RefObject } from 'react';
import type { AiResult } from '../types';
import type { LiveAnalysisResult } from '../services/mockAiService';

interface CameraCardProps {
  cameraStarted: boolean;
  cameraLoading?: boolean;
  cameraMinimized?: boolean;
  liveResult?: AiResult | null;
  liveAnalysis?: LiveAnalysisResult | null;
  previewImage?: string;
  resultLabel?: string;
  videoRef?: RefObject<HTMLVideoElement | null>;
  onStart: () => void;
  onCapture: () => void;
  onUpload: () => void;
  onRetake: () => void;
}

function HealthBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-field-400' : score >= 40 ? 'bg-amber-400' : 'bg-red-400';
  const label = score >= 70 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';
  return (
    <div className="flex items-center gap-2">
      <Heart className="h-3 w-3 text-white/70" />
      <div className="relative h-1.5 flex-1 rounded-full bg-white/20">
        <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-black tabular-nums text-white">{score}</span>
    </div>
  );
}

export function CameraCard({
  cameraStarted,
  cameraLoading = false,
  cameraMinimized = false,
  liveResult,
  liveAnalysis,
  previewImage,
  resultLabel,
  videoRef,
  onStart,
  onCapture,
  onUpload,
  onRetake,
}: CameraCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 400, h: 500 });

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) setDims({ w: Math.round(width), h: Math.round(height) });
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="rounded-[2rem] border border-field-200/70 bg-field-950 p-3 shadow-glass dark:border-white/10 dark:bg-[#0d1210]">
      <div ref={containerRef} className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-gradient-to-br from-field-900 via-field-700 to-harvest-500 dark:bg-none dark:bg-[#111611]">
        {cameraStarted && !cameraMinimized ? (
          <>
            <video
              ref={videoRef as React.LegacyRef<HTMLVideoElement>}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
            />
            <ScannerOverlay analysis={liveAnalysis ?? null} width={dims.w} height={dims.h} />
            <div className="absolute bottom-6 left-0 right-0 z-20 text-center">
              <p className="text-sm font-semibold text-white drop-shadow-lg">
                Align the rice leaf inside the focus area
              </p>
            </div>
            {(liveResult || liveAnalysis) && (
              <div className="absolute left-2 right-2 top-2 z-20 space-y-2">
                {liveAnalysis && (
                  <div className="rounded-2xl bg-black/60 p-3 text-white backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-white/60" />
                        <span className="text-xs font-black uppercase tracking-wider text-white/70">Live Analysis</span>
                      </div>
                      {!liveAnalysis.leafColor.isLeaf ? (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/60 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                          <AlertTriangle className="h-2.5 w-2.5" /> Not a Leaf
                        </span>
                      ) : (
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider',
                          liveAnalysis.status === 'healthy' ? 'bg-field-500/60 text-white'
                            : liveAnalysis.status === 'deficient' ? 'bg-purple-500/60 text-white'
                            : 'bg-harvest-500/60 text-white',
                        )}>
                          {liveAnalysis.status === 'healthy' ? 'Healthy' : liveAnalysis.status === 'deficient' ? 'Deficiency' : 'Disease'}
                        </span>
                      )}
                    </div>

                    {!liveAnalysis.leafColor.isLeaf ? (
                      <p className="mt-1.5 text-xs font-bold text-amber-300">
                        Point the camera at a rice leaf
                      </p>
                    ) : (
                      <>
                        <p className="mt-1.5 text-sm font-black leading-tight">{liveAnalysis.prediction}</p>

                        {/* Leaf color info */}
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <Leaf className="h-3 w-3 text-green-400" />
                          <span className="text-[10px] font-bold text-white/80">
                            Leaf color: <span className="text-green-300">{liveAnalysis.leafColor.dominant}</span>
                          </span>
                          <span className="text-[10px] text-white/40">
                            ({liveAnalysis.leafColor.greenRatio}% green)
                          </span>
                        </div>

                        <div className="mt-2 space-y-1.5">
                          <HealthBar score={liveAnalysis.healthScore} />
                          {liveAnalysis.spotCount > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Bug className="h-3 w-3 text-harvest-400" />
                              <span className="text-[11px] font-bold text-white/90">
                                {liveAnalysis.spotCount} spot{liveAnalysis.spotCount !== 1 ? 's' : ''} detected
                              </span>
                              <span className="text-[10px] text-white/50">
                                ({liveAnalysis.spotSizes.small}s {liveAnalysis.spotSizes.medium > 0 ? `${liveAnalysis.spotSizes.medium}m ` : ''}{liveAnalysis.spotSizes.large > 0 ? `${liveAnalysis.spotSizes.large}l` : ''})
                              </span>
                            </div>
                          )}
                          {liveAnalysis.spotCount === 0 && liveAnalysis.status === 'healthy' && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-field-300">No spots - leaf looks healthy</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {!liveAnalysis && liveResult && (
                  <div className="rounded-2xl bg-black/55 p-3 text-white backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-wider opacity-80">
                        {liveResult.confidence}% Confidence
                      </span>
                      <span className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-wider',
                        liveResult.prediction === 'Healthy'
                          ? 'bg-field-500/60 text-white'
                          : 'bg-harvest-500/60 text-white',
                      )}>
                        {liveResult.prediction === 'Healthy' ? 'Healthy' : liveResult.prediction === 'Rice Leaf Diseases' ? 'Disease' : 'Deficiency'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold leading-tight">{liveResult.prediction}</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : cameraMinimized && previewImage ? (
          <img
            src={previewImage}
            alt="Captured leaf"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:36px_36px] dark:opacity-20" />
            <div className="absolute inset-x-8 top-10 h-48 rounded-full bg-white/12 blur-3xl dark:hidden" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-white/18 ring-1 ring-white/35 dark:bg-white/10">
                <Camera className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-black">Camera Preview</h2>
              <p className="mt-2 max-w-52 text-sm font-semibold leading-6 text-white/75">
                Start the preview or upload a leaf image.
              </p>
            </div>
            <ScannerOverlay analysis={null} width={dims.w} height={dims.h} />
          </>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {cameraMinimized ? (
          <button
            type="button"
            onClick={onRetake}
            className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 px-3 text-sm font-bold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Scan Again
          </button>
        ) : !cameraStarted ? (
          <button
            type="button"
            onClick={onStart}
            disabled={cameraLoading}
            className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-3 text-sm font-bold text-field-800 disabled:opacity-50"
          >
            <Video className="h-4 w-4" />
            {cameraLoading ? 'Starting...' : 'Start Camera'}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onCapture}
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-field-300 px-3 text-sm font-bold text-field-950"
            >
              <Camera className="h-4 w-4" />
              Capture
            </button>
            <button
              type="button"
              onClick={onRetake}
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 px-3 text-sm font-bold text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Retake
            </button>
          </>
        )}
        {!cameraMinimized && (
          <button
            type="button"
            onClick={onUpload}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 px-3 text-sm font-bold text-white"
          >
            <ImagePlus className="h-4 w-4" />
            Upload Image
          </button>
        )}
      </div>
    </section>
  );
}
