import { WeeklyStories } from "@/components/WeeklyStories";
import { StoryViewer } from "@/components/StoryViewer";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Story } from "@/types/story";
import { useAuth } from "@/contexts/AuthContext";

export function WeeklyStoriesSection() {
  const { user } = useAuth();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const { data: weeklyPlanStories = [] } = useQuery({
    queryKey: ['weeklyPlanStories'],
    queryFn: async () => {
      console.log("Fetching weekly plan stories...");
      const weeklyPlansRef = collection(db, "weeklyPlans");
      const q = query(
        weeklyPlansRef,
        where("status", "==", "planned"),
        orderBy("createdAt", "desc")
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

  if (!weeklyPlanStories.length) {
    console.log("No weekly plan stories available");
    return null;
  }

  console.log("Rendering weekly plan stories:", weeklyPlanStories);

  return (
    <div className="mb-6">
      <WeeklyStories
        users={weeklyPlanStories}
        onUserClick={(index) => setSelectedStoryIndex(index)}
      />
      
      {selectedStoryIndex !== null && weeklyPlanStories && weeklyPlanStories.length > 0 && (
        <StoryViewer
          stories={weeklyPlanStories}
          initialUserIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </div>
  );
}