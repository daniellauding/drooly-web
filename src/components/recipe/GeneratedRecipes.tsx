import { Recipe } from "@/types/recipe";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { saveRecipe } from "@/services/recipeOperations";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface GeneratedRecipesProps {
  recipes: Recipe[];
  onClose: () => void;
}

export function GeneratedRecipes({ recipes, onClose }: GeneratedRecipesProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save recipes",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveRecipe(recipe, user.uid, user.displayName || "Anonymous Chef", false);
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
    }
  };

  const handleCreateOwn = (recipe: Recipe) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to create recipes",
        variant: "destructive"
      });
      return;
    }

    navigate('/create-recipe', { state: { recipe } });
  };

  return (
    <div className="space-y-6">
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
              >
                Save Recipe
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
    </div>
  );
}