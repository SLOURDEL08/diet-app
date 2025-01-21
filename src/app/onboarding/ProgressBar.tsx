'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  progressClassName?: string;
}

export default function ProgressBar({ 
  currentStep, 
  totalSteps,
  className = "h-1 bg-white/10",
  progressClassName = "bg-primary"
}: ProgressBarProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative">
      {/* Ligne de progression */}
      <div className={`w-full rounded-full ${className}`}>
        <motion.div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${progressClassName}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </div>

      {/* Points de progression */}
      <div className="relative flex justify-between mt-6">
        {steps.map((step) => (
          <motion.div 
            key={step} 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: step * 0.1 }}
          >
            <div className="relative">
              {/* Cercle principal */}
              <motion.div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center 
                  transition-all duration-300 z-10
                  ${step < currentStep 
                    ? 'bg-primary text-[#170312]' 
                    : step === currentStep 
                      ? 'bg-white/10 backdrop-blur-sm border border-primary text-primary' 
                      : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white/40'}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </motion.div>

              {/* Effet de pulse pour l'étape active */}
              {step === currentStep && (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                </div>
              )}
            </div>

            {/* Label avec effet de fade */}
            <motion.div 
              className={`
                mt-3 text-xs font-medium transition-all duration-300
                ${step <= currentStep ? 'text-primary' : 'text-white/40'}
              `}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: step * 0.15 }}
            >
              Étape {step}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Connecteurs entre les points */}
      <div className="absolute top-4 left-0 right-0 flex justify-between px-4">
        {steps.slice(0, -1).map((_, index) => (
          <div
            key={index}
            className={`
              flex-1 h-px mx-4 transition-all duration-500
              ${index < currentStep - 1 ? 'bg-primary' : 'bg-white/10'}
            `}
          />
        ))}
      </div>
    </div>
  );
}