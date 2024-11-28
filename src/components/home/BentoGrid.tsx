import { Recipe } from "@/services/recipeService";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Clock, ChefHat, Heart, Bookmark, Trophy, Search, Plus, Utensils, Apple } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BentoGridItem } from "./BentoGridItem";
import { BentoInteractiveCard } from "./BentoInteractiveCard";

interface BentoGridProps {
  recipes: Recipe[];
  onAuthModalOpen?: () => void;
}

export function BentoGrid({ recipes, onAuthModalOpen }: BentoGridProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log('BentoGrid received recipes count:', recipes.length);
  console.log('Raw recipes data:', recipes);

  const interactiveCards = [
    {
      title: "What's in your fridge?",
      description: "Find recipes using ingredients you have",
      icon: Apple,
      action: () => navigate('/create-recipe?mode=ingredients'),
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
    items.push(...recipes);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {gridItems.map((item, index) => {
        if ('isInteractive' in item) {
          return (
            <BentoInteractiveCard
              key={`interactive-${index}`}
              item={item}
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
    </div>
  );
}