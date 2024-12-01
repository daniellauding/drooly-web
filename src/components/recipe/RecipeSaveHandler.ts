import { Recipe } from "@/types/recipe";
import { saveRecipe } from "@/services/recipeOperations";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useRecipeSaveHandler(isEditing: boolean, id?: string) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveRecipe = async (
    recipesToSave: Recipe | Recipe[],
    userId: string,
    userName: string,
    isDraft: boolean = false
  ) => {
    try {
      const recipes = Array.isArray(recipesToSave) ? recipesToSave : [recipesToSave];
      console.log(`Saving ${recipes.length} recipes as ${isDraft ? 'draft' : 'published'}`);
      
      // Save each recipe sequentially
      for (const recipe of recipes) {
        if (!recipe.id) {
          console.warn("Recipe missing ID, generating one");
          recipe.id = `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        
        console.log("Saving recipe:", recipe.id, recipe.title);
        await saveRecipe(
          { ...recipe, status: isDraft ? 'draft' : 'published' },
          userId,
          userName,
          isEditing,
          id
        );
      }
      
      toast({
        title: "Success",
        description: `${recipes.length} recipe${recipes.length > 1 ? 's' : ''} ${isDraft ? 'saved as draft' : isEditing ? 'updated' : 'published'} successfully!`
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error saving recipes:", error);
      toast({
        title: "Error",
        description: `Failed to ${isDraft ? 'save draft' : 'publish recipe'}. Please try again.`,
        variant: "destructive"
      });
      throw error;
    }
  };

  return { handleSaveRecipe };
}