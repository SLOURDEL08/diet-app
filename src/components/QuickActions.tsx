'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Settings2, Bell, 
  Search, Pin
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface QuickActionsProps {
  isExpanded: boolean;
}

interface QuickAction {
  id: 'theme' | 'notifications' | 'search' | 'favorites';
  icon: React.ElementType;
  altIcon?: React.ElementType;
  label: string;
  color?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'theme',
    icon: Sun,
    altIcon: Moon,
    label: 'Thème'
  },
  {
    id: 'notifications',
    icon: Bell,
    label: 'Notifications',
    color: 'text-black/70'
  },
  {
    id: 'search',
    icon: Search,
    label: 'Recherche',
    color: 'text-black/70'
  },
  {
    id: 'favorites',
    icon: Pin,
    label: 'Favoris',
    color: 'text-black/70'
  }
];

const buttonVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export default function QuickActions({ isExpanded }: QuickActionsProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = React.useCallback((actionId: QuickAction['id']) => {
    switch (actionId) {
      case 'theme':
        setTheme(theme === 'dark' ? 'light' : 'dark');
        break;
      // Ajoutez d'autres actions ici
      default:
        console.log(`Action ${actionId} clicked`);
    }
  }, [theme, setTheme]);

  if (!mounted) return null;

  return (
    <div className="px-4 mb-2">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-4 gap-2"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                {...buttonVariants}
                animate={{ 
                  ...buttonVariants.animate,
                  transition: { delay: index * 0.05 }
                }}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleAction(action.id)}
                className="flex items-center justify-center h-12 rounded-xl bg-black/5 
                          hover:bg-black/10 transition-colors group"
              >
                {action.id === 'theme' ? (
                  theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-black/70 group-hover:text-black/90 transition-colors" />
                  ) : (
                    <Moon className="h-5 w-5 text-black/70 group-hover:text-black/90 transition-colors" />
                  )
                ) : (
                  <action.icon 
                    className="h-5 w-5 text-black/70 group-hover:text-black/90 transition-colors"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.button
            {...buttonVariants}
            animate={buttonVariants.animate}
            whileHover="hover"
            whileTap="tap"
            className="w-full flex items-center justify-center h-12 rounded-xl bg-black/5 
                      hover:bg-black/10 transition-colors group"
          >
            <Settings2 
              className="h-5 w-5 text-black/70 group-hover:text-black/90 transition-colors"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}