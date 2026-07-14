import { ArrowLeft, Mail, Sprout } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { LeafLogo } from '../components/LeafLogo';
import { resetPassword } from '../services/authService';
import { useAppStore } from '../store/appStore';

interface ForgotForm {
  email: string;
}

export function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const addToast = useAppStore((state) => state.addToast);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotForm>({
    defaultValues: { email: '' },
  });

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      await resetPassword(getValues('email'));
      setSent(true);
    } catch (error) {
      addToast({
        title: 'Failed to send reset link',
        description: error instanceof Error ? error.message : 'Please try again.',
        tone: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="safe-top h-full min-h-screen overflow-y-auto px-5 pb-8 pt-6 md:min-h-0">
      <Link
        to="/login"
        className="mb-8 inline-grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-white/80 text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/10 dark:text-white"
        aria-label="Back to login"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="mb-8">
        <LeafLogo size="md" />
        <h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">Reset Password</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      {sent ? (
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-field-100 dark:bg-field-900/30">
            <Mail className="h-6 w-6 text-field-700 dark:text-field-300" />
          </div>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Check your email</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            We sent a password reset link to <strong>{getValues('email')}</strong>. Click the link in the email to set a new password.
          </p>
          <Link
            to="/login"
            className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-field-700 px-4 text-sm font-black text-white shadow-lg shadow-field-900/20 dark:bg-field-300 dark:text-field-950"
          >
            <Sprout className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75"
        >
          <label className="mb-4 block">
            <span className="mb-2 block text-xs font-black text-slate-500 dark:text-slate-400">Email</span>
            <span className="flex min-h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 dark:border-white/10 dark:bg-white/10">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                className="min-h-12 min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-950 outline-none dark:text-white"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
              />
            </span>
            {errors.email && <span className="mt-1 block text-xs font-bold text-rose-600">{errors.email.message}</span>}
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-field-700 px-4 text-sm font-black text-white shadow-lg shadow-field-900/20 disabled:opacity-70 dark:bg-field-300 dark:text-field-950"
          >
            <Sprout className="h-4 w-4" />
            {submitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </main>
  );
}
