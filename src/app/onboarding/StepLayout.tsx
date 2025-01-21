'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboardingStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeWrapper, useThemeConfig } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function OnboardingLayout({
  children,
  title,
  description,
}: OnboardingLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { isDarkMode } = useThemeConfig();
  const { currentStep, steps } = useOnboardingStore();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.onboardingCompleted) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#170312] transition-colors duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
            <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeWrapper>
      <div className="min-h-screen py-12 px-4 bg-slate-50 dark:bg-[#170312] transition-colors duration-300">
        <div className="fixed top-6 right-6">
          <ThemeToggle />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Conteneur principal */}
            <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
              {/* Contenu principal */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {title && description && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-12 space-y-3"
                    >
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {title}
                      </h2>
                      <p className="text-slate-600 dark:text-white/60 text-lg max-w-xl mx-auto">
                        {description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Zone de contenu */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  {children}
                </motion.div>
              </div>

              {/* Pied de page */}
              <div className="bg-slate-50 dark:bg-white/5 px-8 py-4 border-t border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-center text-sm text-slate-500 dark:text-white/40">
                  <span>© {new Date().getFullYear()} MonApp</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(steps.length)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i < currentStep ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ThemeWrapper>
  );
}