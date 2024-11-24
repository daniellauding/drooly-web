import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DietaryInfoProps {
  value: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    containsNuts: boolean;
  };
  onChange: (value: DietaryInfoProps['value']) => void;
}

export function DietaryInfo({ value, onChange }: DietaryInfoProps) {
  const handleChange = (key: keyof DietaryInfoProps['value']) => {
    onChange({
      ...value,
      [key]: !value[key]
    });
  };

  return (
    <div className="space-y-4">
      <Label>Dietary Information</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isVegetarian"
            checked={value.isVegetarian}
            onCheckedChange={() => handleChange('isVegetarian')}
          />
          <label
            htmlFor="isVegetarian"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Vegetarian
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isVegan"
            checked={value.isVegan}
            onCheckedChange={() => handleChange('isVegan')}
          />
          <label
            htmlFor="isVegan"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Vegan
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isGlutenFree"
            checked={value.isGlutenFree}
            onCheckedChange={() => handleChange('isGlutenFree')}
          />
          <label
            htmlFor="isGlutenFree"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Gluten Free
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isDairyFree"
            checked={value.isDairyFree}
            onCheckedChange={() => handleChange('isDairyFree')}
          />
          <label
            htmlFor="isDairyFree"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Dairy Free
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="containsNuts"
            checked={value.containsNuts}
            onCheckedChange={() => handleChange('containsNuts')}
          />
          <label
            htmlFor="containsNuts"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Contains Nuts
          </label>
        </div>
      </div>
    </div>
  );
}