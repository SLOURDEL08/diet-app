'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Settings2, Bell, 
  Search, Pin, User, LogOut, Settings,
  Home, Calendar, PieChart, Heart, 
  BookOpen, MessageSquare, ScrollText, PenToolIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

interface NavBarProps {
  isExpanded: boolean;
}
interface QuickActionsProps {
  isExpanded: boolean;
}

const navigationItems = [
  { icon: Home, label: 'Tableau de bord', href: '/dashboard' },
  { icon: Calendar, label: 'Food Matcher', href: '/food-matcher' },
  { icon: PieChart, label: 'Fitness', href: '/stats' },
  { icon: Heart, label: 'Suivi santé', href: '/health' },
  { icon: BookOpen, label: 'Mes recettes', href: '/recipes' },
  { icon: MessageSquare, label: 'Messages', href: '/messages', badge: 3 },
  { icon: ScrollText, label: 'Statistiques', href: '/journal' },
  { icon: PenToolIcon, label: 'Mes préférences', href: '/de' }
];

const quickActions = [
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
  },
  {
    id: 'search',
    icon: Search,
    label: 'Recherche',
  },
  {
    id: 'favorites',
    icon: Pin,
    label: 'Favoris',
  }
];

const QuickActions: React.FC<QuickActionsProps> = ({ isExpanded }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: index * 0.05 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => action.id === 'theme' && setTheme(theme === 'dark' ? 'light' : 'dark')}
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
};

export default function NavBar({ isExpanded }: NavBarProps) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <nav 
      className={`fixed left-0 top-0 h-full bg-primary flex flex-col py-6 
        transition-[width] duration-300 ease-in-out ${isExpanded ? 'w-56' : 'w-20'}`}
    >
      {/* Logo Section */}
      <motion.div 
        layout
        className="px-4 mb-6"
      >
        <motion.div 
          layout
          className="flex rounded-xl bg-black/5 h-14"
        >
          <div className="flex items-center w-14 justify-center">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <motion.div
            layout
            className={`flex items-center overflow-hidden transition-all duration-300
              ${isExpanded ? 'w-[calc(100%-3.5rem)]' : 'w-0'}`}
          >
            <span className="text-lg font-semibold text-black whitespace-nowrap">
              MonApp
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-2 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                layout
              >
                <Link
                  href={item.href}
                  className={`flex h-12 rounded-xl transition-colors duration-200 group
                    ${isActive 
                      ? 'bg-black/10 text-black' 
                      : 'hover:bg-black/5 text-black/60 hover:text-black'
                    }`}
                >
                  <div className="flex items-center w-14 justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <motion.div
                    layout
                    className={`flex items-center overflow-hidden transition-all duration-300
                      ${isExpanded ? 'w-[calc(100%-3.5rem)]' : 'w-0'}`}
                  >
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-1 rounded-full text-xs font-medium bg-black/10">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* QuickActions */}
      <QuickActions isExpanded={isExpanded} />

      {/* User Section */}
      <div className="px-4">
        <motion.button
          layout
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`w-full rounded-xl transition-colors duration-200 group
            ${showUserMenu ? 'bg-black/10' : 'hover:bg-black/5'}`}
        >
          <div className="flex h-12">
            <div className="flex items-center w-14 justify-center">
              <User className="w-5 h-5 text-black/70 group-hover:text-black/90 transition-colors" />
            </div>
            <motion.div
              layout
              className={`flex-1 flex flex-col justify-center overflow-hidden transition-all duration-300
                ${isExpanded ? 'w-[calc(100%-3.5rem)]' : 'w-0'}`}
            >
              <p className="text-sm font-medium text-black truncate">
                Utilisateur
              </p>
              <p className="text-xs text-black/50 truncate">
                user@example.com
              </p>
            </motion.div>
          </div>
        </motion.button>

        <AnimatePresence>
          {showUserMenu && isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 space-y-1"
            >
              <Link
                href="/profile"
                className="flex items-center h-12 px-4 rounded-xl hover:bg-black/5 
                          text-black/70 hover:text-black transition-colors group"
              >
                <Settings className="w-5 h-5 mr-3" />
                <span className="text-sm">Paramètres</span>
              </Link>
              <button
                className="w-full flex items-center h-12 px-4 rounded-xl hover:bg-black/5 
                          text-red-600 hover:text-red-700 transition-colors group"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="text-sm">Déconnexion</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}