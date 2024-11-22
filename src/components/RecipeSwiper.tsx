import { Heart, X, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const DISCOVER_RECIPES = [
  {
    id: "1",
    title: "Spicy Ramen Bowl",
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=500&q=80",
    chef: "Chef Mike",
    date: "2 days ago",
    cookTime: "30 mins"
  },
  {
    id: "2",
    title: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80",
    chef: "Chef Sarah",
    date: "Yesterday",
    cookTime: "15 mins"
  },
  {
    id: "3",
    title: "Berry Smoothie Bowl",
    image: "https://images.unsplash.com/photo-1626200419199-391ae4be7f8c?w=500&q=80",
    chef: "Chef Emma",
    date: "3 days ago",
    cookTime: "10 mins"
  },
];

export function RecipeSwiper() {
  const navigate = useNavigate();
  
  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log('Liked recipe:', id);
  };

  const handleDislike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log('Disliked recipe:', id);
  };

  const handleRecipeClick = (id: string) => {
    console.log('Navigating to recipe:', id);
    navigate(`/recipe/${id}`);
  };

  return (
    <Carousel className="w-full max-w-md mx-auto">
      <CarouselContent>
        {DISCOVER_RECIPES.map((recipe) => (
          <CarouselItem key={recipe.id}>
            <Card 
              className="relative h-[400px] overflow-hidden cursor-pointer"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm opacity-80">by {recipe.chef}</p>
                  <span className="text-sm opacity-60">•</span>
                  <p className="text-sm opacity-80">{recipe.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 opacity-80" />
                  <span className="text-sm opacity-80">{recipe.cookTime}</span>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 flex gap-4">
                <button
                  onClick={(e) => handleDislike(e, recipe.id)}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => handleLike(e, recipe.id)}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <Heart className="w-6 h-6 text-white" />
                </button>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}