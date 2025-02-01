type ThemeCategories = {
  background: Record<string, string>;
  text: Record<string, string>;
  border: Record<string, string>;
  overlay: Record<string, string>;
  card: Record<string, string>;
  accent: Record<string, string>;
};

type Theme = {
  light: ThemeCategories;
  dark: ThemeCategories;
};

export const themeConfig: Theme = {
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F4F4F5',
      tertiary: '#E4E4E7',
    },
    text: {
      primary: '#000000',
      secondary: 'rgba(0,0,0,0.7)',
      tertiary: 'rgba(0,0,0,0.5)',
    },
    border: {
      primary: 'rgba(0,0,0,0.1)',
      secondary: 'rgba(0,0,0,0.05)',
    },
    overlay: {
      background: 'rgba(255,255,255,0.8)',
    },
    card: {
      background: '#FFFFFF',
      shadow: 'rgba(0,0,0,0.1)',
    },
    accent: {
      primary: '#C7EF00',
      hover: '#A0C800',
    },
  },
  dark: {
    background: {
      primary: '#121212',
      secondary: '#1E1E1E',
      tertiary: '#2C2C2C',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.8)',
      tertiary: 'rgba(255,255,255,0.6)',
    },
    border: {
      primary: 'rgba(255,255,255,0.1)',
      secondary: 'rgba(255,255,255,0.05)',
    },
    overlay: {
      background: 'rgba(18,18,18,0.8)',
    },
    card: {
      background: '#1E1E1E',
      shadow: 'rgba(0,0,0,0.3)',
    },
    accent: {
      primary: '#C7EF00',
      hover: '#D0F010',
    },
  },
};

type ThemeMode = keyof Theme;
type ThemeCategory = keyof ThemeCategories;

export function getThemeColor(
  category: ThemeCategory, 
  type: string, 
  mode: ThemeMode = 'light'
): string {
  const value = themeConfig[mode][category][type];
  if (typeof value !== 'string') {
    throw new Error(`Invalid theme value for ${category}.${type} in ${mode} mode`);
  }
  return value;
}

export function generateThemeClasses() {
  return {
    'bg-theme-primary': 'bg-white dark:bg-neutral-900',
    'bg-theme-secondary': 'bg-gray-50 dark:bg-neutral-800',
    'bg-theme-tertiary': 'bg-gray-100 dark:bg-neutral-700',
    
    'text-theme-primary': 'text-black dark:text-white',
    'text-theme-secondary': 'text-black/70 dark:text-white/80',
    'text-theme-tertiary': 'text-black/50 dark:text-white/60',
    
    'border-theme-primary': 'border-black/10 dark:border-white/10',
    'border-theme-secondary': 'border-black/5 dark:border-white/5',
    
    'card-theme': 'bg-white dark:bg-neutral-800 shadow-sm dark:shadow-md',
    
    'overlay-theme': 'bg-white/80 dark:bg-black/80',
    
    'accent-theme-primary': 'text-lime-500',
    'accent-theme-hover': 'hover:text-lime-600 dark:hover:text-lime-400'
  } as const;
}