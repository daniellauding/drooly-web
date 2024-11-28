import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ImageUpload";
import { Recipe } from "@/types/recipe";
import { AISuggestions } from "./AISuggestions";

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
    </div>
  );
}