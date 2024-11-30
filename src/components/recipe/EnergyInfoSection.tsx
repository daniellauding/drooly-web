import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface EnergyInfo {
  calories: number;
  kilojoules: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
}

interface EnergyInfoProps {
  energyInfo?: Partial<EnergyInfo>;
  onChange: (updates: Partial<EnergyInfo>) => void;
}

const defaultEnergyInfo: EnergyInfo = {
  calories: 0,
  kilojoules: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
  fiber: 0,
};

export function EnergyInfoSection({ energyInfo = {}, onChange }: EnergyInfoProps) {
  // Merge default values with provided energyInfo
  const currentValues = { ...defaultEnergyInfo, ...energyInfo };

  const handleChange = (field: keyof EnergyInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    onChange({ [field]: value });
  };

  const renderField = (field: keyof EnergyInfo, label: string, tooltip: string) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={field}>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        id={field}
        type="number"
        value={currentValues[field]}
        onChange={handleChange(field)}
        min="0"
        step="0.1"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {renderField("calories", "Calories", "Energy content in kilocalories (kcal)")}
        {renderField("kilojoules", "Kilojoules", "Energy content in kilojoules (kJ)")}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {renderField("protein", "Protein (g)", "4 kcal per gram of protein")}
        {renderField("carbohydrates", "Carbohydrates (g)", "4 kcal per gram of carbohydrates")}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {renderField("fat", "Fat (g)", "9 kcal per gram of fat")}
        {renderField("fiber", "Fiber (g)", "2 kcal per gram of fiber")}
      </div>
    </div>
  );
}