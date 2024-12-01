import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { WeeklyStories } from "@/components/WeeklyStories";
import { StoryViewer } from "@/components/StoryViewer";

export default function Home() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
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

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-4 py-6">
        <WeeklyStories
          users={stories}
          onUserClick={(index) => setSelectedStoryIndex(index)}
        />
        
        {selectedStoryIndex !== null && (
          <StoryViewer
            stories={stories}
            initialUserIndex={selectedStoryIndex}
            onClose={() => setSelectedStoryIndex(null)}
          />
        )}

        {/* Additional content can go here */}
      </main>
    </div>
  );
}
