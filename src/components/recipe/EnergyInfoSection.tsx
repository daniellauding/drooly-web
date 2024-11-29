import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface EnergyInfoProps {
  value: {
    calories?: number;
    kilojoules?: number;
    proteinGrams?: number;
    carbsGrams?: number;
    fatGrams?: number;
    fiberGrams?: number;
  };
  onChange: (updates: Partial<EnergyInfoProps['value']>) => void;
}

const ENERGY_TOOLTIPS = {
  calories: "Energy content in kilocalories (kcal)",
  kilojoules: "Energy content in kilojoules (kJ). 1 kcal = 4.184 kJ",
  protein: "Protein content contributes ~4 kcal/g to total energy",
  carbs: "Carbohydrates contribute ~4 kcal/g to total energy",
  fat: "Fat contributes ~9 kcal/g to total energy",
  fiber: "Dietary fiber contributes ~2 kcal/g to total energy"
};

export function EnergyInfoSection({ value, onChange }: EnergyInfoProps) {
  const handleCalorieChange = (calories: string) => {
    const cal = parseFloat(calories);
    onChange({
      calories: cal,
      kilojoules: cal * 4.184
    });
  };

  const handleKilojouleChange = (kilojoules: string) => {
    const kj = parseFloat(kilojoules);
    onChange({
      kilojoules: kj,
      calories: kj / 4.184
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Energy & Nutritional Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="calories">Calories (kcal)</Label>
            <Tooltip content={ENERGY_TOOLTIPS.calories}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </div>
          <Input
            id="calories"
            type="number"
            value={value.calories || ""}
            onChange={(e) => handleCalorieChange(e.target.value)}
            placeholder="e.g., 250"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="kilojoules">Kilojoules (kJ)</Label>
            <Tooltip content={ENERGY_TOOLTIPS.kilojoules}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </div>
          <Input
            id="kilojoules"
            type="number"
            value={value.kilojoules || ""}
            onChange={(e) => handleKilojouleChange(e.target.value)}
            placeholder="e.g., 1046"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="protein">Protein (g)</Label>
            <Tooltip content={ENERGY_TOOLTIPS.protein}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </div>
          <Input
            id="protein"
            type="number"
            value={value.proteinGrams || ""}
            onChange={(e) => onChange({ proteinGrams: parseFloat(e.target.value) })}
            placeholder="e.g., 15"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="carbs">Carbohydrates (g)</Label>
            <Tooltip content={ENERGY_TOOLTIPS.carbs}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </div>
          <Input
            id="carbs"
            type="number"
            value={value.carbsGrams || ""}
            onChange={(e) => onChange({ carbsGrams: parseFloat(e.target.value) })}
            placeholder="e.g., 30"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="fat">Fat (g)</Label>
            <Tooltip content={ENERGY_TOOLTIPS.fat}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </div>
          <Input
            id="fat"
            type="number"
            value={value.fatGrams || ""}
            onChange={(e) => onChange({ fatGrams: parseFloat(e.target.value) })}
            placeholder="e.g., 10"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="fiber">Dietary Fiber (g)</Label>
            <Tooltip content={ENERGY_TOOLTIPS.fiber}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </div>
          <Input
            id="fiber"
            type="number"
            value={value.fiberGrams || ""}
            onChange={(e) => onChange({ fiberGrams: parseFloat(e.target.value) })}
            placeholder="e.g., 5"
          />
        </div>
      </div>
    </div>
  );
}