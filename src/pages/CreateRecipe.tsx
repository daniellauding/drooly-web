import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById, Recipe, Ingredient } from "@/services/recipeService"; // Updated import
import { validateRecipe } from "@/types/recipe";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { RecipeBasicInfo } from "@/components/recipe/RecipeBasicInfo";
import { RecipeDetails } from "@/components/recipe/RecipeDetails";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeStepInput } from "@/components/RecipeStepInput";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { saveRecipe } from "@/services/recipeOperations";
import { Timestamp } from "firebase/firestore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function CreateRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!id;
  const [openSections, setOpenSections] = useState<string[]>(["basic-info"]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

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
        if (!recipe.totalTime) errors.push("Cooking time is required");
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
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Recipe" : "Create New Recipe"}
        </h1>

        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="space-y-4"
        >
          <AccordionItem value="basic-info" className="border rounded-lg">
            <AccordionTrigger className="px-4">
              <div className="flex items-center gap-2">
                <span>Basic Information</span>
                {validationErrors["basic-info"]?.length > 0 && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {validationErrors["basic-info"]?.length > 0 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {validationErrors["basic-info"].map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              <RecipeBasicInfo
                recipe={recipe}
                onChange={(updates) => setRecipe(prev => ({ ...prev, ...updates }))}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="details" className="border rounded-lg">
            <AccordionTrigger className="px-4">
              <div className="flex items-center gap-2">
                <span>Recipe Details</span>
                {validationErrors["details"]?.length > 0 && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {validationErrors["details"]?.length > 0 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {validationErrors["details"].map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              <RecipeDetails
                recipe={recipe}
                onChange={(updates) => setRecipe(prev => ({ ...prev, ...updates }))}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ingredients" className="border rounded-lg">
            <AccordionTrigger className="px-4">
              <div className="flex items-center gap-2">
                <span>Ingredients</span>
                {validationErrors["ingredients"]?.length > 0 && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {validationErrors["ingredients"]?.length > 0 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {validationErrors["ingredients"].map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              <IngredientInput
                ingredients={recipe.ingredients}
                onChange={(ingredients) => setRecipe(prev => ({ ...prev, ingredients }))}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="steps" className="border rounded-lg">
            <AccordionTrigger className="px-4">Steps</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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