import { Recipe } from "@/services/recipeService";
import { useEffect, useState } from "react";
import { fetchFirebaseRecipes } from "@/services/firebaseRecipes";
import { RecipeSections } from "@/components/home/RecipeSections";
import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/home/Hero";
import { SearchExamples } from "@/components/home/SearchExamples";
import { RecipeFilter } from "@/components/recipe/RecipeFilter";

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

  const handleFilterChange = (filters: any) => {
    console.log("Filters changed:", filters);
    // TODO: Implement filter logic
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Hero />
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <RecipeFilter onFilterChange={handleFilterChange} />
        </div>
      </div>
      <SearchExamples />
      <main className="container mx-auto px-4 py-12">
        <RecipeSections isLoading={isLoading} error={error} recipes={recipes} />
      </main>
    </div>
  );
}