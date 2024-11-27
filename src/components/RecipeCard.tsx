import { Heart, Clock, ChefHat, Edit, X, Bookmark } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe } from "@/types/recipe";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export interface RecipeCardProps {
  id: string;
  title: string;
  image?: string;
  cookTime?: string;
  difficulty: string;
  isFavorite?: boolean;
  chef?: string;
  date?: string;
  images?: string[];
  featuredImageIndex?: number;
  creatorId?: string;
  stats?: {
    likes?: string[];
    saves?: string[];
  };
  onDismiss?: () => void;
}

export function RecipeCard({ 
  id,
  title, 
  image,
  images,
  featuredImageIndex = 0,
  cookTime, 
  difficulty, 
  isFavorite = false,
  chef,
  date,
  creatorId,
  stats,
  onDismiss
}: RecipeCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const isLiked = user && stats?.likes?.includes(user.uid);
  const isSaved = user && stats?.saves?.includes(user.uid);
  const likesCount = stats?.likes?.length || 0;
  const savesCount = stats?.saves?.length || 0;

  const handleClick = () => {
    console.log('Navigating to recipe:', id);
    navigate(`/recipe/${id}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like recipes",
        variant: "destructive"
      });
      return;
    }

    try {
      const recipeRef = doc(db, "recipes", id);
      await updateDoc(recipeRef, {
        "stats.likes": isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
      
      toast({
        title: isLiked ? "Recipe unliked" : "Recipe liked",
        description: isLiked ? "Removed from your liked recipes" : "Added to your liked recipes"
      });
    } catch (error) {
      console.error("Error updating like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save recipes",
        variant: "destructive"
      });
      return;
    }

    try {
      const recipeRef = doc(db, "recipes", id);
      await updateDoc(recipeRef, {
        "stats.saves": isSaved ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
      
      toast({
        title: isSaved ? "Recipe removed" : "Recipe saved",
        description: isSaved ? "Removed from your saved recipes" : "Added to your saved recipes"
      });
    } catch (error) {
      console.error("Error updating save status:", error);
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Navigating to edit recipe:', id);
    navigate(`/recipe/edit/${id}`);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.();
  };

  const getFeaturedImage = () => {
    if (images && images.length > 0) {
      const featuredImage = images[featuredImageIndex] || images[0];
      return featuredImage?.startsWith('blob:') ? '/placeholder.svg' : featuredImage;
    }
    return image || '/placeholder.svg';
  };

  return (
    <Card 
      className="overflow-hidden bg-white border rounded-3xl transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={getFeaturedImage()} 
          alt={title} 
          className="h-48 w-full object-cover" 
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {onDismiss && (
            <button 
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              onClick={handleDismiss}
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
          {user && creatorId === user.uid && (
            <button 
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              onClick={handleEdit}
            >
              <Edit className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <button 
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors group"
            onClick={handleSave}
          >
            <Bookmark 
              className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : "text-gray-600 group-hover:text-primary"}`} 
            />
          </button>
          <button 
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors group"
            onClick={handleLike}
          >
            <Heart 
              className={`h-5 w-5 ${isLiked ? "fill-[#FF6B6B] text-[#FF6B6B]" : "text-gray-600 group-hover:text-[#FF6B6B]"}`} 
            />
          </button>
        </div>
        <div className="absolute bottom-3 right-3 flex gap-2">
          {savesCount > 0 && (
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
              {savesCount} {savesCount === 1 ? 'save' : 'saves'}
            </div>
          )}
          {likesCount > 0 && (
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
              {likesCount} {likesCount === 1 ? 'like' : 'likes'}
            </div>
          )}
        </div>
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