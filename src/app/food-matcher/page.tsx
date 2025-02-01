'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ThumbsUp, ThumbsDown, Heart, Flame, Timer, Leaf, Beef, Fish, Wheat,
  Milk, LucideIcon
} from 'lucide-react';
import { MealTimeSelector } from '@/components/food-matcher/MealTimeSelector';
import { RecipeGallery } from '@/components/food-matcher/RecipeGallery';
import { DailyGoalsWidget } from '@/components/food-matcher/DailyGoalsWidget';
import Image from 'next/image';

// Types
interface FoodPreference {
  id: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}

interface Recipe {
  id: string;
  name: string;
  image: string;
  calories: number;
  prepTime: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  protein?: number;
  carbs?: number;
  fat?: number;
  tags: string[];
  restrictions?: string[];
  ingredients?: string[];
  steps?: string[];
  servings?: number;
  rating?: number;
  reviews?: number;
  action?: 'like' | 'dislike' | 'save';
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

const cardVariants = {
  initial: { scale: 0.8, opacity: 0 },
  enter: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};


// Composant principal
export default function FoodMatcher() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>({
    id: 'current',
    name: 'Salade de Quinoa aux Légumes',
    image: '/altdigi.png',
    calories: 450,
    prepTime: 25,
    protein: 15,
    carbs: 45,
    fat: 12,
    tags: ['végétarien', 'healthy', 'facile']
  });

  const [quickPreferences, setQuickPreferences] = useState<FoodPreference[]>([
    { id: 'vegetarian', label: 'Végétarien', icon: Leaf, active: false },
    { id: 'meat', label: 'Viandes', icon: Beef, active: true },
    { id: 'fish', label: 'Poissons', icon: Fish, active: true },
    { id: 'gluten-free', label: 'Sans Gluten', icon: Wheat, active: false },
    { id: 'lactose-free', label: 'Sans Lactose', icon: Milk, active: false },
  ]);

  const [savedRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Saumon aux légumes',
      image: '/altdigi.png',
      calories: 450,
      prepTime: 25,
      protein: 28,
      carbs: 35,
      fat: 18,
      tags: ['poisson', 'healthy']
    },
    {
      id: '2',
      name: 'Buddha Bowl',
      image: '/altdigi.png',
      calories: 380,
      prepTime: 20,
      protein: 12,
      carbs: 55,
      fat: 15,
      tags: ['végétarien', 'bowl']
    }
  ]);

  const toggleQuickPreference = (id: string) => {
    setQuickPreferences(prefs =>
      prefs.map(pref =>
        pref.id === id ? { ...pref, active: !pref.active } : pref
      )
    );
  };

  const handleRecipeAction = async (action: 'like' | 'dislike' | 'save') => {
    // Animation de sortie
    setCurrentRecipe(prev => ({ ...prev, action }));
    
    // Attendre la fin de l'animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Charger la prochaine recette
    setCurrentRecipe({
      id: Math.random().toString(),
      name: 'Nouvelle recette',
      image: '/altdigi.png',
      calories: Math.floor(Math.random() * 500 + 300),
      prepTime: Math.floor(Math.random() * 30 + 15),
      tags: ['nouvelle', 'recette'],
      protein: Math.floor(Math.random() * 30 + 10),
      carbs: Math.floor(Math.random() * 50 + 20),
      fat: Math.floor(Math.random() * 20 + 5)
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#170312] transition-colors duration-300 p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Food Matcher
          </h1>
          <p className="text-slate-600 dark:text-white/60">
            Trouvez votre prochain repas selon vos préférences
          </p>
        </motion.div>

        {/* Time Selector */}
        <MealTimeSelector />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Preferences */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="flex flex-wrap gap-4">
              {quickPreferences.map(pref => (
                <motion.button
                  key={pref.id}
                  onClick={() => toggleQuickPreference(pref.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-200
                    ${pref.active 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white'}
                    border backdrop-blur-md`}
                >
                  <pref.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{pref.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Left Column - Nutrition */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Nutrition Goals */}
            <motion.div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
              border border-slate-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Objectifs Nutritionnels
              </h2>
            </motion.div>

            {/* Daily Goals */}
            <DailyGoalsWidget />
          </motion.div>

          {/* Central Matcher */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
              border border-slate-200 dark:border-white/10 p-6 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRecipe.id}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  variants={cardVariants}
                  className="aspect-square relative rounded-xl overflow-hidden"
                >
                  <Image 
                    src={currentRecipe.image}
                    alt={currentRecipe.name}
                                      className="w-full h-full object-cover"
                                      width={800}
                                      height={800}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent"
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {currentRecipe.name}
                    </h3>
                    <div className="flex items-center justify-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4" />
                        <span>{currentRecipe.calories} kcal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        <span>{currentRecipe.prepTime} min</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                      {currentRecipe.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full text-xs 
                          bg-white/20 text-white">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRecipeAction('dislike')}
                  className="p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <ThumbsDown className="h-6 w-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRecipeAction('save')}
                  className="p-4 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Heart className="h-6 w-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRecipeAction('like')}
                  className="p-4 rounded-2xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                >
                  <ThumbsUp className="h-6 w-6" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Saved Recipes & Stats */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Saved Recipes */}
            <div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
              border border-slate-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Recettes Sauvegardées
              </h2>
              <RecipeGallery recipes={savedRecipes} />
            </div>

            {/* Meal Stats */}
            <div className="rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
              border border-slate-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Statistiques
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-white/60">Cette semaine</span>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      1850 kcal/jour
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-white/60">Temps moyen</span>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      28 min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}