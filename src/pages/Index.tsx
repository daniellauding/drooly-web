import { Recipe } from "@/services/recipeService";
import { useEffect, useState } from "react";
import { fetchFirebaseRecipes } from "@/services/firebaseRecipes";
import { RecipeSections } from "@/components/home/RecipeSections";
import { TopBar } from "@/components/TopBar";

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const fetchedRecipes = await fetchFirebaseRecipes();
        setRecipes(fetchedRecipes);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-4 pt-20">
        <RecipeSections isLoading={isLoading} error={error} recipes={recipes} />
      </main>
    </div>
  );
}