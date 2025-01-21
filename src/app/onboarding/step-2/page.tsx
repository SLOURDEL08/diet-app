'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StepLayout from '@/app/onboarding/StepLayout';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, Briefcase } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeConfig } from '@/hooks/useTheme';

const professions = [
  { id: 'developer', label: 'Développeur' },
  { id: 'designer', label: 'Designer' },
  { id: 'project-manager', label: 'Chef de projet' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Commercial' },
  { id: 'other', label: 'Autre' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function Step2() {
  const { saveStepData, handleNextStep } = useOnboarding();
  const [profession, setProfession] = useState('');
  const [otherProfession, setOtherProfession] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useThemeConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const finalProfession = profession === 'other' ? otherProfession : 
        professions.find(p => p.id === profession)?.label || '';
      
      await saveStepData({ profession: finalProfession });
      await handleNextStep();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = profession && (profession !== 'other' || otherProfession.length >= 2);

  return (
    <StepLayout
      title="Votre Profil Professionnel"
      description="Faites-nous découvrir votre parcours"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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
              <Briefcase className="w-24 h-24 text-primary relative z-10" />
            </div>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div variants={itemVariants} className="space-y-4">
            <Label className="block text-lg font-medium text-slate-900 dark:text-white">
              Quelle est votre profession ?
            </Label>
            <Select
              value={profession}
              onValueChange={setProfession}
            >
              <SelectTrigger className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Sélectionnez votre profession" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#170312]/95 backdrop-blur-md border-slate-200 dark:border-white/10">
                {professions.map((prof) => (
                  <SelectItem 
                    key={prof.id} 
                    value={prof.id}
                    className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer focus:bg-slate-100 dark:focus:bg-white/10 focus:text-slate-900 dark:focus:text-white"
                  >
                    {prof.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {profession === 'other' && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <Label className="block text-lg font-medium text-slate-900 dark:text-white">
                Précisez votre profession
              </Label>
              <Input
                type="text"
                value={otherProfession}
                onChange={(e) => setOtherProfession(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                placeholder="Votre profession"
                required
                minLength={2}
                maxLength={50}
              />
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={!isValid || isLoading}
            className={`
              w-full flex items-center justify-center gap-3
              px-6 py-4 rounded-2xl text-base font-medium
              transition-all duration-200 
              ${isValid && !isLoading
                ? 'bg-primary text-slate-900 dark:text-[#170312] hover:opacity-90'
                : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/30 cursor-not-allowed'}
              disabled:opacity-50
            `}
            whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
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
        </form>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-slate-500 dark:text-white/40"
        >
          Ces informations nous aideront à personnaliser votre expérience
        </motion.p>
      </motion.div>
    </StepLayout>
  );
}