import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { cn } from "@/lib/utils";

interface MinimizableRecipeResultsProps {
  recipes: Recipe[];
  onClose: () => void;
}

export function MinimizableRecipeResults({ recipes, onClose }: MinimizableRecipeResultsProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!recipes.length) return null;

  return (
    <div className={cn(
      "fixed bottom-0 right-4 z-50 w-full max-w-md transition-all duration-300",
      isMinimized ? "translate-y-[calc(100%-64px)]" : ""
    )}>
      <Card className="border shadow-lg">
        <div 
          className="p-4 bg-primary text-primary-foreground flex items-center justify-between cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">
              Found {recipes.length} recipes
            </h3>
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="h-8 w-8 text-primary-foreground hover:text-primary-foreground/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className={cn(
          "overflow-auto transition-all duration-300",
          isMinimized ? "max-h-0" : "max-h-[60vh] p-4"
        )}>
          <div className="grid gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                images={recipe.images}
                cookTime={recipe.totalTime}
                difficulty={recipe.difficulty}
                chef="AI Generated"
                date={new Date().toLocaleDateString()}
                stats={recipe.stats}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}