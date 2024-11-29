import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/MultiSelect";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Recipe, CUISINES, RECIPE_CATEGORIES, OCCASIONS, SEASONS, COOKING_EQUIPMENT, COST_CATEGORIES } from "@/types/recipe";
import { CookingTimeInput } from "./CookingTimeInput";
import { DietaryInfo } from "./DietaryInfo";
import { RecipeCategories } from "./RecipeCategories";
import { EnergyInfoSection } from "./EnergyInfoSection";

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const COOKING_METHODS = ["Baking", "Frying", "Grilling", "Boiling", "Steaming", "Roasting", "Sautéing"];
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

      <DietaryInfo 
        value={recipe.dietaryInfo}
        onChange={(dietaryInfo) => onChange({ dietaryInfo })}
      />

      <RecipeCategories
        categories={recipe.categories || []}
        onChange={(categories) => onChange({ categories })}
      />

      <div>
        <Label>Estimated Cost</Label>
        <Select
          value={recipe.estimatedCost}
          onValueChange={(value) => onChange({ estimatedCost: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cost range" />
          </SelectTrigger>
          <SelectContent>
            {COST_CATEGORIES.map(cost => (
              <SelectItem key={cost} value={cost}>
                {cost}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Season</Label>
          <Select
            value={recipe.season}
            onValueChange={(value) => onChange({ season: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {SEASONS.map(season => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Occasion</Label>
          <Select
            value={recipe.occasion}
            onValueChange={(value) => onChange({ occasion: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              {OCCASIONS.map(occasion => (
                <SelectItem key={occasion} value={occasion}>
                  {occasion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Required Equipment</Label>
        <MultiSelect
          options={COOKING_EQUIPMENT}
          selected={recipe.equipment || []}
          onChange={(equipment) => onChange({ equipment })}
          placeholder="Select required equipment"
        />
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

      <CookingTimeInput
        value={recipe.totalTime}
        onChange={(time) => onChange({ totalTime: time })}
      />

      <EnergyInfoSection
        energyInfo={recipe.energyInfo || {
          calories: 0,
          kilojoules: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0
        }}
        onChange={(energyInfo) => onChange({ energyInfo })}
      />
    </div>
  );
}
