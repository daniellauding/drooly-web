import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Clock } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe } from "@/types/recipe";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function RecipesToCookContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (user) {
      loadRecipesToCook();
    }
  }, [user]);

  const loadRecipesToCook = async () => {
    if (!user) return;
    try {
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("stats.wantToCook", "array-contains", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const loadedRecipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];

      setRecipes(loadedRecipes);
    } catch (error) {
      console.error("Error loading recipes to cook:", error);
      toast({
        title: "Error",
        description: "Failed to load your recipes",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {recipes.map((recipe) => (
        <Card 
          key={recipe.id}
          className="p-4 hover:bg-accent cursor-pointer"
          onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{recipe.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {recipe.totalTime}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          {recipe.steps && recipe.steps.length > 0 && (
            <div className="mt-4 space-y-2">
              <Separator />
              <h4 className="text-sm font-medium">Next steps:</h4>
              <ul className="space-y-1">
                {recipe.steps.slice(0, 2).map((step, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {index + 1}. {step.title || step.instructions.slice(0, 50)}...
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}