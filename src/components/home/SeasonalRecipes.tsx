import { Recipe } from "@/services/recipeService";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SeasonalRecipesProps {
  recipes: Recipe[];
}

export function SeasonalRecipes({ recipes }: SeasonalRecipesProps) {
  const navigate = useNavigate();
  const christmasRecipes = recipes.filter(recipe => 
    recipe.occasion === 'Christmas' || 
    recipe.categories?.includes('Christmas')
  );

  if (christmasRecipes.length === 0) {
    return (
      <Card 
        className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-red-50 hover:bg-red-100 min-h-[350px] flex flex-col items-center justify-center"
        onClick={() => navigate('/create-recipe?occasion=Christmas')}
      >
        <Plus className="w-12 h-12 text-red-600 mb-4" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Add Christmas Recipe</h3>
        <p className="text-red-600 text-center">Share your favorite holiday dishes</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 overflow-hidden">
      <h3 className="text-xl font-semibold mb-4 text-red-700">Christmas Recipes</h3>
      <Carousel className="w-full">
        <CarouselContent>
          {christmasRecipes.map((recipe) => (
            <CarouselItem key={recipe.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <img
                    src={recipe.images?.[recipe.featuredImageIndex || 0] || '/placeholder.svg'}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold truncate">{recipe.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{recipe.chef}</p>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  );
}