import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Timer } from 'lucide-react';
import Image from 'next/image';


export const RecipeGallery = ({ recipes }) => {
  return (
    <motion.div layout className="grid grid-cols-2 gap-4">
      <AnimatePresence>
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative group"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              <Image 
                src={recipe.image}
                alt={recipe.name}
                        className="w-full h-full object-cover"
                        width={400}
                        height={400}
                
              />
              <motion.div
                initial={false}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent
                  flex flex-col justify-end p-4"
              >
                <h4 className="text-white font-medium mb-2">{recipe.name}</h4>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    <span>{recipe.calories}kcal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    <span>{recipe.prepTime}min</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};