import { Button } from "@/components/ui/button";
import { ShareShoppingList } from "./ShareShoppingList";

interface ShoppingListHeaderProps {
  checkedItemsCount: number;
  onClearAll: () => void;
  onMarkAllBought: () => void;
  userId: string;
  listId: string;
}

export function ShoppingListHeader({ 
  checkedItemsCount, 
  onClearAll, 
  onMarkAllBought,
  userId,
  listId
}: ShoppingListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Shopping List</h1>
      <div className="space-x-2">
        <ShareShoppingList userId={userId} listId={listId} />
        <Button variant="outline" onClick={onMarkAllBought}>
          Mark All as Bought
        </Button>
        {checkedItemsCount > 0 && (
          <Button variant="outline" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}