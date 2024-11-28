import { Recipe } from "@/services/recipeService";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Clock, ChefHat, Heart, Bookmark, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  recipes: Recipe[];
}

export function BentoGrid({ recipes }: BentoGridProps) {
  const navigate = useNavigate();

  const handleRecipeClick = (id: string) => {
    console.log('Navigating to recipe:', id);
    navigate(`/recipe/${id}`);
  };

  const getValidImageUrl = (recipe: Recipe) => {
    const imageUrl = recipe.images?.[recipe.featuredImageIndex || 0];
    return imageUrl?.startsWith('blob:') ? '/placeholder.svg' : (imageUrl || '/placeholder.svg');
  };

  // Calculate recipe importance score
  const getRecipeScore = (recipe: Recipe) => {
    const likesScore = (recipe.stats?.likes?.length || 0) * 2;
    const savesScore = (recipe.stats?.saves?.length || 0) * 3;
    const viewsScore = (recipe.stats?.views || 0);
    const isFeatured = recipe.status === 'featured' ? 100 : 0;
    
    return likesScore + savesScore + viewsScore + isFeatured;
  };

  // Sort recipes by score
  const sortedRecipes = [...recipes].sort((a, b) => getRecipeScore(b) - getRecipeScore(a));

  // Determine grid placement based on score
  const getGridClass = (index: number, score: number) => {
    // First item is always large if it has a good score
    if (index === 0 && score > 50) {
      return "md:col-span-2 md:row-span-2";
    }
    // Every 5th item with good engagement gets medium size
    if (index % 5 === 0 && score > 30) {
      return "md:col-span-2";
    }
    return "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {sortedRecipes.map((recipe, index) => {
        const score = getRecipeScore(recipe);
        const gridClass = getGridClass(index, score);
        const isFeatured = recipe.status === 'featured';

        return (
          <Card
            key={recipe.id}
            className={cn(
              "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg",
              gridClass
            )}
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <div className="relative aspect-[4/3] group">
              <img
                src={getValidImageUrl(recipe)}
                alt={recipe.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Stats Overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                {isFeatured && (
                  <div className="bg-primary/90 text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">Featured</span>
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <ChefHat className="w-4 h-4" />
                  <span>{recipe.chef}</span>
                  <span className="opacity-60">•</span>
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookTime}</span>
                </div>
                
                {/* Engagement Stats */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Heart className={cn(
                      "w-4 h-4",
                      recipe.stats?.likes?.length ? "fill-red-500 text-red-500" : "text-white"
                    )} />
                    <span className="text-sm">{recipe.stats?.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark className={cn(
                      "w-4 h-4",
                      recipe.stats?.saves?.length ? "fill-white text-white" : "text-white"
                    )} />
                    <span className="text-sm">{recipe.stats?.saves?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}