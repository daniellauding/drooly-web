import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { CookingMethodsSlider } from "./CookingMethodsSlider";

interface BentoGridHeaderProps {
  onMethodSelect: (method: string | null) => void;
  selectedMethod: string | null;
  onShowFilters: () => void;
}

export function BentoGridHeader({ onMethodSelect, selectedMethod, onShowFilters }: BentoGridHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4 px-6">
      <CookingMethodsSlider 
        onMethodSelect={onMethodSelect}
        selectedMethod={selectedMethod}
      />
      <Button 
        variant="outline" 
        onClick={onShowFilters}
        className="ml-4"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
    </div>
  );
}