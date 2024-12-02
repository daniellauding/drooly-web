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
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Story } from "@/types/story";

export default function Home() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  
  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchFirebaseRecipes
  });

  const { data: stories = [], isLoading: storiesLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      console.log("Fetching stories...");
      const q = query(collection(db, "stories"));
      const snapshot = await getDocs(q);
      const fetchedStories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Story));
      console.log("Fetched stories:", fetchedStories);
      return fetchedStories;
    }
  });

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Search functionality will be handled by SearchDialog
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>
        <Hero onSearch={handleSearch} />
        <SearchExamples />
        
        <div className="container mx-auto px-4 py-6 space-y-12">
          {stories.length > 0 && (
            <WeeklyStories
              users={stories}
              onUserClick={(index) => setSelectedStoryIndex(index)}
            />
          )}
          
          <BentoGrid 
            recipes={recipes} 
            onAuthModalOpen={() => {}} 
          />
          
          {selectedStoryIndex !== null && stories.length > 0 && (
            <StoryViewer
              stories={stories}
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