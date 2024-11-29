import { Heart, X, Clock, Edit, Bookmark } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Recipe } from "@/services/recipeService";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";
import { updateAchievementProgress } from "@/services/achievementService";
import { AchievementToast } from "./achievements/AchievementToast";
import { achievements } from "@/services/achievementService";

interface RecipeSwiperProps {
  recipes: Recipe[];
  onAuthRequired?: () => void;
}

export function RecipeSwiper({ recipes, onAuthRequired }: RecipeSwiperProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [dismissedRecipes, setDismissedRecipes] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const visibleRecipes = recipes.filter(recipe => 
    !dismissedRecipes.includes(recipe.id) && 
    !recipe.stats?.likes?.includes(user?.uid || '')
  );
  
  const handleLike = async (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        toast({
          title: "Sign in required",
          description: "Please sign in to like recipes",
          variant: "destructive"
        });
      }
      return;
    }

    try {
      const recipeRef = doc(db, "recipes", recipe.id);
      await updateDoc(recipeRef, {
        "stats.likes": arrayUnion(user.uid)
      });
      
      // Check for first like achievement
      const achieved = await updateAchievementProgress(user.uid, 'firstLike', 1);
      if (achieved) {
        toast({
          title: "Achievement Unlocked!",
          description: <AchievementToast achievement={achievements.firstLike} />,
        });
      }
      
      toast({
        title: "Recipe liked",
        description: "Added to your liked recipes"
      });
      
      setDismissedRecipes(prev => [...prev, recipe.id]);
      handleNext();
    } catch (error) {
      console.error("Error updating like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  const handleSave = async (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        toast({
          title: "Sign in required",
          description: "Please sign in to save recipes",
          variant: "destructive"
        });
      }
      return;
    }

    try {
      const recipeRef = doc(db, "recipes", recipe.id);
      const isSaved = recipe.stats?.saves?.includes(user.uid);
      
      await updateDoc(recipeRef, {
        "stats.saves": isSaved ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
      
      toast({
        title: isSaved ? "Recipe removed" : "Recipe saved",
        description: isSaved ? "Removed from saved recipes" : "Added to saved recipes"
      });
      
      handleNext();
    } catch (error) {
      console.error("Error updating save status:", error);
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive"
      });
    }
  };

  const handleDislike = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    console.log('Dismissed recipe:', recipe.id);
    setDismissedRecipes(prev => [...prev, recipe.id]);
    handleNext();
    
    toast({
      title: "Recipe dismissed",
      description: "You won't see this recipe again"
    });
  };

  const handleNext = () => {
    if (currentIndex < recipes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/recipe/edit/${id}`);
  };

  const handleRecipeClick = (id: string) => {
    console.log('Navigating to recipe:', id);
    navigate(`/recipe/${id}`);
  };

  const getValidImageUrl = (recipe: Recipe) => {
    const imageUrl = recipe.images?.[recipe.featuredImageIndex || 0];
    if (!imageUrl) return '/placeholder.svg';
    return imageUrl.startsWith('blob:') ? '/placeholder.svg' : imageUrl;
  };

  if (visibleRecipes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No more recipes to show</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full max-w-md mx-auto">
      <CarouselContent>
        {visibleRecipes.map((recipe) => (
          <CarouselItem key={recipe.id}>
            <Card 
              className="relative h-[400px] overflow-hidden cursor-pointer"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <img
                src={getValidImageUrl(recipe)}
                alt={recipe.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm opacity-80">by {recipe.chef}</p>
                  <span className="text-sm opacity-60">•</span>
                  <p className="text-sm opacity-80">{recipe.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 opacity-80" />
                  <span className="text-sm opacity-80">{recipe.cookTime}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => handleDislike(e, recipe)}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={(e) => handleLike(e, recipe)}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${recipe.stats?.likes?.includes(user?.uid || '') ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
                <button
                  onClick={(e) => handleSave(e, recipe)}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <Bookmark className={`w-5 h-5 ${recipe.stats?.saves?.includes(user?.uid || '') ? 'fill-white text-white' : 'text-white'}`} />
                </button>
                {user && recipe.creatorId === user.uid && (
                  <button
                    onClick={(e) => handleEdit(e, recipe.id)}
                    className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                  >
                    <Edit className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
