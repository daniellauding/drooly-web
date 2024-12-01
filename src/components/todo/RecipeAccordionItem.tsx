import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronDown } from "lucide-react";
import { IngredientItem } from "@/components/shopping/types";

interface RecipeAccordionItemProps {
  recipeId: string;
  recipeTitle: string;
  ingredients: IngredientItem[];
  checkedItems: Set<string>;
  onCheck: (ingredient: IngredientItem) => void;
  onCheckAll: (ingredients: IngredientItem[]) => void;
  onRemove: (ingredient: IngredientItem) => void;
}

export function RecipeAccordionItem({
  recipeId,
  recipeTitle,
  ingredients,
  checkedItems,
  onCheck,
  onCheckAll,
  onRemove
}: RecipeAccordionItemProps) {
  const progress = {
    total: ingredients.length,
    checked: ingredients.filter(ing => checkedItems.has(`${ing.recipeId}-${ing.name}`)).length,
    percentage: ingredients.length > 0 
      ? (ingredients.filter(ing => checkedItems.has(`${ing.recipeId}-${ing.name}`)).length / ingredients.length) * 100
      : 0
  };

  return (
    <AccordionItem value={recipeId} className="border rounded-lg p-2">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center w-full">
            <span className="font-medium">{recipeTitle}</span>
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
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}