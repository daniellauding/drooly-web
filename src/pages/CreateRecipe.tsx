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

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const COOKING_METHODS = ["Baking", "Frying", "Grilling", "Boiling", "Steaming"];
const CUISINES = ["Italian", "Japanese", "Mexican", "Indian", "French"];
const DISH_TYPES = ["Main Course", "Appetizer", "Dessert", "Soup", "Salad"];

const CreateRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({
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
      duration: ""
    }],
    tags: [],
    totalTime: "",
  });

  const handleSave = async (isDraft = false) => {
    if (!user) {
      console.error("User must be logged in to create recipes");
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
      navigate(`/recipe/${docRef.id}`);
    } catch (error) {
      console.error("Error creating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Create New Recipe</h1>

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

          {/* More fields will be added here */}
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