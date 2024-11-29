import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ImageUpload";
import { Recipe } from "@/types/recipe";
import { AISuggestions } from "./AISuggestions";
import { useState } from "react";
import { ImageCropDialog } from "@/components/image/ImageCropDialog";

interface RecipeBasicInfoProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export function RecipeBasicInfo({ recipe, onChange }: RecipeBasicInfoProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    console.log("Opening crop dialog for existing image:", imageUrl);
    setSelectedImage(imageUrl);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    console.log("Crop completed, updating image:", croppedImageUrl);
    if (selectedImage) {
      const imageIndex = recipe.images.indexOf(selectedImage);
      if (imageIndex !== -1) {
        const newImages = [...recipe.images];
        newImages[imageIndex] = croppedImageUrl;
        onChange({
          images: newImages,
          featuredImageIndex: recipe.featuredImageIndex
        });
      }
    }
    setSelectedImage(null);
  };

  return (
    <div className="space-y-6">
      <ImageUpload
        images={recipe.images}
        featuredImageIndex={recipe.featuredImageIndex}
        onChange={(images, featuredIndex) => 
          onChange({
            images,
            featuredImageIndex: featuredIndex
          })
        }
        onImageClick={handleImageClick}
      />

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={recipe.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Recipe title"
          />
        </div>
        <div className="pt-6">
          <AISuggestions
            onSuggestionsApply={onChange}
            currentRecipe={recipe}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={recipe.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe your recipe"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Private Recipe</Label>
          <p className="text-sm text-muted-foreground">
            Only you can see private recipes
          </p>
        </div>
        <Switch
          checked={recipe.privacy === 'private'}
          onCheckedChange={(checked) => 
            onChange({ privacy: checked ? 'private' : 'public' })
          }
        />
      </div>

      <ImageCropDialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        imageUrl={selectedImage || ''}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}