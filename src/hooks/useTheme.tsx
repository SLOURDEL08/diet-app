'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { themeConfig, generateThemeClasses } from '@/config/theme';

export function useThemeConfig() {
  const { theme, systemTheme } = useTheme();
  
  // Déterminer le thème effectif
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  
  // Générer les classes de thème dynamiques
  const themeClasses = React.useMemo(() => generateThemeClasses(), []);
  
  // Obtenir la configuration de couleur actuelle
  const currentThemeColors = effectiveTheme === 'dark' 
    ? themeConfig.dark 
    : themeConfig.light;
  
  return {
    themeClasses,
    currentThemeColors,
    isDarkMode: effectiveTheme === 'dark'
  };
}

interface ThemeWrapperProps {
  children: React.ReactNode;
  className?: string;
  bgClassName?: string;
  textClassName?: string;
}

export function ThemeWrapper({
  children,
  className = '',
  bgClassName = 'bg-theme-primary',
  textClassName = 'text-theme-primary'
}: ThemeWrapperProps) {
  const { themeClasses } = useThemeConfig();
  
  const combinedClassName = React.useMemo(() => {
    return [
      themeClasses[bgClassName as keyof typeof themeClasses] ?? '',
      themeClasses[textClassName as keyof typeof themeClasses] ?? '',
      className,
      'transition-colors duration-300'
    ].filter(Boolean).join(' ');
  }, [themeClasses, bgClassName, textClassName, className]);
  
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}
