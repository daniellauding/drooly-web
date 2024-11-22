import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { RecipeCard } from "@/components/RecipeCard";

const SAMPLE_RECIPES = [
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

const Index = () => {
  return (
    <div className="min-h-screen pb-16 pt-16">
      <TopBar />
      <main className="container py-6">
        <h2 className="text-2xl font-bold mb-6">Popular Recipes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_RECIPES.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}
        </div>
      </main>
      <BottomBar />
    </div>
  );
};

export default Index;