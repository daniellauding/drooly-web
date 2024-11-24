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
import { AdvancedIngredientSection } from "./ingredients/AdvancedIngredientSection";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null);

  const addIngredient = (name = "", group = "Main Ingredients") => {
    onChange([
      ...ingredients,
      { name, amount: "", unit: "", group }
    ]);
    setShowSuggestions(false);
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
        <Label className="text-sm font-medium">Ingredients</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="h-9"
        >
          Advanced
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <div className="relative">
        <div
          className={`w-full h-10 border rounded-md px-3 flex items-center justify-between cursor-pointer text-sm ${
            !showSuggestions ? 'hover:bg-accent hover:text-accent-foreground' : ''
          }`}
          onClick={() => !showSuggestions && setShowSuggestions(true)}
        >
          <span className="text-muted-foreground">Search or add ingredients...</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
        </div>

        {showSuggestions && (
          <div className="absolute w-full z-50 mt-1">
            <IngredientSuggestions 
              onSelect={(ingredientName) => addIngredient(ingredientName)}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
        )}
      </div>

      {Object.entries(groupedIngredients).map(([group, groupIngredients]) => (
        <div key={group} className="space-y-2">
          <h4 className="font-medium text-sm">{group}</h4>
          {groupIngredients.map((ingredient, index) => {
            const globalIndex = ingredients.findIndex(ing => ing === ingredient);
            return (
              <div key={index} className="flex gap-2">
                <div className="flex-1 relative">
                  <div
                    className={`w-full border rounded-md p-2 flex items-center justify-between cursor-pointer ${editingIngredientIndex !== globalIndex ? 'hover:bg-accent hover:text-accent-foreground' : ''}`}
                    onClick={() => setEditingIngredientIndex(globalIndex)}
                  >
                    <span className={ingredient.name ? 'text-foreground' : 'text-muted-foreground'}>
                      {ingredient.name || 'Search or add ingredient...'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${editingIngredientIndex === globalIndex ? 'rotate-180' : ''}`} />
                  </div>

                  {editingIngredientIndex === globalIndex && (
                    <div className="absolute w-full z-50">
                      <IngredientSuggestions 
                        onSelect={(name) => {
                          updateIngredient(globalIndex, { name });
                          setEditingIngredientIndex(null);
                        }}
                        onClose={() => setEditingIngredientIndex(null)}
                      />
                    </div>
                  )}
                </div>
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
          <AdvancedIngredientSection 
            onAddIngredient={addIngredient}
            groups={INGREDIENT_GROUPS}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
