import { Heart, X } from "lucide-react";
import { Card } from "./ui/card";
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
  },
  {
    id: "2",
    title: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80",
    chef: "Chef Sarah",
  },
  {
    id: "3",
    title: "Berry Smoothie Bowl",
    image: "https://images.unsplash.com/photo-1626200419199-391ae4be7f8c?w=500&q=80",
    chef: "Chef Emma",
  },
];

export function RecipeSwiper() {
  const handleLike = (id: string) => {
    console.log('Liked recipe:', id);
  };

  const handleDislike = (id: string) => {
    console.log('Disliked recipe:', id);
  };

  return (
    <Carousel className="w-full max-w-md mx-auto">
      <CarouselContent>
        {DISCOVER_RECIPES.map((recipe) => (
          <CarouselItem key={recipe.id}>
            <Card className="relative h-[400px] overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <p className="text-sm opacity-80">by {recipe.chef}</p>
              </div>
              <div className="absolute bottom-6 right-6 flex gap-4">
                <button
                  onClick={() => handleDislike(recipe.id)}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => handleLike(recipe.id)}
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