import { useState } from "react";
import { Recipe } from "@/services/recipeService";
import { useAuth } from "@/contexts/AuthContext";
import { ImageRecognitionDialog } from "../recipe/ImageRecognitionDialog";
import { AuthModal } from "../auth/AuthModal";
import { CuisineMapDialog } from "./CuisineMapDialog";
import { RecipeFilter } from "../recipe/RecipeFilter";
import { BentoGridHeader } from "./BentoGridHeader";
import { BentoGridContent } from "./BentoGridContent";
import { WeeklyStoriesSection } from "./WeeklyStoriesSection";

interface BentoGridProps {
  recipes: Recipe[];
  onAuthModalOpen?: () => void;
}

export function BentoGrid({ recipes, onAuthModalOpen }: BentoGridProps) {
  const { user } = useAuth();
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [showImageRecognition, setShowImageRecognition] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCuisineMap, setShowCuisineMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  console.log('BentoGrid received recipes count:', recipes.length);

  return (
    <div className="relative">
      <BentoGridHeader 
        onMethodSelect={setSelectedMethod}
        selectedMethod={selectedMethod}
        onShowFilters={() => setShowFilters(true)}
      />

      <WeeklyStoriesSection />
      
      <BentoGridContent 
        recipes={recipes}
        generatedRecipes={generatedRecipes}
        user={user}
        selectedMethod={selectedMethod}
        onAuthModalOpen={onAuthModalOpen}
      />

      <ImageRecognitionDialog
        open={showImageRecognition}
        onOpenChange={setShowImageRecognition}
        onRecipeScanned={() => {}}
      />

      <CuisineMapDialog 
        open={showCuisineMap}
        onOpenChange={setShowCuisineMap}
        recipes={[...recipes, ...generatedRecipes]}
      />

      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="login"
      />

      <RecipeFilter
        open={showFilters}
        onOpenChange={setShowFilters}
        onFilterChange={() => {}}
      />
    </div>
  );
}