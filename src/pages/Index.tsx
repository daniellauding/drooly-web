import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { RecipeCard } from "@/components/RecipeCard";
import { WeeklyStories } from "@/components/WeeklyStories";
import { RecipeSwiper } from "@/components/RecipeSwiper";
import { StoryViewer } from "@/components/StoryViewer";

const POPULAR_RECIPES = [
  {
    title: "Homemade Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    time: "45 mins",
    difficulty: "Medium",
    isFavorite: true,
  },
  {
    title: "Chocolate Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
    time: "60 mins",
    difficulty: "Easy",
  },
  {
    title: "Fresh Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    time: "15 mins",
    difficulty: "Easy",
  },
];

const FRIENDS_RECIPES = [
  {
    title: "Vegan Burger",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80",
    time: "30 mins",
    difficulty: "Medium",
  },
  {
    title: "Sushi Roll",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    time: "50 mins",
    difficulty: "Hard",
  },
];

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

  console.log("Rendering Index page");

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
          <RecipeSwiper />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Recipes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {POPULAR_RECIPES.map((recipe, index) => (
              <RecipeCard key={index} {...recipe} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Friends' Recipes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {FRIENDS_RECIPES.map((recipe, index) => (
              <RecipeCard key={index} {...recipe} />
            ))}
          </div>
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