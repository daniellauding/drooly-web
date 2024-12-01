import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AdvancedIngredientSection } from "./ingredients/AdvancedIngredientSection";
import { IngredientGroupSection } from "./ingredients/IngredientGroupSection";
import { IngredientSearchBar } from "./ingredients/IngredientSearchBar";
import { Ingredient } from "@/services/recipeService";

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

const DEFAULT_UNIT = "piece";
const DEFAULT_AMOUNT = "1";

export function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addIngredient = (name = "", group = "Main Ingredients") => {
    onChange([
      ...ingredients,
      { 
        name, 
        amount: DEFAULT_AMOUNT, 
        unit: DEFAULT_UNIT, 
        group 
      }
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

  const removeGroup = (groupToRemove: string) => {
    onChange(ingredients.filter(ing => ing.group !== groupToRemove));
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

      <IngredientSearchBar onIngredientAdd={addIngredient} />

      {Object.entries(groupedIngredients).map(([group, groupIngredients]) => (
        <IngredientGroupSection
          key={group}
          group={group}
          ingredients={groupIngredients}
          onUpdateIngredient={(index, updates) => {
            const globalIndex = ingredients.findIndex(ing => ing === groupIngredients[index]);
            updateIngredient(globalIndex, updates);
          }}
          onRemoveIngredient={(index) => {
            const globalIndex = ingredients.findIndex(ing => ing === groupIngredients[index]);
            removeIngredient(globalIndex);
          }}
          onAddIngredient={addIngredient}
        />
      ))}

      <Collapsible open={showAdvanced}>
        <CollapsibleContent>
          <AdvancedIngredientSection 
            onAddIngredient={addIngredient}
            onRemoveGroup={removeGroup}
            groups={INGREDIENT_GROUPS}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}