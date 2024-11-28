import { Recipe } from "@/services/recipeService";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Clock, ChefHat, Heart, Bookmark, Trophy, Search, Plus, Utensils, Apple } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface BentoGridProps {
  recipes: Recipe[];
  onAuthModalOpen?: () => void;
}

export function BentoGrid({ recipes, onAuthModalOpen }: BentoGridProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRecipeClick = (id: string) => {
    console.log('Navigating to recipe:', id);
    navigate(`/recipe/${id}`);
  };

  const getValidImageUrl = (recipe: Recipe) => {
    const imageUrl = recipe.images?.[recipe.featuredImageIndex || 0];
    return imageUrl?.startsWith('blob:') ? '/placeholder.svg' : (imageUrl || '/placeholder.svg');
  };

  // Simplified logic: recipe is featured if it has 10+ likes
  const isRecipeFeatured = (recipe: Recipe) => {
    return (recipe.stats?.likes?.length || 0) >= 10;
  };

  // Interactive cards to be inserted between recipes
  const interactiveCards = [
    {
      title: "What's in your fridge?",
      description: "Find recipes using ingredients you have",
      icon: Apple,
      action: () => navigate('/create-recipe?mode=ingredients'),
      color: "bg-orange-50 hover:bg-orange-100",
      textColor: "text-orange-700"
    },
    {
      title: "Explore Cuisines",
      description: "Discover recipes from around the world",
      icon: Utensils,
      action: () => navigate('/create-recipe?mode=cuisine'),
      color: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      title: "Quick Search",
      description: "Find exactly what you're looking for",
      icon: Search,
      action: () => navigate('/create-recipe?mode=search'),
      color: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700"
    }
  ];

  // Insert interactive cards every 6 recipes
  const getGridItems = () => {
    const items = [];
    let interactiveIndex = 0;

    recipes.forEach((recipe, index) => {
      items.push(recipe);
      
      // Add interactive card after every 6 recipes
      if ((index + 1) % 6 === 0 && interactiveIndex < interactiveCards.length) {
        items.push({
          isInteractive: true,
          ...interactiveCards[interactiveIndex]
        });
        interactiveIndex++;
      }
    });

    // Add "Create Recipe" or "Login" card if user isn't logged in
    if (!user) {
      items.splice(2, 0, {
        isInteractive: true,
        title: "Create Your Own",
        description: "Login or register to start sharing recipes",
        icon: Plus,
        action: onAuthModalOpen,
        color: "bg-green-50 hover:bg-green-100",
        textColor: "text-green-700"
      });
    }

    return items;
  };

  const gridItems = getGridItems();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {gridItems.map((item, index) => {
        if ('isInteractive' in item) {
          return (
            <Card
              key={`interactive-${index}`}
              className={cn(
                "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg",
                item.color
              )}
              onClick={item.action}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-full bg-white/80", item.textColor)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={cn("text-lg font-semibold mb-1", item.textColor)}>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        }

        const recipe = item as Recipe;
        const isFeatured = isRecipeFeatured(recipe);
        // Apply larger size only if recipe has 10+ likes and is first in grid
        const gridClass = index === 0 && isFeatured ? "md:col-span-2 md:row-span-2" : "";

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
              
              <div className="absolute top-4 right-4 flex gap-2">
                {isFeatured && (
                  <div className="bg-primary/90 text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">Popular</span>
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