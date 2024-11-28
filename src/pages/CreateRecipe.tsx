import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById, Recipe } from "@/services/recipeService";
import { validateRecipe } from "@/types/recipe";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { saveRecipe } from "@/services/recipeOperations";
import { Timestamp } from "firebase/firestore";
import { RecipeAccordions } from "@/components/recipe/RecipeAccordions";

export default function CreateRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!id;
  const [openSections, setOpenSections] = useState<string[]>(["basic-info"]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isStepBased, setIsStepBased] = useState(false);
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

  const validateSection = (section: string) => {
    const errors: string[] = [];
    
    switch(section) {
      case "basic-info":
        if (!recipe.title?.trim()) errors.push("Title is required");
        if (!recipe.description?.trim()) errors.push("Description is required");
        break;
      case "ingredients":
        if (!recipe.ingredients?.length) errors.push("At least one ingredient is required");
        break;
      case "details":
        if (!recipe.difficulty) errors.push("Difficulty is required");
        break;
    }

    return errors;
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save a recipe",
        variant: "destructive"
      });
      return;
    }

    // Validate all sections
    const newValidationErrors: Record<string, string[]> = {
      "basic-info": validateSection("basic-info"),
      "ingredients": validateSection("ingredients"),
      "details": validateSection("details")
    };

    setValidationErrors(newValidationErrors);

    // Open sections with errors
    const sectionsWithErrors = Object.entries(newValidationErrors)
      .filter(([_, errors]) => errors.length > 0)
      .map(([section]) => section);

    if (sectionsWithErrors.length > 0) {
      setOpenSections(prev => [...new Set([...prev, ...sectionsWithErrors])]);
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Recipe" : "Create New Recipe"}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Step-based creation</span>
            <Switch
              checked={isStepBased}
              onCheckedChange={setIsStepBased}
            />
          </div>
        </div>

        <RecipeAccordions
          recipe={recipe}
          openSections={openSections}
          validationErrors={validationErrors}
          isStepBased={isStepBased}
          onOpenSectionsChange={setOpenSections}
          onRecipeChange={(updates) => setRecipe(prev => ({ ...prev, ...updates }))}
          onAddStep={handleAddStep}
        />

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