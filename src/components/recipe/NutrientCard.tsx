import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface NutrientCardProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  iconColor: string;
  maxValue: number;
  barColor: {
    bg: string;
    fill: string;
    darkBg: string;
  };
  isActive: boolean;
}

export const NutrientCard = ({
  label,
  value,
  unit,
  icon: Icon,
  iconColor,
  maxValue,
  barColor,
  isActive
}: NutrientCardProps) => {
  const percentage = (value / maxValue) * 100;
  const baseColor = iconColor.split('-')[1];
  const [animationKey, setAnimationKey] = useState(0);

  // Réinitialiser les animations quand la carte devient active
  useEffect(() => {
    if (isActive) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isActive]);

  return (
    <motion.div
      key={`card-${animationKey}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1.05 : 1, 
        opacity: 1,
      }}
      whileHover={{ scale: isActive ? 1.05 : 1 }}
      className={`relative p-4 rounded-2xl border transition-all duration-500
                ${isActive 
                  ? `bg-${baseColor}-500 border-${baseColor}-400 dark:border-transparent` 
                  : 'bg-white dark:bg-white/0 border-slate-100 dark:border-white/10'
                } shadow-sm`}
    >
      {/* Icon Header */}
      <div className="relative flex items-center justify-between">
        <motion.div
          key={`icon-${animationKey}`}
          initial={{ y: isActive ? -20 : 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.6 
          }}
          className={`p-2 rounded-xl ${
            isActive 
              ? `bg-white/20` 
              : `${barColor.bg} dark:bg-white/10`
          }`}
        >
          <Icon className={`h-4 w-4 ${
            isActive ? 'text-white' : iconColor
          }`} />
        </motion.div>
        <span className={`text-sm font-medium transition-colors duration-500 ${
          isActive 
            ? 'text-white' 
            : 'text-slate-600 dark:text-white/60'
        }`}>
          {label}
        </span>
      </div>

      {/* Value Display */}
      <motion.div
        key={`value-${animationKey}`}
        initial={{ y: isActive ? 20 : 0, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: isActive ? [1, 1.1, 1] : 1
        }}
        transition={{ 
          duration: 0.6,
          ease: "easeOut"
        }}
        className="relative z-10 mb-3"
      >
        <div className="flex items-baseline justify-end gap-1">
          <span className={`text-2xl font-bold transition-colors duration-500 ${
            isActive 
              ? 'text-white' 
              : 'text-slate-900 dark:text-white'
          }`}>
            {value}
          </span>
          <span className={`text-sm font-medium transition-colors duration-500 ${
            isActive 
              ? 'text-white/80' 
              : 'text-slate-500 dark:text-white/60'
          }`}>
            {unit}
          </span>
        </div>
      </motion.div>

      {/* Progress Bar */}

{/* Progress Bar Container */}
<div className={`h-1.5 w-full rounded-full overflow-hidden transition-colors duration-500 relative ${
  isActive 
    ? `bg-white/10` 
    : `${barColor.bg} dark:${barColor.darkBg}`
}`}>
  {/* Background Track */}
  <div className={`absolute inset-0 ${
    isActive 
      ? 'bg-white/10' 
      : `${barColor.fill.replace('from-', '').replace('to-', '')} opacity-10`
  }`} />

  {/* Active Progress */}
  <AnimatePresence mode="wait">
    <motion.div
      key={`progress-${animationKey}`}
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ 
        duration: isActive ? 1 : 0.8, 
        ease: "easeOut" 
      }}
      className={`h-full rounded-full relative ${
        isActive 
          ? 'bg-white' 
          : barColor.fill
      }`}
    >
      {/* Shine Effect */}
      <motion.div
        key={`shine-${animationKey}`}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          delay: isActive ? 0 : 0.2
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      {/* Active Pulse Effect */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-white/10"
        />
      )}
    </motion.div>
  </AnimatePresence>
</div>
    </motion.div>
  );
};