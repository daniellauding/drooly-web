import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Share2, Printer, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById } from "@/services/recipeService";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AddToWeeklyPlanModal } from "@/components/recipe/AddToWeeklyPlanModal";
import { WantToCookButton } from "@/components/recipe/WantToCookButton";
import { AddToEventModal } from "@/components/recipe/AddToEventModal";
import { IngredientsSection } from "@/components/recipe/sections/IngredientsSection";
import { RecipeHeaderSection } from "@/components/recipe/sections/RecipeHeaderSection";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPlanModal, setShowPlanModal] = React.useState(false);
  const [showEventModal, setShowEventModal] = React.useState(false);

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id!),
    enabled: !!id,
  });

  console.log("Rendering recipe detail for ID:", id, "Recipe:", recipe);

  if (error) {
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

  const validImages = (recipe.images || []).filter(img => !img.startsWith('blob:')) || [];
  const ingredients = recipe.ingredientSections?.[0]?.ingredients || [];
  const instructions = recipe.steps?.map(step => step.instructions).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="relative h-[50vh] w-full overflow-hidden">
        {validImages.length > 0 ? (
          <Carousel className="w-full h-full">
            <CarouselContent>
              {validImages.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="relative w-full h-full">
                    <img
                      src={image}
                      alt={`${recipe.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {validImages.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        ) : (
          <img
            src="/placeholder.svg"
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <RecipeHeaderSection 
          recipe={recipe}
          onNavigateBack={() => navigate(-1)}
          onEdit={() => navigate(`/recipe/edit/${id}`)}
          onShowPlanModal={() => setShowPlanModal(true)}
          onShowEventModal={() => setShowEventModal(true)}
          isCreator={user && recipe.creatorId === user.uid}
        />
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-wrap gap-4 mb-6 sm:mb-8">
          <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
            <Heart className="w-4 h-4" />
            Save
          </Button>
          <WantToCookButton 
            recipeId={recipe.id} 
            wantToCook={recipe.stats?.wantToCook} 
            showCount={true}
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 flex-1 sm:flex-none"
            onClick={() => setShowEventModal(true)}
          >
            <Calendar className="w-4 h-4" />
            Add to Event
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 flex-1 sm:flex-none"
            onClick={() => setShowPlanModal(true)}
          >
            <Calendar className="w-4 h-4" />
            Add to Weekly Plan
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

        <AddToWeeklyPlanModal
          open={showPlanModal}
          onOpenChange={setShowPlanModal}
          recipeId={recipe.id}
          recipeTitle={recipe.title}
          recipeImage={validImages[0] || "/placeholder.svg"}
        />

        <AddToEventModal
          open={showEventModal}
          onOpenChange={setShowEventModal}
          recipeId={recipe.id}
          recipeTitle={recipe.title}
        />

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          <IngredientsSection ingredients={recipe.ingredients} />

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