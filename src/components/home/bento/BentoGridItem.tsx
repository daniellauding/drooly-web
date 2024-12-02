import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Recipe } from "@/services/recipeService";
import { BentoGridRecipeItem } from "./BentoGridRecipeItem";

interface BentoBoxProps {
  box: {
    title?: string;
    description?: string;
    icon?: any;
    color?: string;
    hoverColor?: string;
    textColor?: string;
    action?: string;
    isSpecial?: boolean;
    type?: string;
  } | Recipe;
  onClick?: () => void;
}

export function BentoGridItem({ box, onClick }: BentoBoxProps) {
  console.log('BentoGridItem rendering with box:', box);
  
  // Handle recipe items
  if ('id' in box) {
    console.log('Rendering recipe item:', box.title);
    return (
      <BentoGridRecipeItem
        item={box}
        index={0}
        onRecipeClick={() => onClick?.()}
      />
    );
  }

  // Handle special cases
  if (box.isSpecial) {
    console.log('Rendering special box type:', box.type);
    return null; // For now, return null for special cases
  }

  // If box doesn't have required properties, log warning and return null
  if (!box.title || !box.description || !box.icon) {
    console.warn('Box missing required properties:', box);
    return null;
  }

  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all duration-200",
        box.color,
        box.hoverColor
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {box.icon && <box.icon className={cn("w-8 h-8", box.textColor)} />}
        <div>
          <h3 className={cn("font-semibold mb-2", box.textColor)}>
            {box.title}
          </h3>
          <p className={cn("text-sm", box.textColor)}>
            {box.description}
          </p>
        </div>
      </div>
    </Card>
  );
}