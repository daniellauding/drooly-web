import { Clock, ChefHat, Globe } from "lucide-react";

interface RecipeMetadataProps {
  chef: string;
  date: string;
  cookTime: string;
  cuisine?: string;
}

export function RecipeMetadata({ chef, date, cookTime, cuisine }: RecipeMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-white">
      <div className="flex items-center gap-2">
        <ChefHat className="w-4 h-4" />
        <span>{chef}</span>
      </div>
      <span>•</span>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>{cookTime}</span>
      </div>
      {cuisine && (
        <>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="capitalize">{cuisine}</span>
          </div>
        </>
      )}
      <span>•</span>
      <span>{date}</span>
    </div>
  );
}