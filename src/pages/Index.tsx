import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { WeeklyStories } from "@/components/WeeklyStories";
import { StoryViewer } from "@/components/StoryViewer";
import { Hero } from "@/components/home/Hero";
import { SearchExamples } from "@/components/home/SearchExamples";
import { BentoGrid } from "@/components/home/BentoGrid";
import { useQuery } from "@tanstack/react-query";
import { fetchFirebaseRecipes } from "@/services/firebaseRecipes";
import { SearchDialog } from "@/components/navigation/SearchDialog";
import { collection, query, getDocs, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Story } from "@/types/story";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  
  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchFirebaseRecipes
  });

  const { data: weeklyPlanStories = [], isLoading: storiesLoading } = useQuery({
    queryKey: ['weeklyPlanStories'],
    queryFn: async () => {
      console.log("Fetching weekly plan stories...");
      const weeklyPlansRef = collection(db, "weeklyPlans");
      const q = query(
        weeklyPlansRef,
        where("status", "==", "planned"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      
      const snapshot = await getDocs(q);
      const plans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Transform weekly plans into stories format
      const stories = plans.reduce((acc: Story[], plan: any) => {
        const existingUserStory = acc.find(story => story.name === plan.userName);
        
        if (existingUserStory) {
          existingUserStory.stories.push({
            id: plan.id,
            image: plan.recipeImage || '/placeholder.svg',
            caption: `${plan.title} - ${plan.day} ${plan.mealType}`
          });
        } else {
          acc.push({
            id: plan.userId,
            name: plan.userName,
            avatar: plan.userAvatar || '/placeholder.svg',
            stories: [{
              id: plan.id,
              image: plan.recipeImage || '/placeholder.svg',
              caption: `${plan.title} - ${plan.day} ${plan.mealType}`
            }]
          });
        }
        
        return acc;
      }, []);

      console.log("Transformed weekly plan stories:", stories);
      return stories;
    },
    enabled: !!user
  });

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>
        <Hero onSearch={handleSearch} />
        <SearchExamples />
        
        <div className="container mx-auto px-4 py-6 space-y-12">
          {weeklyPlanStories && weeklyPlanStories.length > 0 && (
            <WeeklyStories
              users={weeklyPlanStories}
              onUserClick={(index) => setSelectedStoryIndex(index)}
            />
          )}
          
          <BentoGrid 
            recipes={recipes} 
            onAuthModalOpen={() => {}} 
          />
          
          {selectedStoryIndex !== null && weeklyPlanStories && weeklyPlanStories.length > 0 && (
            <StoryViewer
              stories={weeklyPlanStories}
              initialUserIndex={selectedStoryIndex}
              onClose={() => setSelectedStoryIndex(null)}
            />
          )}
        </div>

        <SearchDialog 
          open={searchDialogOpen}
          onOpenChange={setSearchDialogOpen}
        />
      </main>
    </div>
  );
}