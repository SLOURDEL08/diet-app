'use client';

import { motion } from 'framer-motion';

const loadingCircleVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1.5,
      ease: "linear",
      repeat: Infinity
    }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50">
      {/* Fond flouté */}
      <div className="absolute inset-0 bg-slate-50/80 dark:bg-[#170312]/80 backdrop-blur-md" />
      
      {/* Conteneur du loader */}
      <div className="relative h-full flex items-center justify-center">
        {/* Cercle extérieur avec animation pulse */}
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="absolute h-24 w-24 rounded-full bg-primary/10"
        />
        
        {/* Cercle de chargement principal */}
        <motion.div
          variants={loadingCircleVariants}
          animate="animate"
          className="h-16 w-16 rounded-full border-4 border-white/10 dark:border-white/5
            border-t-primary border-l-primary"
        />
        
        {/* Texte de chargement */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute mt-32 text-slate-900 dark:text-white font-medium"
        >
          Chargement...
        </motion.div>
      </div>
    </div>
  );
}