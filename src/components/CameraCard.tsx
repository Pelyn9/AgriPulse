import { Camera, ImagePlus, RefreshCw, ScanLine, Video } from 'lucide-react';
import { cn } from '../utils/cn';
import type { RefObject } from 'react';
import type { AiResult } from '../types';

interface CameraCardProps {
  cameraStarted: boolean;
  cameraLoading?: boolean;
  cameraMinimized?: boolean;
  liveResult?: AiResult | null;
  previewImage?: string;
  resultLabel?: string;
  videoRef?: RefObject<HTMLVideoElement | null>;
  onStart: () => void;
  onCapture: () => void;
  onUpload: () => void;
  onRetake: () => void;
}

export function CameraCard({
  cameraStarted,
  cameraLoading = false,
  cameraMinimized = false,
  liveResult,
  previewImage,
  resultLabel,
  videoRef,
  onStart,
  onCapture,
  onUpload,
  onRetake,
}: CameraCardProps) {
  return (
    <section className="rounded-[2rem] border border-field-200/70 bg-field-950 p-3 shadow-glass dark:border-white/10 dark:bg-[#0d1210]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-gradient-to-br from-field-900 via-field-700 to-harvest-500 dark:bg-none dark:bg-[#111611]">
        {cameraStarted && !cameraMinimized ? (
          <>
            <video
              ref={videoRef as React.LegacyRef<HTMLVideoElement>}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-10 top-16 bottom-16 rounded-[2rem] border-2 border-dashed border-white/45 z-10" />
            <div className="absolute bottom-6 left-0 right-0 z-10 text-center">
              <p className="text-sm font-semibold text-white drop-shadow-lg">
                Align the rice leaf inside the focus area
              </p>
            </div>
            {liveResult && (
              <div className="absolute left-3 right-3 top-3 z-20 rounded-2xl bg-black/55 p-3 text-white backdrop-blur-sm">
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
            <div className="absolute inset-x-10 top-16 bottom-16 rounded-[2rem] border-2 border-dashed border-white/45" />
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
