import { Recipe } from "@/types/recipe";
import { DietaryInfo } from "./DietaryInfo";
import { RecipeCategories } from "./RecipeCategories";
import { CookingTimeInput } from "./CookingTimeInput";
import { EnergyInfoSection } from "./EnergyInfoSection";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/MultiSelect";
import { COST_CATEGORIES, SEASONS, OCCASIONS, COOKING_EQUIPMENT } from "@/types/recipe";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { ServingsSection } from "./sections/ServingsSection";

interface RecipeDetailsProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export function RecipeDetails({ recipe, onChange }: RecipeDetailsProps) {
  return (
    <div className="space-y-6">
      <BasicInfoSection recipe={recipe} onChange={onChange} />

      <DietaryInfo 
        value={recipe.dietaryInfo}
        onChange={(dietaryInfo) => onChange({ dietaryInfo })}
      />

      <RecipeCategories
        categories={recipe.categories || []}
        onChange={(categories) => onChange({ categories })}
      />

      <div>
        <Label>Estimated Cost</Label>
        <Select
          value={recipe.estimatedCost}
          onValueChange={(value) => onChange({ estimatedCost: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cost range" />
          </SelectTrigger>
          <SelectContent>
            {COST_CATEGORIES.map(cost => (
              <SelectItem key={cost} value={cost}>
                {cost}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Season</Label>
          <Select
            value={recipe.season}
            onValueChange={(value) => onChange({ season: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {SEASONS.map(season => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Occasion</Label>
          <Select
            value={recipe.occasion}
            onValueChange={(value) => onChange({ occasion: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              {OCCASIONS.map(occasion => (
                <SelectItem key={occasion} value={occasion}>
                  {occasion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Required Equipment</Label>
        <MultiSelect
          options={COOKING_EQUIPMENT}
          selected={recipe.equipment || []}
          onChange={(equipment) => onChange({ equipment })}
          placeholder="Select required equipment"
        />
      </div>

      <ServingsSection recipe={recipe} onChange={onChange} />

      <CookingTimeInput
        value={recipe.totalTime}
        onChange={(time) => onChange({ totalTime: time })}
      />

      <EnergyInfoSection
        energyInfo={recipe.energyInfo || {}}
        onChange={(energyInfo) => onChange({ energyInfo })}
      />
    </div>
  );
}