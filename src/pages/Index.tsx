import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { RecipeCard } from "@/components/RecipeCard";
import { WeeklyStories } from "@/components/WeeklyStories";
import { RecipeSwiper } from "@/components/RecipeSwiper";
import { StoryViewer } from "@/components/StoryViewer";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "@/services/recipeService";
import { Skeleton } from "@/components/ui/skeleton";
import { Recipe } from "@/types/recipe";
import type { RecipeCardProps } from "@/components/RecipeCard";

const WEEKLY_STORIES = [
  {
    id: "1",
    name: "Sarah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    stories: [
      { id: "1", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", caption: "Healthy breakfast bowl" },
      { id: "2", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", caption: "Homemade pizza night" },
    ],
  },
  {
    id: "2",
    name: "Mike",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    stories: [
      { id: "1", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445", caption: "Perfect pancakes" },
    ],
  },
  {
    id: "3",
    name: "Emma",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    stories: [
      { id: "1", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47", caption: "Sunday baking" },
      { id: "2", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187", caption: "Pasta from scratch" },
    ],
  },
  {
    id: "4",
    name: "John",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    stories: [
      { id: "1", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", caption: "Grilling masterclass" },
    ],
  },
  {
    id: "5",
    name: "Lisa",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&q=80",
    stories: [
      { id: "1", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187", caption: "Smoothie bowl art" },
    ],
  },
  {
    id: "6",
    name: "David",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
    stories: [
      { id: "1", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445", caption: "Morning coffee ritual" },
    ],
  },
];

const Index = () => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  console.log("Rendering Index page with recipes:", recipes);

  if (error) {
    console.error("Error loading recipes:", error);
  }

  // Split recipes into different sections
  const discoverRecipes = recipes?.slice(0, 3) || [];
  const popularRecipes = recipes?.slice(0, 3) || [];
  const friendsRecipes = recipes?.slice(3, 5) || [];

  const mapRecipeToProps = (recipe: Recipe): RecipeCardProps => ({
    id: recipe.id || '',
    title: recipe.title,
    image: recipe.image,
    cookTime: recipe.cookTime || `${recipe.totalTime} min`,
    difficulty: recipe.difficulty,
    chef: recipe.chef || recipe.creatorName,
    date: recipe.date
  });

  return (
    <div className="min-h-screen pb-16 pt-16">
      <TopBar />
      <main className="container py-6 space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Weekly Cooking Plans</h2>
          <WeeklyStories users={WEEKLY_STORIES} onUserClick={setSelectedStoryIndex} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Discover New Recipes</h2>
          {isLoading ? (
            <div className="w-full max-w-md mx-auto h-[400px]">
              <Skeleton className="w-full h-full rounded-xl" />
            </div>
          ) : (
            <RecipeSwiper recipes={discoverRecipes} />
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Recipes</h2>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[300px] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...mapRecipeToProps(recipe)} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Friends' Recipes</h2>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[300px] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {friendsRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...mapRecipeToProps(recipe)} />
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomBar />
      
      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={WEEKLY_STORIES}
          initialUserIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </div>
  );
};

export default Index;