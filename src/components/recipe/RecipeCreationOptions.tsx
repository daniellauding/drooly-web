import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Camera, Instagram, Youtube, ChevronDown, Trello, Clipboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecipeUrlDialog } from "./RecipeUrlDialog";
import { ImageRecognitionDialog } from "./ImageRecognitionDialog";
import { TrelloImportDialog } from "./TrelloImportDialog";
import { InstagramImportDialog } from "./InstagramImportDialog";
import { ClipboardImportDialog } from "./ClipboardImportDialog";
import { Recipe } from "@/types/recipe";

interface RecipeCreationOptionsProps {
  onRecipeImported: (recipes: Partial<Recipe>[]) => void;
}

export function RecipeCreationOptions({ onRecipeImported }: RecipeCreationOptionsProps) {
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showImageRecognitionDialog, setShowImageRecognitionDialog] = useState(false);
  const [showTrelloDialog, setShowTrelloDialog] = useState(false);
  const [showInstagramDialog, setShowInstagramDialog] = useState(false);
  const [showClipboardDialog, setShowClipboardDialog] = useState(false);

  const handleSingleRecipeImport = (recipe: Partial<Recipe>) => {
    onRecipeImported([recipe]);
  };

  return (
    <>
      <div className="mb-8 flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              Create Recipe From <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setShowImageRecognitionDialog(true)}>
              <Camera className="mr-2 h-4 w-4" />
              Take Photo & Scan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowUrlDialog(true)}>
              <Globe className="mr-2 h-4 w-4" />
              Web Scrape URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowTrelloDialog(true)}>
              <Trello className="mr-2 h-4 w-4" />
              Import from Trello
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowClipboardDialog(true)}>
              <Clipboard className="mr-2 h-4 w-4" />
              Paste from Clipboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowInstagramDialog(true)}>
              <Instagram className="mr-2 h-4 w-4" />
              Import from Instagram
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Youtube className="mr-2 h-4 w-4" />
              Import from YouTube
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <RecipeUrlDialog
        open={showUrlDialog}
        onOpenChange={setShowUrlDialog}
        onRecipeScraped={handleSingleRecipeImport}
      />

      <ImageRecognitionDialog
        open={showImageRecognitionDialog}
        onOpenChange={setShowImageRecognitionDialog}
        onRecipeScanned={onRecipeImported}
      />

      <TrelloImportDialog
        open={showTrelloDialog}
        onOpenChange={setShowTrelloDialog}
        onRecipeImported={handleSingleRecipeImport}
      />

      <InstagramImportDialog
        open={showInstagramDialog}
        onOpenChange={setShowInstagramDialog}
        onRecipeImported={handleSingleRecipeImport}
      />

      <ClipboardImportDialog
        open={showClipboardDialog}
        onOpenChange={setShowClipboardDialog}
        onRecipeImported={handleSingleRecipeImport}
      />
    </>
  );
}