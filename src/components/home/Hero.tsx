import { Search, Link, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  const handleCreateRecipe = () => {
    navigate('/create');
  };

  return (
    <div className="relative bg-[#F7F9FC] py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Search for <span className="italic">almost</span> anything
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore recipes, find inspiration, and create your own dishes with AI-powered search - discover recipes based on ingredients you have or want to use.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Input 
              placeholder="Search recipes, ingredients, or paste a recipe URL..."
              className="h-12 pl-12 pr-32 text-lg shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Button 
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={handleCreateRecipe}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              AI Assist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}