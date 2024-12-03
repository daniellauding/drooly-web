import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ShoppingListItemProps {
  ingredient: {
    name: string;
    amount: string;
    unit: string;
    recipeId: string;
    recipeTitle: string;
    recurrence?: "none" | "weekly" | "monthly";
  };
  isChecked: boolean;
  onCheck: () => void;
  onRemove: () => void;
}

export function ShoppingListItem({ 
  ingredient, 
  isChecked, 
  onCheck,
  onRemove 
}: ShoppingListItemProps) {
  return (
    <>
      <div className="flex items-center gap-4 py-2">
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheck}
        />
        <div className="flex-1">
          <span className={isChecked ? "line-through text-muted-foreground" : ""}>
            {ingredient.amount} {ingredient.unit} {ingredient.name}
          </span>
          {ingredient.recurrence && ingredient.recurrence !== "none" && (
            <Badge variant="secondary" className="ml-2">
              <Clock className="w-3 h-3 mr-1" />
              {ingredient.recurrence}
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {ingredient.recipeTitle}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
    </>
  );
}