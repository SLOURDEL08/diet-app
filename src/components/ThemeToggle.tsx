'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  isExpanded: boolean;
}

export function ThemeToggle({ isExpanded }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="px-3 my-2">
      <div 
        className={`relative flex rounded-xl bg-black/5 transition-all duration-300
          ${isExpanded ? 'p-2' : 'justify-center p-3'}`}
      >
        {isExpanded ? (
          // Version étendue
          <>
            <motion.div
              className="absolute inset-2 rounded-lg bg-white dark:bg-black/20"
              layout
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
              animate={{
                x: theme === 'dark' ? '50%' : '0%'
              }}
            />
            <button
              onClick={() => setTheme('light')}
              className={`relative z-10 flex items-center gap-3 p-2 rounded-lg flex-1
                ${theme === 'light' ? 'text-black' : 'text-black/50'}`}
            >
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`relative z-10 flex items-center gap-3 p-2 rounded-lg flex-1
                ${theme === 'dark' ? 'text-black' : 'text-black/50'}`}
            >
              <Moon className="h-5 w-5" />
              <span className="text-sm font-medium">Dark</span>
            </button>
          </>
        ) : (
          // Version compacte
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative"
          >
            <motion.div
              initial={false}
              animate={{
                rotate: theme === 'dark' ? 180 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Sun className={`h-5 w-5 absolute transition-all ${
                theme === 'light' 
                  ? 'rotate-0 opacity-100 text-black' 
                  : 'rotate-90 opacity-0 text-black/50'
              }`} />
              <Moon className={`h-5 w-5 transition-all ${
                theme === 'dark'
                  ? 'rotate-0 opacity-100 text-black'
                  : '-rotate-90 opacity-0 text-black/50'
              }`} />
            </motion.div>
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default ThemeToggle;