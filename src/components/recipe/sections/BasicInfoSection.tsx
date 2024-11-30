import { Recipe } from "@/types/recipe";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DIFFICULTY_OPTIONS, CUISINES } from "@/types/recipe";

interface BasicInfoSectionProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export function BasicInfoSection({ recipe, onChange }: BasicInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select
          value={recipe.difficulty}
          onValueChange={(value) => onChange({ difficulty: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_OPTIONS.map(option => (
              <SelectItem key={option.toLowerCase()} value={option.toLowerCase()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="cuisine">Cuisine</Label>
        <Select
          value={recipe.cuisine}
          onValueChange={(value) => onChange({ cuisine: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cuisine" />
          </SelectTrigger>
          <SelectContent>
            {CUISINES.map(cuisine => (
              <SelectItem key={cuisine.toLowerCase()} value={cuisine.toLowerCase()}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}