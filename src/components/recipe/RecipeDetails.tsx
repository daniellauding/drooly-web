import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Recipe } from "@/types/recipe";

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const COOKING_METHODS = ["Baking", "Frying", "Grilling", "Boiling", "Steaming", "Roasting", "Sautéing"];
const CUISINES = ["Italian", "Japanese", "Mexican", "Indian", "French", "Thai", "Mediterranean"];
const DISH_TYPES = ["Main Course", "Appetizer", "Dessert", "Soup", "Salad", "Breakfast", "Snack"];
const SERVING_UNITS = ["serving", "piece", "portion"];

interface RecipeDetailsProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export function RecipeDetails({ recipe, onChange }: RecipeDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={recipe.difficulty}
            onValueChange={(value) => onChange({ difficulty: value })}
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
            onValueChange={(value) => onChange({ cuisine: value })}
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
          onChange={(methods) => onChange({ cookingMethods: methods })}
          placeholder="Select cooking methods"
        />
      </div>

      <div>
        <Label>Dish Types</Label>
        <MultiSelect
          options={DISH_TYPES}
          selected={recipe.dishTypes || []}
          onChange={(types) => onChange({ dishTypes: types })}
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
            onChange={(e) => onChange({
              servings: { ...recipe.servings, amount: parseInt(e.target.value) }
            })}
          />
        </div>
        <div>
          <Label>Serving Unit</Label>
          <Select
            value={recipe.servings.unit}
            onValueChange={(value) => onChange({
              servings: { ...recipe.servings, unit: value }
            })}
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
          onChange={(e) => onChange({ totalTime: e.target.value })}
          placeholder="e.g., 45 minutes"
        />
      </div>
    </div>
  );
}