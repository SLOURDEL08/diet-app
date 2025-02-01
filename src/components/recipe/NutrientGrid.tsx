import React, { useEffect, useState } from 'react';
import { Flame, Dumbbell, Apple, Soup, LucideIcon } from 'lucide-react';
import { NutrientCard } from './NutrientCard';

interface NutrientGridProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface NutrientData {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  iconColor: string;
  maxValue: number;
  barColor: {
    bg: string;
    fill: string;
    darkBg: string;
  };
}

export const NutrientGrid: React.FC<NutrientGridProps> = ({ calories, protein, carbs, fats }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nutrients: NutrientData[] = [
    {
      label: 'Calories',
      value: calories,
      unit: 'kcal',
      icon: Flame,
      iconColor: 'text-orange-500',
      maxValue: 800,
      barColor: {
        bg: 'bg-orange-100',
        fill: 'bg-gradient-to-r from-orange-400 to-orange-500',
        darkBg: 'bg-orange-900/20'
      }
    },
    {
      label: 'Protéines',
      value: protein,
      unit: 'g',
      icon: Dumbbell,
      iconColor: 'text-blue-500',
      maxValue: 50,
      barColor: {
        bg: 'bg-blue-100',
        fill: 'bg-gradient-to-r from-blue-400 to-blue-500',
        darkBg: 'bg-blue-900/20'
      }
    },
    {
      label: 'Glucides',
      value: carbs,
      unit: 'g',
      icon: Apple,
      iconColor: 'text-yellow-500',
      maxValue: 100,
      barColor: {
        bg: 'bg-yellow-100',
        fill: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
        darkBg: 'bg-yellow-900/20'
      }
    },
    {
      label: 'Lipides',
      value: fats,
      unit: 'g',
      icon: Soup,
      iconColor: 'text-green-500',
      maxValue: 50,
      barColor: {
        bg: 'bg-green-100',
        fill: 'bg-gradient-to-r from-green-400 to-green-500',
        darkBg: 'bg-green-900/20'
      }
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {nutrients.map((nutrient, index) => (
        <NutrientCard 
          key={index} 
          {...nutrient} 
          isActive={activeIndex === index}
        />
      ))}
    </div>
  );
};