import { motion } from 'framer-motion';

// Définition du type pour les props
interface NutritionWidgetProps {
  value: number;
  max: number;
  color?: 'primary' | 'secondary' | 'accent'; // Ajoutez d'autres options de couleur si nécessaire
}

const circleVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" }
  }
};

export const NutritionWidget: React.FC<NutritionWidgetProps> = ({ 
  value, 
  max, 
  color = 'primary' 
}) => {
  const percentage = (value / max) * 100;
  
  return (
    <motion.div
      className="relative"
      initial="hidden"
      animate="visible"
    >
      <svg width="120" height="120" viewBox="0 0 120 120">
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={`rgb(var(--${color}))`}
          strokeWidth="12"
          strokeLinecap="round"
          variants={circleVariants}
          style={{
            pathLength: percentage / 100,
            rotate: -90,
            transformOrigin: "50% 50%"
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-primary"
        >
          {Math.round(percentage)}%
        </motion.span>
      </div>
    </motion.div>
  );
};