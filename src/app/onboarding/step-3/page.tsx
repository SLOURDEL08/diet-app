'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StepLayout from '@/app/onboarding/StepLayout';
import { useOnboarding } from '@/hooks/useOnboarding';
import { ArrowRight, Check, Code, Brain, Palette, Shield, Cloud, Settings, Smartphone, Database } from 'lucide-react';
import { useThemeConfig } from '@/hooks/useTheme';

const interestsList = [
  { id: 'web', name: 'Développement Web', icon: Code },
  { id: 'ai', name: 'Intelligence Artificielle', icon: Brain },
  { id: 'design', name: 'Design UI/UX', icon: Palette },
  { id: 'security', name: 'Cybersécurité', icon: Shield },
  { id: 'cloud', name: 'Cloud Computing', icon: Cloud },
  { id: 'devops', name: 'DevOps', icon: Settings },
  { id: 'mobile', name: 'Mobile', icon: Smartphone },
  { id: 'data', name: 'Data Science', icon: Database }
];

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

export default function Step3() {
  const { saveStepData, handleNextStep } = useOnboarding();
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useThemeConfig();

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const saved = await saveStepData({ interests });
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
      title="Centres d'intérêt"
      description="Sélectionnez les domaines qui vous intéressent"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={containerVariants}
          >
            {interestsList.map((interest) => {
              const Icon = interest.icon;
              const isSelected = interests.includes(interest.id);
              
              return (
                <motion.div
                  key={interest.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleInterest(interest.id)}
                  className={`
                    relative p-4 rounded-2xl cursor-pointer
                    backdrop-blur-md border transition-all duration-300
                    ${isSelected 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-primary/20'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-xl transition-colors
                      ${isSelected 
                        ? 'bg-primary text-slate-900 dark:text-[#170312]' 
                        : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`
                      text-sm font-medium flex-1
                      ${isSelected 
                        ? 'text-primary' 
                        : 'text-slate-900 dark:text-white/80'}
                    `}>
                      {interest.name}
                    </span>
                    <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center
                      border transition-colors
                      ${isSelected 
                        ? 'border-primary bg-primary text-slate-900 dark:text-[#170312]' 
                        : 'border-slate-200 dark:border-white/20 bg-white dark:bg-white/5'}
                    `}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.button
            type="submit"
            disabled={interests.length === 0 || isLoading}
            className={`
              w-full flex items-center justify-center gap-3
              px-6 py-4 rounded-2xl text-base font-medium
              transition-all duration-200 
              ${interests.length > 0 && !isLoading
                ? 'bg-primary text-slate-900 dark:text-[#170312] hover:opacity-90'
                : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/30 cursor-not-allowed'}
              disabled:opacity-50
            `}
            whileHover={interests.length > 0 && !isLoading ? { scale: 1.02 } : {}}
            whileTap={interests.length > 0 && !isLoading ? { scale: 0.98 } : {}}
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
                <span>Continuer</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-slate-500 dark:text-white/40"
          >
            Sélectionnez au moins un centre dintérêt pour continuer
          </motion.p>
        </form>
      </motion.div>
    </StepLayout>
  );
}