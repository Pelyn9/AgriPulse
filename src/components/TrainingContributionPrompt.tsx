import { Heart, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { AnimatedCard } from './AnimatedCard';
import { supabase, trainingImageBucket } from '../supabase/client';
import { useAppStore } from '../store/appStore';
import { cn } from '../utils/cn';
import type { PredictionType } from '../types';

const LABEL_OPTIONS: PredictionType[] = [
  'Healthy',
  'Nitrogen Deficiency',
  'Phosphorus Deficiency',
  'Potassium Deficiency',
  'Brown Spot',
  'Rice Blast',
  'Bacterial Leaf Blight',
  'Rice Leaf Diseases',
];

interface TrainingContributionPromptProps {
  imageBlob: Blob | null;
  predictedLabel: string;
  confidence: number;
  onSubmitted?: () => void;
  onDismissed?: () => void;
}

export function TrainingContributionPrompt({
  imageBlob,
  predictedLabel,
  confidence,
  onSubmitted,
  onDismissed,
}: TrainingContributionPromptProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(predictedLabel);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const isOnline = useAppStore((state) => state.isOnline);
  const addToast = useAppStore((state) => state.addToast);

  const handleSubmit = async () => {
    if (!imageBlob || !isOnline) return;

    setSubmitting(true);
    setError(false);

    try {
      if (supabase) {
        const formData = new FormData();
        formData.append('file', imageBlob, 'leaf.jpg');
        formData.append('actual_label', selectedLabel);
        formData.append('predicted_label', predictedLabel);
        formData.append('confidence', String(confidence));

        const response = await fetch('/api/submit-training', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        const blob = imageBlob;
        const extension = blob.type.includes('jpeg') ? 'jpg' : 'png';
        const imageId = crypto.randomUUID();
        const path = `training/${imageId}.${extension}`;

        await supabase.storage.from(trainingImageBucket).upload(path, blob, {
          cacheControl: '31536000',
          contentType: blob.type,
          upsert: false,
        });

        await supabase.from('training_images').insert({
          image: path,
          actual_label: selectedLabel,
          predicted_label: predictedLabel,
          confidence: confidence,
        });
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }

      setSubmitted(true);
      addToast({
        title: 'Thank you!',
        description: 'Your submission helps improve our AI for everyone.',
        tone: 'success',
      });
      onSubmitted?.();
    } catch {
      setError(true);
      addToast({
        title: 'Submission failed',
        description: 'Please try again later.',
        tone: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AnimatedCard className="text-center">
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-950 dark:text-white">Contribution Saved</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Your image will help train our next AI model.
            </p>
          </div>
        </div>
      </AnimatedCard>
    );
  }

  if (!showForm) {
    return (
      <AnimatedCard>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex w-full items-center gap-3 text-left"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
            <Heart className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-black text-slate-950 dark:text-white">Help Improve Our AI</h3>
            <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Confirm this diagnosis to help us train better models for Filipino farmers.
            </p>
          </div>
        </button>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" />
          <h3 className="text-sm font-black text-slate-950 dark:text-white">Confirm Diagnosis</h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            onDismissed?.();
          }}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        Was this diagnosis correct? Your feedback helps us improve accuracy for all farmers.
      </p>

      {!isOnline && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          You need to be online to submit training data.
        </div>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        {LABEL_OPTIONS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setSelectedLabel(label)}
            className={cn(
              'rounded-xl px-3 py-2 text-left text-xs font-bold transition',
              selectedLabel === label
                ? 'bg-field-700 text-white dark:bg-field-300 dark:text-field-950'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !isOnline}
        className={cn(
          'flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition',
          submitting || !isOnline
            ? 'bg-slate-200 text-slate-400 dark:bg-white/5 dark:text-slate-600'
            : 'bg-field-700 text-white hover:bg-field-800 dark:bg-field-300 dark:text-field-950',
        )}
      >
        {submitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Submit Feedback
          </>
        )}
      </button>

      {error && (
        <p className="text-center text-xs font-bold text-red-500">
          Submission failed. Please try again.
        </p>
      )}
    </AnimatedCard>
  );
}
