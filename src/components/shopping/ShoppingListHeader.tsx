import { Button } from "@/components/ui/button";

interface ShoppingListHeaderProps {
  checkedItemsCount: number;
  onClearAll: () => void;
  onMarkAllBought: () => void;
}

export function ShoppingListHeader({ checkedItemsCount, onClearAll, onMarkAllBought }: ShoppingListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Shopping List</h1>
      <div className="space-x-2">
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