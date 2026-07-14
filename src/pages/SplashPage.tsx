import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectionStatusBadge } from '../components/ConnectionStatusBadge';
import { LeafLogo } from '../components/LeafLogo';
import { useAppStore } from '../store/appStore';

export function SplashPage() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(user ? '/home' : '/login', { replace: true });
    }, 1900);

    return () => window.clearTimeout(timer);
  }, [navigate, user]);

  return (
    <main className="safe-top flex min-h-screen flex-col items-center justify-center px-8 pb-12 text-center md:min-h-0 md:h-full">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <LeafLogo animated size="lg" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16 }}
        className="mt-8"
      >
        <h1 className="text-4xl font-black tracking-normal text-slate-950 dark:text-white">AgriPulse</h1>
        <p className="mt-4 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
          AI-Powered Rice Leaf Disease Detection & Fertilizer Recommendation
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.42 }}
        className="mt-8"
      >
        <ConnectionStatusBadge />
      </motion.div>
      <div className="absolute bottom-10 h-2 w-32 overflow-hidden rounded-full bg-field-100 dark:bg-white/10">
        <motion.div
          className="h-full rounded-full bg-field-700 dark:bg-field-300"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </main>
  );
}
