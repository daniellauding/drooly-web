import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/MultiSelect";
import { RECIPE_CATEGORIES } from "@/types/recipe";

interface RecipeCategoriesProps {
  categories: string[];
  onChange: (categories: string[]) => void;
}

export function RecipeCategories({ categories, onChange }: RecipeCategoriesProps) {
  return (
    <div className="space-y-2">
      <Label>Categories</Label>
      <MultiSelect
        options={RECIPE_CATEGORIES}
        selected={categories}
        onChange={onChange}
        placeholder="Select categories"
      />
    </div>
  );
}