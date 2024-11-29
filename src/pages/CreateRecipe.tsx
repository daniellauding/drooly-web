import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById, Recipe } from "@/services/recipeService";
import { validateRecipe } from "@/types/recipe";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Timestamp } from "firebase/firestore";
import { RecipeAccordions } from "@/components/recipe/RecipeAccordions";
import { RecipeCreationOptions } from "@/components/recipe/RecipeCreationOptions";
import { RecipeHeader } from "@/components/recipe/RecipeHeader";
import { useRecipeSaveHandler } from "@/components/recipe/RecipeSaveHandler";
import { Save } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/backoffice/DeleteConfirmationDialog";
import { BetaStrip } from "@/components/home/BetaStrip";
import { ImageRecognitionDialog } from "@/components/recipe/ImageRecognitionDialog";

export default function CreateRecipe() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!id;
  const [openSections, setOpenSections] = useState<string[]>(["basic-info"]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isStepBased, setIsStepBased] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [showImageRecognition, setShowImageRecognition] = useState(mode === 'photo');
  const { handleSaveRecipe } = useRecipeSaveHandler(isEditing, id);
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
    status: 'published',
    privacy: 'public',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    stats: {
      views: 0,
      likes: [],
      saves: [],
      comments: 0
    }
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
      setHasUnsavedChanges(false);
    }
  }, [existingRecipe]);

  // Add navigation prompt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleRecipeChange = (updates: Partial<Recipe>) => {
    setRecipe(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleNavigateAway = () => {
    if (hasUnsavedChanges) {
      setShowExitPrompt(true);
    } else {
      navigate(-1);
    }
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

    await handleSaveRecipe(recipe, user.uid, user.displayName || "", false);
    setHasUnsavedChanges(false);
  };

  const handleSaveAsDraft = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save a recipe",
        variant: "destructive"
      });
      return;
    }

    await handleSaveRecipe(recipe, user.uid, user.displayName || "", true);
    setHasUnsavedChanges(false);
  };

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

  const handleAISuggestions = (suggestions: Partial<Recipe>) => {
    console.log("Applying AI suggestions to recipe:", suggestions);
    setRecipe(prev => ({
      ...prev,
      ...suggestions
    }));
  };

  const handleRecipeScanned = (scannedRecipe: Partial<Recipe>) => {
    handleRecipeChange(scannedRecipe);
    setShowImageRecognition(false);
    toast({
      title: "Recipe created from photo",
      description: "You can now edit and customize the recipe details."
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <BetaStrip />
      <TopBar />
      <main className="container max-w-4xl mx-auto py-6 px-4 space-y-8">
        <RecipeHeader
          isEditing={isEditing}
          recipe={recipe}
          onSaveAsDraft={handleSaveAsDraft}
        />

        <RecipeCreationOptions 
          onRecipeImported={(importedRecipe) => {
            handleRecipeChange(importedRecipe);
          }} 
        />

        <RecipeAccordions
          recipe={recipe}
          openSections={openSections}
          validationErrors={validationErrors}
          isStepBased={isStepBased}
          onOpenSectionsChange={setOpenSections}
          onRecipeChange={handleRecipeChange}
          onAddStep={handleAddStep}
          onStepBasedChange={setIsStepBased}
        />

        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={handleSaveAsDraft}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Update Recipe" : "Publish Recipe"}
          </Button>
        </div>

        <ImageRecognitionDialog
          open={showImageRecognition}
          onOpenChange={setShowImageRecognition}
          onRecipeScanned={handleRecipeScanned}
        />

        <DeleteConfirmationDialog
          open={showExitPrompt}
          onOpenChange={setShowExitPrompt}
          onConfirm={() => {
            setShowExitPrompt(false);
            navigate(-1);
          }}
          title="Unsaved Changes"
          description="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
          confirmText="Leave"
          cancelText="Stay"
        />
      </main>
    </div>
  );
}
