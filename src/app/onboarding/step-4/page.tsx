'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StepLayout from '@/app/onboarding/StepLayout';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Sun, Moon, Bell, Globe, Mail, ArrowRight } from 'lucide-react';
import { useThemeConfig } from '@/hooks/useTheme';

interface Preferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

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

export default function Step4() {
  const { saveStepData, handleNextStep } = useOnboarding();
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'dark',
    notifications: true,
    language: 'fr',
    emailFrequency: 'weekly',
  });
  const [isLoading, setIsLoading] = useState(false);
  useThemeConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const saved = await saveStepData({ preferences });
      if (saved) {
        await handleNextStep();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StepLayout
      title="Vos Préférences"
      description="Personnalisez votre expérience"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Thème */}
          <motion.div variants={itemVariants} className="space-y-4">
            <label className="block text-lg font-medium text-slate-900 dark:text-white">
              Thème de linterface
            </label>
            <div className="flex gap-4">
              {(['light', 'dark'] as const).map((theme) => (
                <motion.button
                  key={theme}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, theme })}
                  className={`
                    flex items-center gap-3 px-6 py-4 rounded-2xl
                    backdrop-blur-md border transition-all duration-300
                    ${preferences.theme === theme
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:border-primary/20'}
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {theme === 'light' ? 'Clair' : 'Sombre'}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className={`
                  p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 cursor-pointer
                  ${preferences.notifications
                    ? 'bg-primary/10 border-primary'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10'}
                `}
                onClick={() => setPreferences({
                  ...preferences,
                  notifications: !preferences.notifications
                })}
              >
                <Bell className={preferences.notifications ? 'text-primary' : 'text-slate-600 dark:text-white/60'} />
              </div>
              <span className="text-lg font-medium text-slate-900 dark:text-white">
                Notifications {preferences.notifications ? 'activées' : 'désactivées'}
              </span>
            </div>
          </motion.div>

          {/* Langue */}
          <motion.div variants={itemVariants} className="space-y-4">
            <label className="flex items-center gap-3 text-lg font-medium text-slate-900 dark:text-white">
              <Globe className="w-5 h-5" />
              Langue préférée
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
                border border-slate-200 dark:border-white/10 
                text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 
                focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            >
              <option value="fr" className="bg-white dark:bg-[#170312]">Français</option>
              <option value="en" className="bg-white dark:bg-[#170312]">English</option>
              <option value="es" className="bg-white dark:bg-[#170312]">Español</option>
            </select>
          </motion.div>

          {/* Fréquence des emails */}
          <motion.div variants={itemVariants} className="space-y-4">
            <label className="flex items-center gap-3 text-lg font-medium text-slate-900 dark:text-white">
              <Mail className="w-5 h-5" />
              Fréquence des emails
            </label>
            <select
              value={preferences.emailFrequency}
              onChange={(e) => setPreferences({
                ...preferences,
                emailFrequency: e.target.value as Preferences['emailFrequency']
              })}
              className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
                border border-slate-200 dark:border-white/10 
                text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 
                focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            >
              <option value="daily" className="bg-white dark:bg-[#170312]">Quotidien</option>
              <option value="weekly" className="bg-white dark:bg-[#170312]">Hebdomadaire</option>
              <option value="monthly" className="bg-white dark:bg-[#170312]">Mensuel</option>
              <option value="never" className="bg-white dark:bg-[#170312]">Jamais</option>
            </select>
          </motion.div>

          {/* Bouton Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center gap-3
              px-6 py-4 rounded-2xl text-base font-medium
              transition-all duration-200 
              ${!isLoading 
                ? 'bg-primary text-slate-900 dark:text-[#170312] hover:opacity-90'
                : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/30 cursor-not-allowed'}
              disabled:opacity-50
            `}
            whileHover={{ scale: !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: !isLoading ? 0.98 : 1 }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Chargement...</span>
              </>
            ) : (
              <>
                <span>Terminer</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </StepLayout>
  );
}