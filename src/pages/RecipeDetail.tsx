import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChefHat, Heart, Share2, Printer, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data - in a real app, this would come from an API
const RECIPE_DATA = {
  "1": {
    id: "1",
    title: "Spicy Ramen Bowl",
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=1200&q=80",
    chef: "Chef Mike",
    date: "2 days ago",
    cookTime: "30 mins",
    difficulty: "Medium",
    servings: 2,
    description: "A warming bowl of spicy ramen with fresh vegetables and perfectly cooked noodles. This recipe brings authentic Asian flavors right to your kitchen.",
    ingredients: [
      "200g ramen noodles",
      "2 cups vegetable broth",
      "2 tbsp soy sauce",
      "1 tbsp chili oil",
      "2 soft-boiled eggs",
      "1 cup fresh spinach",
      "2 green onions, sliced",
      "Sesame seeds for garnish"
    ],
    instructions: [
      "Bring a large pot of water to boil for the noodles.",
      "In a separate pot, heat the vegetable broth and add soy sauce.",
      "Cook noodles according to package instructions.",
      "Prepare soft-boiled eggs by cooking for 6-7 minutes.",
      "Assemble bowls with noodles, broth, vegetables, and eggs.",
      "Top with green onions and sesame seeds.",
      "Serve hot with chili oil on the side."
    ]
  }
};

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = RECIPE_DATA[id as keyof typeof RECIPE_DATA];

  console.log("Rendering recipe detail for ID:", id);

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span>{recipe.chef}</span>
            <span>•</span>
            <span>{recipe.date}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Heart className="w-4 h-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <BookOpen className="w-4 h-4" />
            Start Cooking
          </Button>
        </div>

        {/* Recipe Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Clock className="w-5 h-5 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Cook Time</p>
            <p className="font-medium">{recipe.cookTime}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <ChefHat className="w-5 h-5 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <p className="font-medium">{recipe.difficulty}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="w-5 h-5 text-primary mb-2">👥</div>
            <p className="text-sm text-muted-foreground">Servings</p>
            <p className="font-medium">{recipe.servings} servings</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-muted-foreground">{recipe.description}</p>
        </div>

        {/* Ingredients & Instructions */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ScrollArea className="h-[300px] pr-4">
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ScrollArea className="h-[300px] pr-4">
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground">{instruction}</p>
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}