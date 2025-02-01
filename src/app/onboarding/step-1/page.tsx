'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StepLayout from '@/app/onboarding/StepLayout';
import { useOnboarding } from '@/hooks/useOnboarding';
import { UserCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useThemeConfig } from '@/hooks/useTheme';
import { IOnboardingData } from '@/types/common';

export default function Step1() {
  const { saveStepData, handleNextStep } = useOnboarding();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  useThemeConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const stepData: Partial<IOnboardingData> = {
        profession: name.trim()
      };

      const success = await saveStepData(stepData);
      if (success) {
        await handleNextStep();
      } else {
        throw new Error('Erreur de sauvegarde');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isNameValid = name.trim().length >= 2;

  return (
    <StepLayout
      title="Bienvenue dans votre parcours !"
      description="Commençons cette aventure ensemble"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        {/* Icon Section */}
        <div className="mb-12 flex justify-center">
          <motion.div 
            className="relative"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <UserCircle className="w-24 h-24 text-primary relative z-10" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label
              htmlFor="name"
              className="block text-lg font-medium text-slate-900 dark:text-white"
            >
              Comment souhaitez-vous quon vous appelle ?
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`
                  block w-full px-6 py-4 rounded-2xl
                  bg-white dark:bg-white/10 backdrop-blur-md
                  border transition-all duration-200
                  text-lg placeholder-slate-400 dark:placeholder-white/30 
                  text-slate-900 dark:text-white
                  ${error ? 'border-red-500' :
                    isNameValid ? 'border-primary' :
                    'border-slate-200 dark:border-white/10'}
                  focus:outline-none focus:ring-2 focus:ring-primary/20
                `}
                placeholder="Votre nom préféré"
                required
                minLength={2}
                maxLength={50}
                autoFocus
                disabled={isLoading}
              />
              
              {name.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-2 text-sm flex items-center gap-2
                    ${isNameValid ? 'text-primary' : 'text-slate-500 dark:text-white/60'}`}
                >
                  {isNameValid ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Parfait !</span>
                    </>
                  ) : (
                    'Le nom doit contenir au moins 2 caractères'
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={!isNameValid || isLoading}
            className={`
              w-full flex items-center justify-center gap-3
              px-6 py-4 rounded-2xl text-base font-medium
              transition-all duration-200 
              ${isNameValid && !isLoading
                ? 'bg-primary text-slate-900 dark:text-[#170312] hover:opacity-90'
                : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/30 cursor-not-allowed'}
              disabled:opacity-50
            `}
            whileHover={{ scale: isNameValid && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: isNameValid && !isLoading ? 0.98 : 1 }}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
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
                <span>Cest parti !</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-slate-500 dark:text-white/40"
        >
          Cette information nous aidera à personnaliser votre expérience
        </motion.p>
      </motion.div>
    </StepLayout>
  );
}