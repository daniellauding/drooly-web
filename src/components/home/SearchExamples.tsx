import { CookingPot, Globe, Link, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { IngredientSearchModal } from "@/components/ingredients/IngredientSearchModal";
import { CuisineMapDialog } from "./CuisineMapDialog";
import { RecipeUrlDialog } from "@/components/recipe/RecipeUrlDialog";
import { ClipboardImportDialog } from "@/components/recipe/ClipboardImportDialog";
import { useTranslation } from "react-i18next";

export function SearchExamples() {
  const { user } = useAuth();
  const { t, ready } = useTranslation();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [showCuisineMap, setShowCuisineMap] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showClipboardDialog, setShowClipboardDialog] = useState(false);

  console.log('Rendering SearchExamples, i18n ready:', ready);

  const handleAuthRequired = (action: () => void) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  if (!ready) {
    return null; // Don't render until translations are ready
  }

  const examples = [
    {
      icon: CookingPot,
      title: t('home.kitchen.action'),
      description: t('home.kitchen.description'),
      onClick: () => handleAuthRequired(() => setShowKitchenModal(true))
    },
    {
      icon: Globe,
      title: t('home.cuisines.action'),
      description: t('home.cuisines.description'),
      onClick: () => handleAuthRequired(() => setShowCuisineMap(true))
    },
    {
      icon: Link,
      title: t('home.import.url.action'),
      description: t('home.import.url.description'),
      onClick: () => handleAuthRequired(() => setShowUrlDialog(true))
    },
    {
      icon: ClipboardPaste,
      title: t('home.import.clipboard.action'),
      description: t('home.import.clipboard.description'),
      onClick: () => handleAuthRequired(() => setShowClipboardDialog(true))
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-6 flex flex-col items-start space-y-2"
            onClick={example.onClick}
          >
            <example.icon className="h-6 w-6 text-primary" />
            <div className="text-left">
              <p className="font-medium">{example.title}</p>
              <p className="text-sm text-muted-foreground">{example.description}</p>
            </div>
          </Button>
        ))}
      </div>

      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="login"
      />

      <IngredientSearchModal
        open={showKitchenModal}
        onOpenChange={setShowKitchenModal}
        onRecipesGenerated={() => {}}
        isLoading={false}
      />

      <CuisineMapDialog
        open={showCuisineMap}
        onOpenChange={setShowCuisineMap}
        recipes={[]}
      />

      <RecipeUrlDialog
        open={showUrlDialog}
        onOpenChange={setShowUrlDialog}
        onRecipeScraped={() => {}}
      />

      <ClipboardImportDialog
        open={showClipboardDialog}
        onOpenChange={setShowClipboardDialog}
        onRecipeImported={() => {}}
      />
    </div>
  );
}