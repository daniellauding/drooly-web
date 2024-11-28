import { useEffect, useState } from "react";
import { Recipe } from "@/services/recipeService";
import { fetchFirebaseRecipes } from "@/services/firebaseRecipes";
import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/home/Hero";
import { SearchExamples } from "@/components/home/SearchExamples";
import { RecipeFilter } from "@/components/recipe/RecipeFilter";
import { BentoGrid } from "@/components/home/BentoGrid";
import { Separator } from "@/components/ui/separator";
import { RecipeSections } from "@/components/home/RecipeSections";

interface Filters {
  ingredients?: string[];
  categories?: string[];
  dietary?: string[];
  difficulty?: string[];
  cuisine?: string[];
  estimatedCost?: string[];
  season?: string[];
  occasion?: string[];
  equipment?: string[];
  dishTypes?: string[];
  cookingMethods?: string[];
  cookingTime?: number[];
}

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filters>({});

  const isSearching = searchQuery.length > 0;
  const isFiltering = Object.values(activeFilters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined
  );

  const shouldShowExtraSections = !isSearching && !isFiltering;

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

  const filterRecipes = (recipes: Recipe[]) => {
    return recipes.filter(recipe => {
      // Search query filter
      const searchMatch = !searchQuery || 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.chef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!searchMatch) return false;

      // Apply active filters
      const filterMatches = Object.entries(activeFilters).every(([key, values]) => {
        if (!values || values.length === 0) return true;

        switch (key) {
          case 'ingredients':
            return values.some(ingredient => 
              recipe.ingredients?.some(ri => ri.name.toLowerCase().includes(ingredient.toLowerCase()))
            );
          case 'cookingTime':
            const time = parseInt(recipe.cookTime || '0');
            return time >= values[0] && time <= values[1];
          case 'difficulty':
            return values.includes(recipe.difficulty);
          case 'cuisine':
            return values.includes(recipe.cuisine);
          // Add more filter cases as needed
          default:
            return true;
        }
      });

      return filterMatches;
    });
  };

  const handleFilterChange = (filters: Filters) => {
    console.log("Applied filters:", filters);
    setActiveFilters(filters);
  };

  const filteredRecipes = filterRecipes(recipes);
  console.log("Filtered recipes count:", filteredRecipes.length);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Hero onSearch={setSearchQuery} />
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <RecipeFilter onFilterChange={handleFilterChange} />
        </div>
      </div>
      {shouldShowExtraSections && <SearchExamples />}
      <main className="container mx-auto px-4 py-12">
        {shouldShowExtraSections && (
          <RecipeSections 
            isLoading={isLoading} 
            error={error} 
            recipes={filteredRecipes} 
          />
        )}
        {shouldShowExtraSections && <Separator className="my-12" />}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {isSearching || isFiltering ? "Search Results" : "All Recipes"}
          </h2>
          <BentoGrid recipes={filteredRecipes} />
        </section>
      </main>
    </div>
  );
}