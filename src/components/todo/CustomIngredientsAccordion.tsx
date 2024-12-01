import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { IngredientItem } from "@/components/shopping/types";

interface CustomIngredientsAccordionProps {
  ingredients: IngredientItem[];
  checkedItems: Set<string>;
  onCheck: (ingredient: IngredientItem) => void;
  onCheckAll: (ingredients: IngredientItem[]) => void;
}

export function CustomIngredientsAccordion({
  ingredients,
  checkedItems,
  onCheck,
  onCheckAll
}: CustomIngredientsAccordionProps) {
  const allChecked = ingredients.every(ing => 
    checkedItems.has(`${ing.recipeId}-${ing.name}`)
  );

  const handleGroupCheck = () => {
    onCheckAll(ingredients);
  };

  return (
    <AccordionItem value="custom" className="border rounded-lg">
      <AccordionTrigger className="px-4 py-2 hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={handleGroupCheck}
              onClick={(e) => e.stopPropagation()}
            />
            <span>Custom Items</span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        {ingredients.map((ingredient, idx) => (
          <div key={`custom-${ingredient.name}-${idx}`}>
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