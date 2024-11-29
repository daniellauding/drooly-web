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
  energyInfo: Partial<EnergyInfo>;
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

export function EnergyInfoSection({ energyInfo, onChange }: EnergyInfoProps) {
  const currentValues = { ...defaultEnergyInfo, ...energyInfo };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="calories">Calories</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Energy content in kilocalories (kcal)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="calories"
            type="number"
            value={currentValues.calories}
            onChange={(e) => onChange({ calories: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="kilojoules">Kilojoules</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Energy content in kilojoules (kJ)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="kilojoules"
            type="number"
            value={currentValues.kilojoules}
            onChange={(e) => onChange({ kilojoules: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="protein">Protein (g)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>4 kcal per gram of protein</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="protein"
            type="number"
            value={currentValues.protein}
            onChange={(e) => onChange({ protein: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="carbohydrates">Carbohydrates (g)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>4 kcal per gram of carbohydrates</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="carbohydrates"
            type="number"
            value={currentValues.carbohydrates}
            onChange={(e) => onChange({ carbohydrates: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="fat">Fat (g)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>9 kcal per gram of fat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="fat"
            type="number"
            value={currentValues.fat}
            onChange={(e) => onChange({ fat: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="fiber">Fiber (g)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>2 kcal per gram of fiber</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="fiber"
            type="number"
            value={currentValues.fiber}
            onChange={(e) => onChange({ fiber: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}