import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { RecipeBasicInfo } from "@/components/recipe/RecipeBasicInfo";
import { RecipeDetails } from "@/components/recipe/RecipeDetails";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeStepInput } from "@/components/RecipeStepInput";
import { useToast } from "@/hooks/use-toast";
import { RecipeCreationOptions } from "@/components/recipe/RecipeCreationOptions";
import { Recipe, validateRecipe, ValidationResult } from "@/types/recipe";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const initialRecipe: Recipe = {
  title: "",
  description: "",
  difficulty: "",
  cookingMethods: [],
  cuisine: "",
  dishTypes: [],
  images: [],
  featuredImageIndex: 0,
  ingredients: [],
  servings: {
    amount: 1,
    unit: "serving"
  },
  steps: [{
    title: "Preparation",
    instructions: "",
    duration: "",
    ingredientGroup: "",
    media: []
  }],
  tags: [],
  totalTime: "",
  worksWith: [],
  serveWith: [],
  dietaryInfo: {
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    containsNuts: false
  },
  categories: [],
  estimatedCost: "Under $5",
  equipment: [],
  season: "Year Round",
  occasion: "",
};

export default function CreateRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, errors: [] });

  console.log("Recipe state updated:", recipe);

  const handleRecipeImport = (importedRecipe: Partial<Recipe>) => {
    setRecipe(prev => ({
      ...prev,
      ...importedRecipe
    }));
  };

  const validateAndShowErrors = () => {
    const validation = validateRecipe(recipe);
    setValidationResult(validation);
    return validation.isValid;
  };

  const handleSave = async (isDraft = false) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create recipes",
        variant: "destructive"
      });
      return;
    }

    if (!isDraft && !validateAndShowErrors()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before publishing",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const recipeData = {
        ...recipe,
        creatorId: user.uid,
        createdAt: new Date(),
        status: isDraft ? "draft" : "published"
      };

      const docRef = await addDoc(collection(db, "recipes"), recipeData);
      console.log("Recipe created with ID:", docRef.id);
      
      toast({
        title: "Success",
        description: `Recipe ${isDraft ? 'saved as draft' : 'published'} successfully!`,
      });
      
      navigate(`/recipe/${docRef.id}`);
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast({
        title: "Error",
        description: "Failed to create recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getErrorsForField = (fieldName: string) => {
    return validationResult.errors.filter(error => error.field === fieldName);
  };

  const renderFieldErrors = (fieldName: string) => {
    const errors = getErrorsForField(fieldName);
    if (errors.length === 0) return null;

    return (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Validation Error</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  const ingredientGroups = Array.from(new Set(recipe.ingredients.map(ing => ing.group)));

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <TopBar />
      <div className="flex-1 pt-20 pb-16">
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Recipe</h1>

          <RecipeCreationOptions onRecipeImported={handleRecipeImport} />

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="basic-info" className="border rounded-lg bg-white">
              <AccordionTrigger className="px-4">Basic Information</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <RecipeBasicInfo 
                  recipe={recipe}
                  onChange={(updates) => setRecipe(prev => ({ ...prev, ...updates }))}
                />
                {renderFieldErrors('title')}
                {renderFieldErrors('description')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="details" className="border rounded-lg bg-white">
              <AccordionTrigger className="px-4">Recipe Details</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <RecipeDetails
                  recipe={recipe}
                  onChange={(updates) => setRecipe(prev => ({ ...prev, ...updates }))}
                />
                {renderFieldErrors('difficulty')}
                {renderFieldErrors('servings')}
                {renderFieldErrors('totalTime')}
                {renderFieldErrors('categories')}
                {renderFieldErrors('equipment')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ingredients" className="border rounded-lg bg-white">
              <AccordionTrigger className="px-4">Ingredients</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <IngredientInput
                  ingredients={recipe.ingredients}
                  onChange={(ingredients) => setRecipe(prev => ({ ...prev, ingredients }))}
                />
                {renderFieldErrors('ingredients')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="steps" className="border rounded-lg bg-white">
              <AccordionTrigger className="px-4">Steps</AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <div key={index}>
                      <RecipeStepInput
                        step={step}
                        ingredientGroups={ingredientGroups}
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
                      {renderFieldErrors(`steps.${index}`)}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRecipe(prev => ({
                      ...prev,
                      steps: [...prev.steps, { title: "", instructions: "", duration: "", media: [] }]
                    }))}
                    className="w-full sm:w-auto"
                  >
                    Add Step
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => handleSave(true)}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSave(false)}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Publish Recipe
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
