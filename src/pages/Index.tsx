import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { WeeklyStories } from "@/components/WeeklyStories";
import { StoryViewer } from "@/components/StoryViewer";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatRecipeData } from "@/utils/recipeFormatters";
import { RecipeSections } from "@/components/home/RecipeSections";

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
    queryFn: async () => {
      console.log('Fetching recipes for home page');
      try {
        const recipesRef = collection(db, 'recipes');
        const q = query(
          recipesRef,
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        console.log('Query snapshot:', querySnapshot.size, 'documents');
        
        if (querySnapshot.empty) {
          console.log('No recipes found');
          return [];
        }

        const fetchedRecipes = querySnapshot.docs.map(formatRecipeData);
        console.log('Processed recipes:', fetchedRecipes);
        return fetchedRecipes;
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    }
  });

  return (
    <div className="min-h-screen pb-16 pt-16">
      <TopBar />
      <main className="container py-6 space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Weekly Cooking Plans</h2>
          <WeeklyStories users={WEEKLY_STORIES} onUserClick={setSelectedStoryIndex} />
        </section>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load recipes. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        ) : (
          <RecipeSections isLoading={isLoading} recipes={recipes || []} />
        )}
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
