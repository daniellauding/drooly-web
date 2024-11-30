import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface RecipeCardStackProps {
  recipes: Recipe[];
  onEmpty: () => void;
}

export function RecipeCardStack({ recipes, onEmpty }: RecipeCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const currentRecipe = recipes[currentIndex];

  const handleSwipe = async (isLike: boolean) => {
    if (isLike && user) {
      try {
        const recipeRef = doc(db, "recipes", currentRecipe.id);
        await updateDoc(recipeRef, {
          "stats.likes": arrayUnion(user.uid)
        });
        
        toast({
          title: "Recipe liked",
          description: "Added to your liked recipes"
        });
      } catch (error) {
        console.error("Error updating like:", error);
        toast({
          title: "Error",
          description: "Failed to save the recipe",
          variant: "destructive"
        });
      }
    }

    setDirection(isLike ? 'right' : 'left');
    
    setTimeout(() => {
      setDirection(null);
      if (currentIndex === recipes.length - 1) {
        toast({
          title: "No more recipes",
          description: "Generate more recipes or close to finish",
        });
        onEmpty();
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 200);
  };

  if (!currentRecipe) return null;

  return (
    <div className="relative h-[400px] w-full">
      <AnimatePresence>
        <motion.div
          key={currentRecipe.id}
          className="absolute inset-0"
          initial={{ scale: 1, x: 0 }}
          animate={{
            scale: 1,
            x: direction === 'left' ? -200 : direction === 'right' ? 200 : 0,
            opacity: direction ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg">
            <img
              src={currentRecipe.images?.[0] || '/placeholder.svg'}
              alt={currentRecipe.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">{currentRecipe.title}</h3>
              <p className="text-sm opacity-90 mb-4">{currentRecipe.description}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm opacity-80">{currentRecipe.totalTime}</p>
                <span className="text-sm opacity-60">•</span>
                <p className="text-sm opacity-80">{currentRecipe.difficulty}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
        <Button
          size="lg"
          variant="destructive"
          className="rounded-full h-12 w-12"
          onClick={() => handleSwipe(false)}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="lg"
          variant="default"
          className="rounded-full h-12 w-12 bg-green-500 hover:bg-green-600"
          onClick={() => handleSwipe(true)}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}