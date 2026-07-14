let onUpdate: (() => void) | null = null;

export function registerServiceWorker(callback?: () => void) {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) {
    return;
  }

  if (callback) {
    onUpdate = callback;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            onUpdate?.();
          }
        });
      });
    }).catch(() => {});
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
