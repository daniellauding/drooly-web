import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { RecipeBasicInfo } from "@/components/recipe/RecipeBasicInfo";
import { RecipeDetails } from "@/components/recipe/RecipeDetails";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeStepInput } from "@/components/RecipeStepInput";
import { useToast } from "@/hooks/use-toast";
import { RecipeCreationOptions } from "@/components/recipe/RecipeCreationOptions";
import { Recipe, validateRecipe } from "@/types/recipe";

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

export interface RecipeStep {
  title: string;
  instructions: string;
  duration: string;
  ingredientGroup?: string;
  media?: string[];
}

export default function CreateRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe);

  console.log("Recipe state updated:", recipe);

  const handleRecipeImport = (importedRecipe: Partial<Recipe>) => {
    setRecipe(prev => ({
      ...prev,
      ...importedRecipe
    }));
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

    const validation = validateRecipe(recipe);
    if (!validation.isValid && !isDraft) {
      toast({
        title: "Validation Error",
        description: (
          <div className="space-y-2">
            <p>Please fix the following errors:</p>
            <ul className="list-disc pl-4">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        ),
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

  const ingredientGroups = Array.from(new Set(recipe.ingredients.map(ing => ing.group)));

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 pt-20 pb-16">
        <div className="container max-w-4xl mx-auto p-4 space-y-8">
          <h1 className="text-3xl font-bold">Create New Recipe</h1>

          <RecipeCreationOptions onRecipeImported={handleRecipeImport} />

          <RecipeBasicInfo 
            recipe={recipe}
            onChange={(updates) => setRecipe(prev => ({ ...prev, ...updates }))}
          />

          <RecipeDetails
            recipe={recipe}
            onChange={(updates) => setRecipe(prev => ({ ...prev, ...updates }))}
          />

          <div>
            <IngredientInput
              ingredients={recipe.ingredients}
              onChange={(ingredients) => setRecipe(prev => ({ ...prev, ingredients }))}
            />
          </div>

          <div className="space-y-4">
            {recipe.steps.map((step, index) => (
              <RecipeStepInput
                key={index}
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
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setRecipe(prev => ({
                ...prev,
                steps: [...prev.steps, { title: "", instructions: "", duration: "", media: [] }]
              }))}
            >
              Add Step
            </Button>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => handleSave(true)}
              disabled={loading}
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSave(false)}
              disabled={loading}
            >
              Publish Recipe
            </Button>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
