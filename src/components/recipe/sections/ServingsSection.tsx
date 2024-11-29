import { Recipe } from "@/types/recipe";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SERVING_UNITS = ["serving", "piece", "portion"];

interface ServingsSectionProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export function ServingsSection({ recipe, onChange }: ServingsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Servings Amount</Label>
        <Input
          type="number"
          min="1"
          value={recipe.servings.amount}
          onChange={(e) => onChange({
            servings: { ...recipe.servings, amount: parseInt(e.target.value) }
          })}
        />
      </div>
      <div>
        <Label>Serving Unit</Label>
        <Select
          value={recipe.servings.unit}
          onValueChange={(value) => onChange({
            servings: { ...recipe.servings, unit: value }
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            {SERVING_UNITS.map(unit => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}