import { useEffect, useState } from "react";
import { Recipe } from "@/services/recipeService";
import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/home/Hero";
import { SearchExamples } from "@/components/home/SearchExamples";
import { RecipeFilter } from "@/components/recipe/RecipeFilter";
import { BentoGrid } from "@/components/home/BentoGrid";
import { Separator } from "@/components/ui/separator";
import { RecipeSections } from "@/components/home/RecipeSections";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthModal } from "@/components/auth/AuthModal";
import { BetaStrip } from "@/components/home/BetaStrip";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { filterRecipes, Filters } from "@/utils/recipeFilters";

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { toast } = useToast();

  const isSearching = searchQuery.length > 0;
  const isFiltering = Object.values(activeFilters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined
  );

  const shouldShowExtraSections = !isSearching && !isFiltering;

  useEffect(() => {
    console.log('Setting up real-time recipes listener');
    setIsLoading(true);

    const recipesRef = collection(db, 'recipes');
    const q = query(
      recipesRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('Received recipe update. Total recipes:', snapshot.size);
        const updatedRecipes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt ? 
            new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString() 
            : 'Recently added'
        })) as Recipe[];
        
        console.log('Processed recipes count:', updatedRecipes.length);
        setRecipes(updatedRecipes);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error in recipe listener:', err);
        setError(err as Error);
        setIsLoading(false);
        toast({
          title: "Error loading recipes",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      }
    );

    return () => {
      console.log('Cleaning up recipe listener');
      unsubscribe();
    };
  }, [toast]);

  const handleFilterChange = (filters: Filters) => {
    console.log("Applied filters:", filters);
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveFilters({});
    toast({
      title: "Filters cleared",
      description: "All search filters have been reset"
    });
  };

  const filteredRecipes = filterRecipes(recipes, searchQuery, activeFilters);
  console.log("Filtered recipes count:", filteredRecipes.length);

  return (
    <div className="min-h-screen bg-background">
      <BetaStrip />
      <TopBar />
      <Hero onSearch={setSearchQuery} />
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end gap-4">
          {(isSearching || isFiltering) && (
            <Button 
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              Clear All Filters
            </Button>
          )}
          <RecipeFilter onFilterChange={handleFilterChange} />
        </div>
      </div>
      {shouldShowExtraSections && <SearchExamples />}
      <main className="container mx-auto px-4 py-12">
        {shouldShowExtraSections && (
          <RecipeSections 
            isLoading={isLoading} 
            error={error} 
            recipes={recipes} 
          />
        )}
        {shouldShowExtraSections && <Separator className="my-12" />}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {isSearching || isFiltering ? "Search Results" : "All Recipes"}
          </h2>
          {filteredRecipes.length === 0 && (isSearching || isFiltering) ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No recipes found matching your criteria
              </p>
              <Button 
                variant="secondary"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <BentoGrid 
              recipes={filteredRecipes} 
              onAuthModalOpen={() => setAuthModalOpen(true)}
            />
          )}
        </section>
      </main>

      <AuthModal 
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab="login"
      />
    </div>
  );
}