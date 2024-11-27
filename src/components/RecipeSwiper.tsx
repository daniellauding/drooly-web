import { Heart, X, Clock, Edit } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Recipe } from "@/services/recipeService";
import { Button } from "./ui/button";

interface RecipeSwiperProps {
  recipes: Recipe[];
}

export function RecipeSwiper({ recipes }: RecipeSwiperProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log('Liked recipe:', id);
  };

  const handleDislike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log('Disliked recipe:', id);
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/recipe/edit/${id}`);
  };

  const handleRecipeClick = (id: string) => {
    console.log('Navigating to recipe:', id);
    navigate(`/recipe/${id}`);
  };

  const getValidImageUrl = (recipe: Recipe) => {
    const imageUrl = recipe.images?.[recipe.featuredImageIndex || 0];
    if (!imageUrl) return '/placeholder.svg';
    return imageUrl.startsWith('blob:') ? '/placeholder.svg' : imageUrl;
  };

  return (
    <Carousel className="w-full max-w-md mx-auto">
      <CarouselContent>
        {recipes.map((recipe) => (
          <CarouselItem key={recipe.id}>
            <Card 
              className="relative h-[400px] overflow-hidden cursor-pointer"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <img
                src={getValidImageUrl(recipe)}
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
                {user && recipe.creatorId === user.uid && (
                  <button
                    onClick={(e) => handleEdit(e, recipe.id)}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                  >
                    <Edit className="w-6 h-6 text-white" />
                  </button>
                )}
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