import { Heart, Clock, ChefHat } from "lucide-react";
import { Card } from "./ui/card";

interface RecipeCardProps {
  title: string;
  image: string;
  time: string;
  difficulty: string;
  isFavorite?: boolean;
}

export function RecipeCard({ title, image, time, difficulty, isFavorite = false }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden bg-white border rounded-3xl transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img src={image} alt={title} className="h-48 w-full object-cover" />
        <button 
          className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-[#FF6B6B] text-[#FF6B6B]" : "text-gray-600"}`} />
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-3 text-[#2C3E50]">{title}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="h-4 w-4" />
            <span>{difficulty}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}