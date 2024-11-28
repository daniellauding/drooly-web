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

  const isRecipeFeatured = (recipe: Recipe) => {
    return (recipe.stats?.likes?.length || 0) >= 10;
  };

  // Get layout class based on index and recipe properties
  const getLayoutClass = (index: number, recipe: Recipe) => {
    const isFeatured = isRecipeFeatured(recipe);
    
    // First item is large if featured
    if (index === 0 && isFeatured) {
      return "md:col-span-2 md:row-span-2 min-h-[600px]";
    }
    
    // Every 5th item is tall
    if (index % 5 === 0) {
      return "md:row-span-2 min-h-[500px]";
    }
    
    // Every 7th item is wide
    if (index % 7 === 0) {
      return "md:col-span-2 min-h-[300px]";
    }
    
    // Every 3rd item has a different aspect ratio
    if (index % 3 === 0) {
      return "aspect-square min-h-[400px]";
    }

    // Default size for other items
    return "min-h-[350px]";
  };

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

  const getGridItems = () => {
    const items = [];
    let interactiveIndex = 0;

    recipes.forEach((recipe, index) => {
      items.push(recipe);
      
      if ((index + 1) % 6 === 0 && interactiveIndex < interactiveCards.length) {
        items.push({
          isInteractive: true,
          ...interactiveCards[interactiveIndex]
        });
        interactiveIndex++;
      }
    });

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {gridItems.map((item, index) => {
        if ('isInteractive' in item) {
          return (
            <Card
              key={`interactive-${index}`}
              className={cn(
                "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg min-h-[300px]",
                item.color
              )}
              onClick={item.action}
            >
              <div className="p-8 h-full flex items-center">
                <div className="flex items-center gap-6">
                  <div className={cn("p-4 rounded-full bg-white/80", item.textColor)}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className={cn("text-xl font-semibold mb-2", item.textColor)}>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-lg">
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
        const layoutClass = getLayoutClass(index, recipe);

        return (
          <Card
            key={recipe.id}
            className={cn(
              "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group",
              layoutClass
            )}
            onClick={() => handleRecipeClick(recipe.id)}
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
      })}
    </div>
  );
}
