import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/MultiSelect";
import { Slider } from "@/components/ui/slider";
import {
  CUISINES,
  COOKING_EQUIPMENT,
  RECIPE_CATEGORIES,
  OCCASIONS,
  SEASONS,
  COST_CATEGORIES,
} from "@/types/recipe";
import { COMMON_INGREDIENTS } from "@/components/ingredients/CommonIngredients";

const COOKING_METHODS = [
  "Baking",
  "Frying",
  "Grilling",
  "Boiling",
  "Steaming",
  "Roasting",
  "Sautéing"
];

const DISH_TYPES = [
  "Main Course",
  "Appetizer",
  "Dessert",
  "Soup",
  "Salad",
  "Breakfast",
  "Snack"
];

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Dairy Free",
  "Contains Nuts"
];

interface RecipeFilters {
  ingredients: string[];
  categories: string[];
  dietary: string[];
  difficulty: string[];
  cuisine: string[];
  estimatedCost: string[];
  season: string[];
  occasion: string[];
  equipment: string[];
  dishTypes: string[];
  cookingMethods: string[];
  cookingTime: number[];
}

interface RecipeFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterChange: (filters: RecipeFilters) => void;
}

export function RecipeFilter({ open, onOpenChange, onFilterChange }: RecipeFilterProps) {
  const [filters, setFilters] = React.useState<RecipeFilters>({
    ingredients: [],
    categories: [],
    dietary: [],
    difficulty: [],
    cuisine: [],
    estimatedCost: [],
    season: [],
    occasion: [],
    equipment: [],
    dishTypes: [],
    cookingMethods: [],
    cookingTime: [0, 180],
  });

  // Flatten ingredients array from CommonIngredients object
  const allIngredients = React.useMemo(() => {
    return Object.values(COMMON_INGREDIENTS).flat();
  }, []);

  const handleFilterChange = (key: keyof RecipeFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      ingredients: [],
      categories: [],
      dietary: [],
      difficulty: [],
      cuisine: [],
      estimatedCost: [],
      season: [],
      occasion: [],
      equipment: [],
      dishTypes: [],
      cookingMethods: [],
      cookingTime: [0, 180],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    onOpenChange(false);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Recipe Filters
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label>Ingredients</Label>
              <MultiSelect
                options={allIngredients}
                selected={filters.ingredients}
                onChange={(value) => handleFilterChange("ingredients", value)}
                placeholder="Select ingredients..."
              />
            </div>

            <div>
              <Label>Categories</Label>
              <MultiSelect
                options={RECIPE_CATEGORIES}
                selected={filters.categories}
                onChange={(value) => handleFilterChange("categories", value)}
                placeholder="Select categories..."
              />
            </div>

            <div>
              <Label>Dietary Requirements</Label>
              <MultiSelect
                options={DIETARY_OPTIONS}
                selected={filters.dietary}
                onChange={(value) => handleFilterChange("dietary", value)}
                placeholder="Select dietary requirements..."
              />
            </div>

            <div>
              <Label>Difficulty Level</Label>
              <MultiSelect
                options={DIFFICULTY_LEVELS}
                selected={filters.difficulty}
                onChange={(value) => handleFilterChange("difficulty", value)}
                placeholder="Select difficulty..."
              />
            </div>

            <div>
              <Label>Cuisine</Label>
              <MultiSelect
                options={CUISINES}
                selected={filters.cuisine}
                onChange={(value) => handleFilterChange("cuisine", value)}
                placeholder="Select cuisine..."
              />
            </div>

            <div>
              <Label>Estimated Cost</Label>
              <MultiSelect
                options={COST_CATEGORIES}
                selected={filters.estimatedCost}
                onChange={(value) => handleFilterChange("estimatedCost", value)}
                placeholder="Select cost range..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Season</Label>
              <MultiSelect
                options={SEASONS}
                selected={filters.season}
                onChange={(value) => handleFilterChange("season", value)}
                placeholder="Select season..."
              />
            </div>

            <div>
              <Label>Occasion</Label>
              <MultiSelect
                options={OCCASIONS}
                selected={filters.occasion}
                onChange={(value) => handleFilterChange("occasion", value)}
                placeholder="Select occasion..."
              />
            </div>

            <div>
              <Label>Required Equipment</Label>
              <MultiSelect
                options={COOKING_EQUIPMENT}
                selected={filters.equipment}
                onChange={(value) => handleFilterChange("equipment", value)}
                placeholder="Select equipment..."
              />
            </div>

            <div>
              <Label>Dish Type</Label>
              <MultiSelect
                options={DISH_TYPES}
                selected={filters.dishTypes}
                onChange={(value) => handleFilterChange("dishTypes", value)}
                placeholder="Select dish types..."
              />
            </div>

            <div>
              <Label>Cooking Methods</Label>
              <MultiSelect
                options={COOKING_METHODS}
                selected={filters.cookingMethods}
                onChange={(value) => handleFilterChange("cookingMethods", value)}
                placeholder="Select cooking methods..."
              />
            </div>

            <div className="space-y-2">
              <Label>Cooking Time (minutes)</Label>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 180]}
                  max={180}
                  step={5}
                  value={filters.cookingTime}
                  onValueChange={(value) => handleFilterChange("cookingTime", value)}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{filters.cookingTime[0]} mins</span>
                  <span>{filters.cookingTime[1]} mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
