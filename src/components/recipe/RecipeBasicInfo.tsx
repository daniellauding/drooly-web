import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { Recipe } from "@/types/recipe";

interface RecipeBasicInfoProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export function RecipeBasicInfo({ recipe, onChange }: RecipeBasicInfoProps) {
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
      />

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={recipe.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Recipe title"
        />
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
    </div>
  );
}