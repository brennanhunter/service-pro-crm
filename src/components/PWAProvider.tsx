'use client';

import { useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });

      // Handle app install prompt
      let deferredPrompt: BeforeInstallPromptEvent | null = null;

      const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button or banner
        showInstallPromotion();
        console.log('Install prompt available:', !!deferredPrompt);
      };

      const handleAppInstalled = () => {
        console.log('PWA was installed');
        hideInstallPromotion();
        deferredPrompt = null;
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Cleanup
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const showInstallPromotion = () => {
    // You can implement a custom install banner here
    console.log('App can be installed');
    // Could dispatch an event or update global state to show install UI
  };

  const hideInstallPromotion = () => {
    // Hide the install banner
    console.log('Install promotion hidden');
  };

  return <>{children}</>;
}
