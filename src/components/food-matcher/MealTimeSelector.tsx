import { motion } from 'framer-motion';
import { Coffee, Utensils, Cookie, Sandwich } from 'lucide-react';

const mealTimes = [
  { id: 'breakfast', label: 'Petit-déjeuner', icon: Coffee, time: '6h-11h' },
  { id: 'lunch', label: 'Déjeuner', icon: Utensils, time: '11h-15h' },
  { id: 'snack', label: 'Goûter', icon: Cookie, time: '15h-18h' },
  { id: 'dinner', label: 'Dîner', icon: Sandwich, time: '18h-23h' }
];

export const MealTimeSelector = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {mealTimes.map((meal) => (
        <motion.button
          key={meal.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
            border border-slate-200 dark:border-white/10 transition-colors
            hover:bg-primary/10 hover:border-primary hover:text-primary"
        >
          <meal.icon className="h-6 w-6 mx-auto mb-2" />
          <div className="text-sm font-medium">{meal.label}</div>
          <div className="text-xs text-slate-600 dark:text-white/60">{meal.time}</div>
        </motion.button>
      ))}
    </motion.div>
  );
};