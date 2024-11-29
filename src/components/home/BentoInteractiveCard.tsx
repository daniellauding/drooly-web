import { Recipe } from "@/services/recipeService";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Clock, ChefHat, Heart, Bookmark, Trophy, Search, Plus, Utensils, Apple } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BentoGridItem } from "./BentoGridItem";
import { BentoInteractiveCard } from "./BentoInteractiveCard";
import { useState } from "react"; // Add missing import
import { useToast } from "@/components/ui/use-toast";
import { generateDetailedRecipes } from "@/services/recipe/recipeGenerator";
import { GeneratedRecipes } from "../recipe/GeneratedRecipes";

interface BentoGridProps {
  recipes: Recipe[];
  onAuthModalOpen?: () => void;
}

export function BentoGrid({ recipes, onAuthModalOpen }: BentoGridProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log('BentoGrid received recipes count:', recipes.length);
  console.log('Raw recipes data:', recipes);

  const handleRecipesFound = (newRecipes: Recipe[]) => {
    console.log("Received AI generated recipes:", newRecipes);
    setGeneratedRecipes(newRecipes);
  };

  const interactiveCards = [
    {
      title: "What's in your kitchen?",
      description: "Find recipes using ingredients you have",
      icon: Apple,
      action: () => {},
      color: "bg-orange-50 hover:bg-orange-100",
      textColor: "text-orange-700"
    },
    {
      title: "Explore Cuisines",
      description: "Discover recipes from around the world",
      icon: Utensils,
      action: () => navigate('/create-recipe?mode=cuisine'),
      color: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      title: "Quick Search",
      description: "Find exactly what you're looking for",
      icon: Search,
      action: () => navigate('/create-recipe?mode=search'),
      color: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700"
    }
  ];

  const getGridItems = () => {
    const items = [];
    let interactiveIndex = 0;

    // Add all recipes first
    items.push(...recipes, ...generatedRecipes);
    console.log('Initial items array length:', items.length);
    
    // Add interactive cards every 6 recipes
    for (let i = 0; i < items.length; i += 6) {
      if (interactiveIndex < interactiveCards.length) {
        items.splice(i + 2, 0, {
          isInteractive: true,
          ...interactiveCards[interactiveIndex]
        });
        interactiveIndex++;
      }
    }

    // Add create recipe card for non-logged in users
    if (!user) {
      items.splice(2, 0, {
        isInteractive: true,
        title: "Create Your Own",
        description: "Login or register to start sharing recipes",
        icon: Plus,
        action: onAuthModalOpen,
        color: "bg-green-50 hover:bg-green-100",
        textColor: "text-green-700"
      });
    }

    console.log('Final items array length (with interactive cards):', items.length);
    return items;
  };

  const gridItems = getGridItems();

  const generateRecipes = async (ingredients: string[]) => {
    setIsLoading(true);
    try {
      const recipes = await generateDetailedRecipes(ingredients);
      console.log("Generated recipes:", recipes);
      
      if (recipes.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try selecting different ingredients",
          variant: "destructive"
        });
        return;
      }

      setGeneratedRecipes(recipes);
      handleRecipesFound(recipes);

      toast({
        title: "Recipes found!",
        description: `Found ${recipes.length} recipes using your ingredients`,
      });
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast({
        title: "Error",
        description: "Failed to generate recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    // Implement the logic to gather ingredients and start recipe generation
    const ingredients = ["example ingredient 1", "example ingredient 2"]; // Replace with actual logic to get user-selected ingredients
    generateRecipes(ingredients);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {gridItems.map((item, index) => {
        if ('isInteractive' in item) {
          return (
            <BentoInteractiveCard
              key={`interactive-${index}`}
              item={item}
              onRecipesFound={handleRecipesFound}
            />
          );
        }

        const recipe = item as Recipe;
        return (
          <BentoGridItem
            key={recipe.id}
            recipe={recipe}
            index={index}
            onRecipeClick={() => navigate(`/recipe/${recipe.id}`)}
          />
        );
      })}
      <Button 
        className="w-full mt-4"
        onClick={handleSearchClick}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Find Recipes"}
      </Button>
    </div>
  );
}
