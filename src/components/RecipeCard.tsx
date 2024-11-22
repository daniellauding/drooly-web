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
    <Card className="recipe-card overflow-hidden group relative">
      <div className="relative">
        <img src={image} alt={title} className="h-48 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <button className="absolute top-2 right-2 rounded-xl bg-white/80 p-2 backdrop-blur-sm hover:bg-white transition-colors">
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-lg">
            <ChefHat className="h-4 w-4" />
            <span>{difficulty}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}