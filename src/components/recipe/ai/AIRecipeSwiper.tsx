import { Recipe } from "@/types/recipe";
import { RecipeSwiper } from "@/components/RecipeSwiper";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";

interface AIRecipeSwiperProps {
  recipes: Recipe[];
  onRegenerate: () => void;
  onClose: () => void;
}

export function AIRecipeSwiper({ recipes, onRegenerate, onClose }: AIRecipeSwiperProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAuthRequired = () => {
    toast({
      title: "Authentication required",
      description: "Please sign in to save or create recipes",
    });
    setShowAuthModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Generated Recipes</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      </div>

      <RecipeSwiper 
        recipes={recipes} 
        onAuthRequired={handleAuthRequired}
      />

      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="login"
      />
    </div>
  );
}