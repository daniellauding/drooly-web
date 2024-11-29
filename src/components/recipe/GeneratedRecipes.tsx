import { Recipe } from "@/types/recipe";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { saveRecipe } from "@/services/recipeOperations";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

interface GeneratedRecipesProps {
  recipes: Recipe[];
  onClose: () => void;
  onRegenerate?: () => void;
}

export function GeneratedRecipes({ recipes, onClose, onRegenerate }: GeneratedRecipesProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsSaving(true);
      // Ensure ingredients are properly mapped
      const mappedRecipe = {
        ...recipe,
        ingredients: recipe.ingredients.map(ing => ({
          name: typeof ing === 'string' ? ing : ing.name,
          amount: typeof ing === 'string' ? '' : ing.amount,
          unit: typeof ing === 'string' ? '' : ing.unit,
        }))
      };

      await saveRecipe(mappedRecipe, user.uid, user.displayName || "Anonymous Chef", false);
      toast({
        title: "Recipe Saved",
        description: "The recipe has been added to your collection"
      });
      onClose();
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateOwn = (recipe: Recipe) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate('/create-recipe', { state: { recipe } });
  };

  const handleRegenerate = async () => {
    if (onRegenerate) {
      setIsRegenerating(true);
      try {
        await onRegenerate();
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Generated Recipes</h2>
        {onRegenerate && (
          <Button
            variant="outline"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="gap-2"
          >
            {isRegenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Generate New Recipes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="space-y-4">
            <RecipeCard
              id={recipe.id}
              title={recipe.title}
              images={recipe.images}
              cookTime={recipe.totalTime}
              difficulty={recipe.difficulty}
              chef="AI Generated"
              date={new Date().toLocaleDateString()}
              stats={recipe.stats}
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleSaveRecipe(recipe)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Recipe"
                )}
              </Button>
              <Button 
                variant="default"
                className="flex-1"
                onClick={() => handleCreateOwn(recipe)}
              >
                Create Own Version
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="login"
      />
    </div>
  );
}