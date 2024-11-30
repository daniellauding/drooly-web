import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecipeCardStackProps {
  recipes: Recipe[];
  onRegenerate: () => Promise<void>;
  onSave: (recipe: Recipe) => void;
  onDismiss: (recipe: Recipe) => void;
}

export function RecipeCardStack({ recipes, onRegenerate, onSave, onDismiss }: RecipeCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { toast } = useToast();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const currentRecipe = recipes[currentIndex];

  const handleSwipe = async (isLike: boolean) => {
    if (!currentRecipe) return;
    
    setDirection(isLike ? 'right' : 'left');
    
    if (isLike) {
      onSave(currentRecipe);
    } else {
      onDismiss(currentRecipe);
    }
    
    setTimeout(() => {
      setDirection(null);
      if (currentIndex === recipes.length - 1) {
        toast({
          title: "No more recipes",
          description: "Generate more recipes or close to finish",
        });
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 200);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate();
      setCurrentIndex(0);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!currentRecipe) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-center text-muted-foreground">No more recipes to show</p>
        <Button 
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          Generate More Recipes
        </Button>
      </div>
    );
  }

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
          <Card className="relative h-full w-full overflow-hidden">
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
          </Card>
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