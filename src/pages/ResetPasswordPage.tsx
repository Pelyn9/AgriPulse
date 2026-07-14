import { ArrowLeft, KeyRound, Sprout } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { LeafLogo } from '../components/LeafLogo';
import { updatePassword } from '../services/authService';
import { useAppStore } from '../store/appStore';

interface ResetForm {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const addToast = useAppStore((state) => state.addToast);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetForm) => {
    setSubmitting(true);
    try {
      await updatePassword(values.password);
      setDone(true);
      addToast({ title: 'Password updated', description: 'You can now log in with your new password.', tone: 'success' });
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (error) {
      addToast({
        title: 'Reset failed',
        description: error instanceof Error ? error.message : 'The reset link may have expired. Try again.',
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
        <h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">New Password</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
          Enter your new password below.
        </p>
      </div>

      {done ? (
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-field-100 dark:bg-field-900/30">
            <Sprout className="h-6 w-6 text-field-700 dark:text-field-300" />
          </div>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Password updated!</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Redirecting you to the login page...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75"
        >
          <label className="mb-3 block">
            <span className="mb-2 block text-xs font-black text-slate-500 dark:text-slate-400">New Password</span>
            <span className="flex min-h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 dark:border-white/10 dark:bg-white/10">
              <KeyRound className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                className="min-h-12 min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-950 outline-none dark:text-white"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Use at least 6 characters' } })}
              />
            </span>
            {errors.password && <span className="mt-1 block text-xs font-bold text-rose-600">{errors.password.message}</span>}
          </label>

          <label className="mb-4 block">
            <span className="mb-2 block text-xs font-black text-slate-500 dark:text-slate-400">Confirm Password</span>
            <span className="flex min-h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 dark:border-white/10 dark:bg-white/10">
              <KeyRound className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                className="min-h-12 min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-950 outline-none dark:text-white"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val, formValues) => val === formValues.password || 'Passwords do not match',
                })}
              />
            </span>
            {errors.confirmPassword && <span className="mt-1 block text-xs font-bold text-rose-600">{errors.confirmPassword.message}</span>}
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-field-700 px-4 text-sm font-black text-white shadow-lg shadow-field-900/20 disabled:opacity-70 dark:bg-field-300 dark:text-field-950"
          >
            <Sprout className="h-4 w-4" />
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </main>
  );
}
