'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { ThemeWrapper } from '@/hooks/useTheme';
import { useThemeConfig } from '@/hooks/useTheme';
import { 
  Moon, 
  Bell,
  Globe,
  Settings,
  TrendingDown,
  ChevronRight,
  TrendingUp,
  Target,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import FavoriteRecipesCard from '@/components/FavoriteRecipeCard';
import { ProfileMenu } from '@/components/ProfileMenu';
import FitnessWidget from '@/components/ActivityFeed';

// Types
type Goal = {
  id: string;
  label: string;
  progress: number;
  target: number;
  deadline?: Date;
};

type Metric = {
  label: string;
  value: string | number;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
};

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Preference = {
  icon: IconComponent;
  title: string;
  value: string;
  href?: string;
  onClick?: () => void;
};

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Mock data
const mockGoals: Goal[] = [
  {
    id: '1',
    label: 'Progression mensuelle',
    progress: 75,
    target: 100,
    deadline: new Date(Date.now() + 604800000)
  },
  {
    id: '2',
    label: 'Objectifs complétés',
    progress: 45,
    target: 100
  },
  {
    id: '3',
    label: 'Performance globale',
    progress: 90,
    target: 100
  }
];

const mockMetrics: Metric[] = [
  {
    label: 'Taux de réussite',
    value: '87%',
    trend: '+12%',
    trendDirection: 'up'
  },
  {
    label: 'Actions complétées',
    value: '234',
    trend: '-5%',
    trendDirection: 'down'
  },
  {
    label: 'Score total',
    value: '45.8K',
    trend: '+28%',
    trendDirection: 'up'
  }
];

export default function Dashboard() {
  const onboardingData = useOnboardingStore((state) => state.data);
  const { isDarkMode } = useThemeConfig();
  const [goals] = useState<Goal[]>(mockGoals);
  const [metrics] = useState<Metric[]>(mockMetrics);

  const preferences: Preference[] = [
    {
      icon: Moon,
      title: 'Thème',
      value: isDarkMode ? 'Sombre' : 'Clair',
      onClick: () => { }
    },
    {
      icon: Bell,
      title: 'Notifications',
      value: onboardingData.preferences?.notifications ? 'Activées' : 'Désactivées',
    },
    {
      icon: Globe,
      title: 'Langue',
      value: onboardingData.preferences?.language === 'fr' ? 'Français' : 'English',
    }
  ];

  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-slate-50 dark:bg-[#00000010] transition-colors duration-300 p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[90rem] mx-auto space-y-6"
        >
          {/* Header */}
          <motion.header variants={itemVariants} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Tableau de bord
              </h1>
              <p className="text-slate-600 dark:text-white/60 mt-1">
                Gérez vos préférences et suivez votre progression
              </p>
            </div>
            <ProfileMenu />
          </motion.header>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Favorite Recipes Section */}
              <motion.div 
                variants={itemVariants} 
                className="h-[calc(100vh-16rem)] min-h-[600px]"
              >
                <FavoriteRecipesCard />
              </motion.div>

              {/* Bottom Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Objectifs */}
                <motion.div variants={itemVariants}>
                  <div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
                    border border-slate-200 dark:border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Objectifs</h3>
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {goals.map((goal) => (
                        <div key={goal.id} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium mb-1 flex items-center gap-2 text-slate-900 dark:text-white">
                                {goal.label}
                                {goal.progress >= 100 && (
                                  <span className="inline-block p-1 rounded-full bg-primary/10">
                                    <CheckCircle2 className="h-3 w-3 text-primary" />
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold bg-primary/10 text-primary 
                                  px-2 py-0.5 rounded-full">
                                  {goal.progress}%
                                </span>
                                {goal.deadline && (
                                  <span className="text-xs text-slate-600 dark:text-white/60">
                                    Échéance : {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-500 ease-out bg-primary"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Statistiques */}
                <motion.div variants={itemVariants}>
                  <div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
                    border border-slate-200 dark:border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Statistiques</h3>
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10">
                        <BarChart2 className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {metrics.map((metric, index) => (
                        <div key={index} className="p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 
                          transition-all cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-600 dark:text-white/60 mb-1">
                                {metric.label}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-lg text-slate-900 dark:text-white">
                                  {metric.value}
                                </span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full 
                                  flex items-center gap-1
                                  ${metric.trendDirection === 'up'
                                    ? 'bg-primary/10 text-primary'
                                    : metric.trendDirection === 'down'
                                      ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                      : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60'
                                  }`}>
                                  {metric.trendDirection === 'up' ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                  {metric.trend}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Widget */}
              <motion.div variants={itemVariants}>
                <FitnessWidget />
              </motion.div>

              {/* Préférences */}
              <motion.div variants={itemVariants}>
                <div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
                  border border-slate-200 dark:border-white/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Préférences
                    </h2>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {preferences.map((pref, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl
                          bg-slate-100 dark:bg-white/5 hover:bg-primary/10 
                          dark:hover:bg-primary/10 transition-all cursor-pointer"
                        onClick={pref.onClick}
                      >
                        <div className="p-2 rounded-xl bg-white dark:bg-white/10">
                          <pref.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-600 dark:text-white/60">
                            {pref.title}
                          </p>
                          <p className="font-medium text-slate-900 dark:text-white truncate">
                            {pref.value}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </ThemeWrapper>
  );
}