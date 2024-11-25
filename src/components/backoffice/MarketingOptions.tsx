import { Checkbox } from "@/components/ui/checkbox";

interface MarketingOptionsProps {
  options: {
    popularRecipes: boolean;
    topCreators: boolean;
  };
  onChange: (options: { popularRecipes: boolean; topCreators: boolean }) => void;
}

export function MarketingOptions({ options, onChange }: MarketingOptionsProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Marketing Content</label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="popularRecipes"
            checked={options.popularRecipes}
            onCheckedChange={(checked) => 
              onChange({ ...options, popularRecipes: checked as boolean })
            }
          />
          <label htmlFor="popularRecipes">Include popular recipes</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="topCreators"
            checked={options.topCreators}
            onCheckedChange={(checked) => 
              onChange({ ...options, topCreators: checked as boolean })
            }
          />
          <label htmlFor="topCreators">Include top creators</label>
        </div>
      </div>
    </div>
  );
}