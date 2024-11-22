import { UtensilsCrossed } from "lucide-react";

interface Dish {
  name: string;
  assignedTo: string;
  ingredients: string[];
}

interface EventMenuProps {
  dishes: Dish[];
}

export function EventMenu({ dishes }: EventMenuProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
        <UtensilsCrossed className="h-4 w-4" />
        Menu & Responsibilities
      </h4>
      <div className="space-y-2">
        {dishes.map((dish) => (
          <div key={dish.name} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{dish.name}</span>
              <span className="text-gray-500">by {dish.assignedTo}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Ingredients: {dish.ingredients.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}