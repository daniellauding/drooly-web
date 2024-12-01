import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown } from "lucide-react";
import { IngredientItem } from "@/components/shopping/types";
import { useState } from "react";
import { CustomIngredientAdd } from "../shopping/CustomIngredientAdd";

interface RecipeAccordionItemProps {
  recipeId: string;
  recipeTitle: string;
  ingredients: IngredientItem[];
  checkedItems: Set<string>;
  onCheck: (ingredient: IngredientItem) => void;
  onCheckAll: (ingredients: IngredientItem[]) => void;
  onRemove: (ingredient: IngredientItem) => void;
  onGroupNameChange?: (oldName: string, newName: string) => void;
}

export function RecipeAccordionItem({
  recipeId,
  recipeTitle,
  ingredients,
  checkedItems,
  onCheck,
  onCheckAll,
  onRemove,
  onGroupNameChange
}: RecipeAccordionItemProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(recipeTitle);
  const [showCustomIngredient, setShowCustomIngredient] = useState(false);

  const progress = {
    total: ingredients.length,
    checked: ingredients.filter(ing => checkedItems.has(`${ing.recipeId}-${ing.name}`)).length,
    percentage: ingredients.length > 0 
      ? (ingredients.filter(ing => checkedItems.has(`${ing.recipeId}-${ing.name}`)).length / ingredients.length) * 100
      : 0
  };

  const handleTitleClick = () => {
    if (onGroupNameChange) {
      setIsEditingTitle(true);
    }
  };

  const handleTitleSave = () => {
    if (onGroupNameChange && editedTitle !== recipeTitle) {
      onGroupNameChange(recipeTitle, editedTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCustomIngredientAdd = (name: string, amount: string, unit: string, recurrence?: "none" | "weekly" | "monthly") => {
    const newIngredient: IngredientItem = {
      name,
      amount,
      unit,
      recipeId,
      recipeTitle,
      bought: false,
      recurrence
    };
    onCheck(newIngredient);
    setShowCustomIngredient(false);
  };

  return (
    <AccordionItem value={recipeId} className="border rounded-lg p-2">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={ingredients.every(ing => checkedItems.has(`${ing.recipeId}-${ing.name}`))}
                onCheckedChange={() => onCheckAll(ingredients)}
              />
              {isEditingTitle ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                  className="max-w-[200px]"
                  autoFocus
                />
              ) : (
                <span 
                  className="font-medium cursor-pointer hover:underline" 
                  onClick={handleTitleClick}
                >
                  {recipeTitle}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </div>
          <div className="w-full space-y-1">
            <Progress value={progress.percentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {progress.checked} of {progress.total} ingredients checked
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onCheckAll(ingredients)}
          >
            <Check className="mr-2 h-4 w-4" />
            {ingredients.every(ing => checkedItems.has(`${ing.recipeId}-${ing.name}`))
              ? "Uncheck All"
              : "Check All"}
          </Button>
          
          {ingredients.map((ingredient, idx) => (
            <div key={`${ingredient.recipeId}-${ingredient.name}-${idx}`}>
              <div className="flex items-center gap-4 py-2">
                <Checkbox
                  checked={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`)}
                  onCheckedChange={() => onCheck(ingredient)}
                />
                <span className={checkedItems.has(`${ingredient.recipeId}-${ingredient.name}`) ? "line-through text-muted-foreground" : ""}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => onRemove(ingredient)}
                >
                  Remove
                </Button>
              </div>
              {idx < ingredients.length - 1 && <Separator />}
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => setShowCustomIngredient(true)}
          >
            Add Custom Ingredient
          </Button>

          {showCustomIngredient && (
            <div className="mt-4">
              <CustomIngredientAdd onAdd={handleCustomIngredientAdd} />
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}