import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CookingPot } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface WantToCookButtonProps {
  recipeId: string;
  wantToCook?: string[];
  variant?: "default" | "outline" | "ghost";
  showCount?: boolean;
}

export function WantToCookButton({ 
  recipeId, 
  wantToCook = [], 
  variant = "outline",
  showCount = false 
}: WantToCookButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const isWanted = user ? wantToCook.includes(user.uid) : false;
  
  const handleToggle = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add recipes to your cooking list",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const recipeRef = doc(db, "recipes", recipeId);
      await updateDoc(recipeRef, {
        "stats.wantToCook": isWanted 
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid)
      });

      toast({
        title: isWanted ? "Removed from cooking list" : "Added to cooking list",
        description: isWanted 
          ? "Recipe removed from your cooking list" 
          : "Recipe added to your cooking list"
      });
    } catch (error) {
      console.error("Error updating want to cook status:", error);
      toast({
        title: "Error",
        description: "Failed to update cooking list",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isWanted ? "default" : variant}
        size="sm"
        onClick={handleToggle}
        disabled={isUpdating}
        className="gap-2"
      >
        <CookingPot className="w-4 h-4" />
        {isWanted ? "Want to Cook" : "Add to Cook"}
      </Button>
      {showCount && wantToCook.length > 0 && (
        <Badge variant="secondary" className="text-xs">
          {wantToCook.length}
        </Badge>
      )}
    </div>
  );
}