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

interface EnergyInfoProps {
  energyInfo: {
    calories: number;
    kilojoules: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
  onChange: (updates: Partial<typeof energyInfo>) => void;
}

export function EnergyInfoSection({ energyInfo, onChange }: EnergyInfoProps) {
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
            value={energyInfo.calories}
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
            value={energyInfo.kilojoules}
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
            value={energyInfo.protein}
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
            value={energyInfo.carbohydrates}
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
            value={energyInfo.fat}
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
            value={energyInfo.fiber}
            onChange={(e) => onChange({ fiber: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}