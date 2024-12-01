import { Button } from "@/components/ui/button";
import { Heart, Share2, Printer, BookOpen, ArrowLeft, Edit, Calendar } from "lucide-react";
import { RecipeMetadata } from "./RecipeMetadata";

interface RecipeHeaderSectionProps {
  recipe: any;
  onNavigateBack: () => void;
  onEdit: () => void;
  onShowPlanModal: () => void;
  onShowEventModal: () => void;
  isCreator: boolean;
}

export function RecipeHeaderSection({
  recipe,
  onNavigateBack,
  onEdit,
  onShowPlanModal,
  onShowEventModal,
  isCreator
}: RecipeHeaderSectionProps) {
  return (
    <>
      <div className="fixed top-4 left-4 right-4 z-10 flex justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={onNavigateBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {isCreator && (
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={onEdit}
          >
            <Edit className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">{recipe.title}</h1>
        <RecipeMetadata 
          chef={recipe.creatorName || 'Anonymous'}
          date={new Date(recipe.createdAt.seconds * 1000).toLocaleDateString()}
          cookTime={recipe.totalTime || '30 min'}
          cuisine={recipe.cuisine}
        />
      </div>
    </>
  );
}