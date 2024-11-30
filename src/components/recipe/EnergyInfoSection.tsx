import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EnergyInfo {
  calories: number;
  kilojoules: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
}

interface EnergyInfoSectionProps {
  energyInfo: Partial<EnergyInfo>;
  onChange: (energyInfo: EnergyInfo) => void;
}

export function EnergyInfoSection({ energyInfo, onChange }: EnergyInfoSectionProps) {
  const defaultValues: EnergyInfo = {
    calories: 0,
    kilojoules: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    ...energyInfo
  };

  const handleChange = (field: keyof EnergyInfo, value: string) => {
    onChange({
      ...defaultValues,
      [field]: parseFloat(value) || 0
    });
  };

  return (
    <div className="space-y-4">
      <Label>Energy Information</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Calories</Label>
          <Input
            type="number"
            value={defaultValues.calories}
            onChange={(e) => handleChange("calories", e.target.value)}
          />
        </div>
        <div>
          <Label>Kilojoules</Label>
          <Input
            type="number"
            value={defaultValues.kilojoules}
            onChange={(e) => handleChange("kilojoules", e.target.value)}
          />
        </div>
        <div>
          <Label>Protein (g)</Label>
          <Input
            type="number"
            value={defaultValues.protein}
            onChange={(e) => handleChange("protein", e.target.value)}
          />
        </div>
        <div>
          <Label>Carbohydrates (g)</Label>
          <Input
            type="number"
            value={defaultValues.carbohydrates}
            onChange={(e) => handleChange("carbohydrates", e.target.value)}
          />
        </div>
        <div>
          <Label>Fat (g)</Label>
          <Input
            type="number"
            value={defaultValues.fat}
            onChange={(e) => handleChange("fat", e.target.value)}
          />
        </div>
        <div>
          <Label>Fiber (g)</Label>
          <Input
            type="number"
            value={defaultValues.fiber}
            onChange={(e) => handleChange("fiber", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}