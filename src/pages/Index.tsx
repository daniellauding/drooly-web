import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { RecipeCard } from "@/components/RecipeCard";

const SAMPLE_RECIPES = [
  {
    title: "Neon Sushi Rolls",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80",
    time: "45 mins",
    difficulty: "Cyberpunk",
    isFavorite: true,
  },
  {
    title: "Robot's Breakfast",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80",
    time: "60 mins",
    difficulty: "AI Level",
  },
  {
    title: "Matrix Meatballs",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=500&q=80",
    time: "15 mins",
    difficulty: "Digital",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen pb-16 pt-16 bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900">
      <TopBar />
      <main className="container py-6">
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-pulse">
          Recipes from Another Dimension
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 [transform-style:preserve-3d] hover:[transform:rotateX(10deg)]">
          {SAMPLE_RECIPES.map((recipe, index) => (
            <div key={index} className="animate-bounce-in" style={{ animationDelay: `${index * 150}ms` }}>
              <RecipeCard {...recipe} />
            </div>
          ))}
        </div>
      </main>
      <BottomBar />
    </div>
  );
};

export default Index;