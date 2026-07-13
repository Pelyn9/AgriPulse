import { AlertTriangle, ChevronDown, ChevronUp, FileText, FlaskConical, Leaf, Save, ScanLine, Shield, Sprout, Target, Camera } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { AnimatedCard } from '../components/AnimatedCard';
import { CameraCard } from '../components/CameraCard';
import { LoadingDialog } from '../components/LoadingDialog';
import { PageHeader } from '../components/PageHeader';
import { TrainingContributionPrompt } from '../components/TrainingContributionPrompt';
import { analyzeRiceLeaf, analyzeRiceLeafFast } from '../services/aiService';
import { analyzeRiceLeafLive, type LiveAnalysisResult } from '../services/mockAiService';
import { fetchTips } from '../services/tipsService';
import { createLeafThumbnail } from '../services/imageService';
import { useAppStore } from '../store/appStore';
import { useScanStore } from '../store/scanStore';
import type { AiResult } from '../types';
import { createId } from '../utils/id';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; badgeBg: string; dot: string }> = {
  'Healthy':                      { bg: 'bg-green-50 dark:bg-green-500/10', text: 'text-green-800 dark:text-green-200', badgeBg: 'bg-green-500', dot: 'bg-green-400' },
  'Nitrogen Deficiency':          { bg: 'bg-lime-50 dark:bg-lime-500/10', text: 'text-lime-800 dark:text-lime-200', badgeBg: 'bg-lime-500', dot: 'bg-lime-400' },
  'Phosphorus Deficiency':        { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-800 dark:text-purple-200', badgeBg: 'bg-purple-500', dot: 'bg-purple-400' },
  'Potassium Deficiency':         { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-800 dark:text-orange-200', badgeBg: 'bg-orange-500', dot: 'bg-orange-400' },
  'Brown Spot':                   { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-800 dark:text-amber-200', badgeBg: 'bg-amber-700', dot: 'bg-amber-600' },
  'Rice Blast':                   { bg: 'bg-stone-50 dark:bg-stone-500/10', text: 'text-stone-800 dark:text-stone-200', badgeBg: 'bg-stone-600', dot: 'bg-stone-500' },
  'Bacterial Leaf Blight':        { bg: 'bg-yellow-50 dark:bg-yellow-500/10', text: 'text-yellow-800 dark:text-yellow-200', badgeBg: 'bg-yellow-600', dot: 'bg-yellow-400' },
  'Rice Leaf Diseases':           { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-800 dark:text-rose-200', badgeBg: 'bg-rose-600', dot: 'bg-rose-400' },
};

const LOW_CONFIDENCE_THRESHOLD = 70;

export function ScanPage() {
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraMinimized, setCameraMinimized] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [result, setResult] = useState<AiResult | null>(null);
  const [resultMinimized, setResultMinimized] = useState(false);
  const [thumbnail, setThumbnail] = useState(createLeafThumbnail());
  const [liveResult, setLiveResult] = useState<AiResult | null>(null);
  const [liveAnalysis, setLiveAnalysis] = useState<LiveAnalysisResult | null>(null);
  const [scanImageBlob, setScanImageBlob] = useState<Blob | null>(null);
  const [showTrainingPrompt, setShowTrainingPrompt] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const liveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingStreamRef = useRef<MediaStream | null>(null);
  const lastFrameHashRef = useRef<number>(0);
  const analysisBusyRef = useRef<boolean>(false);

  const isOnline = useAppStore((state) => state.isOnline);
  const addToast = useAppStore((state) => state.addToast);
  const addScan = useScanStore((state) => state.addScan);
  const language = useAppStore((state) => state.settings.language);
  const [tipsSource, setTipsSource] = useState<'online' | 'offline'>('offline');

  const isLowConfidence = (result?.confidence ?? 100) < LOW_CONFIDENCE_THRESHOLD;
  const colors = CATEGORY_COLORS[result?.prediction ?? ''] ?? CATEGORY_COLORS['Rice Leaf Diseases'];

  useEffect(() => {
    if (cameraStarted && videoRef.current && pendingStreamRef.current) {
      videoRef.current.srcObject = pendingStreamRef.current;
      pendingStreamRef.current = null;
    }
  }, [cameraStarted]);

  useEffect(() => {
    return () => {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (liveIntervalRef.current) {
      clearInterval(liveIntervalRef.current);
      liveIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    pendingStreamRef.current = null;
    setCameraStarted(false);
  }, []);

  const captureFrame = useCallback(async (): Promise<Blob | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  }, []);

  const startCamera = useCallback(async () => {
    setCameraLoading(true);
    setCameraMinimized(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      pendingStreamRef.current = stream;
      setCameraStarted(true);
      setCameraLoading(false);
      setLiveResult(null);
      setLiveAnalysis(null);
      addToast({ title: 'Camera active', tone: 'info' });

      liveIntervalRef.current = setInterval(async () => {
        if (analysisBusyRef.current) return;
        analysisBusyRef.current = true;
        try {
          const blob = await captureFrame();
          if (!blob) { analysisBusyRef.current = false; return; }

          let hash = 0;
          const buf = await blob.arrayBuffer();
          const view = new Uint8Array(buf);
          const hashStep = Math.max(1, Math.floor(view.length / 64));
          for (let i = 0; i < view.length; i += hashStep) {
            hash = ((hash << 5) - hash + view[i]) | 0;
          }
          if (hash === lastFrameHashRef.current) { analysisBusyRef.current = false; return; }
          lastFrameHashRef.current = hash;

          const aiResult = await analyzeRiceLeafFast(blob);
          setLiveResult(aiResult);
          const liveData = await analyzeRiceLeafLive(blob);
          setLiveAnalysis(liveData);
        } finally {
          analysisBusyRef.current = false;
        }
      }, 800);
    } catch {
      setCameraLoading(false);
      addToast({
        title: 'Camera unavailable',
        description: 'Check permissions or use upload instead.',
        tone: 'error',
      });
    }
  }, [addToast, captureFrame]);

  const handleCapture = async () => {
    if (liveIntervalRef.current) {
      clearInterval(liveIntervalRef.current);
      liveIntervalRef.current = null;
    }
    const blob = await captureFrame();
    if (!blob) return;
    setScanImageBlob(blob);
    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
    stopCamera();
    setLiveResult(null);
    setLiveAnalysis(null);
    setAnalyzing(true);
    setLoadingStage(0);
    const reader = new FileReader();
    reader.onload = () => setThumbnail(String(reader.result));
    reader.readAsDataURL(file);
    await new Promise((r) => setTimeout(r, 400));
    setLoadingStage(1);
    await new Promise((r) => setTimeout(r, 500));
    setLoadingStage(2);
    const aiResult = await analyzeRiceLeaf(file);
    setLoadingStage(3);
    await new Promise((r) => setTimeout(r, 300));
    const { tips, source } = await fetchTips(aiResult.prediction, language, isOnline);
    setTipsSource(source);
    setLoadingStage(4);
    await new Promise((r) => setTimeout(r, 200));
    setResult({ ...aiResult, recoveryTips: tips });
    setCameraMinimized(true);
    setAnalyzing(false);
  };

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setScanImageBlob(file);
    stopCamera();
    setLiveResult(null);
    setLiveAnalysis(null);
    setCameraMinimized(false);
    setAnalyzing(true);
    setLoadingStage(0);
    const reader = new FileReader();
    reader.onload = () => setThumbnail(String(reader.result));
    reader.readAsDataURL(file);
    await new Promise((r) => setTimeout(r, 400));
    setLoadingStage(1);
    await new Promise((r) => setTimeout(r, 500));
    setLoadingStage(2);
    const aiResult = await analyzeRiceLeaf(file);
    setLoadingStage(3);
    await new Promise((r) => setTimeout(r, 300));
    const { tips, source } = await fetchTips(aiResult.prediction, language, isOnline);
    setTipsSource(source);
    setLoadingStage(4);
    await new Promise((r) => setTimeout(r, 200));
    setResult({ ...aiResult, recoveryTips: tips });
    setAnalyzing(false);
    event.target.value = '';
  };

  const handleSave = async () => {
    if (!result) return;
    await addScan({
      ...result,
      id: createId('scan'),
      image: thumbnail,
      mode: isOnline ? 'Online' : 'Offline',
      synced: false,
      createdAt: new Date().toISOString(),
    });
    setShowTrainingPrompt(true);
    addToast({
      title: 'Result saved',
      description: isOnline
        ? 'Stored locally and queued for cloud backup.'
        : 'Stored locally for offline use.',
      tone: 'success',
    });
  };

  const handleRetake = () => {
    stopCamera();
    setResult(null);
    setLiveResult(null);
    setLiveAnalysis(null);
    setScanImageBlob(null);
    setShowTrainingPrompt(false);
    setThumbnail(createLeafThumbnail());
    setResultMinimized(false);
    setCameraMinimized(false);
    setTipsSource('offline');
  };

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Scan Leaf" eyebrow="Health analysis" />

      <canvas ref={canvasRef} className="hidden" />

      <CameraCard
        cameraStarted={cameraStarted}
        cameraLoading={cameraLoading}
        cameraMinimized={cameraMinimized}
        liveResult={liveResult}
        liveAnalysis={liveAnalysis}
        previewImage={thumbnail}
        resultLabel={result?.prediction}
        videoRef={videoRef}
        onStart={startCamera}
        onCapture={handleCapture}
        onUpload={handleUpload}
        onRetake={handleRetake}
      />

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {result && (
        <AnimatedCard className="space-y-4">
          <button
            type="button"
            onClick={() => setResultMinimized(!resultMinimized)}
            className="flex w-full items-center gap-3 text-left"
          >
            <img src={thumbnail} alt={result.prediction} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ${
                  isLowConfidence
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'
                    : 'bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isLowConfidence ? 'bg-amber-400' : 'bg-field-400'}`} />
                  {result.confidence}% Confidence
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ${colors.bg} ${colors.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                  {result.prediction === 'Healthy' ? 'Healthy' : result.prediction.includes('Deficiency') ? 'Deficiency' : 'Disease'}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-black leading-tight text-slate-950 dark:text-white">{result.prediction}</h2>
              {isLowConfidence && (
                <p className="mt-1 flex items-start gap-1.5 text-xs font-bold leading-5 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Low confidence — capture a clearer image under good lighting for a more accurate result
                </p>
              )}
            </div>
            {resultMinimized ? <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" /> : <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" />}
          </button>

          {!resultMinimized && (
            <>
              <div className="grid gap-3">

                <SectionCard
                  title="What is this?"
                  icon={FileText}
                  iconColor="text-slate-400"
                  isOpen={expandedSection === 'desc'}
                  onToggle={() => toggleSection('desc')}
                >
                  <p className="text-xs leading-6 text-slate-600 dark:text-slate-300">{result.description}</p>
                </SectionCard>

                {result.causes.length > 0 && (
                  <SectionCard
                    title="Possible Causes"
                    icon={Target}
                    iconColor="text-amber-600 dark:text-amber-400"
                    isOpen={expandedSection === 'causes'}
                    onToggle={() => toggleSection('causes')}
                  >
                    <ul className="space-y-1">
                      {result.causes.map((cause) => (
                        <li key={cause} className="flex items-start gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                )}

                <SectionCard
                  title="Symptoms"
                  icon={Leaf}
                  iconColor="text-field-700 dark:text-field-300"
                  isOpen={expandedSection === 'symptoms'}
                  onToggle={() => toggleSection('symptoms')}
                >
                  <div className="flex flex-wrap gap-2">
                    {result.symptoms.map((symptom) => (
                      <span key={symptom} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-200">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </SectionCard>

                <div className="rounded-2xl bg-field-700 p-4 text-white dark:bg-field-800">
                  <div className="flex items-center gap-2 text-sm font-black">
                    <FlaskConical className="h-4 w-4" />
                    Treatment
                  </div>
                  <p className="mt-2 text-sm leading-6 font-semibold text-white/90">{result.treatment}</p>
                  {result.fertilizer !== 'Consult local agricultural extension' && (
                    <div className="mt-3 rounded-xl bg-white/10 p-3">
                      <p className="text-xs font-black">Recommended Product</p>
                      <p className="mt-0.5 text-sm font-bold">{result.fertilizer}</p>
                      <p className="mt-0.5 text-xs font-semibold text-white/75">Rate: {result.applicationRate}</p>
                    </div>
                  )}
                </div>

                {result.prevention.length > 0 && (
                  <SectionCard
                    title="Prevention"
                    icon={Shield}
                    iconColor="text-sky-600 dark:text-sky-400"
                    isOpen={expandedSection === 'prevention'}
                    onToggle={() => toggleSection('prevention')}
                  >
                    <ul className="space-y-1.5">
                      {result.prevention.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs leading-5 text-sky-700 dark:text-sky-300/80">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                )}

                <SectionCard
                  title="Recovery Tips"
                  icon={Sprout}
                  iconColor="text-emerald-600 dark:text-emerald-400"
                  isOpen={expandedSection === 'tips'}
                  onToggle={() => toggleSection('tips')}
                  rightElement={
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      tipsSource === 'online'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-200'
                        : 'bg-amber-400/20 text-amber-700 dark:text-amber-200'
                    }`}>
                      {tipsSource === 'online' ? 'Cloud' : 'Offline'}
                    </span>
                  }
                >
                  <ul className="space-y-2">
                    {result.recoveryTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-xs leading-5 text-emerald-700 dark:text-emerald-300/80">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-field-700 px-3 text-sm font-black text-white dark:bg-field-300 dark:text-field-950"
                >
                  <Save className="h-4 w-4" />
                  Save Result
                </button>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 text-sm font-black text-slate-700 dark:border-white/10 dark:text-slate-200"
                >
                  <Camera className="h-4 w-4" />
                  New Scan
                </button>
              </div>

              {showTrainingPrompt && result && (
                <TrainingContributionPrompt
                  imageBlob={scanImageBlob}
                  predictedLabel={result.prediction}
                  confidence={result.confidence}
                  onSubmitted={() => setShowTrainingPrompt(false)}
                  onDismissed={() => setShowTrainingPrompt(false)}
                />
              )}
            </>
          )}
        </AnimatedCard>
      )}

      {!result && (
        <AnimatedCard className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-field-100 text-field-700 dark:bg-field-500/15 dark:text-field-100">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-950 dark:text-white">Ready for a new scan</h2>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
              Point your camera at a rice leaf and capture to get started.
            </p>
          </div>
        </AnimatedCard>
      )}

      <LoadingDialog open={analyzing} stage={loadingStage} />
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  iconColor,
  children,
  isOpen,
  onToggle,
  rightElement,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          {title}
        </div>
        <div className="flex items-center gap-2">
          {rightElement}
          <ChevronDown className={`h-4 w-4 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}
