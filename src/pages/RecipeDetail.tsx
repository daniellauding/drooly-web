import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChefHat, Heart, Share2, Printer, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById } from "@/services/recipeService";
import { Skeleton } from "@/components/ui/skeleton";

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

      <div className="relative h-[50vh] w-full">
        <img
          src={recipe.imageUrls?.[recipe.featuredImageIndex || 0] || '/placeholder.svg'}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span>{recipe.creatorName || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(recipe.createdAt.seconds * 1000).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Heart className="w-4 h-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <BookOpen className="w-4 h-4" />
            Start Cooking
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Clock className="w-5 h-5 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Cook Time</p>
            <p className="font-medium">{recipe.totalTime} min</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <ChefHat className="w-5 h-5 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <p className="font-medium">{recipe.difficulty}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="w-5 h-5 text-primary mb-2">👥</div>
            <p className="text-sm text-muted-foreground">Servings</p>
            <p className="font-medium">{recipe.servings?.amount || 2} {recipe.servings?.unit || 'servings'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-muted-foreground">{recipe.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ScrollArea className="h-[300px] pr-4">
              <ul className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ScrollArea className="h-[300px] pr-4">
              <ol className="space-y-4">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground">{instruction}</p>
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}