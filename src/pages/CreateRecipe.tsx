import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { RecipeStepInput } from "@/components/RecipeStepInput";
import { MultiSelect } from "@/components/MultiSelect";
import { IngredientInput } from "@/components/IngredientInput";
import { useToast } from "@/components/ui/use-toast";
import { RecipeCreationOptions } from "@/components/recipe/RecipeCreationOptions";

// Move constants to a separate file later for better organization
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const COOKING_METHODS = ["Baking", "Frying", "Grilling", "Boiling", "Steaming", "Roasting", "Sautéing"];
const CUISINES = ["Italian", "Japanese", "Mexican", "Indian", "French", "Thai", "Mediterranean"];
const DISH_TYPES = ["Main Course", "Appetizer", "Dessert", "Soup", "Salad", "Breakfast", "Snack"];
const SERVING_UNITS = ["serving", "piece", "portion"];

export interface RecipeStep {
  title: string;
  instructions: string;
  duration: string;
  ingredientGroup?: string;
  media?: string[];
}

interface Recipe {
  title: string;
  description: string;
  difficulty: string;
  cookingMethods: string[];
  cuisine: string;
  dishTypes: string[];
  images: string[];
  featuredImageIndex: number;
  ingredients: any[];
  servings: {
    amount: number;
    unit: string;
  };
  steps: RecipeStep[];
  tags: string[];
  totalTime: string;
  worksWith: string[];
  serveWith: string[];
}

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
};

const CreateRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe);

  const handleSave = async (isDraft = false) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create recipes",
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

  // Get unique ingredient groups
  const ingredientGroups = Array.from(new Set(recipe.ingredients.map(ing => ing.group)));

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Create New Recipe</h1>

      <RecipeCreationOptions />

      <div className="space-y-6">
        <ImageUpload
          images={recipe.images}
          featuredImageIndex={recipe.featuredImageIndex}
          onChange={(images, featuredIndex) => 
            setRecipe(prev => ({
              ...prev,
              images,
              featuredImageIndex: featuredIndex
            }))
          }
        />

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={recipe.title}
              onChange={(e) => setRecipe(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Recipe title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={recipe.description}
              onChange={(e) => setRecipe(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your recipe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={recipe.difficulty}
                onValueChange={(value) => setRecipe(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map(option => (
                    <SelectItem key={option} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cuisine">Cuisine</Label>
              <Select
                value={recipe.cuisine}
                onValueChange={(value) => setRecipe(prev => ({ ...prev, cuisine: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {CUISINES.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Cooking Methods</Label>
            <MultiSelect
              options={COOKING_METHODS}
              selected={recipe.cookingMethods || []}
              onChange={(methods) => setRecipe(prev => ({ ...prev, cookingMethods: methods }))}
              placeholder="Select cooking methods"
            />
          </div>

          <div>
            <Label>Dish Types</Label>
            <MultiSelect
              options={DISH_TYPES}
              selected={recipe.dishTypes || []}
              onChange={(types) => setRecipe(prev => ({ ...prev, dishTypes: types }))}
              placeholder="Select dish types"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Servings Amount</Label>
              <Input
                type="number"
                min="1"
                value={recipe.servings.amount}
                onChange={(e) => setRecipe(prev => ({
                  ...prev,
                  servings: { ...prev.servings, amount: parseInt(e.target.value) }
                }))}
              />
            </div>
            <div>
              <Label>Serving Unit</Label>
              <Select
                value={recipe.servings.unit}
                onValueChange={(value) => setRecipe(prev => ({
                  ...prev,
                  servings: { ...prev.servings, unit: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {SERVING_UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Total Cooking Time</Label>
            <Input
              value={recipe.totalTime}
              onChange={(e) => setRecipe(prev => ({ ...prev, totalTime: e.target.value }))}
              placeholder="e.g., 45 minutes"
            />
          </div>

          <IngredientInput
            ingredients={recipe.ingredients}
            onChange={(ingredients) => setRecipe(prev => ({ ...prev, ingredients }))}
          />

          <div className="space-y-4">
            <Label>Recipe Steps</Label>
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
  );
};

export default CreateRecipe;
