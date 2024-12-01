import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { IngredientItem } from "@/components/shopping/types";

interface RecipeAccordionItemProps {
  recipeId: string;
  recipeTitle: string;
  ingredients: IngredientItem[];
  checkedItems: Set<string>;
  onCheck: (ingredient: IngredientItem) => void;
  onCheckAll: (ingredients: IngredientItem[]) => void;
}

export function RecipeAccordionItem({
  recipeId,
  recipeTitle,
  ingredients,
  checkedItems,
  onCheck,
  onCheckAll
}: RecipeAccordionItemProps) {
  const allChecked = ingredients.every(ing => 
    checkedItems.has(`${ing.recipeId}-${ing.name}`)
  );

  const handleGroupCheck = () => {
    onCheckAll(ingredients);
  };

  return (
    <AccordionItem value={recipeId} className="border rounded-lg">
      <AccordionTrigger className="px-4 py-2 hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={handleGroupCheck}
              onClick={(e) => e.stopPropagation()}
            />
            <span>{recipeTitle}</span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
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
            </div>
            {idx < ingredients.length - 1 && <Separator />}
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}