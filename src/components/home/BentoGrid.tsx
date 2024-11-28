import { Recipe } from "@/services/recipeService";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Clock, ChefHat } from "lucide-react";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {recipes.map((recipe, index) => (
        <Card
          key={recipe.id}
          className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
            index === 0 ? 'md:col-span-2 md:row-span-2' : ''
          }`}
          onClick={() => handleRecipeClick(recipe.id)}
        >
          <div className="relative aspect-[4/3] group">
            <img
              src={getValidImageUrl(recipe)}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <ChefHat className="w-4 h-4" />
                <span>{recipe.chef}</span>
                <span className="opacity-60">•</span>
                <Clock className="w-4 h-4" />
                <span>{recipe.cookTime}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}