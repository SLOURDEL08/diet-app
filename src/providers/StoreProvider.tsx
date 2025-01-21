// providers/StoreProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [hydrationError, setHydrationError] = useState<Error | null>(null);

  useEffect(() => {
    const hydrateStore = async () => {
      try {
        await useOnboardingStore.persist.rehydrate();
        setIsHydrated(true);
      } catch (error) {
        console.error('Store hydration failed:', error);
        setHydrationError(error as Error);
        // Fallback à un état par défaut si nécessaire
        setIsHydrated(true);
      }
    };

    hydrateStore();
  }, []);

  // Gestion des erreurs d'hydration
  if (hydrationError) {
    // On pourrait afficher un message d'erreur ou utiliser un fallback
    console.warn('Using fallback store state due to hydration error');
    return children;
  }

  // État de chargement
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}