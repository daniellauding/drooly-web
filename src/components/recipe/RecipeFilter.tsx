import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CUISINES, COOKING_EQUIPMENT } from "@/types/recipe";

interface RecipeFilterProps {
  onFilterChange: (filters: RecipeFilters) => void;
}

interface RecipeFilters {
  cookingTime: number[];
  difficulty: string;
  cuisine: string[];
  equipment: string[];
  dietary: string[];
}

export function RecipeFilter({ onFilterChange }: RecipeFilterProps) {
  const [filters, setFilters] = React.useState<RecipeFilters>({
    cookingTime: [0, 180],
    difficulty: "",
    cuisine: [],
    equipment: [],
    dietary: [],
  });

  const handleTimeChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, cookingTime: value }));
    onFilterChange({ ...filters, cookingTime: value });
  };

  const handleDifficultyChange = (value: string) => {
    setFilters((prev) => ({ ...prev, difficulty: value }));
    onFilterChange({ ...filters, difficulty: value });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            Filters
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Cooking Time */}
          <div className="space-y-4">
            <h3 className="font-semibold">Cooking Time</h3>
            <div className="px-2">
              <Slider
                defaultValue={[0, 180]}
                max={180}
                step={5}
                value={filters.cookingTime}
                onValueChange={handleTimeChange}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{filters.cookingTime[0]} mins</span>
                <span>{filters.cookingTime[1]} mins</span>
              </div>
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-4">
            <h3 className="font-semibold">Difficulty Level</h3>
            <ToggleGroup
              type="single"
              value={filters.difficulty}
              onValueChange={handleDifficultyChange}
              className="flex flex-wrap gap-2"
            >
              {["Easy", "Medium", "Advanced"].map((level) => (
                <ToggleGroupItem
                  key={level}
                  value={level.toLowerCase()}
                  className="rounded-full"
                >
                  {level}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Cuisine Type */}
          <div className="space-y-4">
            <h3 className="font-semibold">Cuisine</h3>
            <div className="grid grid-cols-2 gap-2">
              {CUISINES.slice(0, 8).map((cuisine) => (
                <Button
                  key={cuisine}
                  variant={filters.cuisine.includes(cuisine) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    const newCuisines = filters.cuisine.includes(cuisine)
                      ? filters.cuisine.filter((c) => c !== cuisine)
                      : [...filters.cuisine, cuisine];
                    setFilters((prev) => ({ ...prev, cuisine: newCuisines }));
                    onFilterChange({ ...filters, cuisine: newCuisines });
                  }}
                >
                  {cuisine}
                </Button>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-4">
            <h3 className="font-semibold">Equipment Needed</h3>
            <div className="grid grid-cols-2 gap-2">
              {COOKING_EQUIPMENT.slice(0, 6).map((equipment) => (
                <Button
                  key={equipment}
                  variant={filters.equipment.includes(equipment) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    const newEquipment = filters.equipment.includes(equipment)
                      ? filters.equipment.filter((e) => e !== equipment)
                      : [...filters.equipment, equipment];
                    setFilters((prev) => ({ ...prev, equipment: newEquipment }));
                    onFilterChange({ ...filters, equipment: newEquipment });
                  }}
                >
                  {equipment}
                </Button>
              ))}
            </div>
          </div>

          {/* Dietary Requirements */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dietary Requirements</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"].map((diet) => (
                <Button
                  key={diet}
                  variant={filters.dietary.includes(diet) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    const newDietary = filters.dietary.includes(diet)
                      ? filters.dietary.filter((d) => d !== diet)
                      : [...filters.dietary, diet];
                    setFilters((prev) => ({ ...prev, dietary: newDietary }));
                    onFilterChange({ ...filters, dietary: newDietary });
                  }}
                >
                  {diet}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const resetFilters = {
                  cookingTime: [0, 180],
                  difficulty: "",
                  cuisine: [],
                  equipment: [],
                  dietary: [],
                };
                setFilters(resetFilters);
                onFilterChange(resetFilters);
              }}
            >
              Clear
            </Button>
            <Button className="flex-1">
              See recipes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}