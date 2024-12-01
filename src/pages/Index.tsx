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

export default function Home() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [stories] = useState([
    {
      id: "1",
      name: "John's Weekly Plan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      stories: [
        {
          id: "1",
          image: "/placeholder.svg",
          caption: "Monday: Pasta Night"
        },
        {
          id: "2",
          image: "/placeholder.svg",
          caption: "Tuesday: Taco Tuesday"
        }
      ]
    }
  ]);

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchFirebaseRecipes
  });

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Search functionality will be handled by SearchDialog
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>
        <Hero onSearchClick={() => setSearchDialogOpen(true)} />
        <SearchExamples />
        
        <div className="container mx-auto px-4 py-6 space-y-12">
          <WeeklyStories
            users={stories}
            onUserClick={(index) => setSelectedStoryIndex(index)}
          />
          
          <BentoGrid 
            recipes={recipes} 
            onAuthModalOpen={() => {}} 
          />
          
          {selectedStoryIndex !== null && (
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