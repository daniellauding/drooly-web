import { Edit, X, Bookmark, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface RecipeImageProps {
  id: string;
  image: string;
  creatorId?: string;
  stats?: {
    likes?: string[];
    saves?: string[];
  };
  onDismiss?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
}

export function RecipeImage({ 
  id, 
  image, 
  creatorId, 
  stats,
  onDismiss,
  onEdit 
}: RecipeImageProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const isLiked = user && stats?.likes?.includes(user.uid);
  const isSaved = user && stats?.saves?.includes(user.uid);
  const likesCount = stats?.likes?.length || 0;
  const savesCount = stats?.saves?.length || 0;

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

  return (
    <div className="relative">
      <img 
        src={image} 
        alt="Recipe" 
        className="h-48 w-full object-cover" 
      />
      <div className="absolute top-3 right-3 flex gap-2">
        {onDismiss && (
          <button 
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}
        {user && creatorId === user.uid && (
          <button 
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            onClick={onEdit}
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
  );
}