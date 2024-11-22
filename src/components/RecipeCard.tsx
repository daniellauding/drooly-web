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
    <Card className="recipe-card overflow-hidden">
      <div className="relative">
        <img src={image} alt={title} className="h-48 w-full object-cover" />
        <button className="absolute top-2 right-2 rounded-full bg-background/80 p-2 backdrop-blur-sm">
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-accent text-accent" : "text-foreground"}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <span>{difficulty}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}