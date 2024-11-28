import { Recipe } from "@/services/recipeService";
import { useEffect, useState } from "react";
import { fetchFirebaseRecipes } from "@/services/firebaseRecipes";
import { RecipeSections } from "@/components/home/RecipeSections";
import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/home/Hero";
import { SearchExamples } from "@/components/home/SearchExamples";
import { RecipeFilter } from "@/components/recipe/RecipeFilter";
import { BentoGrid } from "@/components/home/BentoGrid";
import { Separator } from "@/components/ui/separator";

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const fetchedRecipes = await fetchFirebaseRecipes();
        console.log('Fetched recipes:', fetchedRecipes.length);
        setRecipes(fetchedRecipes);
      } catch (err) {
        console.error('Error loading recipes:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, []);

  const handleFilterChange = (filters: any) => {
    console.log("Applied filters:", filters);
    // TODO: Implement filter logic
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.chef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Hero />
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search recipes..."
            className="flex-1 max-w-md px-4 py-2 rounded-lg border border-input bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <RecipeFilter onFilterChange={handleFilterChange} />
        </div>
      </div>
      <SearchExamples />
      <main className="container mx-auto px-4 py-12">
        <RecipeSections isLoading={isLoading} error={error} recipes={recipes} />
        <Separator className="my-12" />
        <section>
          <h2 className="text-2xl font-bold mb-6">All Recipes</h2>
          <BentoGrid recipes={filteredRecipes} />
        </section>
      </main>
    </div>
  );
}