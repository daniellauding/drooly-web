import { Recipe } from "@/services/recipeService";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, ChefHat, Heart, Bookmark, Trophy } from "lucide-react";

interface BentoGridItemProps {
  recipe: Recipe;
  index: number;
  onRecipeClick: () => void;
}

export function BentoGridItem({ recipe, index, onRecipeClick }: BentoGridItemProps) {
  const isRecipeFeatured = (recipe: Recipe) => {
    return (recipe.stats?.likes?.length || 0) >= 10;
  };

  const getLayoutClass = (index: number, recipe: Recipe) => {
    const isFeatured = isRecipeFeatured(recipe);
    
    if (index === 0 && isFeatured) {
      return "md:col-span-2 md:row-span-2 min-h-[600px]";
    }
    
    if (index % 5 === 0) {
      return "md:row-span-2 min-h-[500px]";
    }
    
    if (index % 7 === 0) {
      return "md:col-span-2 min-h-[300px]";
    }
    
    if (index % 3 === 0) {
      return "aspect-square min-h-[400px]";
    }

    return "min-h-[350px]";
  };

  const getValidImageUrl = (recipe: Recipe) => {
    const imageUrl = recipe.images?.[recipe.featuredImageIndex || 0];
    return imageUrl?.startsWith('blob:') ? '/placeholder.svg' : (imageUrl || '/placeholder.svg');
  };

  const isFeatured = isRecipeFeatured(recipe);
  const layoutClass = getLayoutClass(index, recipe);

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group",
        layoutClass
      )}
      onClick={onRecipeClick}
    >
      <div className="relative h-full group">
        <img
          src={getValidImageUrl(recipe)}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute top-6 right-6 flex gap-2">
          {isFeatured && (
            <div className="bg-primary/90 text-white px-4 py-2 rounded-full flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="text-base">Popular</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-semibold mb-3">{recipe.title}</h3>
          <div className="flex items-center gap-3 text-base opacity-90 mb-3">
            <ChefHat className="w-5 h-5" />
            <span>{recipe.chef}</span>
            <span className="opacity-60">•</span>
            <Clock className="w-5 h-5" />
            <span>{recipe.cookTime}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className={cn(
                "w-5 h-5",
                recipe.stats?.likes?.length ? "fill-red-500 text-red-500" : "text-white"
              )} />
              <span className="text-base">{recipe.stats?.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bookmark className={cn(
                "w-5 h-5",
                recipe.stats?.saves?.length ? "fill-white text-white" : "text-white"
              )} />
              <span className="text-base">{recipe.stats?.saves?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}