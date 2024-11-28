import { Recipe } from "@/types/recipe";
import { saveRecipe } from "@/services/recipeOperations";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useRecipeSaveHandler(isEditing: boolean, id?: string) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveRecipe = async (
    recipe: Recipe,
    userId: string,
    userName: string,
    isDraft: boolean = false
  ) => {
    try {
      console.log(`Saving recipe as ${isDraft ? 'draft' : 'published'}:`, recipe);
      
      await saveRecipe(
        { ...recipe, status: isDraft ? 'draft' : 'published' },
        userId,
        userName,
        isEditing,
        id
      );
      
      toast({
        title: "Success",
        description: `Recipe ${isDraft ? 'saved as draft' : isEditing ? 'updated' : 'published'} successfully!`
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: `Failed to ${isDraft ? 'save draft' : 'publish recipe'}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  return { handleSaveRecipe };
}