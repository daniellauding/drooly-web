import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { RecipeCard } from "@/components/RecipeCard";
import { WeeklyStories } from "@/components/WeeklyStories";
import { RecipeSwiper } from "@/components/RecipeSwiper";

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

const Index = () => {
  console.log("Rendering Index page"); // Added for debugging

  return (
    <div className="min-h-screen pb-16 pt-16">
      <TopBar />
      <main className="container py-6 space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Weekly Cooking Plans</h2>
          <WeeklyStories />
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

        <section>
          <h2 className="text-2xl font-bold mb-6">Discover New Recipes</h2>
          <RecipeSwiper />
        </section>
      </main>
      <BottomBar />
    </div>
  );
};

export default Index;