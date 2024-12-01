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
import { RecipeHeaderSection } from "@/components/recipe/sections/RecipeHeaderSection";
import { ScannedRecipesNav } from "@/components/recipe/sections/ScannedRecipesNav";
import { useRecipeSaveHandler } from "@/components/recipe/RecipeSaveHandler";
import { Save, Camera } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/backoffice/DeleteConfirmationDialog";
import { BetaStrip } from "@/components/home/BetaStrip";
import { ImageRecognitionDialog } from "@/components/recipe/ImageRecognitionDialog";
import { updateAchievementProgress, achievements } from "@/services/achievementService";
import { AchievementToast } from "@/components/achievements/AchievementToast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  
  const [scannedRecipes, setScannedRecipes] = useState<Partial<Recipe>[]>([]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>({
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
      setCurrentRecipe(existingRecipe);
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
    console.log("Updating recipe:", {
      activeIndex: activeRecipeIndex,
      updates
    });
    
    setCurrentRecipe(prev => {
      const updated = { ...prev, ...updates };
      // Update the scanned recipes array with the changes
      setScannedRecipes(prevRecipes => {
        const newRecipes = [...prevRecipes];
        newRecipes[activeRecipeIndex] = updated;
        return newRecipes;
      });
      return updated;
    });
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

    await handleSaveRecipe(currentRecipe, user.uid, user.displayName || "", false);
    
    // Check for first recipe and recipe streak achievements
    const firstRecipeAchieved = await updateAchievementProgress(user.uid, 'firstRecipe', 1);
    if (firstRecipeAchieved) {
      toast({
        title: "Achievement Unlocked!",
        description: <AchievementToast achievement={achievements.firstRecipe} />,
      });
    }
    
    const streakAchieved = await updateAchievementProgress(user.uid, 'recipeStreak', 1);
    if (streakAchieved) {
      toast({
        title: "Achievement Unlocked!",
        description: <AchievementToast achievement={achievements.recipeStreak} />,
      });
    }
    
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

    await handleSaveRecipe(currentRecipe, user.uid, user.displayName || "", true);
    setHasUnsavedChanges(false);
  };

  const validateSection = (section: string) => {
    const errors: string[] = [];
    
    switch(section) {
      case "basic-info":
        if (!currentRecipe.title?.trim()) errors.push("Title is required");
        if (!currentRecipe.description?.trim()) errors.push("Description is required");
        break;
      case "ingredients":
        if (!currentRecipe.ingredients?.length) errors.push("At least one ingredient is required");
        break;
      case "details":
        if (!currentRecipe.difficulty) errors.push("Difficulty is required");
        break;
    }

    return errors;
  };

  const handleAddStep = () => {
    setCurrentRecipe(prev => ({
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
    setCurrentRecipe(prev => ({
      ...prev,
      ...suggestions
    }));
  };

  const handleRecipeScanned = async (recipes: Partial<Recipe>[]) => {
    console.log("Received scanned recipes:", recipes.length);
    setScannedRecipes(recipes);
    
    if (recipes.length > 0) {
      const firstRecipe = recipes[0];
      setCurrentRecipe(prev => ({
        ...prev,
        ...firstRecipe
      }));
      
      if (firstRecipe.steps && firstRecipe.steps.length > 0) {
        setIsStepBased(true);
      }
      
      const sectionsToOpen = ["basic-info"];
      if (firstRecipe.ingredients?.length) sectionsToOpen.push("ingredients");
      if (firstRecipe.steps?.length) sectionsToOpen.push("steps");
      setOpenSections(sectionsToOpen);
    }
    
    setShowImageRecognition(false);
    toast({
      title: `Recipe created from photo`,
      description: "You can now edit and customize the recipe details."
    });
  };

  const handleRecipeSelect = (index: number) => {
    console.log("Switching to recipe:", {
      selectedIndex: index,
      recipe: scannedRecipes[index]
    });
    
    setActiveRecipeIndex(index);
    if (scannedRecipes[index]) {
      setCurrentRecipe(prev => ({
        ...prev,
        ...scannedRecipes[index]
      }));
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <BetaStrip />
      <TopBar />
      <main className="container max-w-4xl mx-auto py-6 px-4 space-y-8">
        <div className="flex items-center justify-between">
          <RecipeHeaderSection isEditing={isEditing} />
        </div>

        <ScannedRecipesNav
          scannedRecipes={scannedRecipes}
          activeRecipeIndex={activeRecipeIndex}
          onRecipeSelect={handleRecipeSelect}
        />

        <RecipeCreationOptions 
          onRecipeImported={handleRecipeScanned}
          onStepBasedChange={setIsStepBased}
        />

        <RecipeAccordions
          recipe={currentRecipe}
          openSections={openSections}
          validationErrors={validationErrors}
          isStepBased={isStepBased}
          onOpenSectionsChange={setOpenSections}
          onRecipeChange={handleRecipeChange}
          onAddStep={handleAddStep}
          onStepBasedChange={setIsStepBased}
        />

        <div className="flex justify-end gap-4">
          <Button onClick={handleSave}>
            {isEditing ? "Update Recipe" : "Publish Recipe"}
          </Button>
        </div>

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

        <ImageRecognitionDialog
          open={showImageRecognition}
          onOpenChange={setShowImageRecognition}
          onRecipeScanned={handleRecipeScanned}
        />
      </main>
    </div>
  );
}
