import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChefHat, Heart, Share2, Printer, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById } from "@/services/recipeService";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id!),
    enabled: !!id,
  });

  console.log("Rendering recipe detail for ID:", id, "Recipe:", recipe);

  if (error) {
    console.error("Error loading recipe:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Error loading recipe</p>
      </div>
    );
  }

  if (isLoading || !recipe) {
    return (
      <div className="min-h-screen bg-[#F7F9FC]">
        <div className="h-[50vh]">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Ensure ingredients and instructions exist with default values
  const ingredients = recipe.ingredientSections?.[0]?.ingredients || [];
  const instructions = recipe.steps?.map(step => step.instructions).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="relative h-[40vh] sm:h-[50vh] w-full">
        <img
          src={recipe.images?.[recipe.featuredImageIndex || 0] || '/placeholder.svg'}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span>{recipe.creatorName || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(recipe.createdAt.seconds * 1000).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-wrap gap-4 mb-6 sm:mb-8">
          <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
            <Heart className="w-4 h-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none hidden sm:flex">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90">
            <BookOpen className="w-4 h-4" />
            Start Cooking
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-4 rounded-xl">
            <Clock className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">Cook Time</p>
            <p className="font-medium text-sm sm:text-base">{recipe.totalTime} min</p>
          </Card>
          <Card className="p-3 sm:p-4 rounded-xl">
            <ChefHat className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">Difficulty</p>
            <p className="font-medium text-sm sm:text-base">{recipe.difficulty}</p>
          </Card>
          <Card className="p-3 sm:p-4 rounded-xl col-span-2 sm:col-span-1">
            <div className="w-5 h-5 text-primary mb-2">👥</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Servings</p>
            <p className="font-medium text-sm sm:text-base">
              {recipe.servings?.amount || 2} {recipe.servings?.unit || 'servings'}
            </p>
          </Card>
        </div>

        <Card className="p-4 sm:p-6 rounded-xl mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Description</h2>
          <p className="text-muted-foreground text-sm sm:text-base">{recipe.description}</p>
        </Card>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          <Card className="p-4 sm:p-6 rounded-xl">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Ingredients</h2>
            <ScrollArea className="h-[250px] sm:h-[300px] pr-4">
              <ul className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm sm:text-base">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </Card>

          <Card className="p-4 sm:p-6 rounded-xl">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Instructions</h2>
            <ScrollArea className="h-[250px] sm:h-[300px] pr-4">
              <ol className="space-y-4">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 sm:gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground text-sm sm:text-base">{instruction}</p>
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}