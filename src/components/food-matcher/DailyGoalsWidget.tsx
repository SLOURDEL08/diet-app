import { motion } from 'framer-motion';

export const DailyGoalsWidget = () => {
  const goals = [
    { label: 'Protéines', current: 45, target: 60, unit: 'g' },
    { label: 'Calories', current: 1200, target: 2000, unit: 'kcal' },
    { label: 'Eau', current: 1.5, target: 2.5, unit: 'L' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
        border border-slate-200 dark:border-white/10 p-6"
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Objectifs journaliers
      </h3>
      <div className="space-y-4">
        {goals.map(goal => (
          <motion.div 
            key={goal.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-white/60">{goal.label}</span>
              <span className="text-primary font-medium">
                {goal.current}/{goal.target} {goal.unit}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};