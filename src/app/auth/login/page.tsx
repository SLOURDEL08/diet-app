'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, AlertCircle, Loader2, Sun, Moon } from 'lucide-react';
import { useThemeConfig } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const { isDarkMode } = useThemeConfig();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      if (data.user) {
        await login(formData.email, formData.password);
        
        if (!data.user.onboardingCompleted) {
          router.push(`/onboarding/step-${data.user.onboardingStep || 1}`);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#170312] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <ThemeToggle/>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Connexion
          </h2>
          <p className="mt-2 text-slate-600 dark:text-white/60">
            Accédez à votre espace personnel
          </p>
        </motion.div>
        
        <motion.form 
          variants={itemVariants}
          className="mt-8 space-y-6 relative"
          onSubmit={handleSubmit}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 
                  text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 
                  focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                  transition-all duration-200 shadow-sm"
                placeholder="Votre adresse email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 
                  text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 
                  focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                  transition-all duration-200 shadow-sm"
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl 
                bg-primary text-white font-medium hover:opacity-90 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Se connecter</span>
                </>
              )}
            </motion.button>

            <p className="text-center text-slate-600 dark:text-white/60">
              Pas encore de compte ?{' '}
              <Link
                href="/auth/register"
                className="text-primary hover:opacity-80 transition-opacity font-medium"
              >
                S&apos;inscrire
              </Link>
            </p>
          </motion.div>
        </motion.form>

        <motion.div 
          variants={itemVariants}
          className="text-center text-sm text-slate-500 dark:text-white/40"
        >
          En vous connectant, vous acceptez nos{' '}
          <Link href="/conditions" className="text-primary hover:text-primary/80 transition-colors">
            conditions d&apos;utilisation
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}