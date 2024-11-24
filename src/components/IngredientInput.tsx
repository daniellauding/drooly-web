import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IngredientSuggestions } from "./ingredients/IngredientSuggestions";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  group?: string;
}

interface IngredientInputProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

const INGREDIENT_GROUPS = [
  "Main Ingredients",
  "Sauce",
  "Marinade",
  "Salad Dressing",
  "Garnish",
  "Seasoning"
];

const COMMON_UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "cup",
  "tbsp",
  "tsp",
  "piece",
  "to taste"
];

export function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addIngredient = (name = "", group = "Main Ingredients") => {
    onChange([
      ...ingredients,
      { name, amount: "", unit: "", group }
    ]);
  };

  const updateIngredient = (index: number, updates: Partial<Ingredient>) => {
    const newIngredients = ingredients.map((ing, i) =>
      i === index ? { ...ing, ...updates } : ing
    );
    onChange(newIngredients);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const groupedIngredients = ingredients.reduce((acc, ing) => {
    const group = ing.group || "Main Ingredients";
    if (!acc[group]) acc[group] = [];
    acc[group].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Ingredients</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <IngredientSuggestions 
        onSelect={(ingredientName) => addIngredient(ingredientName)}
      />
      
      {Object.entries(groupedIngredients).map(([group, groupIngredients]) => (
        <div key={group} className="space-y-2">
          <h4 className="font-medium text-sm">{group}</h4>
          {groupIngredients.map((ingredient, index) => {
            const globalIndex = ingredients.findIndex(ing => ing === ingredient);
            return (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(globalIndex, { name: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(globalIndex, { amount: e.target.value })}
                  className="w-24"
                />
                <Select
                  value={ingredient.unit}
                  onValueChange={(value) => updateIngredient(globalIndex, { unit: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(globalIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addIngredient("", group)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient to {group}
          </Button>
        </div>
      ))}

      <Collapsible open={showAdvanced}>
        <CollapsibleContent>
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium">Custom Ingredient Groups</h3>
            <Select
              value=""
              onValueChange={(value) => addIngredient("", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Add new ingredient group" />
              </SelectTrigger>
              <SelectContent>
                {INGREDIENT_GROUPS.map(group => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}