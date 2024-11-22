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
    <Card className="overflow-hidden bg-black/30 backdrop-blur-lg border-2 border-purple-500/50 rounded-[2rem] transition-all duration-500 hover:scale-105 hover:rotate-3 group">
      <div className="relative">
        <img src={image} alt={title} className="h-48 w-full object-cover transition-all duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <button 
          className="absolute top-3 right-3 h-12 w-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <Heart className={`h-6 w-6 ${isFavorite ? "fill-pink-500 text-pink-500" : "text-white"}`} />
        </button>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          {title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1">
            <ChefHat className="h-4 w-4" />
            <span>{difficulty}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}