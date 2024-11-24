import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedIngredientSectionProps {
  onAddIngredient: (name: string, group: string) => void;
  groups: string[];
}

export function AdvancedIngredientSection({ onAddIngredient, groups }: AdvancedIngredientSectionProps) {
  return (
    <div className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-medium text-sm">Custom Ingredient Groups</h3>
      
      <Select
        value=""
        onValueChange={(group) => onAddIngredient("", group)}
      >
        <SelectTrigger className="h-10">
          <SelectValue placeholder="Select ingredient group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map(group => (
            <SelectItem key={group} value={group}>
              {group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}