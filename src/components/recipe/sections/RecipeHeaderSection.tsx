import { Button } from "@/components/ui/button";
import { Heart, Share2, Printer, BookOpen, ArrowLeft, Edit, Calendar } from "lucide-react";
import { RecipeMetadata } from "./RecipeMetadata";

interface RecipeHeaderSectionProps {
  recipe?: any;
  onNavigateBack?: () => void;
  onEdit?: () => void;
  onShowPlanModal?: () => void;
  onShowEventModal?: () => void;
  isCreator?: boolean;
  isEditing?: boolean;
  onSaveAsDraft?: () => void;
}

export function RecipeHeaderSection({
  recipe,
  onNavigateBack,
  onEdit,
  onShowPlanModal,
  onShowEventModal,
  isCreator,
  isEditing,
  onSaveAsDraft
}: RecipeHeaderSectionProps) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Recipe" : "Create New Recipe"}
          </h1>
          <div className="flex items-center gap-4">
            {onSaveAsDraft && (
              <Button 
                variant="outline" 
                onClick={onSaveAsDraft}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Save as Draft
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">{recipe?.title}</h1>
        <RecipeMetadata 
          chef={recipe?.creatorName || 'Anonymous'}
          date={new Date(recipe?.createdAt?.seconds * 1000).toLocaleDateString()}
          cookTime={recipe?.totalTime || '30 min'}
          cuisine={recipe?.cuisine}
        />
      </div>
    </>
  );
}