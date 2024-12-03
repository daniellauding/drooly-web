import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, Plus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AdvancedIngredientSection } from "./ingredients/AdvancedIngredientSection";
import { IngredientGroupSection } from "./ingredients/IngredientGroupSection";
import { IngredientFormDialog } from "./ingredients/IngredientFormDialog";
import { Ingredient } from "@/services/recipeService";
import { useTranslation } from "react-i18next";

interface IngredientInputProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

const DEFAULT_UNIT = "piece";
const DEFAULT_AMOUNT = "1";

export function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { t } = useTranslation();

  const addIngredient = (name = "", group = "Main Ingredients") => {
    console.log("Adding ingredient:", { name, group });
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
        <Label className="text-sm font-medium">{t('recipe.ingredients')}</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="h-9"
        >
          {t('common.advanced')}
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAddDialog(true)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Ingredient
      </Button>

      <IngredientFormDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onIngredientAdd={addIngredient}
      />

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
            groups={Object.keys(groupedIngredients)}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}