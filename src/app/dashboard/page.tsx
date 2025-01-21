'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingStore } from '@/store/onboardingStore';
import { ThemeWrapper } from '@/hooks/useTheme';
import { useThemeConfig } from '@/hooks/useTheme';
import { 
  User, 
  Briefcase, 
  Star, 
  Moon, 
  Bell,
  Globe,
  Mail,
  Settings,
  TrendingDown,
  ChevronRight,
  TrendingUp,
  Calendar,
  Activity,
  Target,
  Award,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  InfoIcon
} from 'lucide-react';

// Types
type StatCard = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
  gradientColor?: string;
};

type Activity = {
  id: string;
  action: string;
  timestamp: Date;
  type: 'success' | 'warning' | 'error' | 'info';
};

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

type Preference = {
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  href?: string;
  onClick?: () => void;
};

// Mock data
const mockActivities: Activity[] = [
  {
    id: '1',
    action: 'Objectif atteint',
    timestamp: new Date(Date.now() - 3600000), // 1 heure avant
    type: 'success'
  },
  {
    id: '2',
    action: 'Nouvelle tâche ajoutée',
    timestamp: new Date(Date.now() - 7200000), // 2 heures avant
    type: 'info'
  },
  {
    id: '3',
    action: 'Attention requise',
    timestamp: new Date(Date.now() - 10800000), // 3 heures avant
    type: 'warning'
  },
  {
    id: '4',
    action: 'Erreur système',
    timestamp: new Date(Date.now() - 14400000), // 4 heures avant
    type: 'error'
  }
];

const mockGoals: Goal[] = [
  {
    id: '1',
    label: 'Progression mensuelle',
    progress: 75,
    target: 100,
    deadline: new Date(Date.now() + 604800000) // 7 jours après
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

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};



const StatCard = ({ title, value, description, icon: Icon }: StatCard) => (
  <motion.div
    variants={itemVariants}
    className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 
               bg-white dark:bg-white/10 backdrop-blur-md transition-all duration-200"
    whileHover={{ scale: 1.02 }}
  >
    <div className="relative p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm font-medium text-slate-600 dark:text-white/60">
          {title}
        </span>
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {value}
      </p>
      <p className="text-slate-600 dark:text-white/60 text-sm">
        {description}
      </p>
    </div>
  </motion.div>
);

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-primary" />,
    warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    error: <XCircle className="h-4 w-4 text-red-500" />,
    info: <InfoIcon className="h-4 w-4 text-blue-500" />
  };
  return icons[type];
};

export default function Dashboard() {
  const { user } = useAuth();
  const onboardingData = useOnboardingStore((state) => state.data);
  const [stats, setStats] = useState<StatCard[]>([]);
  const { isDarkMode } = useThemeConfig();
  const [activities] = useState<Activity[]>(mockActivities);
  const [goals] = useState<Goal[]>(mockGoals);
  const [metrics] = useState<Metric[]>(mockMetrics);

  useEffect(() => {
    setStats([
      {
        title: 'Bienvenue',
        value: user?.name || 'Utilisateur',
        description: 'Ravi de vous revoir !',
        icon: User,
        gradientColor: 'from-primary/20 to-primary/10'
      },
      {
        title: 'Profession',
        value: onboardingData.profession || 'Non spécifié',
        description: 'Votre domaine d\'expertise',
        icon: Briefcase,
        gradientColor: 'from-primary/20 to-primary/10'
      },
      {
        title: 'Centres d\'intérêt',
        value: `${onboardingData.interests?.length || 0} domaines`,
        description: 'Domaines sélectionnés',
        icon: Star,
        gradientColor: 'from-primary/20 to-primary/10'
      },
    ]);
  }, [user, onboardingData]);

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
      <div className="min-h-screen bg-slate-50 dark:bg-[#170312] transition-colors duration-300 p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                  Tableau de bord
                </h1>
                <p className="text-slate-600 dark:text-white/60">
                  Gérez vos préférences et suivez votre progression
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-3 rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all hover:-translate-y-0.5">
                  <Bell className="h-5 w-5 text-primary" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="relative group">
                  <div className="p-2 rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats */}
            <motion.div variants={itemVariants} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </motion.div>

            {/* Activités récentes */}
            <motion.div variants={itemVariants} className="row-span-2">
              <div className="h-full rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Activité récente
                  </h3>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id}
                      className="flex items-start gap-4 p-3 rounded-xl 
                        hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="mt-1">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-white/60">
                          {new Date(activity.timestamp).toLocaleString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full px-6 py-4 rounded-2xl bg-primary text-white 
                  font-medium hover:opacity-90 transition-all duration-200">
                  Voir toutes les activités
                </button>
              </div>
            </motion.div>

            {/* Préférences */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
                border border-slate-200 dark:border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Vos préférences
                  </h2>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {preferences.map((pref, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-4 p-4 rounded-xl
                        bg-slate-100 dark:bg-white/5
                        hover:bg-primary/10 dark:hover:bg-primary/10
                        transition-all duration-300 cursor-pointer"
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
                      <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Objectifs */}
<motion.div variants={itemVariants}>
  <div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
    border border-slate-200 dark:border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Objectifs
      </h3>
      <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10">
        <Target className="h-5 w-5 text-primary" />
      </div>
    </div>
    <div className="space-y-6">
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
              style={{
                width: `${goal.progress}%`,
                transform: `translateX(${goal.progress < 5 ? '-98%' : '0'})`,
              }}
            />
          </div>
        </div>
      ))}
      <button className="w-full px-6 py-4 rounded-2xl border-2 border-primary 
        text-primary hover:bg-primary/10 font-medium transition-all duration-200">
        Ajouter un objectif
      </button>
    </div>
  </div>
</motion.div>

{/* Statistiques */}
<motion.div variants={itemVariants}>
  <div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
    border border-slate-200 dark:border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Statistiques
      </h3>
      <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10">
        <BarChart2 className="h-5 w-5 text-primary" />
      </div>
    </div>
    <div className="space-y-6">
      {metrics.map((metric, index) => (
        <div key={index} className="group p-4 rounded-xl 
          hover:bg-slate-100 dark:hover:bg-white/5 
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
            <div className={`w-16 h-8 rounded-lg 
              ${metric.trendDirection === 'up'
                ? 'bg-primary/10'
                : 'bg-red-100 dark:bg-red-500/20'
              }`}
            />
          </div>
        </div>
      ))}
      <button className="w-full px-6 py-4 rounded-2xl bg-primary 
        text-white font-medium hover:opacity-90 transition-all duration-200">
        Voir les statistiques détaillées
      </button>
    </div>
  </div>
</motion.div>
          </div>
        </motion.div>
      </div>
    </ThemeWrapper>
  );
}