import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/MultiSelect";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Dairy Free",
  "Contains Nuts"
];

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
  // Convert boolean object to array of selected options
  const selectedOptions = Object.entries(value || {})
    .filter(([_, isSelected]) => isSelected)
    .map(([key, _]) => {
      switch(key) {
        case 'isVegetarian': return 'Vegetarian';
        case 'isVegan': return 'Vegan';
        case 'isGlutenFree': return 'Gluten Free';
        case 'isDairyFree': return 'Dairy Free';
        case 'containsNuts': return 'Contains Nuts';
        default: return '';
      }
    })
    .filter(Boolean);

  const handleChange = (selected: string[]) => {
    onChange({
      isVegetarian: selected.includes('Vegetarian'),
      isVegan: selected.includes('Vegan'),
      isGlutenFree: selected.includes('Gluten Free'),
      isDairyFree: selected.includes('Dairy Free'),
      containsNuts: selected.includes('Contains Nuts')
    });
  };

  return (
    <div className="space-y-2">
      <Label>Dietary Information</Label>
      <MultiSelect
        options={DIETARY_OPTIONS}
        selected={selectedOptions}
        onChange={handleChange}
        placeholder="Select dietary information"
      />
    </div>
  );
}