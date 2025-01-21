'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  Settings,
  LogOut,
  Calendar,
  PieChart,
  Heart,
  BookOpen,
  MessageSquare,
  ScrollText,
  Sun,
  Moon,
  PenToolIcon,
} from 'lucide-react';
import Image from 'next/image';

interface NavBarProps {
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
    { icon: PenToolIcon, label: 'Mes préférences', href: '/de' },

];

export default function NavBar({ isExpanded }: NavBarProps) {
 const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
      <nav 
      className={`fixed left-0 top-0 h-full bg-primary flex flex-col py-6 
        transition-[width] duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      {/* Logo Section */}
<div className="px-3 mb-8">
  <div className="flex rounded-xl bg-black/5">
    <div className="flex items-center h-14 w-14 justify-center">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
        <Image 
          src="/logo.png" 
          alt="Logo"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
      </div>
    </div>
    <div className={`flex items-center transition-[width] duration-300 ease-in-out overflow-hidden
      ${isExpanded ? 'w-[calc(100%-3.5rem)]' : 'w-0'}`}>
      <span className="text-xl font-semibold text-black whitespace-nowrap">
        MonApp
      </span>
      <div className="ml-auto">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl bg-black/5 hover:bg-black/10"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-black" />
          ) : (
            <Moon className="w-5 h-5 text-black" />
          )}
        </button>
      </div>
    </div>
  </div>
</div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-2 overflow-x-hidden">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex rounded-xl transition-colors duration-200
                ${isActive 
                  ? 'bg-black/10 text-black' 
                  : 'hover:bg-black/5 text-black/60 hover:text-black'
                }`}
            >
              <div className="flex items-center h-full w-max p-3 justify-center">
                <div className="relative">
                  <item.icon className="w-6 h-6" />
                  {item.badge && !isExpanded && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-medium text-primary">
                        {item.badge}
                      </span>
                    </span>
                  )}
                </div>
              </div>
              <div className={`flex items-center transition-[width] duration-300 ease-in-out overflow-hidden
                ${isExpanded ? 'w-[calc(100%-3.5rem)]' : 'w-0'}`}>
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
                {item.badge && isExpanded && (
                  <span className="ml-auto px-2 py-1 rounded-full text-xs font-medium bg-black/10 text-black">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Section */}
      <div className="px-3 mt-4">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`w-full rounded-xl transition-colors duration-200
            ${showUserMenu ? 'bg-black/10' : 'hover:bg-black/5'}`}
        >
          <div className="flex items-center h-14">
            <div className="flex items-center h-14 w-14 justify-center">
              <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center">
                <User className="w-4 h-4 text-black/70" />
              </div>
            </div>
            <div className={`flex-1 overflow-hidden transition-[width] duration-300 ease-in-out
              ${isExpanded ? 'w-auto' : 'w-0'}`}>
              <p className="text-sm font-medium text-black text-left truncate">
                {user?.name || 'Utilisateur'}
              </p>
              <p className="text-xs text-black/50 text-left truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </button>

        {/* User Menu */}
        {showUserMenu && isExpanded && (
          <div className="mt-2 py-2 px-1 space-y-1">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 text-black/70 hover:text-black transition-colors duration-200"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm">Paramètres</span>
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Déconnexion</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications Indicator */}
      {!isExpanded && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
        </div>
      )}
    </nav>
  );
}