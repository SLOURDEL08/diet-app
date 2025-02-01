import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NutrientGrid } from '@/components/recipe/NutrientGrid';
import { 
  Beef,
  Fish,
  Heart,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Clock,
  Users,
  ChefHat,
  Leaf,
} from 'lucide-react';
import Image from 'next/image';



type DifficultyLevel = 'Facile' | 'Moyen' | 'Difficile';
type RecipeType = 'fish' | 'meat' | 'vegetarian';

interface Recipe {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: number;
  servings: number;
  type: RecipeType;
  difficulty: DifficultyLevel;
  image: string;
  nutritionScore: number;
  allergenes?: string[];
  healthBenefits: string[];
  preparationTime: number;
  cookingTime: number;
  ingredients: number;
}


const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Saumon grillé aux herbes',
    description: 'Saumon frais grillé avec un mélange d\'herbes fraîches et citron, accompagné de légumes de saison et d\'une sauce légère aux agrumes',
    calories: 420,
    protein: 46,
    carbs: 2,
    fats: 28,
    time: 20,
    servings: 2,
    type: 'fish',
    difficulty: 'Facile',
    image: '/recipe2.jpg',
    nutritionScore: 92,
    healthBenefits: ['Riche en Oméga-3', 'Protéines maigres', 'Vitamines B12'],
    preparationTime: 10,
    cookingTime: 15,
    ingredients: 8
  },
  {
    id: 2,
    name: 'Bowl protéiné au poulet',
    description: 'Bowl équilibré avec du poulet grillé mariné aux épices, accompagné de quinoa, légumes croquants et sauce tahini maison',
    calories: 580,
    protein: 42,
    carbs: 45,
    fats: 22,
    time: 25,
    servings: 1,
    type: 'meat',
    difficulty: 'Moyen',
    image: '/recipe1.jpg',
    nutritionScore: 88,
    healthBenefits: ['Riche en protéines', 'Fibres', 'Antioxydants'],
    preparationTime: 15,
    cookingTime: 20,
    ingredients: 12
  },
 
];

const FavoriteRecipesCard = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = mockRecipes.length - 1;
            if (nextIndex >= mockRecipes.length) nextIndex = 0;
            return nextIndex;
        });
    };

    const recipe = mockRecipes[currentIndex];

    const TypeIcon = () => {
        switch (recipe.type) {
            case 'fish':
                return <Fish className="h-5 w-5 text-blue-500" />;
            case 'meat':
                return <Beef className="h-5 w-5 text-red-500" />;
            case 'vegetarian':
                return <Leaf className="h-5 w-5 text-green-500" />;
            default:
                return null;
        }
    };

    const DifficultyColor = {
        Facile: 'text-green-500',
        Moyen: 'text-orange-500',
        Difficile: 'text-red-500'
    };
    


  return (
    <div className="col-span-2 relative h-full">
      <div className="h-full rounded-2xl border border-slate-200 dark:border-white/10 
                    bg-white dark:bg-white/10 backdrop-blur-md overflow-hidden">
        <div className="relative h-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full h-full"
            >
              <div className="h-full p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5">
                      <TypeIcon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-medium ${DifficultyColor[recipe.difficulty]}`}>
                          <ChefHat className="h-3 w-3 inline mr-1" />
                          {recipe.difficulty}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-white/60">
                          <Users className="h-3 w-3 inline mr-1" />
                          {recipe.servings} pers.
                        </span>
                        <span className="text-xs text-slate-600 dark:text-white/60">
                          <Utensils className="h-3 w-3 inline mr-1" />
                          {recipe.ingredients} ingrédients
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      Score santé: {recipe.nutritionScore}/100
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-white/60">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Prep: {recipe.preparationTime}min
                      </span>
                      <span className="flex items-center">
                        Cuisson: {recipe.cookingTime}min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="relative flex-1 mb-6 overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                  <Image
                    src={recipe.image}
                    alt={recipe.name}
                                      className="w-full h-full object-cover"
                                      width={500}
                                      height={500}
                  />
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 
                               hover:bg-white dark:hover:bg-slate-900 transition-colors"
                    >
                      <Heart 
                        className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'} 
                                 transition-colors`}
                      />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 
                                bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-sm text-white">
                      {recipe.description}
                    </p>
                  </div>
                </div>

                {/* Macros */}
                 <NutrientGrid
  calories={recipe.calories}
  protein={recipe.protein}
  carbs={recipe.carbs}
  fats={recipe.fats}
/>

            
              </div>
            </motion.div>
          </AnimatePresence>
{/* Navigation Buttons */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl 
                     bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 
                     transition-colors z-10 hover:-translate-x-1 group"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-white 
                                 group-hover:text-primary transition-colors" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl 
                     bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 
                     transition-colors z-10 hover:translate-x-1 group"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="h-5 w-5 text-slate-600 dark:text-white 
                                  group-hover:text-primary transition-colors" />
          </button>

     
        </div>
      </div>
    </div>
  );
};

export default FavoriteRecipesCard;