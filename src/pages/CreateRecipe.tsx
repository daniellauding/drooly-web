import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById } from "@/services/recipeService";
import { Recipe, validateRecipe } from "@/types/recipe";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { RecipeBasicInfo } from "@/components/recipe/RecipeBasicInfo";
import { RecipeStepInput } from "@/components/RecipeStepInput";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { saveRecipe } from "@/services/recipeOperations";
import { Timestamp } from "firebase/firestore";

export default function CreateRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!id;

  const [recipe, setRecipe] = useState<Recipe>({
    id: '',
    title: "",
    description: "",
    difficulty: "Medium",
    cookingMethods: [],
    cuisine: "",
    dishTypes: [],
    images: [],
    featuredImageIndex: 0,
    ingredients: [],
    instructions: [],
    servings: {
      amount: 4,
      unit: "servings"
    },
    steps: [{
      title: "",
      instructions: "",
      duration: "",
      media: [],
      ingredients: []
    }],
    tags: [],
    totalTime: "",
    worksWith: [],
    serveWith: [],
    categories: [],
    estimatedCost: "",
    equipment: [],
    status: "draft",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  const { data: existingRecipe, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (existingRecipe) {
      console.log("Setting existing recipe data:", existingRecipe);
      setRecipe(existingRecipe);
    }
  }, [existingRecipe]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save a recipe",
        variant: "destructive"
      });
      return;
    }

    const validation = validateRecipe(recipe);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    try {
      await saveRecipe(recipe, user.uid, user.displayName || "", isEditing, id);
      
      toast({
        title: "Success",
        description: `Recipe ${isEditing ? "updated" : "created"} successfully!`
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddStep = () => {
    setRecipe(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          title: "",
          instructions: "",
          duration: "",
          media: [],
          ingredients: []
        }
      ]
    }));
  };

  if (isEditing && isLoading) {
    return <div>Loading recipe...</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="container max-w-4xl mx-auto py-6 px-4 space-y-8">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Recipe" : "Create New Recipe"}
        </h1>

        <RecipeBasicInfo
          recipe={recipe}
          onChange={(updates) => setRecipe(prev => ({ ...prev, ...updates }))}
        />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Steps</h2>
          {recipe.steps.map((step, index) => (
            <RecipeStepInput
              key={index}
              step={step}
              onChange={(updatedStep) => {
                const newSteps = [...recipe.steps];
                newSteps[index] = updatedStep;
                setRecipe(prev => ({ ...prev, steps: newSteps }));
              }}
              onDelete={() => {
                if (recipe.steps.length > 1) {
                  const newSteps = recipe.steps.filter((_, i) => i !== index);
                  setRecipe(prev => ({ ...prev, steps: newSteps }));
                }
              }}
            />
          ))}
          <Button
            variant="outline"
            onClick={handleAddStep}
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </Button>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Update Recipe" : "Create Recipe"}
          </Button>
        </div>
      </main>
    </div>
  );
}
