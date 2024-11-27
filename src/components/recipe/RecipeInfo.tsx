import { Clock, ChefHat } from "lucide-react";

interface RecipeInfoProps {
  title: string;
  chef?: string;
  date?: string;
  cookTime?: string;
  difficulty: string;
}

export function RecipeInfo({ 
  title, 
  chef, 
  date, 
  cookTime, 
  difficulty 
}: RecipeInfoProps) {
  return (
    <div className="p-5">
      <h3 className="font-semibold text-lg mb-3 text-[#2C3E50]">{title}</h3>
      {(chef || date) && (
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          {chef && <span>{chef}</span>}
          {chef && date && <span>•</span>}
          {date && <span className="text-gray-500">{date}</span>}
        </div>
      )}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        {cookTime && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{cookTime}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <ChefHat className="h-4 w-4" />
          <span>{difficulty}</span>
        </div>
      </div>
    </div>
  );
}