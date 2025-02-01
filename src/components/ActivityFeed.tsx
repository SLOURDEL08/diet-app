import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Apple, Dumbbell, Timer, Target,
  Calendar, TrendingUp, ChevronRight
} from 'lucide-react';

interface FitnessData {
  calories: {
    consumed: number;
    burned: number;
    target: number;
  };
  meals: {
    id: string;
    name: string;
    calories: number;
    time: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }[];
  activities: {
    id: string;
    name: string;
    duration: string;
    caloriesBurned: number;
    intensity: 'low' | 'medium' | 'high';
  }[];
}

const SAMPLE_DATA: FitnessData = {
  calories: {
    consumed: 1450,
    burned: 320,
    target: 2000
  },
  meals: [
    { id: '1', name: 'Petit-déjeuner protéiné', calories: 380, time: '08:30', type: 'breakfast' },
    { id: '2', name: 'Salade composée', calories: 420, time: '12:30', type: 'lunch' },
    { id: '3', name: 'Collation fruits secs', calories: 150, time: '16:00', type: 'snack' }
  ],
  activities: [
    { id: '1', name: 'Course à pied', duration: '30 min', caloriesBurned: 180, intensity: 'high' },
    { id: '2', name: 'Yoga', duration: '45 min', caloriesBurned: 140, intensity: 'medium' }
  ]
};

const CircularProgress = ({ value, max }) => {
  const percentage = (value / max) * 100;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative h-32 w-32"
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Fond */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          className="text-slate-100 dark:text-white/10"
          strokeWidth="10"
        />
        {/* Progression */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100) 
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          transform="rotate(-90 50 50)"
        />
        {/* Texte central */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy="0.3em"
          className="text-2xl font-bold fill-slate-900 dark:fill-white"
        >
          {Math.round(percentage)}%
        </text>
      </svg>
    </motion.div>
  );
};

const ActivityTag = ({ intensity }: { intensity: string }) => {
  const colors = {
    low: 'bg-primary/10 text-primary',
    medium: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    high: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[intensity]}`}>
      {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
    </span>
  );
};

export const FitnessWidget = () => {
  const [data] = useState(SAMPLE_DATA);
  const [activeView, setActiveView] = useState<'nutrition' | 'activity'>('nutrition');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
                 border border-slate-200 dark:border-white/10 overflow-hidden"
    >
      {/* En-tête */}
      <div className="p-6 border-b border-slate-200 dark:border-white/10">


        <div className="flex w-full items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('nutrition')}
            className={`flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeView === 'nutrition'
                ? 'bg-primary dark:bg-white/10 text-black dark:bg-primary'
                : 'text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
          >
            <Apple className="h-4 w-4" />
            Nutrition
          </button>
          <button
            onClick={() => setActiveView('activity')}
            className={`flex w-full justify-center items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeView === 'activity'
                ? 'bg-primary dark:bg-white/10 text-black dark:bg-primary'
                : 'text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
          >
            <Dumbbell className="h-4 w-4" />
            Activités
          </button>
        </div>
      </div>

      {/* Corps du widget */}
      <div className="p-6">
        <div className="flex items-center justify-around mb-6">
          <div className="text-center">
            <CircularProgress value={data.calories.consumed} max={data.calories.target} />
            <p className="text-sm text-slate-600 dark:text-white/60 mt-2">
              {data.calories.consumed} / {data.calories.target} cal
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'nutrition' ? (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {data.meals.map((meal) => (
                <motion.div
                  key={meal.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-100 
                            dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-primary/10 
                            transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-white/10">
                      <Apple className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{meal.name}</p>
                      <p className="text-sm text-slate-500 dark:text-white/60">{meal.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {meal.calories} cal
                    </span>
                    <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {data.activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-100 
                            dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-primary/10 
                            transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-white/10">
                      <Dumbbell className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {activity.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Timer className="h-3 w-3 text-slate-400" />
                        <span className="text-sm text-slate-500 dark:text-white/60">
                          {activity.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <ActivityTag intensity={activity.intensity} />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.caloriesBurned} cal
                      </span>
                      <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FitnessWidget;