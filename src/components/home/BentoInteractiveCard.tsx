import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { IngredientSearchModal } from "../ingredients/IngredientSearchModal";
import { Recipe } from "@/types/recipe";

interface BentoInteractiveCardProps {
  item: {
    title: string;
    description: string;
    icon: LucideIcon;
    action: () => void;
    color: string;
    textColor: string;
  };
  onRecipesFound?: (recipes: Recipe[]) => void;
}

export function BentoInteractiveCard({ item, onRecipesFound }: BentoInteractiveCardProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleClick = () => {
    if (item.title === "What's in your kitchen?") {
      setIsSearchOpen(true);
    } else {
      item.action();
    }
  };

  const handleRecipesGenerated = (recipes: Recipe[]) => {
    if (onRecipesFound) {
      onRecipesFound(recipes);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg min-h-[300px]",
          item.color
        )}
        onClick={handleClick}
      >
        <div className="p-8 h-full flex items-center">
          <div className="flex items-center gap-6">
            <div className={cn("p-4 rounded-full bg-white/80", item.textColor)}>
              <item.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className={cn("text-xl font-semibold mb-2", item.textColor)}>
                {item.title}
              </h3>
              <p className="text-gray-600 text-lg">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <IngredientSearchModal
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        onRecipesGenerated={handleRecipesGenerated}
      />
    </>
  );
}