'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  LogOut,
  Mail,
  ChevronRight,
} from 'lucide-react';

type UserStatus = 'online' | 'away' | 'offline';

type UserProfile = {
  name: string;
  role: string;
  email: string;
  status: UserStatus;
  avatar?: string;
  stats: {
    recipes: number;
    followers: number;
  };
};

type MenuItem = {
  icon: React.ComponentType;
  label: string;
  badge?: string;
  variant?: 'default' | 'danger';
  action: () => void;
};

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useState({
    name: 'John Doe',
    role: 'Chef Premium',
    email: 'john@example.com',
    status: 'online' as const,
    avatar: '/ava1.png',
    stats: {
      recipes: 45,
      followers: 234
    }
  });

  const menuItems = [
    {
      icon: User,
      label: 'Mon Profil',
      action: () => console.log('Profile clicked')
    },
    {
      icon: Mail,
      label: 'Messages',
      badge: '2',
      action: () => console.log('Messages clicked')
    },
    {
      icon: Settings,
      label: 'Paramètres',
      action: () => console.log('Settings clicked')
    },
    {
      icon: LogOut,
      label: 'Déconnexion',
      variant: 'danger',
      action: () => console.log('Logout clicked')
    }
  ];

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-slate-500'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-3 p-2 pl-3 pr-4 rounded-2xl 
                 bg-white dark:bg-white/10 backdrop-blur-md border border-slate-200 
                 dark:border-white/10 transition-all hover:-translate-y-0.5 
                 group cursor-pointer"
      >
        {/* Avatar avec status */}
        <div className="relative">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 
                        ${statusColors[user.status]} border-2 border-white 
                        dark:border-[#170312] rounded-full`} />
        </div>

        {/* Info utilisateur */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-xs text-slate-600 dark:text-white/60 truncate">
            {user.role}
          </p>
        </div>

        {/* Stats rapides */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user.stats.recipes}
            </p>
            <p className="text-xs text-slate-600 dark:text-white/60">
              Recettes
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user.stats.followers}
            </p>
            <p className="text-xs text-slate-600 dark:text-white/60">
              Abonnés
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white 
                     dark:bg-white/10 backdrop-blur-md border border-slate-200 
                     dark:border-white/10 shadow-lg z-50 overflow-hidden"
          >
            {/* Quick Actions */}
            <div className="p-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full px-4 py-2.5 rounded-xl flex items-center gap-3 
                           text-sm transition-colors
                           ${item.variant === 'danger'
                            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10'
                            : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                           }`}
                >
                  <item.icon className={`h-4 w-4 ${
                    item.variant === 'danger'
                      ? 'text-red-600'
                      : 'text-slate-600 dark:text-white/60'
                  }`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs 
                                 bg-primary/10 text-primary">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};