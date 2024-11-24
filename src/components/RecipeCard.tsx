import { Heart, Clock, ChefHat } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  id: string;
  title: string;
  image?: string;
  cookTime?: string;
  difficulty: string;
  isFavorite?: boolean;
  chef?: string;
  date?: string;
}

export function RecipeCard({ 
  id,
  title, 
  image, 
  cookTime, 
  difficulty, 
  isFavorite = false,
  chef,
  date 
}: RecipeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Navigating to recipe:', id);
    navigate(`/recipe/${id}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggle favorite for recipe:', id);
  };

  return (
    <Card 
      className="overflow-hidden bg-white border rounded-3xl transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={image || '/placeholder.svg'} 
          alt={title} 
          className="h-48 w-full object-cover" 
        />
        <button 
          className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          onClick={handleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-[#FF6B6B] text-[#FF6B6B]" : "text-gray-600"}`} />
        </button>
      </div>
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
    </Card>
  );
}