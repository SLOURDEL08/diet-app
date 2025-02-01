'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
        cache: 'no-store' // Important pour éviter le cache
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Si l'utilisateur est authentifié mais pas sur la bonne page
        if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/register') {
          if (data.user.onboardingCompleted) {
            if (window.location.pathname.startsWith('/onboarding')) {
              router.push('/dashboard');
            }
          } else {
            if (!window.location.pathname.startsWith('/onboarding')) {
              router.push(`/onboarding/step-${data.user.onboardingStep || 1}`);
            }
          }
        }
      } else {
        setUser(null);
      }
    } catch  {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erreur de connexion');
    }

    const data = await response.json();
    setUser(data.user);

    if (data.user.onboardingCompleted) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding/step-1');
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    router.push('/auth/login');
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};