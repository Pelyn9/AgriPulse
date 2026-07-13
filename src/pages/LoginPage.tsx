import { ArrowLeft, KeyRound, Mail, Sprout } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { LeafLogo } from '../components/LeafLogo';
import { loginWithEmail, loginWithGooglePlaceholder, registerWithEmail } from '../services/authService';
import { useAppStore } from '../store/appStore';
import { useSync } from '../hooks/useSync';
import type { UserSession } from '../types';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const setSyncPrompt = useAppStore((state) => state.setSyncPrompt);
  const addToast = useAppStore((state) => state.addToast);
  const sync = useSync();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const finishAuth = async (userPromise: Promise<UserSession>) => {
    setSubmitting(true);
    try {
      const user = await userPromise;
      setUser(user);
      setSyncPrompt(false);
      addToast({ title: `Welcome, ${user.name}`, description: 'Local scans are ready for sync.', tone: 'success' });
      await sync(user);
      navigate('/home', { replace: true });
    } catch (error) {
      addToast({
        title: mode === 'login' ? 'Login failed' : 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        tone: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (values: LoginForm) => {
    finishAuth(mode === 'login' ? loginWithEmail(values) : registerWithEmail(values));
  };

  return (
    <main className="safe-top h-full min-h-screen overflow-y-auto px-5 pb-8 pt-6 md:min-h-0">
      <Link
        to="/home"
        className="mb-8 inline-grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-white/80 text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/10 dark:text-white"
        aria-label="Back to dashboard"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="mb-8">
        <LeafLogo size="md" />
        <h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">Login & Sync</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
          Upload local scan data to Supabase when cloud backup is available.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75"
      >
        <div className="mb-4 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-white/10">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`min-h-11 rounded-xl text-sm font-black transition ${
              mode === 'login' ? 'bg-white text-field-800 shadow-sm dark:bg-field-300 dark:text-field-950' : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`min-h-11 rounded-xl text-sm font-black transition ${
              mode === 'register'
                ? 'bg-white text-field-800 shadow-sm dark:bg-field-300 dark:text-field-950'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            Register
          </button>
        </div>

        <label className="mb-3 block">
          <span className="mb-2 block text-xs font-black text-slate-500 dark:text-slate-400">Email</span>
          <span className="flex min-h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 dark:border-white/10 dark:bg-white/10">
            <Mail className="h-4 w-4 text-slate-400" />
            <input
              type="email"
              className="min-h-12 min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-950 outline-none dark:text-white"
              {...register('email', { required: 'Email is required' })}
            />
          </span>
          {errors.email && <span className="mt-1 block text-xs font-bold text-rose-600">{errors.email.message}</span>}
        </label>

        <label className="mb-4 block">
          <span className="mb-2 block text-xs font-black text-slate-500 dark:text-slate-400">Password</span>
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

        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-field-700 px-4 text-sm font-black text-white shadow-lg shadow-field-900/20 disabled:opacity-70 dark:bg-field-300 dark:text-field-950"
        >
          <Sprout className="h-4 w-4" />
          {submitting ? 'Uploading...' : mode === 'login' ? 'Login' : 'Register'}
        </button>

        <button
          type="button"
          onClick={() => addToast({ title: 'Password reset placeholder', description: 'Supabase recovery can be enabled with project keys.', tone: 'info' })}
          className="mt-3 min-h-10 w-full rounded-2xl text-sm font-black text-field-700 dark:text-field-300"
        >
          Forgot Password
        </button>
      </form>

      <button
        type="button"
        onClick={() => finishAuth(loginWithGooglePlaceholder())}
        disabled={submitting}
        className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 text-sm font-black text-slate-700 shadow-soft disabled:opacity-70 dark:border-white/10 dark:bg-white/10 dark:text-white"
      >
        Google Login
      </button>
    </main>
  );
}
