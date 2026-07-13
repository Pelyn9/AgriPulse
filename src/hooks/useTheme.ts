import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export function useTheme() {
  const theme = useAppStore((state) => state.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const shouldUseDark = theme === 'dark' || (theme === 'system' && media.matches);
      root.classList.toggle('dark', shouldUseDark);
    };

    applyTheme();
    media.addEventListener('change', applyTheme);

    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);
}
